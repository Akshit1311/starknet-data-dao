import { verifyProof } from "@reclaimprotocol/js-sdk";

export const dynamic = "force-static";

export async function GET() {
	return Response.json({ hi: "there" });
}
export async function POST(req: Request) {
	const data = await req.text();

	const decodedBody = decodeURIComponent(data);
	const proof = JSON.parse(decodedBody);

	console.log({ proof });

	return Response.json({ proof });
}
