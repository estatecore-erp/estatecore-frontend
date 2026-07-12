"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MonthlySales } from "@/types";

const chartConfig = {
  total: {
    label: "Sales",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const SalesChart = ({ data }: { data: MonthlySales[] }) => {
  return (
    <ChartContainer config={chartConfig} className="h-50 w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

export default SalesChart;
