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

type UserGrowthPoint = {
  label: string;
  newUsers: number;
  createdUsers: number;
};

type UserActivityPoint = {
  label: string;
  active: number;
  inactive: number;
};

type LocationPoint = {
  location: string;
  registrations: number;
};

type NetworkGrowthPoint = {
  label: string;
  direct: number;
  network: number;
};

type UserAnalyticsRow = {
  id: number;
  name: string;
  role: string;
  city: string;
  createdUsers: number;
  ordersGenerated: number;
  revenueGenerated: string;
  status: "Active" | "Inactive" | "Suspended";
  joinDate: string;
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

const dailyUserGrowth: UserGrowthPoint[] = [
  { label: "Mon", newUsers: 42, createdUsers: 16 },
  { label: "Tue", newUsers: 51, createdUsers: 19 },
  { label: "Wed", newUsers: 48, createdUsers: 17 },
  { label: "Thu", newUsers: 63, createdUsers: 23 },
  { label: "Fri", newUsers: 71, createdUsers: 28 },
  { label: "Sat", newUsers: 55, createdUsers: 21 },
  { label: "Sun", newUsers: 37, createdUsers: 12 },
];

const weeklyUserGrowth: UserGrowthPoint[] = [
  { label: "Week 1", newUsers: 260, createdUsers: 92 },
  { label: "Week 2", newUsers: 284, createdUsers: 101 },
  { label: "Week 3", newUsers: 315, createdUsers: 118 },
  { label: "Week 4", newUsers: 342, createdUsers: 129 },
];

const monthlyUserGrowth: UserGrowthPoint[] = [
  { label: "Jan", newUsers: 820, createdUsers: 310 },
  { label: "Feb", newUsers: 910, createdUsers: 344 },
  { label: "Mar", newUsers: 980, createdUsers: 372 },
  { label: "Apr", newUsers: 1040, createdUsers: 398 },
  { label: "May", newUsers: 1125, createdUsers: 427 },
  { label: "Jun", newUsers: 1210, createdUsers: 456 },
];

const userActivityOverview: UserActivityPoint[] = [
  { label: "00-04", active: 120, inactive: 40 },
  { label: "04-08", active: 240, inactive: 55 },
  { label: "08-12", active: 420, inactive: 60 },
  { label: "12-16", active: 380, inactive: 72 },
  { label: "16-20", active: 455, inactive: 81 },
  { label: "20-24", active: 210, inactive: 50 },
];

const userRegistrationByLocation: LocationPoint[] = [
  { location: "Mumbai", registrations: 1240 },
  { location: "Delhi", registrations: 980 },
  { location: "Bengaluru", registrations: 860 },
  { location: "Hyderabad", registrations: 640 },
  { location: "Ahmedabad", registrations: 520 },
];

const ROLE_DONUT_DATA = [
  { name: "Distributor", value: 156, color: "#0ea5e9" },
  { name: "Franchise", value: 42, color: "#8b5cf6" },
  { name: "Retailer", value: 892, color: "#f59e0b" },
  { name: "Networker", value: 234, color: "#ec4899" },
  { name: "Customer", value: 11219, color: "#10b981" },
] as { name: string; value: number; color: string }[];

const TOTAL_ROLE_USERS = ROLE_DONUT_DATA.reduce(
  (sum, item) => sum + item.value,
  0
);

const TOTAL_ACTIVITY = userActivityOverview.reduce(
  (acc, item) => {
    acc.active += item.active;
    acc.inactive += item.inactive;
    return acc;
  },
  { active: 0, inactive: 0 }
);

const TOTAL_REGISTRATIONS = userRegistrationByLocation.reduce(
  (sum, item) => sum + item.registrations,
  0
);

const createdUsersNetworkGrowth: NetworkGrowthPoint[] = [
  { label: "Q1", direct: 280, network: 620 },
  { label: "Q2", direct: 320, network: 710 },
  { label: "Q3", direct: 360, network: 790 },
  { label: "Q4", direct: 410, network: 880 },
];

const userAnalyticsRows: UserAnalyticsRow[] = [
  {
    id: 1,
    name: "Amit Verma",
    role: "Distributor",
    city: "Mumbai",
    createdUsers: 42,
    ordersGenerated: 780,
    revenueGenerated: "₹4,82,000",
    status: "Active",
    joinDate: "2024-01-12",
  },
  {
    id: 2,
    name: "Neha Sharma",
    role: "Franchise",
    city: "Delhi",
    createdUsers: 31,
    ordersGenerated: 512,
    revenueGenerated: "₹3,26,400",
    status: "Active",
    joinDate: "2024-03-05",
  },
  {
    id: 3,
    name: "Rahul Singh",
    role: "Retailer",
    city: "Bengaluru",
    createdUsers: 18,
    ordersGenerated: 268,
    revenueGenerated: "₹1,64,900",
    status: "Active",
    joinDate: "2024-05-18",
  },
  {
    id: 4,
    name: "Priya Iyer",
    role: "Networker",
    city: "Hyderabad",
    createdUsers: 24,
    ordersGenerated: 196,
    revenueGenerated: "₹1,18,200",
    status: "Suspended",
    joinDate: "2024-02-23",
  },
  {
    id: 5,
    name: "Sanjay Patel",
    role: "Customer",
    city: "Ahmedabad",
    createdUsers: 0,
    ordersGenerated: 32,
    revenueGenerated: "₹24,600",
    status: "Inactive",
    joinDate: "2024-06-01",
  },
  {
    id: 6,
    name: "Kavita Mehta",
    role: "Distributor",
    city: "Delhi",
    createdUsers: 35,
    ordersGenerated: 612,
    revenueGenerated: "₹3,98,700",
    status: "Active",
    joinDate: "2024-01-28",
  },
];

const userAnalyticsColumns: Column<UserAnalyticsRow>[] = [
  { key: "name", label: "User" },
  { key: "role", label: "Role" },
  { key: "city", label: "City" },
  { key: "createdUsers", label: "Created Users" },
  { key: "ordersGenerated", label: "Orders Generated" },
  { key: "revenueGenerated", label: "Revenue Generated" },
  { key: "status", label: "Status" },
  { key: "joinDate", label: "Join Date" },
];

export default function UserAnalyticsPage() {
  const [trendView, setTrendView] = useState<TrendView>("Monthly");
  const [roleFilter, setRoleFilter] =
    useState<(typeof ROLE_OPTIONS)[number]>("All roles");
  const [cityFilter, setCityFilter] =
    useState<(typeof CITY_OPTIONS)[number]>("All cities");

  const trendData =
    trendView === "Daily"
      ? dailyUserGrowth
      : trendView === "Weekly"
      ? weeklyUserGrowth
      : monthlyUserGrowth;

  const filteredRows = useMemo(
    () =>
      userAnalyticsRows.filter((row) => {
        const matchesRole = roleFilter === "All roles" || row.role === roleFilter;
        const matchesCity =
          cityFilter === "All cities" || row.city === cityFilter;
        return matchesRole && matchesCity;
      }),
    [roleFilter, cityFilter]
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
                  User Analytics
                </h1>
                <p className="text-sm text-slate-500">
                  Performance insights across your user network, roles and
                  locations
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        User Growth Trend
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Track new users and created users over time
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
                      chartType="stackedBar"
                      data={trendData}
                      xKey="label"
                      seriesKeys={["newUsers", "createdUsers"]}
                      heightClassName="h-72"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Created Users / Network Growth
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        How direct registrations and network size are evolving
                        over time
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="stackedBar"
                      data={createdUsersNetworkGrowth}
                      xKey="label"
                      seriesKeys={["direct", "network"]}
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
                        User Distribution by Role
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Distributor, franchise, retailer, networker, customer
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
                        const percentage =
                          (item.value / TOTAL_ROLE_USERS) * 100;
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
                        User Activity Overview
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Active vs inactive sessions across the day
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="stackedBar"
                      data={userActivityOverview}
                      xKey="label"
                      seriesKeys={["active", "inactive"]}
                      heightClassName="h-56"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                    <div className="mt-4 space-y-1.5">
                      {[
                        { label: "Active", value: TOTAL_ACTIVITY.active },
                        { label: "Inactive", value: TOTAL_ACTIVITY.inactive },
                      ].map((item, index) => {
                        const percentage =
                          (item.value /
                            (TOTAL_ACTIVITY.active + TOTAL_ACTIVITY.inactive)) *
                          100;
                        const color = index === 0 ? "#ec4899" : "#6366f1";
                        return (
                          <div
                            key={item.label}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: color }}
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

                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm lg:col-span-1">
                  <CardHeader>
                    <div className="flex flex-col gap-0.5">
                      <CardTitle className="text-lg font-semibold text-slate-800 whitespace-nowrap">
                        User Registration by Location
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Top cities contributing to new registrations
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="bar"
                      data={userRegistrationByLocation}
                      xKey="location"
                      yKey="registrations"
                      heightClassName="h-56"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                    <div className="mt-4 space-y-1.5">
                      {userRegistrationByLocation.map((item, index) => {
                        const percentage =
                          (item.registrations / TOTAL_REGISTRATIONS) * 100;
                        const colors = ["#ec4899", "#8b5cf6", "#0ea5e9", "#f97316", "#10b981"];
                        return (
                          <div
                            key={item.location}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: colors[index % colors.length] }}
                              />
                              <span className="text-xs font-medium text-slate-700">
                                {item.location}
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
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      Detailed User Analytics
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-500">
                      Drill into individual user performance, orders and revenue
                      contribution
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataTable<UserAnalyticsRow>
                    title=""
                    columns={userAnalyticsColumns}
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

