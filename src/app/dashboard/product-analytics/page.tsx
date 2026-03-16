"use client";

import { useMemo, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DataTable, Column } from "@/components/ui/table";
import { SalesAnalyticsChart } from "@/components/charts/SalesAnalyticsChart";

type TrendView = "Daily" | "Weekly" | "Monthly";

type ProductTrendPoint = {
  label: string;
  units: number;
  revenue: number;
};

type TopProductPoint = {
  name: string;
  unitsSold: number;
  revenue: number;
};

type CategorySalesPoint = {
  category: string;
  value: number;
};

type PerformanceComparisonPoint = {
  product: string;
  unitsSold: number;
  revenue: number;
};

type LowPerformerPoint = {
  product: string;
  unitsSold: number;
};

type StockVsSalesPoint = {
  product: string;
  stock: number;
  sold: number;
};

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

type DateRangeFilter =
  | "All time"
  | "Last 7 days"
  | "Last 30 days"
  | "Last 90 days";

type ProductAnalyticsRow = {
  id: number;
  name: string;
  category: string;
  sku: string;
  unitsSold: number;
  revenue: number;
  currentStock: number;
  stockStatus: StockStatus;
  returns: number;
  lastUpdated: string; // ISO date string
};

const CATEGORY_OPTIONS = [
  "All categories",
  "Skincare",
  "Haircare",
  "Wellness",
  "Personal Care",
] as const;

const STOCK_STATUS_OPTIONS: ("All statuses" | StockStatus)[] = [
  "All statuses",
  "In Stock",
  "Low Stock",
  "Out of Stock",
];

const DATE_RANGE_OPTIONS: DateRangeFilter[] = [
  "All time",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
];

const dailyProductTrend: ProductTrendPoint[] = [
  { label: "Mon", units: 320, revenue: 78000 },
  { label: "Tue", units: 295, revenue: 74200 },
  { label: "Wed", units: 348, revenue: 82600 },
  { label: "Thu", units: 382, revenue: 90120 },
  { label: "Fri", units: 415, revenue: 96850 },
  { label: "Sat", units: 390, revenue: 93240 },
  { label: "Sun", units: 305, revenue: 72680 },
];

const weeklyProductTrend: ProductTrendPoint[] = [
  { label: "Week 1", units: 2140, revenue: 486000 },
  { label: "Week 2", units: 2280, revenue: 512400 },
  { label: "Week 3", units: 2365, revenue: 529800 },
  { label: "Week 4", units: 2490, revenue: 556200 },
];

const monthlyProductTrend: ProductTrendPoint[] = [
  { label: "Jan", units: 8120, revenue: 1824000 },
  { label: "Feb", units: 8340, revenue: 1882000 },
  { label: "Mar", units: 8610, revenue: 1956000 },
  { label: "Apr", units: 8920, revenue: 2032000 },
  { label: "May", units: 9240, revenue: 2108000 },
  { label: "Jun", units: 9480, revenue: 2164000 },
];

const topSellingProducts: TopProductPoint[] = [
  { name: "Glow Serum Pro 30ml", unitsSold: 1820, revenue: 546000 },
  { name: "Hydra Moisturizer 50ml", unitsSold: 1560, revenue: 421000 },
  { name: "Vitamin C Serum 30ml", unitsSold: 1390, revenue: 398000 },
  { name: "Sunscreen SPF 50 50ml", unitsSold: 1210, revenue: 352000 },
  { name: "Night Repair Cream 50g", unitsSold: 980, revenue: 289000 },
];

const categorySales: CategorySalesPoint[] = [
  { category: "Serums", value: 38 },
  { category: "Moisturizers", value: 26 },
  { category: "Sunscreens", value: 18 },
  { category: "Cleansers", value: 10 },
  { category: "Wellness", value: 8 },
];

const TOTAL_TOP_REVENUE = topSellingProducts.reduce(
  (sum, item) => sum + item.revenue,
  0
);

const TOTAL_CATEGORY_SALES = categorySales.reduce(
  (sum, item) => sum + item.value,
  0
);

const productPerformanceComparison: PerformanceComparisonPoint[] = [
  { product: "Glow Serum Pro", unitsSold: 1820, revenue: 546000 },
  { product: "Hydra Moisturizer", unitsSold: 1560, revenue: 421000 },
  { product: "Vitamin C Serum", unitsSold: 1390, revenue: 398000 },
  { product: "Sunscreen SPF 50", unitsSold: 1210, revenue: 352000 },
];

