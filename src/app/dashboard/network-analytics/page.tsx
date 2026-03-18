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

type NetworkGrowthPoint = {
  label: string;
  directNetworkSize: number;
  totalNetworkSize: number;
};

type RoleDistributionPoint = {
  name: string;
  value: number;
  color: string;
};

type RoleCreatedUsersPoint = {
  role: string;
  createdUsers: number;
};

type RevenueContributionPoint = {
  label: string;
  revenue: number;
};

type NetworkLeaderPoint = {
  leader: string;
  depth: number;
  revenue: number;
};

type NetworkOrdersPoint = {
  label: string;
  repeatOrders: number;
  newOrders: number;
};

type NetworkAnalyticsRow = {
  id: number;
  name: string;
  role: string;
  city: string;
  createdUsers: number;
  networkOrders: number;
  networkRevenue: string;
  levelDepth: number;
  joinDate: string;
  status: "Active" | "Inactive" | "Suspended";
  networkSizeBucket: "Small" | "Medium" | "Large";
};

const ROLE_OPTIONS = [
  "All roles",
  "Distributor",
  "Franchise",
  "Retailer",
  "Networker",
  "Customer",
] as const;

const CITY_OPTIONS = [
  "All cities",
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Ahmedabad",
] as const;

const NETWORK_SIZE_OPTIONS = [
  "All sizes",
  "Small",
  "Medium",
  "Large",
] as const;

const DAILY_NETWORK_GROWTH: NetworkGrowthPoint[] = [
  { label: "Mon", directNetworkSize: 32, totalNetworkSize: 140 },
  { label: "Tue", directNetworkSize: 38, totalNetworkSize: 162 },
  { label: "Wed", directNetworkSize: 42, totalNetworkSize: 181 },
  { label: "Thu", directNetworkSize: 48, totalNetworkSize: 210 },
  { label: "Fri", directNetworkSize: 54, totalNetworkSize: 238 },
  { label: "Sat", directNetworkSize: 50, totalNetworkSize: 227 },
  { label: "Sun", directNetworkSize: 37, totalNetworkSize: 190 },
];

const WEEKLY_NETWORK_GROWTH: NetworkGrowthPoint[] = [
  { label: "Week 1", directNetworkSize: 180, totalNetworkSize: 820 },
  { label: "Week 2", directNetworkSize: 210, totalNetworkSize: 910 },
  { label: "Week 3", directNetworkSize: 235, totalNetworkSize: 980 },
  { label: "Week 4", directNetworkSize: 260, totalNetworkSize: 1040 },
];

const MONTHLY_NETWORK_GROWTH: NetworkGrowthPoint[] = [
  { label: "Jan", directNetworkSize: 520, totalNetworkSize: 2420 },
  { label: "Feb", directNetworkSize: 580, totalNetworkSize: 2640 },
  { label: "Mar", directNetworkSize: 640, totalNetworkSize: 2890 },
  { label: "Apr", directNetworkSize: 700, totalNetworkSize: 3110 },
  { label: "May", directNetworkSize: 760, totalNetworkSize: 3360 },
  { label: "Jun", directNetworkSize: 820, totalNetworkSize: 3610 },
];

const ROLE_DONUT_DATA: RoleDistributionPoint[] = [
  { name: "Distributor", value: 184, color: "#0ea5e9" },
  { name: "Franchise", value: 61, color: "#8b5cf6" },
  { name: "Retailer", value: 932, color: "#f59e0b" },
  { name: "Networker", value: 312, color: "#ec4899" },
  { name: "Customer", value: 12580, color: "#10b981" },
];

const TOTAL_ROLE_USERS = ROLE_DONUT_DATA.reduce(
  (sum, item) => sum + item.value,
  0
);

const CREATED_USERS_BY_ROLE: RoleCreatedUsersPoint[] = [
  { role: "Distributor", createdUsers: 420 },
  { role: "Franchise", createdUsers: 260 },
  { role: "Retailer", createdUsers: 190 },
  { role: "Networker", createdUsers: 340 },
  { role: "Customer", createdUsers: 85 },
];

const TOTAL_CREATED_USERS = CREATED_USERS_BY_ROLE.reduce(
  (sum, item) => sum + item.createdUsers,
  0
);

const NETWORK_REVENUE_CONTRIBUTION: RevenueContributionPoint[] = [
  { label: "Direct Orders", revenue: 12.4 },
  { label: "Level 1", revenue: 18.9 },
  { label: "Level 2", revenue: 24.6 },
  { label: "Level 3", revenue: 17.2 },
  { label: "Level 4+", revenue: 11.8 },
];

const TOTAL_NETWORK_REVENUE = NETWORK_REVENUE_CONTRIBUTION.reduce(
  (sum, item) => sum + item.revenue,
  0
);

