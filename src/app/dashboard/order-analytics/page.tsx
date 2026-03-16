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

type OrdersTrendPoint = {
  label: string;
  orders: number;
  amount: number;
};

type StatusPoint = {
  status: string;
  value: number;
};

type RoleOrdersPoint = {
  role: string;
  orders: number;
};

type LocationOrdersPoint = {
  city: string;
  orders: number;
};

type OrderValueBucketPoint = {
  bucket: string;
  count: number;
};

type OrdersVsReturnsPoint = {
  label: string;
  orders: number;
  returns: number;
};

type UserRole = "Distributor" | "Franchise" | "Retailer" | "Customer";

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned";

type PaymentMethod = "UPI" | "Card" | "NetBanking" | "COD";

type DateRangeFilter =
  | "All time"
  | "Last 7 days"
  | "Last 30 days"
  | "Last 90 days";

type OrderAnalyticsRow = {
  id: number;
  orderId: string;
  customerName: string;
  role: UserRole;
  city: string;
  productsCount: number;
  orderAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  orderDate: string; // ISO string
};

const STATUS_OPTIONS: ("All statuses" | OrderStatus)[] = [
  "All statuses",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
];

const ROLE_OPTIONS: ("All roles" | UserRole)[] = [
  "All roles",
  "Distributor",
  "Franchise",
  "Retailer",
  "Customer",
];

const CITY_OPTIONS = [
  "All cities",
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Pune",
] as const;

const PAYMENT_OPTIONS: ("All payments" | PaymentMethod)[] = [
  "All payments",
  "UPI",
  "Card",
  "NetBanking",
  "COD",
];

const DATE_RANGE_OPTIONS: DateRangeFilter[] = [
  "All time",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
];

const dailyOrdersTrend: OrdersTrendPoint[] = [
  { label: "Mon", orders: 320, amount: 184000 },
  { label: "Tue", orders: 295, amount: 176500 },
  { label: "Wed", orders: 348, amount: 192300 },
  { label: "Thu", orders: 382, amount: 205600 },
  { label: "Fri", orders: 415, amount: 221400 },
  { label: "Sat", orders: 390, amount: 214200 },
  { label: "Sun", orders: 305, amount: 169800 },
];

const weeklyOrdersTrend: OrdersTrendPoint[] = [
  { label: "Week 1", orders: 2140, amount: 1184000 },
  { label: "Week 2", orders: 2280, amount: 1246000 },
  { label: "Week 3", orders: 2365, amount: 1292000 },
  { label: "Week 4", orders: 2490, amount: 1358000 },
];

const monthlyOrdersTrend: OrdersTrendPoint[] = [
  { label: "Jan", orders: 8120, amount: 4420000 },
  { label: "Feb", orders: 8340, amount: 4580000 },
  { label: "Mar", orders: 8610, amount: 4748000 },
  { label: "Apr", orders: 8920, amount: 4896000 },
  { label: "May", orders: 9240, amount: 5064000 },
  { label: "Jun", orders: 9480, amount: 5182000 },
];

const ordersByStatus: StatusPoint[] = [
  { status: "Pending", value: 8 },
  { status: "Processing", value: 18 },
  { status: "Shipped", value: 22 },
  { status: "Delivered", value: 42 },
  { status: "Cancelled", value: 6 },
  { status: "Returned", value: 4 },
];

const ordersByRole: RoleOrdersPoint[] = [
  { role: "Distributor", orders: 920 },
  { role: "Franchise", orders: 740 },
  { role: "Retailer", orders: 540 },
  { role: "Customer", orders: 380 },
];

const ordersByLocation: LocationOrdersPoint[] = [
  { city: "Mumbai", orders: 820 },
  { city: "Delhi", orders: 690 },
  { city: "Bengaluru", orders: 640 },
  { city: "Hyderabad", orders: 520 },
  { city: "Pune", orders: 430 },
];

const orderValueDistribution: OrderValueBucketPoint[] = [
  { bucket: "< ₹500", count: 420 },
  { bucket: "₹500 - ₹999", count: 760 },
  { bucket: "₹1,000 - ₹1,999", count: 980 },
  { bucket: "₹2,000 - ₹4,999", count: 640 },
  { bucket: "₹5,000+", count: 210 },
];

const ordersVsReturns: OrdersVsReturnsPoint[] = [
  { label: "Week 1", orders: 2140, returns: 84 },
  { label: "Week 2", orders: 2280, returns: 92 },
  { label: "Week 3", orders: 2365, returns: 88 },
  { label: "Week 4", orders: 2490, returns: 96 },
];

const TOTAL_STATUS_VALUE = ordersByStatus.reduce(
  (sum, item) => sum + item.value,
  0
);

const TOTAL_ROLE_ORDERS = ordersByRole.reduce(
  (sum, item) => sum + item.orders,
  0
);

const TOTAL_LOCATION_ORDERS = ordersByLocation.reduce(
  (sum, item) => sum + item.orders,
  0
);

const TOTAL_ORDER_VALUE_BUCKETS = orderValueDistribution.reduce(
  (sum, item) => sum + item.count,
  0
);

