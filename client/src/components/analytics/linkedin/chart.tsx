"use client";

import type React from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	ComposedChart,
	Legend,
	Line,
	XAxis,
	YAxis,
} from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "~/components/ui/chart";

import type { LinkedInChartData } from "./index";

interface ChartProps {
	chartData: LinkedInChartData[];
}

const chartConfig = {
	connectionCount: {
		label: "New Connections",
		color: "hsl(var(--chart-1))",
	},
	growth: {
		label: "Growth Rate (%)",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

const Chart: React.FC<ChartProps> = ({ chartData }) => {
	return (
		<div className="w-[600px] -ml-2">
			<ChartContainer config={chartConfig}>
				<ComposedChart accessibilityLayer data={chartData}>
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
					<YAxis yAxisId="left" tickLine={false} axisLine={true} />
					<YAxis
						yAxisId="right"
						orientation="right"
						tickLine={false}
						axisLine={true}
						tickFormatter={(value) => `${value}%`}
					/>
					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent indicator="line" />}
					/>
					<Bar
						yAxisId="left"
						dataKey="connectionCount"
						fill="#0077B5"
						fillOpacity={0.7}
						name="New Connections"
					/>
					<Line
						yAxisId="right"
						dataKey="growth"
						type="monotone"
						stroke="#00A0DC"
						name="Growth Rate"
						strokeWidth={2}
					/>
					<Legend />
				</ComposedChart>
			</ChartContainer>
		</div>
	);
};

export default Chart;
