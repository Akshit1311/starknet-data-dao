import { TRPCError } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import {
	linkedinConnections,
	nykaaOrders,
	uberPastTrips,
	users,
	zomatoOrders,
} from "~/server/db/schema";
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

	leaderboard: publicProcedure.query(async ({ ctx }) => {
		const db = ctx.db;
		const allUsers = await db.select().from(users);

		// Step 2: For each user, count items in each table
		const leaderboardData = await Promise.all(
			allUsers.map(async (user) => {
				// Count Nykaa orders
				const [nykaaResult] = await db
					.select({ count: count() })
					.from(nykaaOrders)
					.where(eq(nykaaOrders.userId, user.id));

				// Count LinkedIn connections
				const [linkedinResult] = await db
					.select({ count: count() })
					.from(linkedinConnections)
					.where(eq(linkedinConnections.userId, user.id));

				// Count Zomato orders
				const [zomatoResult] = await db
					.select({ count: count() })
					.from(zomatoOrders)
					.where(eq(zomatoOrders.userId, user.id));

				// Count Uber trips
				const [uberResult] = await db
					.select({ count: count() })
					.from(uberPastTrips)
					.where(eq(uberPastTrips.userId, user.id));

				// Calculate total count
				const totalCount =
					(nykaaResult?.count ?? 0) +
					(linkedinResult?.count ?? 0) +
					(zomatoResult?.count ?? 0) +
					(uberResult?.count ?? 0);

				return {
					userId: user.id,
					userAddress: user.address,
					nickname: user.nickname,
					points: totalCount,
				};
			}),
		);

		// Sort users by points in descending order (highest first)
		leaderboardData.sort((a, b) => b.points - a.points);

		return leaderboardData;
	}),
});
