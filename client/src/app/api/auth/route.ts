import { NextResponse } from "next/server";

import { auth } from "~/server/utils";

export async function POST(req: Request) {
	const { address } = await req.json();
	const data = await auth();

	return NextResponse.json(data);
}
