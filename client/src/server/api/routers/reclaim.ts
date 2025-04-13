import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import { z } from "zod";

import { PROVIDERS_INFO } from "~/constants";
import { env } from "~/env";
import { logger } from "~/lib/utils";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ProviderSchema } from "~/types";

export const reclaimRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.mutation(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	generateConfig: publicProcedure
		.input(
			z.object({
				providerSlug: ProviderSchema,
			}),
		)
		.mutation(async ({ input }) => {
			const providerSlug = input.providerSlug;

			const categoryId = Object.values(PROVIDERS_INFO).find(
				(provider) => provider.slug === providerSlug,
			)?.categoryId;

			if (!categoryId) {
				logger.error(`Category ID not found for provider: ${providerSlug}`);
				throw new Error("Invalid provider slug");
			}

			const reclaimProofRequest = await ReclaimProofRequest.init(
				env.RECLAIM_APP_ID,
				env.RECLAIM_APP_SECRET,
				categoryId,
			);

			reclaimProofRequest.setAppCallbackUrl(
				"https://bankai-data-dao.vercel.app/api/receive-proofs",
			);

			const reclaimProofRequestConfig = reclaimProofRequest.toJsonString();

			return {
				reclaimProofRequestConfig,
			};
		}),
});
