 "use client";

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type RevenuePoint = {
  label: string; // e.g. "Jan", "Week 1", "2026-03-16"
  amount: number;
};

type Granularity = "daily" | "weekly" | "monthly";

type SaleRevenueLineChartProps = {
  data: RevenuePoint[];
  granularity: Granularity;
};

const GRANULARITY_LABEL: Record<Granularity, string> = {
  daily: "Daily revenue",
  weekly: "Weekly revenue",
  monthly: "Monthly revenue",
};

export function SaleRevenueLineChart({
  data,
  granularity,
}: SaleRevenueLineChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ left: -24, right: 0, top: 10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#fce0ec"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tick={{ fontSize: 11, fill: "#9f8ca5" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tick={{ fontSize: 11, fill: "#9f8ca5" }}
          />
          <Tooltip
            formatter={(value: number) => [
              `₹${value.toLocaleString()}`,
              GRANULARITY_LABEL[granularity],
            ]}
            labelFormatter={(label) => label}
            contentStyle={{
              borderRadius: 16,
              borderColor: "#f9ccd9",
              boxShadow: "0 18px 45px rgba(236,90,135,0.1)",
              fontSize: 11,
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#ec5a87"
            strokeWidth={2.4}
            dot={{ r: 3.5, strokeWidth: 1.2 }}
            activeDot={{ r: 5 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

