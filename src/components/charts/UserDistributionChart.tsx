"use client";

import { useEffect, useState } from "react";
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

const TOTAL_USERS = data.reduce((sum, item) => sum + item.value, 0);

export function UserDistributionChart() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="flex w-full flex-col">
      <div className="h-60 sm:h-72">
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
              layout={isMobile ? "horizontal" : "vertical"}
              align={isMobile ? "center" : "right"}
              verticalAlign={isMobile ? "bottom" : "middle"}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-gray-600">{value}</span>
              )}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-1">
        {data.map((item, index) => {
          const percentage = ((item.value / TOTAL_USERS) * 100).toFixed(1);
          return (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-1.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-xs font-medium text-slate-700">
                  {item.name}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-800">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