const lowPerformingProducts: LowPerformerPoint[] = [
  { product: "Gentle Face Wash", unitsSold: 220 },
  { product: "Lip Balm Classic", unitsSold: 185 },
  { product: "Hand Cream", unitsSold: 160 },
  { product: "Hair Serum Lite", unitsSold: 140 },
];

const TOTAL_PERFORMANCE_UNITS = productPerformanceComparison.reduce(
  (sum, item) => sum + item.unitsSold,
  0
);

const TOTAL_LOW_PERFORMING_UNITS = lowPerformingProducts.reduce(
  (sum, item) => sum + item.unitsSold,
  0
);

const productStockVsSales: StockVsSalesPoint[] = [
  { product: "Glow Serum Pro", stock: 820, sold: 1820 },
  { product: "Hydra Moisturizer", stock: 640, sold: 1560 },
  { product: "Vitamin C Serum", stock: 520, sold: 1390 },
  { product: "Sunscreen SPF 50", stock: 480, sold: 1210 },
  { product: "Night Repair Cream", stock: 430, sold: 980 },
];

const TOTAL_STOCK_VS_SALES = productStockVsSales.reduce(
  (acc, item) => {
    acc.stock += item.stock;
    acc.sold += item.sold;
    return acc;
  },
  { stock: 0, sold: 0 }
);

const productAnalyticsRows: ProductAnalyticsRow[] = [
  {
    id: 1,
    name: "Glow Serum Pro 30ml",
    category: "Skincare",
    sku: "GSP-30",
    unitsSold: 1820,
    revenue: 546000,
    currentStock: 820,
    stockStatus: "In Stock",
    returns: 26,
    lastUpdated: "2026-03-15T16:24:00",
  },
  {
    id: 2,
    name: "Hydra Moisturizer 50ml",
    category: "Skincare",
    sku: "HM-50",
    unitsSold: 1560,
    revenue: 421000,
    currentStock: 260,
    stockStatus: "Low Stock",
    returns: 18,
    lastUpdated: "2026-03-14T11:05:00",
  },
  {
    id: 3,
    name: "Vitamin C Serum 30ml",
    category: "Skincare",
    sku: "VCS-30",
    unitsSold: 1390,
    revenue: 398000,
    currentStock: 0,
    stockStatus: "Out of Stock",
    returns: 22,
    lastUpdated: "2026-03-12T09:42:00",
  },
  {
    id: 4,
    name: "Sunscreen SPF 50 50ml",
    category: "Skincare",
    sku: "SSPF-50",
    unitsSold: 1210,
    revenue: 352000,
    currentStock: 340,
    stockStatus: "In Stock",
    returns: 14,
    lastUpdated: "2026-03-10T13:18:00",
  },
  {
    id: 5,
    name: "Night Repair Cream 50g",
    category: "Skincare",
    sku: "NRC-50",
    unitsSold: 980,
    revenue: 289000,
    currentStock: 430,
    stockStatus: "In Stock",
    returns: 11,
    lastUpdated: "2026-03-09T10:50:00",
  },
  {
    id: 6,
    name: "Hair Strengthening Oil 100ml",
    category: "Haircare",
    sku: "HSO-100",
    unitsSold: 640,
    revenue: 168000,
    currentStock: 540,
    stockStatus: "In Stock",
    returns: 7,
    lastUpdated: "2026-03-13T12:18:00",
  },
  {
    id: 7,
    name: "Immunity Booster Gummies",
    category: "Wellness",
    sku: "IBG-60",
    unitsSold: 420,
    revenue: 112000,
    currentStock: 210,
    stockStatus: "Low Stock",
    returns: 9,
    lastUpdated: "2026-03-11T09:50:00",
  },
];

