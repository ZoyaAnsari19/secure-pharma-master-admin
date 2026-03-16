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

type InventoryTrendPoint = {
  label: string;
  incoming: number;
  outgoing: number;
  net: number;
};

type WarehouseStockPoint = {
  warehouse: string;
  stock: number;
};

type StatusPoint = {
  status: string;
  value: number;
};

type ProductMovementPoint = {
  name: string;
  value: number;
};

type StockMovementPoint = {
  period: string;
  incoming: number;
  outgoing: number;
};

type InventoryRow = {
  id: number;
  productName: string;
  sku: string;
  warehouse: string;
  category: string;
  totalStock: number;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  batchNumber: string;
  expiryDate: string;
  lastUpdated: string;
};

const WAREHOUSE_OPTIONS = [
  "All warehouses",
  "Mumbai WH",
  "Delhi WH",
  "Bengaluru WH",
  "Hyderabad WH",
] as const;

const CATEGORY_OPTIONS = [
  "All categories",
  "Skincare",
  "Haircare",
  "Wellness",
  "Personal Care",
] as const;

const STOCK_STATUS_OPTIONS = [
  "All statuses",
  "In Stock",
  "Low Stock",
  "Out of Stock",
] as const;

const EXPIRY_RANGE_OPTIONS = [
  "Any expiry",
  "Expiring in 30 days",
  "Expiring in 90 days",
  "Expired",
] as const;

const dailyInventoryTrend: InventoryTrendPoint[] = [
  { label: "Mon", incoming: 420, outgoing: 360, net: 60 },
  { label: "Tue", incoming: 380, outgoing: 310, net: 70 },
  { label: "Wed", incoming: 460, outgoing: 390, net: 70 },
  { label: "Thu", incoming: 510, outgoing: 430, net: 80 },
  { label: "Fri", incoming: 530, outgoing: 470, net: 60 },
  { label: "Sat", incoming: 390, outgoing: 420, net: -30 },
  { label: "Sun", incoming: 310, outgoing: 280, net: 30 },
];

const weeklyInventoryTrend: InventoryTrendPoint[] = [
  { label: "Week 1", incoming: 2480, outgoing: 2190, net: 290 },
  { label: "Week 2", incoming: 2610, outgoing: 2310, net: 300 },
  { label: "Week 3", incoming: 2740, outgoing: 2430, net: 310 },
  { label: "Week 4", incoming: 2890, outgoing: 2550, net: 340 },
];

const monthlyInventoryTrend: InventoryTrendPoint[] = [
  { label: "Jan", incoming: 9200, outgoing: 8540, net: 660 },
  { label: "Feb", incoming: 9480, outgoing: 8810, net: 670 },
  { label: "Mar", incoming: 9860, outgoing: 9130, net: 730 },
  { label: "Apr", incoming: 10120, outgoing: 9380, net: 740 },
  { label: "May", incoming: 10480, outgoing: 9680, net: 800 },
  { label: "Jun", incoming: 10840, outgoing: 9940, net: 900 },
];

const warehouseStockData: WarehouseStockPoint[] = [
  { warehouse: "Mumbai WH", stock: 4820 },
  { warehouse: "Delhi WH", stock: 3980 },
  { warehouse: "Bengaluru WH", stock: 3620 },
  { warehouse: "Hyderabad WH", stock: 2870 },
  { warehouse: "Ahmedabad WH", stock: 2140 },
];

const TOTAL_WAREHOUSE_STOCK = warehouseStockData.reduce(
  (sum, item) => sum + item.stock,
  0
);

const inventoryStatusData: StatusPoint[] = [
  { status: "In Stock", value: 72 },
  { status: "Low Stock", value: 18 },
  { status: "Out of Stock", value: 10 },
];

const TOTAL_STATUS_VALUE = inventoryStatusData.reduce(
  (sum, item) => sum + item.value,
  0
);

const topStockMovementProducts: ProductMovementPoint[] = [
  { name: "Glow Serum Pro", value: 1240 },
  { name: "Hydra Moisturizer", value: 980 },
  { name: "Vitamin C Serum", value: 860 },
  { name: "Sunscreen SPF 50", value: 640 },
  { name: "Night Repair Cream", value: 520 },
];

