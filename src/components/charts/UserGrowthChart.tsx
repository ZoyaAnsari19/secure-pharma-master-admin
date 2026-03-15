"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", newUsers: 800, returningUsers: 420 },
  { month: "Feb", newUsers: 920, returningUsers: 460 },
  { month: "Mar", newUsers: 1040, returningUsers: 510 },
  { month: "Apr", newUsers: 1180, returningUsers: 560 },
  { month: "May", newUsers: 1320, returningUsers: 620 },
  { month: "Jun", newUsers: 1470, returningUsers: 690 },
];

export function UserGrowthChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -24, right: 0, top: 10 }}>
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
          <Line
            type="monotone"
            dataKey="newUsers"
            stroke="#ec5a87"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="returningUsers"
            stroke="#f9a8d4"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
