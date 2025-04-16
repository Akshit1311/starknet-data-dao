"use client";

import { useAccount } from "@starknet-react/core";
import { Loader } from "lucide-react";
import type React from "react";

import DownloadData from "~/components/download";
import { buttonVariants } from "~/components/ui/button";
import { cn, formatNumberWithCommas } from "~/lib/utils";
import { api } from "~/trpc/react";

import type { AnalyticsProps } from "..";
import Chart from "./chart";

// Enhanced chart data type with multiple metrics
export type ZomatoChartData = {
	month: string;
	cost: number;
	orderCount: number;
	avgOrderValue: number;
};

const ZomatoAnalytics: React.FC<AnalyticsProps> = ({ analyticSlug }) => {
	const { address } = useAccount();

	const { data, isPending } = api.auth.providerInfo.useQuery(
		{
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			address: address!,
			analyticSlug,
		},
		{
			enabled: !!address,
		},
	);

	const totalCost: number =
		data?.providerResult?.reduce(
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
		) || 0;

	const totalOrders = data?.providerResult?.length || 0;
	const avgOrderValue = totalOrders > 0 ? totalCost / totalOrders : 0;

	// Function to extract unique restaurants
	const getUniqueRestaurants = () => {
		if (!data?.providerResult || data.providerResult.length === 0) {
			return 0;
		}

		const uniqueRestaurants = new Set();
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		// biome-ignore lint/complexity/noForEach: <explanation>
		data.providerResult.forEach((order: any) => {
			if (order.restaurantURL) {
				uniqueRestaurants.add(order.restaurantURL);
			}
		});

		return uniqueRestaurants.size;
	};

	const uniqueRestaurantsCount = getUniqueRestaurants();

	// Enhanced to get more detailed monthly metrics
	const getMonthlyChartData = (): ZomatoChartData[] => {
		if (!data?.providerResult || data.providerResult.length === 0) {
			return [];
		}

		const monthlyData: Record<string, { cost: number; orderCount: number }> =
			{};

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		// biome-ignore lint/complexity/noForEach: <explanation>
		data.providerResult.forEach((order: any) => {
			if (order.createdAt) {
				const orderDate = new Date(order.createdAt);
				const month = orderDate.toLocaleString("default", { month: "long" });
				const year = orderDate.getFullYear();
				const monthYear = `${month} ${year}`;

				const cost = order.totalCost
					? Number(order.totalCost.replace(/[^0-9.-]+/g, ""))
					: 0;

				if (!monthlyData[monthYear]) {
					monthlyData[monthYear] = { cost: 0, orderCount: 0 };
				}

				monthlyData[monthYear].cost += cost;
				monthlyData[monthYear].orderCount += 1;
			}
		});

		return Object.entries(monthlyData)
			.map(([month, data]) => ({
				month,
				cost: Math.round(data.cost),
				orderCount: data.orderCount,
				avgOrderValue: Math.round(data.cost / data.orderCount),
			}))
			.sort((a, b) => {
				const monthA = new Date(a.month);
				const monthB = new Date(b.month);
				return monthA.getTime() - monthB.getTime();
			});
	};

	const chartData = getMonthlyChartData();

	// Find most ordered from restaurant
	const getMostOrderedRestaurant = () => {
		if (!data?.providerResult || data.providerResult.length === 0) {
			return null;
		}

		const restaurantCounts: Record<string, number> = {};

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		// biome-ignore lint/complexity/noForEach: <explanation>
		data.providerResult.forEach((order: any) => {
			if (order.restaurantURL) {
				// Extract restaurant name from URL or use the URL itself
				const restaurantName =
					order.restaurantURL.split("/").pop() || order.restaurantURL;
				restaurantCounts[restaurantName] =
					(restaurantCounts[restaurantName] || 0) + 1;
			}
		});

		const sortedRestaurants = Object.entries(restaurantCounts).sort(
			(a, b) => b[1] - a[1],
		);
		return sortedRestaurants.length > 0 && sortedRestaurants[0]
			? sortedRestaurants[0][0]
			: null;
	};

	const mostOrderedRestaurant = getMostOrderedRestaurant();

	if (!address) {
		return <div>Connect your wallet</div>;
	}

	if (data?.providerResult.length <= 0) {
		return (
			<div className="w-full flex items-center justify-center flex-col">
				<p className="text-black">No data available :(</p>
			</div>
		);
	}

	if (isPending) {
		return (
			<div className="w-full flex items-center justify-center flex-col gap-4">
				<Loader className="animate-spin" />
				<p className="text-black">Crunching the latest stats for you...</p>
			</div>
		);
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
							₹{formatNumberWithCommas(totalCost.toFixed(2))}
						</span>
					</p>
					<p className="text-black/60">
						Total orders:{" "}
						<span className="text-black font-semibold">{totalOrders}</span>
					</p>
					<p className="text-black/60">
						Avg. order value:{" "}
						<span className="text-black font-semibold">
							₹{formatNumberWithCommas(avgOrderValue.toFixed(2))}
						</span>
					</p>
				</div>

				<div className="mt-2 w-full">
					{/* <div className="flex flex-col gap-3">
						<p className="text-black/60">
							Unique restaurants:{" "}
							<span className="text-black font-semibold">
								{uniqueRestaurantsCount}
							</span>
						</p>

						{mostOrderedRestaurant && (
							<p className="text-black/60">
								Most ordered from:{" "}
								<span className="text-black font-semibold">
									{mostOrderedRestaurant}
								</span>
							</p>
						)}
					</div> */}
				</div>

				<div className="mt-6 h-full w-full -ml-4">
					<Chart chartData={chartData} />
				</div>
			</div>

			<DownloadData
				data={data?.providerResult}
				fileName={analyticSlug.replace(/-/g, "_")}
			/>
		</div>
	);
};

export default ZomatoAnalytics;
