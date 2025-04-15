"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type LeaderboardData = {
	id: number;
	rank: number;
	name: string;
	address: `0x${string}`;
	points: number;
};

export const columns: ColumnDef<LeaderboardData>[] = [
	{
		accessorKey: "rank",
		header: "Rank",
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "address",
		header: "Address",
	},
	{
		accessorKey: "points",
		header: () => "Points",
	},
];
