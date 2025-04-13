import { z } from "zod";

import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
        providerId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const reclaimProofRequest = await ReclaimProofRequest.init(
        env.RECLAIM_APP_ID,
        env.RECLAIM_APP_SECRET,
        input.providerId
      );

      reclaimProofRequest.setAppCallbackUrl(
        "https://bankai-data-dao.vercel.app/api/receive-proofs"
      );

      const reclaimProofRequestConfig = reclaimProofRequest.toJsonString();

      return {
        reclaimProofRequestConfig,
      };
    }),
});
