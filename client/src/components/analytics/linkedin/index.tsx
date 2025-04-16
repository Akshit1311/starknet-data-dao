"use client";

import { useAccount } from "@starknet-react/core";
import { Loader } from "lucide-react";
import type React from "react";

import DownloadData from "~/components/download";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

import type { AnalyticsProps } from "..";
import Chart from "./chart";

export type LinkedInChartData = {
	month: string;
	connectionCount: number;
	growth: number;
};

const LinkedInAnalytics: React.FC<AnalyticsProps> = ({ analyticSlug }) => {
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

	// Calculate total connections
	const totalConnections = data?.providerResult?.length || 0;

	// Extract unique industries/headlines
	const getHeadlineCategories = () => {
		if (!data?.providerResult || data.providerResult.length === 0) {
			return {};
		}

		const headlines: Record<string, number> = {};

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		// biome-ignore lint/complexity/noForEach: <explanation>
		data.providerResult.forEach((connection: any) => {
			if (connection.headline) {
				// Extract primary industry/role from headline (simplified approach)
				const primaryRole = connection.headline.split(" at ")[0].trim();
				headlines[primaryRole] = (headlines[primaryRole] || 0) + 1;
			}
		});

		return headlines;
	};

	// Find most common role/industry
	const getMostCommonHeadline = () => {
		const headlines = getHeadlineCategories();
		const sortedHeadlines = Object.entries(headlines).sort(
			(a, b) => b[1] - a[1],
		);
		return sortedHeadlines.length > 0 && sortedHeadlines[0]
			? sortedHeadlines[0][0]
			: null;
	};

	const mostCommonHeadline = getMostCommonHeadline();

	// Calculate connections by month
	const getMonthlyChartData = (): LinkedInChartData[] => {
		if (!data?.providerResult || data.providerResult.length === 0) {
			return [];
		}

		const monthlyData: Record<string, { connectionCount: number }> = {};

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		// biome-ignore lint/complexity/noForEach: <explanation>
		data.providerResult.forEach((connection: any) => {
			if (connection.createdAt) {
				const connectionDate = new Date(connection.createdAt);
				const month = connectionDate.toLocaleString("default", {
					month: "long",
				});
				const year = connectionDate.getFullYear();
				const monthYear = `${month} ${year}`;

				if (!monthlyData[monthYear]) {
					monthlyData[monthYear] = { connectionCount: 0 };
				}

				monthlyData[monthYear].connectionCount += 1;
			}
		});

		// Sort by date and calculate growth
		const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
			const dateA = new Date(a);
			const dateB = new Date(b);
			return dateA.getTime() - dateB.getTime();
		});

		return sortedMonths.map((month, index) => {
			const previousCount =
				index > 0
					? Object.values(monthlyData).reduce((sum, data, i) => {
							return i < index ? sum + data.connectionCount : sum;
						}, 0)
					: 0;

			const currentCount = monthlyData[month]?.connectionCount ?? 0;
			const growth =
				index === 0 ? currentCount : currentCount / (previousCount || 1);

			return {
				month,
				connectionCount: monthlyData[month]?.connectionCount ?? 0,
				growth: Number.parseFloat((growth * 100 - 100).toFixed(1)), // Growth as percentage
			};
		});
	};

	const chartData = getMonthlyChartData();

	// Calculate connection growth rate (overall)
	const calculateGrowthRate = () => {
		if (chartData.length <= 1) return 0;

		const firstMonth = chartData[0];
		const lastMonth = chartData[chartData.length - 1];
		const totalMonths = chartData.length;

		if (totalMonths > 1) {
			const initialConnections = firstMonth?.connectionCount ?? 0;
			const totalConnections = chartData.reduce(
				(sum, month) => sum + month.connectionCount,
				0,
			);
			return Number.parseFloat(
				(
					((totalConnections / initialConnections - 1) * 100) /
					(totalMonths - 1)
				).toFixed(1),
			);
		}

		return 0;
	};

	const monthlyGrowthRate = calculateGrowthRate();

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
						Total connections:{" "}
						<span className="text-black font-semibold">{totalConnections}</span>
					</p>
					<p className="text-black/60">
						Monthly growth rate:{" "}
						<span
							className={`text-black font-semibold ${monthlyGrowthRate > 0 ? "text-green-600" : monthlyGrowthRate < 0 ? "text-red-600" : ""}`}
						>
							{monthlyGrowthRate > 0 ? "+" : ""}
							{monthlyGrowthRate}%
						</span>
					</p>
				</div>

				{mostCommonHeadline && (
					<div className="mt-2 w-full">
						<p className="text-black/60">
							Most common role:{" "}
							<span className="text-black font-semibold">
								{mostCommonHeadline}
							</span>
						</p>
					</div>
				)}

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

export default LinkedInAnalytics;
