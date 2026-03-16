 "use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type TopSellingDatum = {
  name: string;
  value: number;
};

type TopSellingBarChartProps = {
  data: TopSellingDatum[];
  /**
   * Label for the metric, shown in tooltip.
   * Example: "Units sold" or "Revenue".
   */
  metricLabel?: string;
};

export function TopSellingBarChart({
  data,
  metricLabel = "Units sold",
}: TopSellingBarChartProps) {
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 10, bottom: 10, left: 60, right: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#fce0ec"
            horizontal={false}
          />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tick={{ fontSize: 11, fill: "#9f8ca5" }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tick={{ fontSize: 11, fill: "#4b5563" }}
          />
          <Tooltip
            formatter={(value: number) => [
              value.toLocaleString(),
              metricLabel,
            ]}
            contentStyle={{
              borderRadius: 16,
              borderColor: "#f9ccd9",
              boxShadow: "0 18px 45px rgba(236,90,135,0.1)",
              fontSize: 11,
            }}
          />
          <Bar
            dataKey="value"
            radius={[6, 6, 6, 6]}
            barSize={18}
            fill="#ec5a87"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

