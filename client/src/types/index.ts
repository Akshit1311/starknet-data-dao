import type { Proof } from "@reclaimprotocol/js-sdk";
import { z } from "zod";

import { PROVIDERS_INFO } from "~/constants";

export type TProofs = string[] | string | Proof | Proof[] | undefined;

export type TProviders = keyof typeof PROVIDERS_INFO;

export const ProviderSchema = z.custom<TProviders>((val) => {
	const slugs = Object.keys(PROVIDERS_INFO).map((provider) => provider);

	return slugs.includes(val);
});

export type TPublicData = {
	[key: string]: string;
};
