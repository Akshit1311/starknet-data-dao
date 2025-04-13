import { verifyProof, type Proof } from "@reclaimprotocol/js-sdk";
import { z } from "zod";
import { db } from "~/server/db";
import { nykaaOrders, NykaaOrdersSchema } from "~/server/db/schema";

export const dynamic = "force-static";

export async function GET() {
	return Response.json({ hi: "there" });
}
export async function POST(req: Request) {
	try {
		const data = await req.text();

		const decodedBody = decodeURIComponent(data);
		const proof: Proof = JSON.parse(decodedBody);

		const parsedData = z
			.array(NykaaOrdersSchema)
			.parse(proof.publicData?.orders);

		const insertedIds = await db
			.insert(nykaaOrders)
			.values(parsedData)
			.onConflictDoNothing()
			.returning({
				id: nykaaOrders.id,
			});

		console.dir({ insertedIds }, { depth: null });

		console.log({ orders: parsedData });

		return Response.json({ message: "Updated data in db successfully" });
	} catch (error) {
		console.log({ message: "errored!" });

		return Response.json({ message: "errored!" }, { status: 500 });
	}
}