const TOP_NETWORK_LEADERS: NetworkLeaderPoint[] = [
  { leader: "Amit Verma", depth: 8, revenue: 42.8 },
  { leader: "Neha Sharma", depth: 7, revenue: 38.4 },
  { leader: "Rahul Singh", depth: 6, revenue: 31.6 },
  { leader: "Priya Iyer", depth: 6, revenue: 28.1 },
  { leader: "Sanjay Patel", depth: 5, revenue: 24.5 },
  { leader: "Kavita Mehta", depth: 5, revenue: 22.3 },
];

const NETWORK_ORDERS_PERFORMANCE: NetworkOrdersPoint[] = [
  { label: "Jan", repeatOrders: 520, newOrders: 210 },
  { label: "Feb", repeatOrders: 560, newOrders: 240 },
  { label: "Mar", repeatOrders: 610, newOrders: 270 },
  { label: "Apr", repeatOrders: 640, newOrders: 290 },
  { label: "May", repeatOrders: 680, newOrders: 320 },
  { label: "Jun", repeatOrders: 720, newOrders: 340 },
];

const NETWORK_ANALYTICS_ROWS: NetworkAnalyticsRow[] = [
  {
    id: 1,
    name: "Amit Verma",
    role: "Distributor",
    city: "Mumbai",
    createdUsers: 72,
    networkOrders: 820,
    networkRevenue: "₹5,42,000",
    levelDepth: 8,
    joinDate: "2023-11-12",
    status: "Active",
    networkSizeBucket: "Large",
  },
  {
    id: 2,
    name: "Neha Sharma",
    role: "Franchise",
    city: "Delhi",
    createdUsers: 54,
    networkOrders: 610,
    networkRevenue: "₹4,18,400",
    levelDepth: 7,
    joinDate: "2024-02-05",
    status: "Active",
    networkSizeBucket: "Large",
  },
  {
    id: 3,
    name: "Rahul Singh",
    role: "Retailer",
    city: "Bengaluru",
    createdUsers: 29,
    networkOrders: 348,
    networkRevenue: "₹2,14,900",
    levelDepth: 5,
    joinDate: "2024-04-18",
    status: "Active",
    networkSizeBucket: "Medium",
  },
  {
    id: 4,
    name: "Priya Iyer",
    role: "Networker",
    city: "Hyderabad",
    createdUsers: 38,
    networkOrders: 296,
    networkRevenue: "₹1,78,200",
    levelDepth: 6,
    joinDate: "2024-01-23",
    status: "Suspended",
    networkSizeBucket: "Medium",
  },
  {
    id: 5,
    name: "Sanjay Patel",
    role: "Customer",
    city: "Ahmedabad",
    createdUsers: 0,
    networkOrders: 82,
    networkRevenue: "₹54,600",
    levelDepth: 2,
    joinDate: "2024-05-01",
    status: "Inactive",
    networkSizeBucket: "Small",
  },
  {
    id: 6,
    name: "Kavita Mehta",
    role: "Distributor",
    city: "Delhi",
    createdUsers: 48,
    networkOrders: 712,
    networkRevenue: "₹4,38,700",
    levelDepth: 7,
    joinDate: "2023-12-28",
    status: "Active",
    networkSizeBucket: "Large",
  },
];

const NETWORK_ANALYTICS_COLUMNS: Column<NetworkAnalyticsRow>[] = [
  { key: "name", label: "User" },
  { key: "role", label: "Role" },
  { key: "city", label: "City" },
  { key: "createdUsers", label: "Created Users" },
  { key: "networkOrders", label: "Network Orders" },
  { key: "networkRevenue", label: "Network Revenue" },
  { key: "levelDepth", label: "Level Depth" },
  { key: "joinDate", label: "Join Date" },
  { key: "status", label: "Status" },
];

