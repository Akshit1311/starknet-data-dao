import type { Proof } from "@reclaimprotocol/js-sdk";
import { z } from "zod";
import type { PROVIDER_IDS } from "~/constants";

export type TProofs = string[] | string | Proof | Proof[] | undefined;

export type TProviders = keyof typeof PROVIDER_IDS;

export const ProviderSchema = z.custom<TProviders>();

export type TPublicData = {
	[key: string]: string;
};