const productAnalyticsColumns: Column<ProductAnalyticsRow>[] = [
  { key: "name", label: "Product" },
  { key: "category", label: "Category" },
  { key: "sku", label: "SKU" },
  { key: "unitsSold", label: "Units Sold" },
  {
    key: "revenue",
    label: "Revenue",
    render: (row) => `₹${row.revenue.toLocaleString()}`,
  },
  { key: "currentStock", label: "Current Stock" },
  { key: "stockStatus", label: "Stock Status" },
  { key: "returns", label: "Returns" },
  {
    key: "lastUpdated",
    label: "Last Updated",
    render: (row) =>
      new Date(row.lastUpdated).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
];

export default function ProductAnalyticsPage() {
  const [trendView, setTrendView] = useState<TrendView>("Monthly");
  const [categoryFilter, setCategoryFilter] =
    useState<(typeof CATEGORY_OPTIONS)[number]>("All categories");
  const [stockStatusFilter, setStockStatusFilter] = useState<
    (typeof STOCK_STATUS_OPTIONS)[number]
  >("All statuses");
  const [dateRangeFilter, setDateRangeFilter] =
    useState<DateRangeFilter>("All time");

  const trendData =
    trendView === "Daily"
      ? dailyProductTrend
      : trendView === "Weekly"
      ? weeklyProductTrend
      : monthlyProductTrend;

  const filteredRows = useMemo(() => {
    const today = new Date("2026-03-16");

    const matchesDateRange = (lastUpdated: string): boolean => {
      if (dateRangeFilter === "All time") return true;

      const updated = new Date(lastUpdated);
      const diffDays = Math.floor(
        (today.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dateRangeFilter === "Last 7 days") {
        return diffDays >= 0 && diffDays <= 7;
      }
      if (dateRangeFilter === "Last 30 days") {
        return diffDays >= 0 && diffDays <= 30;
      }
      if (dateRangeFilter === "Last 90 days") {
        return diffDays >= 0 && diffDays <= 90;
      }

      return true;
    };

    return productAnalyticsRows.filter((row) => {
      const matchesCategory =
        categoryFilter === "All categories" || row.category === categoryFilter;

      const matchesStatus =
        stockStatusFilter === "All statuses" ||
        row.stockStatus === stockStatusFilter;

      return (
        matchesCategory && matchesStatus && matchesDateRange(row.lastUpdated)
      );
    });
  }, [categoryFilter, stockStatusFilter, dateRangeFilter]);

  return (
    <div className="flex min-h-screen bg-slate-50/80 text-slate-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
            <div className="space-y-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                  Product Analytics
                </h1>
                <p className="text-sm text-slate-500">
                  Product performance, stock health and revenue contribution by
                  SKU
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Product Sales Trend
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Switch between daily, weekly and monthly product revenue
                        trends
                      </CardDescription>
                    </div>
                    <div className="inline-flex rounded-full bg-slate-50 p-1 text-xs font-medium text-slate-600">
                      {(["Daily", "Weekly", "Monthly"] as const).map((view) => (
                        <button
                          key={view}
                          type="button"
                          onClick={() => setTrendView(view)}
                          className={`rounded-full px-3 py-1 transition ${
                            trendView === view
                              ? "bg-white text-pink-600 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {view}
                        </button>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="line"
                      data={trendData}
                      xKey="label"
                      yKey="revenue"
                      heightClassName="h-72"
                      valueFormatter={(v) => `₹${v.toLocaleString()}`}
                    />
                  </CardContent>
                </Card>

                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Product Stock vs Sales
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Compare current stock on hand vs units sold for top
                        products
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="stackedBar"
                      data={productStockVsSales}
                      xKey="product"
                      seriesKeys={["stock", "sold"]}
                      heightClassName="h-72"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                    <div className="mt-4 space-y-1.5">
                      {[
                        { label: "Stock", value: TOTAL_STOCK_VS_SALES.stock },
                        { label: "Sold", value: TOTAL_STOCK_VS_SALES.sold },
                      ].map((item, index) => {
                        const total =
                          TOTAL_STOCK_VS_SALES.stock +
                          TOTAL_STOCK_VS_SALES.sold ||
                          1;
                        const percentage = (item.value / total) * 100;
                        const colors = ["#6366f1", "#ec4899"];
                        return (
                          <div
                            key={item.label}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                  backgroundColor: colors[index],
                                }}
                              />
                              <span className="text-xs font-medium text-slate-700">
                                {item.label}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-slate-800">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Top Selling Products
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Products contributing the most revenue in the selected
                        period
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="horizontalBar"
                      data={topSellingProducts}
                      labelKey="name"
                      valueKey="revenue"
                      heightClassName="h-72"
                      valueFormatter={(v) => `₹${v.toLocaleString()}`}
                    />
                    <div className="mt-4 space-y-1.5">
                      {topSellingProducts.map((item, index) => {
                        const percentage =
                          (item.revenue / (TOTAL_TOP_REVENUE || 1)) * 100;
                        const colors = [
                          "#ec4899",
                          "#6366f1",
                          "#0ea5e9",
                          "#f97316",
                          "#10b981",
                        ];
                        return (
                          <div
                            key={item.name}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                  backgroundColor: colors[index % colors.length],
                                }}
                              />
                              <span className="text-xs font-medium text-slate-700">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-slate-800">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Product Sales by Category
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Relative share of each category in total units sold
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="donut"
                      data={categorySales}
                      nameKey="category"
                      valueKey="value"
                      heightClassName="h-72"
                      valueFormatter={(v) => `${v.toFixed(1)}%`}
                    />
                    <div className="mt-4 space-y-1.5">
                      {categorySales.map((item, index) => {
                        const percentage =
                          (item.value / (TOTAL_CATEGORY_SALES || 1)) * 100;
                        const colors = [
                          "#0ea5e9",
                          "#8b5cf6",
                          "#f97316",
                          "#22c55e",
                          "#e11d48",
                        ];
                        return (
                          <div
                            key={item.category}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                  backgroundColor: colors[index % colors.length],
                                }}
                              />
                              <span className="text-xs font-medium text-slate-700">
                                {item.category}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-slate-800">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Product Performance Comparison
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Compare units sold across key products
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="bar"
                      data={productPerformanceComparison}
                      xKey="product"
                      yKey="unitsSold"
                      heightClassName="h-72"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                    <div className="mt-4 space-y-1.5">
                      {productPerformanceComparison.map((item, index) => {
                        const percentage =
                          (item.unitsSold / (TOTAL_PERFORMANCE_UNITS || 1)) *
                          100;
                        const colors = [
                          "#ec4899",
                          "#6366f1",
                          "#0ea5e9",
                          "#f97316",
                        ];
                        return (
                          <div
                            key={item.product}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                  backgroundColor: colors[index % colors.length],
                                }}
                              />
                              <span className="text-xs font-medium text-slate-700">
                                {item.product}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-slate-800">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Low Performing Products
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Products with lowest sales volume in the period
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="bar"
                      data={lowPerformingProducts}
                      xKey="product"
                      yKey="unitsSold"
                      heightClassName="h-72"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                    <div className="mt-4 space-y-1.5">
                      {lowPerformingProducts.map((item, index) => {
                        const percentage =
                          (item.unitsSold / (TOTAL_LOW_PERFORMING_UNITS || 1)) *
                          100;
                        const colors = [
                          "#22c55e",
                          "#f97316",
                          "#6366f1",
                          "#ec4899",
                        ];
                        return (
                          <div
                            key={item.product}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                  backgroundColor: colors[index % colors.length],
                                }}
                              />
                              <span className="text-xs font-medium text-slate-700">
                                {item.product}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-slate-800">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Detailed Product Analytics
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Product-wise units sold, revenue, stock status and
                        returns
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataTable<ProductAnalyticsRow>
                    title=""
                    columns={productAnalyticsColumns}
                    data={filteredRows}
                    pageSize={6}
                    searchPlaceholder="Search by product, SKU or category..."
                    hideFiltersButton
                    showIndexColumn
                    indexColumnLabel="Sr No."
                    rightHeader={
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-700 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                          value={categoryFilter}
                          onChange={(e) =>
                            setCategoryFilter(
                              e.target.value as (typeof CATEGORY_OPTIONS)[number]
                            )
                          }
                        >
                          {CATEGORY_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <select
                          className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-700 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                          value={stockStatusFilter}
                          onChange={(e) =>
                            setStockStatusFilter(
                              e.target.value as (typeof STOCK_STATUS_OPTIONS)[number]
                            )
                          }
                        >
                          {STOCK_STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <select
                          className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-700 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                          value={dateRangeFilter}
                          onChange={(e) =>
                            setDateRangeFilter(e.target.value as DateRangeFilter)
                          }
                        >
                          {DATE_RANGE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}