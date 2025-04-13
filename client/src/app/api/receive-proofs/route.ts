import { verifyProof, type Proof } from "@reclaimprotocol/js-sdk";
import { z } from "zod";
import { db } from "~/server/db";
import {
	linkedinConnections,
	LinkedinConnectionsSchema,
	nykaaOrders,
	NykaaOrdersSchema,
} from "~/server/db/schema";

export const dynamic = "force-static";

export async function GET() {
	return Response.json({ hi: "there" });
}

const NykaaResSchema = z.object({ orders: z.array(NykaaOrdersSchema) });
const LinkedInResSchema = z.object({
	data: z.object({
		connectionsList: z.array(LinkedinConnectionsSchema),
	}),
});

export async function POST(req: Request) {
	try {
		const data = await req.text();

		const decodedBody = decodeURIComponent(data);
		const proof: Proof = JSON.parse(decodedBody);

		// nykaa
		const parsedData = NykaaResSchema.safeParse(proof.publicData);

		if (parsedData.success) {
			const insertedIds = await db
				.insert(nykaaOrders)
				.values(parsedData.data.orders)
				.onConflictDoNothing()
				.returning({
					id: nykaaOrders.id,
				});

			console.dir({ insertedIds }, { depth: null });

			console.log({ orders: parsedData });

			return Response.json({ message: "Updated data in db successfully" });
		}

		// linkedin
		const parsedLinkedInData = LinkedInResSchema.safeParse(proof.publicData);

		if (parsedLinkedInData.success) {
			const insertedIds = await db
				.insert(linkedinConnections)
				.values(parsedLinkedInData.data.data.connectionsList)
				.onConflictDoNothing()
				.returning({
					id: linkedinConnections.id,
				});

			console.dir({ insertedIds }, { depth: null });

			console.log({
				connections: parsedLinkedInData.data.data.connectionsList,
			});

			return Response.json({ message: "Updated data in db successfully" });
		}

		return Response.json({ message: "zod failed!" }, { status: 400 });
	} catch (error) {
		console.log({ message: "errored!" });

		return Response.json({ message: "errored!" }, { status: 500 });
	}
}
