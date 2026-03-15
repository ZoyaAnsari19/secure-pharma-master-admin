"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const ROLE_COLORS = [
  "#0ea5e9", // sky - distributor
  "#8b5cf6", // violet - franchise
  "#f59e0b", // amber - retailer
  "#ec4899", // pink - networker
  "#10b981", // emerald - customer
];

const data = [
  { name: "Distributor", value: 156, fill: ROLE_COLORS[0] },
  { name: "Franchise", value: 42, fill: ROLE_COLORS[1] },
  { name: "Retailer", value: 892, fill: ROLE_COLORS[2] },
  { name: "Networker", value: 234, fill: ROLE_COLORS[3] },
  { name: "Customer", value: 11219, fill: ROLE_COLORS[4] },
];

export function UserDistributionChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            stroke="white"
            strokeWidth={2}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={data[index].fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [value.toLocaleString(), "Users"]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontSize: 12,
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={8}
            formatter={(value, entry) => (
              <span className="text-xs text-gray-600">{value}</span>
            )}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
