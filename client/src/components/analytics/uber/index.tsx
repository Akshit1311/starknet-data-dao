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

export type TripChartData = {
	month: string;
	trips: number;
};

const UberAnalytics: React.FC<AnalyticsProps> = ({ analyticSlug }) => {
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

	const totalTrips = data?.providerResult?.length || 0;

	const completedTrips =
		data?.providerResult?.filter(
			(trip: { dropoffTime: string }) =>
				trip.dropoffTime && trip.dropoffTime !== "",
		).length || 0;

	const totalSpent =
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		data?.providerResult?.reduce((acc: any, trip: any) => {
			if (trip.fare) {
				const fareAmount = Number.parseFloat(
					trip.fare.replace(/[^0-9.-]+/g, ""),
				);
				// biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
				return isNaN(fareAmount) ? acc : acc + fareAmount;
			}
			return acc;
		}, 0) || 0;

	const getMonthlyChartData = (): TripChartData[] => {
		if (!data?.providerResult || data.providerResult.length === 0) {
			return [];
		}

		const monthlyTrips: Record<string, number> = {};

		// biome-ignore lint/complexity/noForEach: <explanation>
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		data.providerResult.forEach((trip: any) => {
			if (trip.beginTripTime) {
				const tripDate = new Date(trip.beginTripTime);
				const month = tripDate.toLocaleString("default", { month: "long" });
				const year = tripDate.getFullYear();
				const monthYear = `${month} ${year}`;

				monthlyTrips[monthYear] = (monthlyTrips[monthYear] || 0) + 1;
			}
		});

		return Object.entries(monthlyTrips)
			.map(([month, trips]) => ({
				month,
				trips,
			}))
			.sort((a, b) => {
				const monthA = new Date(a.month);
				const monthB = new Date(b.month);
				return monthA.getTime() - monthB.getTime();
			});
	};

	const tripChartData = getMonthlyChartData();

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
						Total trips:{" "}
						<span className="text-black font-semibold">{totalTrips}</span>
					</p>
					<p className="text-black/60">
						Completed trips:{" "}
						<span className="text-black font-semibold">{completedTrips}</span>
					</p>
					{totalSpent > 0 && (
						<p className="text-black/60">
							Total spent:{" "}
							<span className="text-black font-semibold">
								₹{formatNumberWithCommas(totalSpent.toFixed(2))}
							</span>
						</p>
					)}
				</div>

				<div className="mt-6 h-full w-full -ml-4">
					<Chart chartData={tripChartData} />
				</div>
			</div>

			<DownloadData
				data={data?.providerResult}
				fileName={analyticSlug.replace(/-/g, "_")}
			/>
		</div>
	);
};

export default UberAnalytics;