const TOTAL_ORDERS_VS_RETURNS = ordersVsReturns.reduce(
  (acc, item) => {
    acc.orders += item.orders;
    acc.returns += item.returns;
    return acc;
  },
  { orders: 0, returns: 0 }
);

const orderAnalyticsRows: OrderAnalyticsRow[] = [
  {
    id: 1,
    orderId: "ORD-240615-001",
    customerName: "Aarti Sharma",
    role: "Customer",
    city: "Mumbai",
    productsCount: 3,
    orderAmount: 1850,
    status: "Delivered",
    paymentMethod: "UPI",
    orderDate: "2026-03-15T16:24:00",
  },
  {
    id: 2,
    orderId: "ORD-240615-002",
    customerName: "Glow Beauty Store",
    role: "Retailer",
    city: "Delhi",
    productsCount: 18,
    orderAmount: 24890,
    status: "Shipped",
    paymentMethod: "NetBanking",
    orderDate: "2026-03-15T11:10:00",
  },
  {
    id: 3,
    orderId: "ORD-240615-003",
    customerName: "Radiance Franchise - BLR",
    role: "Franchise",
    city: "Bengaluru",
    productsCount: 32,
    orderAmount: 48230,
    status: "Processing",
    paymentMethod: "Card",
    orderDate: "2026-03-14T10:45:00",
  },
  {
    id: 4,
    orderId: "ORD-240615-004",
    customerName: "ABC Distributors - HYD",
    role: "Distributor",
    city: "Hyderabad",
    productsCount: 68,
    orderAmount: 132840,
    status: "Delivered",
    paymentMethod: "NetBanking",
    orderDate: "2026-03-13T13:18:00",
  },
  {
    id: 5,
    orderId: "ORD-240615-005",
    customerName: "Sneha Verma",
    role: "Customer",
    city: "Pune",
    productsCount: 2,
    orderAmount: 920,
    status: "Cancelled",
    paymentMethod: "Card",
    orderDate: "2026-03-12T09:50:00",
  },
  {
    id: 6,
    orderId: "ORD-240615-006",
    customerName: "Beauty Hub - Andheri",
    role: "Retailer",
    city: "Mumbai",
    productsCount: 24,
    orderAmount: 31240,
    status: "Delivered",
    paymentMethod: "UPI",
    orderDate: "2026-03-11T15:32:00",
  },
  {
    id: 7,
    orderId: "ORD-240615-007",
    customerName: "Radiance Franchise - DEL",
    role: "Franchise",
    city: "Delhi",
    productsCount: 40,
    orderAmount: 58620,
    status: "Returned",
    paymentMethod: "COD",
    orderDate: "2026-03-10T12:05:00",
  },
];

