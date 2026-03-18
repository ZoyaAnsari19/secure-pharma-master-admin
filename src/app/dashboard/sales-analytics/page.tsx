"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { DataTable, Column } from "@/components/ui/table";
import { SalesAnalyticsChart } from "@/components/charts/SalesAnalyticsChart";

type RevenuePoint = {
  label: string;
  amount: number;
};

const monthlyRevenue: RevenuePoint[] = [
  { label: "Jan", amount: 320000 },
  { label: "Feb", amount: 345000 },
  { label: "Mar", amount: 372000 },
  { label: "Apr", amount: 398000 },
  { label: "May", amount: 421000 },
  { label: "Jun", amount: 456000 },
];

const weeklyRevenue: RevenuePoint[] = [
  { label: "Week 1", amount: 98000 },
  { label: "Week 2", amount: 112000 },
  { label: "Week 3", amount: 104500 },
  { label: "Week 4", amount: 121300 },
];

const dailyRevenue: RevenuePoint[] = [
  { label: "Mon", amount: 15800 },
  { label: "Tue", amount: 17240 },
  { label: "Wed", amount: 16310 },
  { label: "Thu", amount: 18940 },
  { label: "Fri", amount: 20110 },
  { label: "Sat", amount: 17650 },
  { label: "Sun", amount: 14980 },
];

type RevenueRow = {
  id: number;
  period: string;
  granularity: "Monthly" | "Weekly" | "Daily";
  orders: number;
  revenue: string;
  growth: string;
  category: string;
  role: string;
};

const revenueColumns: Column<RevenueRow>[] = [
  { key: "period", label: "Period" },
  { key: "granularity", label: "Type" },
  { key: "orders", label: "Orders" },
  { key: "revenue", label: "Revenue" },
  { key: "growth", label: "Growth vs prev." },
  { key: "category", label: "Category" },
  { key: "role", label: "User role" },
];

const revenueRows: RevenueRow[] = [
  {
    id: 1,
    period: "Jun 2026",
    granularity: "Monthly",
    orders: 2487,
    revenue: "₹4.56L",
    growth: "+8.3%",
    category: "Skincare",
    role: "Customer",
  },
  {
    id: 2,
    period: "May 2026",
    granularity: "Monthly",
    orders: 2310,
    revenue: "₹4.21L",
    growth: "+6.7%",
    category: "Skincare",
    role: "Customer",
  },
  {
    id: 3,
    period: "Week 4 (Jun)",
    granularity: "Weekly",
    orders: 642,
    revenue: "₹1.21L",
    growth: "+9.4%",
    category: "Serums",
    role: "Distributor",
  },
  {
    id: 4,
    period: "Week 3 (Jun)",
    granularity: "Weekly",
    orders: 598,
    revenue: "₹1.04L",
    growth: "+4.1%",
    category: "Moisturizers",
    role: "Franchise",
  },
  {
    id: 5,
    period: "Fri (last week)",
    granularity: "Daily",
    orders: 132,
    revenue: "₹20,110",
    growth: "+12.2%",
    category: "Sunscreen",
    role: "Retailer",
  },
];

type ProductSalesDatum = {
  name: string;
  value: number;
};

const topProductSales: ProductSalesDatum[] = [
  { name: "Glow Serum Pro", value: 372000 },
  { name: "Hydra Moisturizer", value: 294000 },
  { name: "Vitamin C Serum", value: 227000 },
  { name: "Sunscreen SPF 50", value: 131000 },
  { name: "Night Repair Cream", value: 156000 },
];

type DailyOrderPoint = {
  day: string;
  orders: number;
};

const dailyOrders: DailyOrderPoint[] = [
  { day: "Mon", orders: 320 },
  { day: "Tue", orders: 280 },
  { day: "Wed", orders: 360 },
  { day: "Thu", orders: 410 },
  { day: "Fri", orders: 450 },
  { day: "Sat", orders: 380 },
  { day: "Sun", orders: 290 },
];

type CategorySalesPoint = {
  category: string;
  value: number;
};

const categorySales: CategorySalesPoint[] = [
  { category: "Serums", value: 42 },
  { category: "Moisturizers", value: 28 },
  { category: "Sunscreens", value: 18 },
  { category: "Cleansers", value: 7 },
  { category: "Others", value: 5 },
];

type RoleRevenuePoint = {
  period: string;
  Distributor: number;
  Franchise: number;
  Retailer: number;
  Customer: number;
};

const revenueByRole: RoleRevenuePoint[] = [
  { period: "Q1", Distributor: 120, Franchise: 90, Retailer: 60, Customer: 40 },
  { period: "Q2", Distributor: 150, Franchise: 110, Retailer: 75, Customer: 55 },
  { period: "Q3", Distributor: 170, Franchise: 130, Retailer: 88, Customer: 70 },
  { period: "Q4", Distributor: 190, Franchise: 145, Retailer: 96, Customer: 82 },
];

export default function SalesAnalyticsPage() {
  const [trendView, setTrendView] = useState<"Monthly" | "Weekly" | "Daily">(
    "Monthly"
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const trendData =
    trendView === "Monthly"
      ? monthlyRevenue
      : trendView === "Weekly"
      ? weeklyRevenue
      : dailyRevenue;

  const filteredRows =
    selectedCategory === "All"
      ? revenueRows
      : revenueRows.filter((row) => row.category === selectedCategory);

  return (
    <div className="flex h-screen bg-slate-50/80 text-slate-900">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
            <div className="space-y-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                  Sales Analytics
                </h1>
                <p className="text-sm text-slate-500">
                  Revenue performance and order insights across different time
                  ranges
                </p>
              </div>

              <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      Revenue Trend
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-500">
                      Switch between monthly, weekly and daily revenue views
                    </CardDescription>
                  </div>
                  <div className="inline-flex rounded-full bg-slate-50 p-1 text-xs font-medium text-slate-600">
                    {(["Monthly", "Weekly", "Daily"] as const).map((view) => (
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
                    yKey="amount"
                    heightClassName="h-72"
                    valueFormatter={(v) => `₹${v.toLocaleString()}`}
                  />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Daily Orders
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Order volume over the last 7 days
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="bar"
                      data={dailyOrders}
                      xKey="day"
                      yKey="orders"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                  </CardContent>
                </Card>

                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Sales by Category
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Contribution of each product category to total sales
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="donut"
                      data={categorySales}
                      nameKey="category"
                      valueKey="value"
                      valueFormatter={(v) => `${v.toFixed(1)}%`}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Top Selling Products (by revenue)
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Highest earning products in the current period
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="horizontalBar"
                      data={topProductSales}
                      labelKey="name"
                      valueKey="value"
                      valueFormatter={(v) => `₹${v.toLocaleString()}`}
                    />
                  </CardContent>
                </Card>

                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Revenue by User Role
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Relative revenue contribution across the network
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="stackedBar"
                      data={revenueByRole}
                      xKey="period"
                      seriesKeys={["Distributor", "Franchise", "Retailer", "Customer"]}
                      valueFormatter={(v) => `₹${v.toLocaleString()}k`}
                    />
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Sales Data Table
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Detailed breakdown of orders, revenue and growth by period
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataTable
                    title=""
                    columns={revenueColumns}
                    data={filteredRows}
                    pageSize={5}
                    searchPlaceholder="Search by period..."
                    hideFiltersButton
                    rightHeader={
                      <select
                        className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="All">All categories</option>
                        <option value="Skincare">Skincare</option>
                        <option value="Serums">Serums</option>
                        <option value="Moisturizers">Moisturizers</option>
                        <option value="Sunscreen">Sunscreen</option>
                      </select>
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

