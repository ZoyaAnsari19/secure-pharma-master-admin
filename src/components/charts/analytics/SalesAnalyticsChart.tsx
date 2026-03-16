 "use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";

export type ChartType =
  | "line"
  | "bar"
  | "horizontalBar"
  | "donut"
  | "stackedBar";

type BaseProps<T extends Record<string, any>> = {
  data: T[];
  /**
   * Tailwind height class for outer container.
   */
  heightClassName?: string;
  /**
   * Optional custom colors (cycled through series / segments).
   */
  colors?: string[];
  /**
   * Optional value formatter for tooltip and stacked labels.
   */
  valueFormatter?: (value: number) => string;
};

type LineOrBarProps<T extends Record<string, any>> = BaseProps<T> & {
  chartType: "line" | "bar";
  xKey: keyof T;
  yKey: keyof T;
};

type HorizontalBarProps<T extends Record<string, any>> = BaseProps<T> & {
  chartType: "horizontalBar";
  labelKey: keyof T;
  valueKey: keyof T;
};

type DonutProps<T extends Record<string, any>> = BaseProps<T> & {
  chartType: "donut";
  nameKey: keyof T;
  valueKey: keyof T;
};

type StackedBarProps<T extends Record<string, any>> = BaseProps<T> & {
  chartType: "stackedBar";
  xKey: keyof T;
  seriesKeys: (keyof T)[];
};

export type SalesAnalyticsChartProps<T extends Record<string, any>> =
  | LineOrBarProps<T>
  | HorizontalBarProps<T>
  | DonutProps<T>
  | StackedBarProps<T>;

const DEFAULT_COLORS = [
  "#ec5a87",
  "#8b5cf6",
  "#0ea5e9",
  "#f97316",
  "#10b981",
  "#facc15",
];

export function SalesAnalyticsChart<T extends Record<string, any>>(
  props: SalesAnalyticsChartProps<T>
) {
  const {
    data,
    heightClassName = "h-64",
    colors = DEFAULT_COLORS,
    valueFormatter = (v) => v.toLocaleString(),
  } = props as BaseProps<T>;

  if (props.chartType === "line") {
    const { xKey, yKey } = props as LineOrBarProps<T>;
    return (
      <div className={`${heightClassName} w-full`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ left: -24, right: 0, top: 10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#fce0ec"
              vertical={false}
            />
            <XAxis
              dataKey={xKey as string}
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
              formatter={(value: number) => [valueFormatter(value)]}
              contentStyle={{
                borderRadius: 16,
                borderColor: "#f9ccd9",
                boxShadow: "0 18px 45px rgba(236,90,135,0.1)",
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey={yKey as string}
              stroke={colors[0]}
              strokeWidth={2.4}
              dot={{ r: 3.5, strokeWidth: 1.2 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (props.chartType === "bar") {
    const { xKey, yKey } = props as LineOrBarProps<T>;
    return (
      <div className={`${heightClassName} w-full`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ left: -24, right: 0, top: 10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#fce0ec"
              vertical={false}
            />
            <XAxis
              dataKey={xKey as string}
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
              formatter={(value: number) => [valueFormatter(value)]}
              contentStyle={{
                borderRadius: 16,
                borderColor: "#f9ccd9",
                boxShadow: "0 18px 45px rgba(236,90,135,0.1)",
                fontSize: 11,
              }}
            />
            <Bar
              dataKey={yKey as string}
              radius={[6, 6, 0, 0]}
              barSize={20}
              fill={colors[0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (props.chartType === "horizontalBar") {
    const { labelKey, valueKey } = props as HorizontalBarProps<T>;
    const sorted = [...data].sort(
      (a, b) => (b[valueKey] as number) - (a[valueKey] as number)
    );
    return (
      <div className={`${heightClassName} w-full`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sorted}
            layout="vertical"
            margin={{ top: 10, bottom: 10, left: 80, right: 16 }}
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
              dataKey={labelKey as string}
              width={140}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tick={{ fontSize: 11, fill: "#4b5563" }}
            />
            <Tooltip
              formatter={(value: number) => [valueFormatter(value)]}
              contentStyle={{
                borderRadius: 16,
                borderColor: "#f9ccd9",
                boxShadow: "0 18px 45px rgba(236,90,135,0.1)",
                fontSize: 11,
              }}
            />
            <Bar
              dataKey={valueKey as string}
              radius={[6, 6, 6, 6]}
              barSize={18}
              fill={colors[0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (props.chartType === "donut") {
    const { nameKey, valueKey } = props as DonutProps<T>;
    const chartData = data.map((d, index) => ({
      ...d,
      fill: colors[index % colors.length],
    }));

    return (
      <div className={`${heightClassName} w-full`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={3}
              dataKey={valueKey as string}
              nameKey={nameKey as string}
              stroke="white"
              strokeWidth={2}
            />
            <Tooltip
              formatter={(value: number, _name: string, item: any) => [
                valueFormatter(value),
                item?.name,
              ]}
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
              formatter={(value) => (
                <span className="text-xs text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // stackedBar
  const { xKey, seriesKeys } = props as StackedBarProps<T>;
  return (
    <div className={`${heightClassName} w-full`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ left: -24, right: 0, top: 10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#fce0ec"
            vertical={false}
          />
          <XAxis
            dataKey={xKey as string}
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
            formatter={(value: number) => [valueFormatter(value)]}
            contentStyle={{
              borderRadius: 16,
              borderColor: "#f9ccd9",
              boxShadow: "0 18px 45px rgba(236,90,135,0.1)",
              fontSize: 11,
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs text-gray-600">{value}</span>
            )}
          />
          {seriesKeys.map((key, index) => (
            <Bar
              key={String(key)}
              dataKey={key as string}
              stackId="stack"
              fill={colors[index % colors.length]}
              radius={index === seriesKeys.length - 1 ? [6, 6, 0, 0] : 0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

