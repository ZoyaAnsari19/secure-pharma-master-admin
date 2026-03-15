"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const data = [
  { day: "Mon", orders: 320 },
  { day: "Tue", orders: 280 },
  { day: "Wed", orders: 360 },
  { day: "Thu", orders: 410 },
  { day: "Fri", orders: 450 },
  { day: "Sat", orders: 380 },
  { day: "Sun", orders: 290 },
];

export function OrdersOverviewChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -24, right: 0, top: 10 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#fce0ec"
            vertical={false}
          />
          <XAxis
            dataKey="day"
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
          <Bar
            dataKey="orders"
            radius={[10, 10, 10, 10]}
            barSize={18}
            fill="#ec5a87"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
