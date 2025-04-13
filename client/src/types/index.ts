import type { Proof } from "@reclaimprotocol/js-sdk";
import { z } from "zod";
import { PROVIDERS_INFO } from "~/constants";

export type TProofs = string[] | string | Proof | Proof[] | undefined;

export type TProviders = keyof typeof PROVIDERS_INFO;

export const ProviderSchema = z.custom<TProviders>((val) => {
	return Object.keys(PROVIDERS_INFO).includes(val);
});

export type TPublicData = {
	[key: string]: string;
};
