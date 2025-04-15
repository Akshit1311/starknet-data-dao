import type { Proof } from "@reclaimprotocol/js-sdk";
import { z } from "zod";
import { db } from "~/server/db";
import {
	linkedinConnections,
	LinkedinConnectionsSchema,
	nykaaOrders,
	NykaaOrdersSchema,
	uberPastTrips,
	UberPastTripsSchema,
	zomatoOrders,
	ZomatoOrdersSchema,
} from "~/server/db/schema";

export const dynamic = "force-static";

export async function GET() {
	return Response.json({ hi: "there" });
}

const NykaaResSchema = z.object({ orders: z.array(NykaaOrdersSchema) });
const ZomatoResSchema = z.object({
	orders: z.array(ZomatoOrdersSchema),
	userid: z.string(),
});
const LinkedInResSchema = z.object({
	data: z.object({
		connectionsList: z.array(LinkedinConnectionsSchema),
	}),
});
const UberResSchema = z.object({ trips: z.array(UberPastTripsSchema) });

const ContextSchema = z.object({
	// contextAddress: WalletSchema,
	contextMessage: z.string(),
});

export async function POST(req: Request) {
	try {
		const data = await req.text();

		const decodedBody = decodeURIComponent(data);
		const proof: Proof = JSON.parse(decodedBody);

		const context = JSON.parse(proof.claimData.context);

		const parsedContext = ContextSchema.safeParse(context);

		if (!parsedContext.success) {
			return Response.json({ message: "context errored!" }, { status: 500 });
		}

		const userId = Number.parseInt(parsedContext.data.contextMessage);

		console.log({
			userId,
			ctxMsg: parsedContext.data.contextMessage,
			parsedContext,
		});

		// zomato order history
		const parsedZomatoOrders = ZomatoResSchema.safeParse(proof.publicData);
		if (parsedZomatoOrders.success) {
			const insertedIds = await db
				.insert(zomatoOrders)
				.values(parsedZomatoOrders.data.orders.map((o) => ({ ...o, userId })))
				.onConflictDoNothing()
				.returning({
					id: zomatoOrders.id,
				});

			console.dir({ insertedIds }, { depth: null });

			console.log({ orders: parsedZomatoOrders });

			return Response.json({ message: "Updated data in db successfully" });
		}

		// nykaa
		const parsedData = NykaaResSchema.safeParse(proof.publicData);

		if (parsedData.success) {
			const insertedIds = await db
				.insert(nykaaOrders)
				.values(parsedData.data.orders.map((o) => ({ ...o, userId })))
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

		console.dir({ parsedLinkedInData }, { depth: null });

		if (parsedLinkedInData.success) {
			const insertedIds = await db
				.insert(linkedinConnections)
				.values(
					parsedLinkedInData.data.data.connectionsList.map((o) => ({
						...o,
						userId,
					})),
				)
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

		// uber past trips
		const parsedUberTrips = UberResSchema.safeParse(proof.publicData);

		if (parsedUberTrips.success) {
			const insertedIds = await db
				.insert(uberPastTrips)
				.values(parsedUberTrips.data.trips.map((o) => ({ ...o, userId })))
				.onConflictDoNothing()
				.returning({
					id: uberPastTrips.id,
				});

			console.dir({ insertedIds }, { depth: null });

			console.log({ trips: parsedUberTrips });

			return Response.json({ message: "Updated data in db successfully" });
		}

		return Response.json({ message: "zod failed!" }, { status: 400 });
	} catch (error) {
		console.log({ message: "errored!", error });

		return Response.json({ message: "errored!" }, { status: 500 });
	}
}