const orderAnalyticsColumns: Column<OrderAnalyticsRow>[] = [
  { key: "orderId", label: "Order ID" },
  { key: "customerName", label: "Customer" },
  { key: "role", label: "User Role" },
  { key: "city", label: "City" },
  { key: "productsCount", label: "Products" },
  {
    key: "orderAmount",
    label: "Order Amount",
    render: (row) => `₹${row.orderAmount.toLocaleString()}`,
  },
  { key: "status", label: "Status" },
  { key: "paymentMethod", label: "Payment" },
  {
    key: "orderDate",
    label: "Order Date",
    render: (row) =>
      new Date(row.orderDate).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
];

export default function OrderAnalyticsPage() {
  const [trendView, setTrendView] = useState<TrendView>("Monthly");
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_OPTIONS)[number]>("All statuses");
  const [roleFilter, setRoleFilter] =
    useState<(typeof ROLE_OPTIONS)[number]>("All roles");
  const [cityFilter, setCityFilter] =
    useState<(typeof CITY_OPTIONS)[number]>("All cities");
  const [paymentFilter, setPaymentFilter] =
    useState<(typeof PAYMENT_OPTIONS)[number]>("All payments");
  const [dateRangeFilter, setDateRangeFilter] =
    useState<DateRangeFilter>("All time");

  const trendData =
    trendView === "Daily"
      ? dailyOrdersTrend
      : trendView === "Weekly"
      ? weeklyOrdersTrend
      : monthlyOrdersTrend;

  const filteredRows = useMemo(() => {
    const today = new Date("2026-03-16");

    const matchesDateRange = (orderDate: string): boolean => {
      if (dateRangeFilter === "All time") return true;

      const date = new Date(orderDate);
      const diffDays = Math.floor(
        (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
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

    return orderAnalyticsRows.filter((row) => {
      const matchesStatus =
        statusFilter === "All statuses" || row.status === statusFilter;
      const matchesRole =
        roleFilter === "All roles" || row.role === roleFilter;
      const matchesCity =
        cityFilter === "All cities" || row.city === cityFilter;
      const matchesPayment =
        paymentFilter === "All payments" || row.paymentMethod === paymentFilter;

      return (
        matchesStatus &&
        matchesRole &&
        matchesCity &&
        matchesPayment &&
        matchesDateRange(row.orderDate)
      );
    });
  }, [statusFilter, roleFilter, cityFilter, paymentFilter, dateRangeFilter]);

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
                  Order Analytics
                </h1>
                <p className="text-sm text-slate-500">
                  Order performance, status distribution and customer behaviour
                  insights
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Orders Trend
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Switch between daily, weekly and monthly order amount
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
                      yKey="amount"
                      heightClassName="h-72"
                      valueFormatter={(v) => `₹${v.toLocaleString()}`}
                    />
                  </CardContent>
                </Card>

                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Orders vs Returns
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Weekly comparison of total orders vs returns
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="stackedBar"
                      data={ordersVsReturns}
                      xKey="label"
                      seriesKeys={["orders", "returns"]}
                      heightClassName="h-72"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                    <div className="mt-4 space-y-1.5">
                      {[
                        { label: "Orders", value: TOTAL_ORDERS_VS_RETURNS.orders },
                        { label: "Returns", value: TOTAL_ORDERS_VS_RETURNS.returns },
                      ].map((item, index) => {
                        const total =
                          TOTAL_ORDERS_VS_RETURNS.orders +
                          TOTAL_ORDERS_VS_RETURNS.returns ||
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
                        Orders by Status
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Current distribution of orders across statuses
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="donut"
                      data={ordersByStatus}
                      nameKey="status"
                      valueKey="value"
                      heightClassName="h-72"
                      valueFormatter={(v) => `${v.toFixed(1)}%`}
                    />
                    <div className="mt-4 space-y-1.5">
                      {ordersByStatus.map((item, index) => {
                        const percentage =
                          (item.value / (TOTAL_STATUS_VALUE || 1)) * 100;
                        const colors = [
                          "#0ea5e9",
                          "#8b5cf6",
                          "#22c55e",
                          "#f97316",
                          "#facc15",
                          "#ef4444",
                        ];
                        return (
                          <div
                            key={item.status}
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

                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Orders by User Role
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Order volume contribution by network role
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="bar"
                      data={ordersByRole}
                      xKey="role"
                      yKey="orders"
                      heightClassName="h-72"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                    <div className="mt-4 space-y-1.5">
                      {ordersByRole.map((item, index) => {
                        const percentage =
                          (item.orders / (TOTAL_ROLE_ORDERS || 1)) * 100;
                        const colors = ["#ec4899", "#6366f1", "#0ea5e9", "#22c55e"];
                        return (
                          <div
                            key={item.role}
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
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Orders by Location
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        City-wise order distribution across the network
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="bar"
                      data={ordersByLocation}
                      xKey="city"
                      yKey="orders"
                      heightClassName="h-72"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                    <div className="mt-4 space-y-1.5">
                      {ordersByLocation.map((item, index) => {
                        const percentage =
                          (item.orders / (TOTAL_LOCATION_ORDERS || 1)) * 100;
                        const colors = [
                          "#0ea5e9",
                          "#8b5cf6",
                          "#f97316",
                          "#22c55e",
                          "#e11d48",
                        ];
                        return (
                          <div
                            key={item.city}
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
                                {item.city}
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
                        Order Value Distribution
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Distribution of orders across value buckets
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesAnalyticsChart
                      chartType="bar"
                      data={orderValueDistribution}
                      xKey="bucket"
                      yKey="count"
                      heightClassName="h-72"
                      valueFormatter={(v) => v.toLocaleString()}
                    />
                    <div className="mt-4 space-y-1.5">
                      {orderValueDistribution.map((item, index) => {
                        const percentage =
                          (item.count / (TOTAL_ORDER_VALUE_BUCKETS || 1)) * 100;
                        const colors = [
                          "#22c55e",
                          "#0ea5e9",
                          "#6366f1",
                          "#f97316",
                          "#ec4899",
                        ];
                        return (
                          <div
                            key={item.bucket}
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
                                {item.bucket}
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
                        Detailed Orders Analytics
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Order-wise amount, status, payment and customer details
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataTable<OrderAnalyticsRow>
                    title=""
                    columns={orderAnalyticsColumns}
                    data={filteredRows}
                    pageSize={6}
                    searchPlaceholder="Search by order ID, customer or city..."
                    hideFiltersButton
                    showIndexColumn
                    indexColumnLabel="Sr No."
                    rightHeader={
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-700 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                          value={statusFilter}
                          onChange={(e) =>
                            setStatusFilter(
                              e.target.value as (typeof STATUS_OPTIONS)[number]
                            )
                          }
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <select
                          className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-700 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                          value={roleFilter}
                          onChange={(e) =>
                            setRoleFilter(
                              e.target.value as (typeof ROLE_OPTIONS)[number]
                            )
                          }
                        >
                          {ROLE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
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
                          {CITY_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <select
                          className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-700 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                          value={paymentFilter}
                          onChange={(e) =>
                            setPaymentFilter(
                              e.target.value as (typeof PAYMENT_OPTIONS)[number]
                            )
                          }
                        >
                          {PAYMENT_OPTIONS.map((option) => (
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