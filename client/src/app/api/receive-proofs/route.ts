import { verifyProof } from "@reclaimprotocol/js-sdk";

export const dynamic = "force-static";

export async function GET() {
	return Response.json({ hi: "there" });
}
export async function POST(req: Request) {
	const data = await req.json();
	const decodedBody = decodeURIComponent(data);
	const proof = JSON.parse(decodedBody);
	const result = await verifyProof(proof);

	if (!result) {
		return new Response("Invalid proofs data", {
			status: 400,
		});
	}

	console.dir(proof, { depth: null });

	return Response.json({ proof });
}
