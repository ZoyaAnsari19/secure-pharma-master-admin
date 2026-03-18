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

export type OrderStatusDatum = {
  status: string;
  value: number;
  fill?: string;
};

type OrdersStatusPieChartProps = {
  data: OrderStatusDatum[];
};

const STATUS_COLORS: Record<string, string> = {
  Pending: "#f97316", // orange
  Processing: "#3b82f6", // blue
  Shipped: "#8b5cf6", // violet
  Delivered: "#10b981", // emerald
  Cancelled: "#ef4444", // red
};

export function OrdersStatusPieChart({ data }: OrdersStatusPieChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const chartData = data.map((d) => ({
    name: d.status,
    value: d.value,
    fill: d.fill ?? STATUS_COLORS[d.status] ?? "#9ca3af",
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <div className="h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
            stroke="white"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`order-status-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, _name: string, item: any) => {
              const percent = ((value / total) * 100).toFixed(1);
              return [`${value} (${percent}%)`, item?.name ?? "Status"];
            }}
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
            formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

