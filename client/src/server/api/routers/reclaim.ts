import { z } from "zod";

import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ProviderSchema } from "~/types";
import { PROVIDERS_INFO } from "~/constants";

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
				provider: ProviderSchema,
			}),
		)
		.mutation(async ({ input }) => {
			const reclaimProofRequest = await ReclaimProofRequest.init(
				env.RECLAIM_APP_ID,
				env.RECLAIM_APP_SECRET,
				PROVIDERS_INFO[input.provider].categoryId,
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
