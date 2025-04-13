import { verifyProof } from "@reclaimprotocol/js-sdk";

export const dynamic = "force-static";

export async function GET() {
	return Response.json({ hi: "there" });
}
export async function POST(req: Request) {
	const data = await req.json();

	console.log({ data });

	return Response.json({ data });
}
