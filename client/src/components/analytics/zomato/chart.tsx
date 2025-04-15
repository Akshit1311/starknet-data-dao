"use client";

import type React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "~/components/ui/chart";

import type { OrderChartData } from "./index";

interface ChartProps {
	chartData: OrderChartData[];
}

const chartConfig = {
	cost: {
		label: "Cost (₹)",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

const Chart: React.FC<ChartProps> = ({ chartData }) => {
	return (
		<div className="w-[600px] -ml-4">
			<ChartContainer config={chartConfig}>
				<AreaChart accessibilityLayer data={chartData}>
					{/* <CartesianGrid vertical={false} /> */}
					<XAxis
						dataKey="month"
						tickLine={false}
						axisLine={true}
						tickMargin={8}
						tickFormatter={(value) => value.slice(0, 3)}
					/>
					<YAxis
						tickLine={false}
						axisLine={true}
						tickFormatter={(value) => `₹${value}`}
					/>
					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent indicator="line" />}
					/>
					<Area
						dataKey="cost"
						type="natural"
						fill="#00C8EF"
						fillOpacity={0.4}
						stroke="#000"
						name="Cost"
					/>
				</AreaChart>
			</ChartContainer>
		</div>
	);
};

export default Chart;
