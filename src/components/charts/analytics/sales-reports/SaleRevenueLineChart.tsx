 "use client";

import { useState } from "react";
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
  monthly: RevenuePoint[];
  weekly: RevenuePoint[];
  daily: RevenuePoint[];
};

const GRANULARITY_LABEL: Record<Granularity, string> = {
  daily: "Daily revenue",
  weekly: "Weekly revenue",
  monthly: "Monthly revenue",
};

export function SaleRevenueLineChart({
  monthly,
  weekly,
  daily,
}: SaleRevenueLineChartProps) {
  const [active, setActive] = useState<Granularity>("monthly");

  const data =
    active === "monthly" ? monthly : active === "weekly" ? weekly : daily;

  return (
    <div className="flex h-72 w-full flex-col">
      <div className="mb-3 inline-flex self-end rounded-full bg-slate-50 p-1 text-xs font-medium text-slate-600">
        {(["monthly", "weekly", "daily"] as Granularity[]).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setActive(g)}
            className={`rounded-full px-3 py-1 transition ${
              active === g
                ? "bg-white text-pink-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {g === "monthly"
              ? "Monthly"
              : g === "weekly"
              ? "Weekly"
              : "Daily"}
          </button>
        ))}
      </div>
      <div className="flex-1">
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
                GRANULARITY_LABEL[active],
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
    </div>
  );
}

