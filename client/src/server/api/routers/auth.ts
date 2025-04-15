import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { createAndSetToken } from "~/server/utils";
import { WalletSchema } from "~/types";

export const authRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.mutation(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),
	login: publicProcedure
		.input(
			z.object({
				address: WalletSchema,
				nickname: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			console.log({ input });
			const addrToBeInserted: `0x${string}` = `0x${input.address.split("0x")[1]?.toLowerCase()}`;

			const existingUser = await ctx.db.query.users.findFirst({
				where: (fields, { ilike }) => ilike(fields.address, addrToBeInserted),
			});

			if (existingUser) {
				console.log("user exists");

				if (!existingUser.nickname?.length) {
					console.log("inserting nick");

					await db
						.update(users)
						.set({
							nickname: input.nickname,
						})
						.where(eq(users.address, addrToBeInserted));
				}

				await createAndSetToken({
					address: existingUser.address,
					userId: existingUser.id,
					nickname: existingUser.nickname,
				});

				console.log("here");

				return true;
			}

			const insertedUser = await ctx.db
				.insert(users)
				.values({
					address: addrToBeInserted,
					nickname: input.nickname,
				})
				.returning({
					insertedId: users.id,
				});

			if (!insertedUser[0]) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "User insertion failed",
				});
			}

			await createAndSetToken({
				address: addrToBeInserted,
				nickname: input.nickname,
				userId: insertedUser[0].insertedId,
			});

			console.log("here");

			return true;
		}),
	users: publicProcedure.query(async () => {
		const users = await db.query.users.findMany();
		return users;
	}),
});
