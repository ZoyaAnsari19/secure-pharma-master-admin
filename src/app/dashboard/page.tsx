"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RevenueOverviewChart } from "@/components/charts/RevenueOverviewChart";
import { OrdersOverviewChart } from "@/components/charts/OrdersOverviewChart";
import { UserDistributionChart } from "@/components/charts/UserDistributionChart";
import { DataTable, Column } from "@/components/ui/table";
import { KpiCard, CARD_VARIANTS } from "@/components/ui/kpiCards";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Users,
  ShoppingBag,
  IndianRupee,
  Package,
  Truck,
  Building2,
  Store,
  Clock,
  AlertTriangle,
  Boxes,
  Wallet,
} from "lucide-react";

const statCards = [
  { label: "Total Orders", value: "12,847", delta: "+8.2% vs last month", icon: ShoppingBag },
  { label: "Total Revenue", value: "₹18.42L", delta: "+15.3% vs last month", icon: IndianRupee },
  { label: "Total Products", value: "684", delta: "+3.1%", icon: Package },
  { label: "Total Customers", value: "11,219", delta: "+12.5%", icon: Users },
  { label: "Distributors", value: "156", delta: "+5 this month", icon: Truck },
  { label: "Franchise", value: "42", delta: "+3 this month", icon: Building2 },
  { label: "Retailers", value: "892", delta: "+18 this month", icon: Store },
  { label: "Pending Orders", value: "47", delta: "Require action", icon: Clock },
  { label: "Low Stock Products", value: "23", delta: "Below threshold", icon: AlertTriangle },
  { label: "Pending Withdrawal Request", value: "22", delta: "Pending today", icon: Wallet },
];

const inventoryMetrics = [
  { label: "Total Stock (units)", value: "124,580", sub: "Across all SKUs" },
  { label: "Low Stock", value: "23", sub: "Need reorder" },
  { label: "Expiring Soon (30d)", value: "8", sub: "Products" },
];

const topProductsColumns: Column<
  { id: number; name: string; sku: string; sold: number; revenue: string; trend: string }
>[] = [
  { key: "name", label: "Product" },
  { key: "sku", label: "SKU" },
  { key: "sold", label: "Units Sold" },
  { key: "revenue", label: "Revenue" },
  {
    key: "trend",
    label: "Trend",
    render: (row) => (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
        {row.trend}
      </span>
    ),
  },
];
const topProductsRows = [
  { id: 1, name: "Glow Serum Pro", sku: "TB-GS-001", sold: 1240, revenue: "₹3.72L", trend: "+24%" },
  { id: 2, name: "Hydra Moisturizer", sku: "TB-HM-002", sold: 982, revenue: "₹2.94L", trend: "+18%" },
  { id: 3, name: "Vitamin C Serum", sku: "TB-VC-003", sold: 756, revenue: "₹2.27L", trend: "+12%" },
  { id: 4, name: "Sunscreen SPF 50", sku: "TB-SS-004", sold: 654, revenue: "₹1.31L", trend: "+31%" },
  { id: 5, name: "Night Repair Cream", sku: "TB-NR-005", sold: 521, revenue: "₹1.56L", trend: "+8%" },
];

const statusClass: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Processing: "bg-blue-50 text-blue-700",
  Shipped: "bg-violet-50 text-violet-700",
  Delivered: "bg-emerald-50 text-emerald-700",
};

const recentOrdersColumns: Column<
  { id: number; orderId: string; customer: string; total: string; status: string; placedOn: string }
>[] = [
  { key: "orderId", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "total", label: "Total" },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span
        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClass[row.status] ?? "bg-slate-100 text-slate-700"}`}
      >
        {row.status}
      </span>
    ),
  },
  { key: "placedOn", label: "Placed On" },
];
const recentOrdersRows = [
  { id: 1, orderId: "#TB-9842", customer: "Riya Malhotra", total: "₹2,340", status: "Delivered", placedOn: "Today, 10:02 AM" },
  { id: 2, orderId: "#TB-9841", customer: "Sagar Arora", total: "₹1,120", status: "Shipped", placedOn: "Today, 09:48 AM" },
  { id: 3, orderId: "#TB-9840", customer: "Palak Sethi", total: "₹3,890", status: "Processing", placedOn: "Today, 09:15 AM" },
  { id: 4, orderId: "#TB-9839", customer: "Neeraj Kumar", total: "₹780", status: "Pending", placedOn: "Yesterday, 04:37 PM" },
  { id: 5, orderId: "#TB-9838", customer: "Anjali Rao", total: "₹1,540", status: "Delivered", placedOn: "Yesterday, 01:19 PM" },
];

export default function DashboardPage() {
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
                  Master Admin
                </h1>
                <p className="text-sm text-slate-500">
                  E-commerce ERP & supply chain overview
                </p>
              </div>

              {/* Summary KPI cards — 9 metrics */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <KpiCard
                      key={card.label}
                      title={card.label}
                      value={card.value}
                      delta={card.delta}
                      icon={<Icon className="h-4 w-4" />}
                      variant={CARD_VARIANTS[index % CARD_VARIANTS.length]}
                    />
                  );
                })}
              </div>

              {/* Charts row: Monthly revenue + Daily orders */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Monthly Revenue Trend
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Last 6 months
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RevenueOverviewChart />
                  </CardContent>
                </Card>
                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Daily Orders
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Orders by day (last 7 days)
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <OrdersOverviewChart />
                  </CardContent>
                </Card>
              </div>

              {/* User distribution donut + Inventory overview */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm lg:col-span-2">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        User Distribution by Role
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Distributor, franchise, retailer, networker, customer
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <UserDistributionChart />
                  </CardContent>
                </Card>
                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <Boxes className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">
                          Inventory Overview
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-500">
                          Stock health at a glance
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {inventoryMetrics.map((m, i) => (
                      <div
                        key={m.label}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3"
                      >
                        <div>
                          <p className="text-xs font-medium text-slate-500">{m.label}</p>
                          <p className="text-xs text-slate-400">{m.sub}</p>
                        </div>
                        <p className="text-lg font-semibold tabular-nums text-slate-800">
                          {m.value}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Top selling products — full width */}
              <DataTable
                title="Top Selling Products"
                columns={topProductsColumns}
                data={topProductsRows}
                pageSize={5}
                searchPlaceholder="Search products..."
                renderActionMenuItems={() => (
                  <>
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit stock</DropdownMenuItem>
                  </>
                )}
              />

              {/* Recent orders — full width below */}
              <DataTable
                title="Recent Orders"
                columns={recentOrdersColumns}
                data={recentOrdersRows}
                pageSize={5}
                searchPlaceholder="Search orders..."
                renderActionMenuItems={() => (
                  <>
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem className="text-amber-600">Refund</DropdownMenuItem>
                    <DropdownMenuItem className="text-rose-600">Cancel</DropdownMenuItem>
                  </>
                )}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
