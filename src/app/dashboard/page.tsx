"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  Eye,
  Pencil,
  PackageOpen,
  Hash,
  TrendingUp,
  BarChart3,
  User,
  Receipt,
  RotateCcw,
  XCircle,
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

const topProductsColumns: Column<TopProductRow>[] = [
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
type TopProductRow = {
  id: number;
  name: string;
  sku: string;
  sold: number;
  revenue: string;
  trend: string;
};

const topProductsRows: TopProductRow[] = [
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

type RecentOrderRow = {
  id: number;
  orderId: string;
  customer: string;
  total: string;
  status: string;
  placedOn: string;
};

const recentOrdersColumns: Column<RecentOrderRow>[] = [
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
const recentOrdersRows: RecentOrderRow[] = [
  { id: 1, orderId: "#TB-9842", customer: "Riya Malhotra", total: "₹2,340", status: "Delivered", placedOn: "Today, 10:02 AM" },
  { id: 2, orderId: "#TB-9841", customer: "Sagar Arora", total: "₹1,120", status: "Shipped", placedOn: "Today, 09:48 AM" },
  { id: 3, orderId: "#TB-9840", customer: "Palak Sethi", total: "₹3,890", status: "Processing", placedOn: "Today, 09:15 AM" },
  { id: 4, orderId: "#TB-9839", customer: "Neeraj Kumar", total: "₹780", status: "Pending", placedOn: "Yesterday, 04:37 PM" },
  { id: 5, orderId: "#TB-9838", customer: "Anjali Rao", total: "₹1,540", status: "Delivered", placedOn: "Yesterday, 01:19 PM" },
];

export default function DashboardPage() {
  const [viewingProduct, setViewingProduct] = useState<TopProductRow | null>(null);
  const [editingProduct, setEditingProduct] = useState<TopProductRow | null>(null);
  const [editStockValue, setEditStockValue] = useState<string>("");
  const [viewingOrder, setViewingOrder] = useState<RecentOrderRow | null>(null);

  const openViewModal = (row: TopProductRow) => {
    setViewingProduct(row);
  };
  const openEditModal = (row: TopProductRow) => {
    setEditingProduct(row);
    // Prefill with mock current stock (in real app would come from API)
    setEditStockValue(String(Math.max(100, row.sold + 50)));
  };

  const handleSaveEditStock = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: persist editStockValue
    setEditingProduct(null);
  };

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
                renderActionMenuItems={(row) => (
                  <>
                    <DropdownMenuItem
                      className="text-sm font-medium text-gray-900"
                      onClick={() => openViewModal(row)}
                    >
                      <Eye className="h-4 w-4" />
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-sm font-medium text-gray-900"
                      onClick={() => openEditModal(row)}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit stock
                    </DropdownMenuItem>
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
                renderActionMenuItems={(row) => (
                  <>
                    <DropdownMenuItem
                      className="text-sm font-medium text-gray-900"
                      onClick={() => setViewingOrder(row)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm font-medium text-amber-600">
                      <RotateCcw className="h-4 w-4" />
                      Refund
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm font-medium text-rose-600">
                      <XCircle className="h-4 w-4" />
                      Cancel
                    </DropdownMenuItem>
                  </>
                )}
              />

              {/* View product details — modal (read-only) */}
              <Dialog
                open={!!viewingProduct}
                onOpenChange={(open) => !open && setViewingProduct(null)}
              >
                <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Product Details</DialogTitle>
                    <DialogDescription>Read-only view</DialogDescription>
                  </DialogHeader>
                  {viewingProduct && (
                    <>
                      <div className="space-y-4">
                        <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Basic information
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                                <PackageOpen className="h-4 w-4" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                  Product name
                                </p>
                                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                  {viewingProduct.name}
                                </p>
                              </div>
                            </div>
                            <div className="h-px bg-gray-200/80" />
                            <div className="flex items-start gap-3">
                              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                                <Hash className="h-4 w-4" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                  SKU
                                </p>
                                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                  {viewingProduct.sku}
                                </p>
                              </div>
                            </div>
                          </div>
                        </section>
                        <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Sales & performance
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                <ShoppingBag className="h-4 w-4" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                  Units sold
                                </p>
                                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                  {viewingProduct.sold.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="h-px bg-gray-200/80" />
                            <div className="flex items-start gap-3">
                              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                                <BarChart3 className="h-4 w-4" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                  Revenue
                                </p>
                                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                  {viewingProduct.revenue}
                                </p>
                              </div>
                            </div>
                            <div className="h-px bg-gray-200/80" />
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Trend
                              </p>
                              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                                {viewingProduct.trend}
                              </span>
                            </div>
                          </div>
                        </section>
                      </div>
                      <DialogFooter className="!justify-start">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setViewingProduct(null)}
                        >
                          Close
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>

              {/* View order details — modal (read-only, same style as Product Details) */}
              <Dialog
                open={!!viewingOrder}
                onOpenChange={(open) => !open && setViewingOrder(null)}
              >
                <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>Read-only view</DialogDescription>
                  </DialogHeader>
                  {viewingOrder && (
                    <>
                      <div className="space-y-4">
                        <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Order information
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                                <Receipt className="h-4 w-4" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                  Order ID
                                </p>
                                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                  {viewingOrder.orderId}
                                </p>
                              </div>
                            </div>
                            <div className="h-px bg-gray-200/80" />
                            <div className="flex items-start gap-3">
                              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                                <User className="h-4 w-4" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                  Customer
                                </p>
                                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                  {viewingOrder.customer}
                                </p>
                              </div>
                            </div>
                            <div className="h-px bg-gray-200/80" />
                            <div className="flex items-start gap-3">
                              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                <IndianRupee className="h-4 w-4" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                  Total
                                </p>
                                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                  {viewingOrder.total}
                                </p>
                              </div>
                            </div>
                            <div className="h-px bg-gray-200/80" />
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Status
                              </p>
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass[viewingOrder.status] ?? "bg-slate-100 text-slate-700"}`}
                              >
                                {viewingOrder.status}
                              </span>
                            </div>
                            <div className="h-px bg-gray-200/80" />
                            <div className="flex items-start gap-3">
                              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                                <Clock className="h-4 w-4" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                  Placed on
                                </p>
                                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                  {viewingOrder.placedOn}
                                </p>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                      <DialogFooter className="!justify-start">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setViewingOrder(null)}
                        >
                          Close
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>

              {/* Edit stock — prefill modal */}
              <Dialog
                open={!!editingProduct}
                onOpenChange={(open) => {
                  if (!open) {
                    setEditingProduct(null);
                    setEditStockValue("");
                  }
                }}
              >
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit stock</DialogTitle>
                    {editingProduct && (
                      <DialogDescription>{editingProduct.name}</DialogDescription>
                    )}
                  </DialogHeader>
                  {editingProduct && (
                    <form onSubmit={handleSaveEditStock} className="grid gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="edit-stock"
                          className="text-sm font-medium text-gray-700"
                        >
                          Current stock (units)
                        </label>
                        <input
                          id="edit-stock"
                          type="number"
                          min={0}
                          value={editStockValue}
                          onChange={(e) => setEditStockValue(e.target.value)}
                          placeholder="e.g. 500"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                        />
                      </div>
                      <DialogFooter className="!justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingProduct(null);
                            setEditStockValue("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" variant="primary">Save</Button>
                      </DialogFooter>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
