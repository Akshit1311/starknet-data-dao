"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { standariseAddress } from "~/lib/utils";

export type LeaderboardData = {
	id: number;
	rank: number;
	name: string | null;
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
		filterFn: (row, columnId, filterValue) => {
			const name = row.getValue<string | null>(columnId);
			const address = row.getValue<string>("address");
			const search = filterValue.toLowerCase();

			return (
				name?.toLowerCase().includes(search) ||
				address.toLowerCase().includes(search) ||
				standariseAddress(address).toLowerCase().includes(search)
			);
		},
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
