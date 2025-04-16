"use client";

import type React from "react";
import { Area, AreaChart, Legend, Line, XAxis, YAxis } from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "~/components/ui/chart";

import type { ZomatoChartData } from "./index";

interface ChartProps {
	chartData: ZomatoChartData[];
}

const chartConfig = {
	cost: {
		label: "Cost (₹)",
		color: "hsl(var(--chart-1))",
	},
	orderCount: {
		label: "Order Count",
		color: "hsl(var(--chart-2))",
	},
	avgOrderValue: {
		label: "Avg Order Value (₹)",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;

const Chart: React.FC<ChartProps> = ({ chartData }) => {
	return (
		<div className="w-[700px] -ml-2">
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
						dataKey="cost"
						type="monotone"
						fill="#00C8EF"
						fillOpacity={0.4}
						stroke="#000"
						name="Total Cost"
					/>
					<Line
						yAxisId="right"
						dataKey="orderCount"
						type="monotone"
						stroke="#FF5722"
						name="Orders"
						strokeWidth={2}
					/>
					<Line
						yAxisId="left"
						dataKey="avgOrderValue"
						type="monotone"
						stroke="#4CAF50"
						name="Avg Order Value"
						strokeWidth={2}
						strokeDasharray="5 5"
					/>

					<Legend className="!bottom-0" />
				</AreaChart>
			</ChartContainer>
		</div>
	);
};

export default Chart;
