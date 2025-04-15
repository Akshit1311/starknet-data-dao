"use client";

import { useAccount } from "@starknet-react/core";
import type React from "react";

import DownloadData from "~/components/download";
import { buttonVariants } from "~/components/ui/button";
import { cn, formatNumberWithCommas } from "~/lib/utils";
import { api } from "~/trpc/react";

import type { AnalyticsProps } from "..";
import Chart from "./chart";

// Define a type for chart data
export type OrderChartData = {
	month: string;
	cost: number;
};

const ZomatoAnalytics: React.FC<AnalyticsProps> = ({ analyticSlug }) => {
	const { address } = useAccount();

	const { data } = api.auth.providerInfo.useQuery(
		{
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			address: address!,
			analyticSlug,
		},
		{
			enabled: !!address,
		},
	);

	// Calculate total cost from all orders
	const totalCost: number = data?.providerResult.reduce(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(acc: number, order: any) => {
			if (order.totalCost) {
				const cost = order.totalCost.replace(/[^0-9.-]+/g, "");
				const parsedCost = Number(cost);

				return acc + parsedCost;
			}
			return acc;
		},
		0,
	);

	const totalOrders = data?.providerResult.length;

	// Process order data to get monthly cost data
	const getMonthlyChartData = (): OrderChartData[] => {
		if (!data?.providerResult || data.providerResult.length === 0) {
			return [];
		}

		// Create a map to store monthly totals
		const monthlyTotals: Record<string, number> = {};

		// Process each order
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		// biome-ignore lint/complexity/noForEach: <explanation>
		data.providerResult.forEach((order: any) => {
			if (order.createdAt && order.totalCost) {
				// Extract month from createdAt date
				const orderDate = new Date(order.createdAt);
				const month = orderDate.toLocaleString("default", { month: "long" });

				// Extract cost
				const cost = order.totalCost.replace(/[^0-9.-]+/g, "");
				const parsedCost = Number(cost);

				// Add to monthly total
				if (monthlyTotals[month]) {
					monthlyTotals[month] += parsedCost;
				} else {
					monthlyTotals[month] = parsedCost;
				}
			}
		});

		// Convert to array format needed by chart
		return Object.entries(monthlyTotals)
			.map(([month, cost]) => ({
				month,
				cost: Math.round(cost),
			}))
			.reverse();
	};

	const orderChartData = getMonthlyChartData();

	if (!address) {
		return <div>Connect your wallet</div>;
	}

	return (
		<div className="w-full flex items-center justify-center flex-col">
			<div
				className={cn(
					"!h-full !bg-white flex flex-col items-center backdrop-blur-3xl shadow-sm !py-4 !px-6",
					buttonVariants({ variant: "noShadow" }),
				)}
			>
				<div className="flex justify-between w-full items-start">
					<p className="text-black/60">
						Total cost:{" "}
						<span className="text-black font-semibold">
							₹{formatNumberWithCommas(totalCost?.toFixed(2))}
						</span>
					</p>
					<p className="text-black/60">
						Total orders:{" "}
						<span className="text-black font-semibold">{totalOrders}</span>
					</p>
				</div>

				<div className="mt-6 h-full w-full -ml-4">
					<Chart chartData={orderChartData} />
				</div>
			</div>

			<DownloadData data={data?.providerResult} />
		</div>
	);
};

export default ZomatoAnalytics;