const expiringProductsData: ProductMovementPoint[] = [
  { name: "Batch A (30d)", value: 420 },
  { name: "Batch B (45d)", value: 360 },
  { name: "Batch C (60d)", value: 280 },
  { name: "Batch D (90d)", value: 190 },
];

const TOTAL_EXPIRING = expiringProductsData.reduce(
  (sum, item) => sum + item.value,
  0
);

const stockMovementAnalytics: StockMovementPoint[] = [
  { period: "Week 1", incoming: 2480, outgoing: 2190 },
  { period: "Week 2", incoming: 2610, outgoing: 2310 },
  { period: "Week 3", incoming: 2740, outgoing: 2430 },
  { period: "Week 4", incoming: 2890, outgoing: 2550 },
];

const TOTAL_STOCK_MOVEMENT = stockMovementAnalytics.reduce(
  (acc, item) => {
    acc.incoming += item.incoming;
    acc.outgoing += item.outgoing;
    return acc;
  },
  { incoming: 0, outgoing: 0 }
);

const TOTAL_TOP_MOVEMENT = topStockMovementProducts.reduce(
  (sum, item) => sum + item.value,
  0
);

const inventoryRows: InventoryRow[] = [
  {
    id: 1,
    productName: "Glow Serum Pro 30ml",
    sku: "GSP-30",
    warehouse: "Mumbai WH",
    category: "Skincare",
    totalStock: 820,
    stockStatus: "In Stock",
    batchNumber: "BATCH-GSP-2405",
    expiryDate: "2025-05-30",
    lastUpdated: "2026-03-14 16:24",
  },
  {
    id: 2,
    productName: "Hydra Moisturizer 50ml",
    sku: "HM-50",
    warehouse: "Delhi WH",
    category: "Skincare",
    totalStock: 120,
    stockStatus: "Low Stock",
    batchNumber: "BATCH-HM-2404",
    expiryDate: "2025-04-18",
    lastUpdated: "2026-03-15 10:05",
  },
  {
    id: 3,
    productName: "Vitamin C Serum 30ml",
    sku: "VCS-30",
    warehouse: "Bengaluru WH",
    category: "Skincare",
    totalStock: 0,
    stockStatus: "Out of Stock",
    batchNumber: "BATCH-VCS-2401",
    expiryDate: "2025-01-10",
    lastUpdated: "2026-03-12 09:42",
  },
  {
    id: 4,
    productName: "Hair Strengthening Oil 100ml",
    sku: "HSO-100",
    warehouse: "Hyderabad WH",
    category: "Haircare",
    totalStock: 540,
    stockStatus: "In Stock",
    batchNumber: "BATCH-HSO-2407",
    expiryDate: "2025-08-22",
    lastUpdated: "2026-03-15 12:18",
  },
  {
    id: 5,
    productName: "Immunity Booster Gummies",
    sku: "IBG-60",
    warehouse: "Mumbai WH",
    category: "Wellness",
    totalStock: 210,
    stockStatus: "Low Stock",
    batchNumber: "BATCH-IBG-2403",
    expiryDate: "2025-03-30",
    lastUpdated: "2026-03-15 09:50",
  },
];

const inventoryColumns: Column<InventoryRow>[] = [
  { key: "productName", label: "Product" },
  { key: "sku", label: "SKU" },
  { key: "warehouse", label: "Warehouse" },
  { key: "category", label: "Category" },
  { key: "totalStock", label: "Total Stock" },
  { key: "stockStatus", label: "Stock Status" },
  { key: "batchNumber", label: "Batch No." },
  { key: "expiryDate", label: "Expiry Date" },
  { key: "lastUpdated", label: "Last Updated" },
];

