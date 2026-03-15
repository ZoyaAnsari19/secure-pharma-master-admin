"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", revenue: 32000 },
  { month: "Feb", revenue: 38000 },
  { month: "Mar", revenue: 41000 },
  { month: "Apr", revenue: 46000 },
  { month: "May", revenue: 52000 },
  { month: "Jun", revenue: 58000 },
];

export function RevenueOverviewChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -24, right: 0, top: 10 }}>
          <defs>
            <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec5a87" stopOpacity={0.84} />
              <stop offset="100%" stopColor="#ec5a87" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#fce0ec"
            vertical={false}
          />
          <XAxis
            dataKey="month"
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
            contentStyle={{
              borderRadius: 16,
              borderColor: "#f9ccd9",
              boxShadow: "0 18px 45px rgba(236,90,135,0.1)",
              fontSize: 11,
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#ec5a87"
            strokeWidth={2.4}
            fill="url(#revGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
