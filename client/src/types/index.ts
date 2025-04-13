import type { Proof } from "@reclaimprotocol/js-sdk";
import { z } from "zod";
import type { PROVIDER_IDS } from "~/constants";

export type TProofs = string[] | string | Proof | Proof[] | undefined;

export type TProviders = keyof typeof PROVIDER_IDS;

export const ProviderSchema = z.custom<TProviders>();

export type TPublicData = {
	[key: string]: string;
};

export const productSchema = z.object({
	brandIds: z.string(),
	brandNames: z.array(z.string()),
	categoryId: z.string(),
	createdAt: z.string(),
	imageUrl: z.string().url(),
	itemName: z.string(),
	itemQuantity: z.number(),
	itemSku: z.string(),
	itemStatus: z.string(),
	orderNo: z.string(),
	parentId: z.string(),
	productId: z.string(),
	productUrl: z.string().url(),
	unitPrice: z.number(),
});