export default function InventoryAnalyticsPage() {
  const [trendView, setTrendView] = useState<TrendView>("Monthly");
  const [warehouseFilter, setWarehouseFilter] =
    useState<(typeof WAREHOUSE_OPTIONS)[number]>("All warehouses");
  const [categoryFilter, setCategoryFilter] =
    useState<(typeof CATEGORY_OPTIONS)[number]>("All categories");
  const [stockStatusFilter, setStockStatusFilter] =
    useState<(typeof STOCK_STATUS_OPTIONS)[number]>("All statuses");
  const [expiryFilter, setExpiryFilter] =
    useState<(typeof EXPIRY_RANGE_OPTIONS)[number]>("Any expiry");

  const trendData =
    trendView === "Daily"
      ? dailyInventoryTrend
      : trendView === "Weekly"
      ? weeklyInventoryTrend
      : monthlyInventoryTrend;

  const trendTotals = useMemo(
    () =>
      trendData.reduce(
        (acc, point) => {
          acc.incoming += point.incoming;
          acc.outgoing += point.outgoing;
          return acc;
        },
        { incoming: 0, outgoing: 0 }
      ),
    [trendData]
  );

  const filteredRows = useMemo(
    () =>
      inventoryRows.filter((row) => {
        const matchesWarehouse =
          warehouseFilter === "All warehouses" ||
          row.warehouse === warehouseFilter;
        const matchesCategory =
          categoryFilter === "All categories" ||
          row.category === categoryFilter;
        const matchesStatus =
          stockStatusFilter === "All statuses" ||
          row.stockStatus === stockStatusFilter;

        if (expiryFilter === "Any expiry") {
          return matchesWarehouse && matchesCategory && matchesStatus;
        }

        const today = new Date("2026-03-16");
        const expiry = new Date(row.expiryDate);
        const diffDays = Math.floor(
          (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        let matchesExpiry = true;
        if (expiryFilter === "Expiring in 30 days") {
          matchesExpiry = diffDays >= 0 && diffDays <= 30;
        } else if (expiryFilter === "Expiring in 90 days") {
          matchesExpiry = diffDays >= 0 && diffDays <= 90;
        } else if (expiryFilter === "Expired") {
          matchesExpiry = diffDays < 0;
        }

        return (
          matchesWarehouse && matchesCategory && matchesStatus && matchesExpiry
        );
      }),
    [warehouseFilter, categoryFilter, stockStatusFilter, expiryFilter]
  );

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
                  Inventory Analytics
                </h1>
                <p className="text-sm text-slate-500">
                  Stock performance, movement trends and expiry insights across
                  warehouses
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Inventory Stock Trend
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Incoming vs outgoing stock across selected period
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
                      chartType="stackedBar"
                      data={trendData}
                      xKey="label"
                      seriesKeys={["incoming", "outgoing"]}
                      heightClassName="h-72"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                    <div className="mt-4 space-y-1.5">
                      {[
                        { label: "Incoming", value: trendTotals.incoming },
                        { label: "Outgoing", value: trendTotals.outgoing },
                      ].map((item, index) => {
                        const total =
                          trendTotals.incoming + trendTotals.outgoing || 1;
                        const percentage = (item.value / total) * 100;
                        const colors = ["#ec4899", "#6366f1"];
                        return (
                          <div
                            key={item.label}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                  backgroundColor:
                                    colors[index % colors.length],
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

                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div className="flex flex-col gap-0.5">
                      <CardTitle className="text-lg font-semibold text-slate-800 whitespace-nowrap">
                        Stock Movement Analytics
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Weekly incoming vs outgoing stock volume
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="stackedBar"
                      data={stockMovementAnalytics}
                      xKey="period"
                      seriesKeys={["incoming", "outgoing"]}
                      heightClassName="h-72"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                    <div className="mt-4 space-y-1.5">
                      {[
                        { label: "Incoming", value: TOTAL_STOCK_MOVEMENT.incoming },
                        { label: "Outgoing", value: TOTAL_STOCK_MOVEMENT.outgoing },
                      ].map((item, index) => {
                        const total =
                          TOTAL_STOCK_MOVEMENT.incoming +
                          TOTAL_STOCK_MOVEMENT.outgoing;
                        const percentage = (item.value / total) * 100;
                        const colors = ["#22c55e", "#ef4444"];
                        return (
                          <div
                            key={item.label}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                  backgroundColor:
                                    colors[index % colors.length],
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

              <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm lg:col-span-1">
                  <CardHeader>
                    <div className="flex flex-col gap-0.5">
                      <CardTitle className="text-lg font-semibold text-slate-800 whitespace-nowrap">
                        Stock Distribution by Warehouse
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Current stock on hand by warehouse location
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="bar"
                      data={warehouseStockData}
                      xKey="warehouse"
                      yKey="stock"
                      heightClassName="h-56"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                    <div className="mt-4 space-y-1.5">
                      {warehouseStockData.map((item, index) => {
                        const percentage =
                          (item.stock / TOTAL_WAREHOUSE_STOCK) * 100;
                        const colors = [
                          "#0ea5e9",
                          "#8b5cf6",
                          "#f97316",
                          "#22c55e",
                          "#e11d48",
                        ];
                        return (
                          <div
                            key={item.warehouse}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                  backgroundColor:
                                    colors[index % colors.length],
                                }}
                              />
                              <span className="text-xs font-medium text-slate-700">
                                {item.warehouse}
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

                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm lg:col-span-1">
                  <CardHeader>
                    <div className="flex flex-col gap-0.5">
                      <CardTitle className="text-lg font-semibold text-slate-800 whitespace-nowrap">
                        Inventory Status Overview
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        In stock, low stock and out of stock items
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="donut"
                      data={inventoryStatusData}
                      nameKey="status"
                      valueKey="value"
                      heightClassName="h-56"
                      valueFormatter={(v) => `${v.toFixed(1)}%`}
                    />
                    <div className="mt-4 space-y-1.5">
                      {inventoryStatusData.map((item, index) => {
                        const percentage =
                          (item.value / TOTAL_STATUS_VALUE) * 100;
                        const colors = ["#22c55e", "#f59e0b", "#ef4444"];
                        return (
                          <div
                            key={item.status}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                  backgroundColor:
                                    colors[index % colors.length],
                                }}
                              />
                              <span className="text-xs font-medium text-slate-700">
                                {item.status}
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

                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm lg:col-span-1">
                  <CardHeader>
                    <div className="flex flex-col gap-0.5">
                      <CardTitle className="text-lg font-semibold text-slate-800 whitespace-nowrap">
                        Expiring Products
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Batches approaching expiry in the next 90 days
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="bar"
                      data={expiringProductsData}
                      xKey="name"
                      yKey="value"
                      heightClassName="h-56"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                    <div className="mt-4 space-y-1.5">
                      {expiringProductsData.map((item, index) => {
                        const percentage = (item.value / TOTAL_EXPIRING) * 100;
                        const colors = ["#f97316", "#6366f1", "#10b981", "#ec4899"];
                        return (
                          <div
                            key={item.name}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                  backgroundColor:
                                    colors[index % colors.length],
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
              </div>

              <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Top Stock Movement Products
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Products with highest combined incoming and outgoing
                        quantity
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <SalesAnalyticsChart
                    chartType="horizontalBar"
                    data={topStockMovementProducts}
                    labelKey="name"
                    valueKey="value"
                    heightClassName="h-72"
                    valueFormatter={(v) => v.toLocaleString()}
                  />
                  <div className="mt-4 space-y-1.5">
                    {topStockMovementProducts.map((item, index) => {
                      const percentage =
                        (item.value / TOTAL_TOP_MOVEMENT) * 100;
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

              <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Detailed Inventory Data
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Product-wise stock, warehouse allocation and expiry
                        details
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataTable<InventoryRow>
                    title=""
                    columns={inventoryColumns}
                    data={filteredRows}
                    pageSize={6}
                    searchPlaceholder="Search by product, SKU or warehouse..."
                    hideFiltersButton
                    showIndexColumn
                    indexColumnLabel="Sr No."
                    rightHeader={
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-700 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                          value={warehouseFilter}
                          onChange={(e) =>
                            setWarehouseFilter(
                              e.target.value as (typeof WAREHOUSE_OPTIONS)[number]
                            )
                          }
                        >
                          {WAREHOUSE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
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
                          value={expiryFilter}
                          onChange={(e) =>
                            setExpiryFilter(
                              e.target.value as (typeof EXPIRY_RANGE_OPTIONS)[number]
                            )
                          }
                        >
                          {EXPIRY_RANGE_OPTIONS.map((option) => (
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