export default function NetworkAnalyticsPage() {
  const [trendView, setTrendView] = useState<TrendView>("Monthly");
  const [roleFilter, setRoleFilter] =
    useState<(typeof ROLE_OPTIONS)[number]>("All roles");
  const [cityFilter, setCityFilter] =
    useState<(typeof CITY_OPTIONS)[number]>("All cities");
  const [networkSizeFilter, setNetworkSizeFilter] =
    useState<(typeof NETWORK_SIZE_OPTIONS)[number]>("All sizes");

  const trendData =
    trendView === "Daily"
      ? DAILY_NETWORK_GROWTH
      : trendView === "Weekly"
      ? WEEKLY_NETWORK_GROWTH
      : MONTHLY_NETWORK_GROWTH;

  const filteredRows = useMemo(
    () =>
      NETWORK_ANALYTICS_ROWS.filter((row) => {
        const matchesRole = roleFilter === "All roles" || row.role === roleFilter;
        const matchesCity =
          cityFilter === "All cities" || row.city === cityFilter;
        const matchesNetworkSize =
          networkSizeFilter === "All sizes" ||
          row.networkSizeBucket === networkSizeFilter;
        return matchesRole && matchesCity && matchesNetworkSize;
      }),
    [roleFilter, cityFilter, networkSizeFilter]
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
                  Network Analytics
                </h1>
                <p className="text-sm text-slate-500">
                  Visualize network growth, depth and revenue contribution across
                  your organisation
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Network Growth Trend
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Track direct and total network size over time
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
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
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="line"
                      data={trendData}
                      xKey="label"
                      yKey="totalNetworkSize"
                      heightClassName="h-72"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Network Orders Performance
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        New vs repeat orders flowing through your network
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="stackedBar"
                      data={NETWORK_ORDERS_PERFORMANCE}
                      xKey="label"
                      seriesKeys={["newOrders", "repeatOrders"]}
                      heightClassName="h-72"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm lg:col-span-1">
                  <CardHeader>
                    <div className="flex flex-col gap-0.5">
                      <CardTitle className="text-lg font-semibold text-slate-800 whitespace-nowrap">
                        Network Distribution by Role
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        How your network is composed across roles
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="donut"
                      data={ROLE_DONUT_DATA}
                      nameKey="name"
                      valueKey="value"
                      heightClassName="h-64"
                      colors={ROLE_DONUT_DATA.map((d) => d.color)}
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                    <div className="mt-4 space-y-1.5">
                      {ROLE_DONUT_DATA.map((item) => {
                        const percentage = (item.value / TOTAL_ROLE_USERS) * 100;
                        return (
                          <div
                            key={item.name}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
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

                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm lg:col-span-1">
                  <CardHeader>
                    <div className="flex flex-col gap-0.5">
                      <CardTitle className="text-lg font-semibold text-slate-800 whitespace-nowrap">
                        Created Users by Role
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Volume of downline users created by each role
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="bar"
                      data={CREATED_USERS_BY_ROLE}
                      xKey="role"
                      yKey="createdUsers"
                      heightClassName="h-56"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                    <div className="mt-4 space-y-1.5">
                      {CREATED_USERS_BY_ROLE.map((item, index) => {
                        const percentage =
                          (item.createdUsers / TOTAL_CREATED_USERS) * 100;
                        const colors = ["#ec4899", "#8b5cf6", "#0ea5e9", "#f97316", "#10b981"];
                        return (
                          <div
                            key={item.role}
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
                                {item.role}
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
                        Network Revenue Contribution
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Revenue driven by each level of your network
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="bar"
                      data={NETWORK_REVENUE_CONTRIBUTION}
                      xKey="label"
                      yKey="revenue"
                      heightClassName="h-56"
                      valueFormatter={(v) => `₹${v.toFixed(1)}L`}
                    />
                    <div className="mt-4 space-y-1.5">
                      {NETWORK_REVENUE_CONTRIBUTION.map((item, index) => {
                        const percentage =
                          (item.revenue / TOTAL_NETWORK_REVENUE) * 100;
                        const colors = ["#ec4899", "#8b5cf6", "#0ea5e9", "#f97316", "#10b981"];
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

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Top Network Leaders
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Leaders ranked by downline revenue and depth
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="horizontalBar"
                      data={TOP_NETWORK_LEADERS}
                      labelKey="leader"
                      valueKey="revenue"
                      heightClassName="h-72"
                      valueFormatter={(v) => `₹${v.toFixed(1)}L`}
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Network Depth vs Revenue
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Correlation between network depth and revenue per leader
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="line"
                      data={TOP_NETWORK_LEADERS.map((l) => ({
                        label: l.leader,
                        value: l.depth * l.revenue,
                      }))}
                      xKey="label"
                      yKey="value"
                      heightClassName="h-72"
                      valueFormatter={(v) => `₹${(v / 10).toFixed(1)}L`}
                    />
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      Network Analytics Details
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-500">
                      User level breakdown of network size, orders and revenue
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataTable<NetworkAnalyticsRow>
                    title=""
                    columns={NETWORK_ANALYTICS_COLUMNS}
                    data={filteredRows}
                    pageSize={6}
                    searchPlaceholder="Search by user, role or city..."
                    hideFiltersButton
                    showIndexColumn
                    indexColumnLabel="Sr No."
                    rightHeader={
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-700 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                          value={roleFilter}
                          onChange={(e) =>
                            setRoleFilter(
                              e.target.value as (typeof ROLE_OPTIONS)[number]
                            )
                          }
                        >
                          {ROLE_OPTIONS.map((roleOption) => (
                            <option key={roleOption} value={roleOption}>
                              {roleOption}
                            </option>
                          ))}
                        </select>
                        <select
                          className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-700 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                          value={cityFilter}
                          onChange={(e) =>
                            setCityFilter(
                              e.target.value as (typeof CITY_OPTIONS)[number]
                            )
                          }
                        >
                          {CITY_OPTIONS.map((cityOption) => (
                            <option key={cityOption} value={cityOption}>
                              {cityOption}
                            </option>
                          ))}
                        </select>
                        <select
                          className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-700 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                          value={networkSizeFilter}
                          onChange={(e) =>
                            setNetworkSizeFilter(
                              e.target.value as (typeof NETWORK_SIZE_OPTIONS)[number]
                            )
                          }
                        >
                          {NETWORK_SIZE_OPTIONS.map((sizeOption) => (
                            <option key={sizeOption} value={sizeOption}>
                              {sizeOption}
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