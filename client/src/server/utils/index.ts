import "server-only";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { env } from "~/env";

export const TOKEN_COOKIE = "__BANKAI_TOKEN__";

export type TokenPayload = {
	address: `0x${string}`;
	userId: number;
	nickname: string | null;
};

export const createAndSetToken = async (data: TokenPayload) => {
	const c = await cookies();

	const j = jwt.sign(data, env.JWT_SECRET, {
		expiresIn: "100d",
	});

	c.set(`${TOKEN_COOKIE}_${data.address}`, j);

	console.log("token set succssfully", { data });
};

export const auth = async (address: string) => {
	const c = await cookies();

	const token = c.get(`${TOKEN_COOKIE}_${address}`)?.value;

	if (!token) return null;

	try {
		const data = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

		return data;
	} catch (error) {
		console.error("error verifying token", error);
		c.delete(`${TOKEN_COOKIE}_${address}`);

		return null;
	}
};
