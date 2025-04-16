"use client";

import type React from "react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "~/components/ui/chart";

import type { TripChartData } from "./index";

interface ChartProps {
	chartData: TripChartData[];
}

const chartConfig = {
	trips: {
		label: "Number of Trips",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

const Chart: React.FC<ChartProps> = ({ chartData }) => {
	return (
		<div className="w-[600px] -ml-4">
			<ChartContainer config={chartConfig}>
				<AreaChart accessibilityLayer data={chartData}>
					<XAxis
						dataKey="month"
						tickLine={false}
						axisLine={true}
						tickMargin={8}
						tickFormatter={(value) => {
							const parts = value.split(" ");
							return `${parts[0].slice(0, 3)} ${parts[1]}`;
						}}
					/>
					<YAxis tickLine={false} axisLine={true} />
					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent indicator="line" />}
					/>
					<Area
						dataKey="trips"
						type="natural"
						fill="#00C8EF"
						fillOpacity={0.4}
						stroke="#000"
						name="Trips"
					/>
				</AreaChart>
			</ChartContainer>
		</div>
	);
};

export default Chart;
