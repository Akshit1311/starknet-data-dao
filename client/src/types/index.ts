import type { Proof } from "@reclaimprotocol/js-sdk";
import { z } from "zod";

import { PROVIDERS_INFO } from "~/constants";
import { NykaaOrdersSchema } from "~/server/db/schema";

export type TProofs = string[] | string | Proof | Proof[] | undefined;

export type TProviders = keyof typeof PROVIDERS_INFO;

export const ProviderSchema = z.custom<TProviders>((val) => {
	const slugs = Object.keys(PROVIDERS_INFO).map((provider) => provider);

	return slugs.includes(val);
});

export type TPublicData = {
	[key: string]: string;
};

export const NykaaResSchema = z.object({ orders: z.array(NykaaOrdersSchema) });

export const WalletSchema = z.custom<`0x${string}`>(
	(val) => typeof val === "string" && /^0x[a-fA-F0-9]{64}$/.test(val),
	{
		message: "Invalid wallet address",
	},
);
