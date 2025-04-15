import type { NextPage } from "next";
import React from "react";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";

import { shortAddress } from "~/lib/utils";
import { api } from "~/trpc/server";

import type { LeaderboardData } from "./_components/columns";
import LeaderboardTable from "./_components/table";

const LeaderboardPage: NextPage = async () => {
	const users = await api.auth.users();

	const formattedData: LeaderboardData[] = users.map((user, idx) => ({
		id: user.id.toString(),
		rank: idx + 1,
		name: user.nickname || `Anonymous${idx + 1}`,
		address: shortAddress(user.address),
		points: "1000",
	}));

	return (
		<main className="flex flex-col items-center justify-center bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-[100dvh] bg-background">
			<div className="mx-auto max-w-5xl w-full flex flex-col items-center gap-12">
				<RoughNotationGroup show={true}>
					<h1 className="text-4xl text-primary">
						<RoughNotation
							type="underline"
							animationDuration={1500}
							iterations={5}
							color="#00C8EF"
						>
							Leaderboard
						</RoughNotation>
					</h1>
				</RoughNotationGroup>
				<LeaderboardTable data={formattedData} />
			</div>
		</main>
	);
};

export default LeaderboardPage;
