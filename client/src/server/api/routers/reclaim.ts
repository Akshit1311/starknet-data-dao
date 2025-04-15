import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import { z } from "zod";

import { PROVIDERS_INFO } from "~/constants";
import { env } from "~/env";
import { logger } from "~/lib/utils";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import { ProviderSchema } from "~/types";

export const reclaimRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.mutation(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	generateConfig: protectedProcedure
		.input(
			z.object({
				providerSlug: ProviderSchema,
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const providerSlug = input.providerSlug;

			const categoryId = PROVIDERS_INFO[input.providerSlug].categoryId;

			if (!categoryId) {
				logger.error(`Category ID not found for provider: ${providerSlug}`);
				throw new Error("Invalid provider slug");
			}

			const reclaimProofRequest = await ReclaimProofRequest.init(
				env.RECLAIM_APP_ID,
				env.RECLAIM_APP_SECRET,
				categoryId,
				// {
				// 	device: "ios", // "android", // according to user agent
				// 	useAppClip: true, // false for desktops
				// },
			);

			reclaimProofRequest.addContext(
				ctx.user.address,
				ctx.user.userId.toString(),
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
