import { verifyProof, type Proof } from "@reclaimprotocol/js-sdk";
import { db } from "~/server/db";
import { nykaaOrders, NykaaOrdersSchema } from "~/server/db/schema";

export const dynamic = "force-static";

export async function GET() {
	return Response.json({ hi: "there" });
}
export async function POST(req: Request) {
	const data = await req.text();

	const decodedBody = decodeURIComponent(data);
	const proof: Proof = JSON.parse(decodedBody);

	const parsedData = NykaaOrdersSchema.safeParse(proof.publicData?.orders);

	if (parsedData.success) {
		await db.insert(nykaaOrders).values(parsedData.data);

		console.log({ orders: parsedData.data });

		return Response.json({ message: "Updated data in db successfully" });
	}

	return Response.json({ message: "errored!" });
}
