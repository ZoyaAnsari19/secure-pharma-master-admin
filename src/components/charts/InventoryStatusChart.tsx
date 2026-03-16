 "use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type InventoryStatusDatum = {
  name: string;
  value: number;
  fill?: string;
};

type InventoryStatusChartProps = {
  data: InventoryStatusDatum[];
};

const SEGMENT_COLORS = {
  total: "#0ea5e9", // sky
  low: "#f97316", // orange
  expiring: "#eab308", // yellow
  out: "#ef4444", // red
};

export function InventoryStatusChart({ data }: InventoryStatusChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    fill:
      d.fill ??
      (d.name.toLowerCase().includes("total")
        ? SEGMENT_COLORS.total
        : d.name.toLowerCase().includes("low")
        ? SEGMENT_COLORS.low
        : d.name.toLowerCase().includes("expiring")
        ? SEGMENT_COLORS.expiring
        : SEGMENT_COLORS.out),
  }));

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="85%"
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
            stroke="white"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`inv-cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, _name: string, item: any) => [
              value.toLocaleString(),
              item?.name ?? "Value",
            ]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontSize: 12,
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-[11px] text-gray-600">{value}</span>
            )}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

