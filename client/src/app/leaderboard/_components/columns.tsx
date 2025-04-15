"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type LeaderboardData = {
	id: string;
	rank: number;
	name: string;
	address: string;
	points: string;
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
