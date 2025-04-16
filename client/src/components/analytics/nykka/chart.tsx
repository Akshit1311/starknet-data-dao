"use client";

import type React from "react";
import { Area, AreaChart, Legend, Line, XAxis, YAxis } from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "~/components/ui/chart";

import type { NykaaChartData } from "./index";

interface ChartProps {
	chartData: NykaaChartData[];
}

const chartConfig = {
	spending: {
		label: "Spending (₹)",
		color: "hsl(var(--chart-1))",
	},
	items: {
		label: "Items Purchased",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

const Chart: React.FC<ChartProps> = ({ chartData }) => {
	return (
		<div className="w-[600px] -ml-2">
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
					<YAxis
						yAxisId="left"
						tickLine={false}
						axisLine={true}
						tickFormatter={(value) => `₹${value}`}
					/>
					<YAxis
						yAxisId="right"
						orientation="right"
						tickLine={false}
						axisLine={true}
					/>
					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent indicator="line" />}
					/>
					<Area
						yAxisId="left"
						dataKey="spending"
						type="monotone"
						fill="#00C8EF"
						fillOpacity={0.4}
						stroke="#000"
						name="Spending"
					/>
					<Line
						yAxisId="right"
						dataKey="items"
						type="monotone"
						stroke="#000"
						name="Items"
						strokeWidth={2}
					/>
					<Legend />
				</AreaChart>
			</ChartContainer>
		</div>
	);
};

export default Chart;
