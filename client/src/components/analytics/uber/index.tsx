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

const UberAnalytics: React.FC<AnalyticsProps> = ({ analyticSlug }) => {
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

	const getMonthlyChartData = (): OrderChartData[] => {
		if (!data?.providerResult || data.providerResult.length === 0) {
			return [];
		}

		const monthlyTotals: Record<string, number> = {};

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		// biome-ignore lint/complexity/noForEach: <explanation>
		data.providerResult.forEach((order: any) => {
			if (order.createdAt && order.totalCost) {
				const orderDate = new Date(order.createdAt);
				const month = orderDate.toLocaleString("default", { month: "long" });

				const cost = order.totalCost.replace(/[^0-9.-]+/g, "");
				const parsedCost = Number(cost);

				if (monthlyTotals[month]) {
					monthlyTotals[month] += parsedCost;
				} else {
					monthlyTotals[month] = parsedCost;
				}
			}
		});

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

export default UberAnalytics;
