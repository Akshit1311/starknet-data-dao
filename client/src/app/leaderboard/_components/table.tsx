"use client";

import {
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import React from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";

import { columns, type LeaderboardData } from "./columns";

const data: LeaderboardData[] = [
	{
		id: "1",
		rank: 1,
		name: "John Doe",
		address: "0x1234567890abcdef1234567890abcdef12345678",
		points: "1000",
	},
	{
		id: "2",
		rank: 2,
		name: "Jane Smith",
		address: "0xabcdef1234567890abcdef1234567890abcdef12",
		points: "900",
	},
	{
		id: "3",
		rank: 3,
		name: "Alice Johnson",
		address: "0x7890abcdef1234567890abcdef1234567890abcd",
		points: "800",
	},
	{
		id: "4",
		rank: 4,
		name: "Bob Brown",
		address: "0x4567890abcdef1234567890abcdef1234567890",
		points: "700",
	},
	{
		id: "5",
		rank: 5,
		name: "Charlie Davis",
		address: "0x234567890abcdef1234567890abcdef12345678",
		points: "600",
	},
];

const LeaderboardTable = () => {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div className="w-full font-base text-main-foreground">
			<div className="flex items-center py-4">
				<Input
					placeholder="Search name..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
			</div>
			<div>
				<Table>
					<TableHeader className="font-heading">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								className="bg-secondary-background text-foreground"
								key={headerGroup.id}
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead className="text-foreground" key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									className="bg-secondary-background text-foreground data-[state=selected]:bg-main data-[state=selected]:text-main-foreground"
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell className="px-4 py-2" key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="space-x-2">
					<Button
						variant="noShadow"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="noShadow"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
};

export default LeaderboardTable;
