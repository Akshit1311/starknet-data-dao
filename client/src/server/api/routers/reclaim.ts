import { z } from "zod";
import { PROVIDER_IDS } from "~/constants";
import { env } from "~/env";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ProviderSchema } from "~/types";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";

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
				PROVIDER_IDS[input.provider],
			);

			// reclaimProofRequest.setAppCallbackUrl(
			// 	"https://bankai-data-dao.vercel.app/api/receive-proofs",
			// );

			const reclaimProofRequestConfig = reclaimProofRequest.toJsonString();

			return {
				reclaimProofRequestConfig,
			};
		}),
});
