"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { KpiCards } from "@/components/ui/kpiCards";
import { DataTable, type Column } from "@/components/ui/table";
import { FiltersBar } from "@/components/ui/filters";
import {
  SideDrawer,
  SideDrawerContent,
  SideDrawerHeader,
  SideDrawerTitle,
  SideDrawerFooter,
} from "@/components/ui/sideDrawer";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  MoreVertical,
  Eye,
  RefreshCw,
  Ban,
  Receipt,
  FileText,
  Truck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
type PaymentStatus = "Paid" | "Pending" | "Refunded" | "Failed";
type OrderedBy = "Customer" | "Retailer";

type OrderRow = {
  id: string;
  customerName: string;
  orderedBy: OrderedBy;
  productCount: number;
  amountInr: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  orderDate: string;
  paymentMethod: string;
  shippingAddress?: string;
};

const ORDER_STATUS_OPTIONS: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = ["Paid", "Pending", "Refunded", "Failed"];
const ORDERED_BY_OPTIONS: OrderedBy[] = ["Customer", "Retailer"];
const DATE_FILTER_OPTIONS = ["All", "Last 7 days", "Last 30 days", "Last 90 days"] as const;

const initialOrders: OrderRow[] = [
  {
    id: "ORD-1042",
    customerName: "Aditi Sharma",
    orderedBy: "Customer",
    productCount: 3,
    amountInr: 2499,
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    orderDate: "2025-03-08",
    paymentMethod: "UPI",
  },
  {
    id: "ORD-1037",
    customerName: "Rahul Verma",
    orderedBy: "Retailer",
    productCount: 1,
    amountInr: 1499,
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    orderDate: "2025-02-27",
    paymentMethod: "Card",
  },
  {
    id: "ORD-1029",
    customerName: "Sara Khan",
    orderedBy: "Customer",
    productCount: 2,
    amountInr: 1999,
    paymentStatus: "Pending",
    orderStatus: "Pending",
    orderDate: "2025-02-15",
    paymentMethod: "UPI",
  },
  {
    id: "ORD-1025",
    customerName: "Vikram Mehta",
    orderedBy: "Retailer",
    productCount: 4,
    amountInr: 4599,
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    orderDate: "2025-03-10",
    paymentMethod: "Netbanking",
  },
  {
    id: "ORD-1018",
    customerName: "Priya Nair",
    orderedBy: "Customer",
    productCount: 1,
    amountInr: 899,
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    orderDate: "2025-01-20",
    paymentMethod: "Card",
  },
  {
    id: "ORD-1009",
    customerName: "Kavita Reddy",
    orderedBy: "Customer",
    productCount: 2,
    amountInr: 1799,
    paymentStatus: "Refunded",
    orderStatus: "Cancelled",
    orderDate: "2024-12-05",
    paymentMethod: "Netbanking",
  },
  {
    id: "ORD-1045",
    customerName: "Anil Kumar",
    orderedBy: "Retailer",
    productCount: 5,
    amountInr: 6299,
    paymentStatus: "Paid",
    orderStatus: "Processing",
    orderDate: "2025-03-12",
    paymentMethod: "COD",
  },
];

const orderColumns: Column<OrderRow>[] = [
  { key: "id", label: "Order ID" },
  { key: "customerName", label: "Customer" },
  {
    key: "orderedBy",
    label: "Ordered by",
    render: (row) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
          row.orderedBy === "Retailer" ? "bg-violet-50 text-violet-700" : "bg-sky-50 text-sky-700"
        }`}
      >
        {row.orderedBy}
      </span>
    ),
  },
  {
    key: "productCount",
    label: "Products",
    render: (row) => (
      <span className="tabular-nums font-medium text-gray-900">{row.productCount}</span>
    ),
  },
  {
    key: "amountInr",
    label: "Amount",
    render: (row) => (
      <span className="text-sm font-semibold text-gray-900">
        ₹{row.amountInr.toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    key: "paymentStatus",
    label: "Payment",
    render: (row) => {
      const styles =
        row.paymentStatus === "Paid"
          ? "bg-emerald-50 text-emerald-700"
          : row.paymentStatus === "Pending"
            ? "bg-amber-50 text-amber-700"
            : row.paymentStatus === "Refunded"
              ? "bg-blue-50 text-blue-700"
              : "bg-rose-50 text-rose-700";
      return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styles}`}>
          {row.paymentStatus}
        </span>
      );
    },
  },
  {
    key: "orderStatus",
    label: "Order status",
    render: (row) => {
      const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium";
      const map: Record<OrderStatus, { className: string; icon: React.ReactNode }> = {
        Pending: { className: "bg-amber-50 text-amber-700", icon: <Clock className="mr-1 h-3 w-3" /> },
        Processing: { className: "bg-sky-50 text-sky-700", icon: <RefreshCw className="mr-1 h-3 w-3" /> },
        Shipped: { className: "bg-violet-50 text-violet-700", icon: <Truck className="mr-1 h-3 w-3" /> },
        Delivered: { className: "bg-emerald-50 text-emerald-700", icon: <CheckCircle2 className="mr-1 h-3 w-3" /> },
        Cancelled: { className: "bg-rose-50 text-rose-700", icon: <XCircle className="mr-1 h-3 w-3" /> },
      };
      const { className, icon } = map[row.orderStatus];
      return (
        <span className={`${base} ${className}`}>
          {icon}
          {row.orderStatus}
        </span>
      );
    },
  },
  {
    key: "orderDate",
    label: "Date",
    render: (row) =>
      new Date(row.orderDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
];

function isDateInRange(orderDate: string, range: (typeof DATE_FILTER_OPTIONS)[number]): boolean {
  if (range === "All") return true;
  const d = new Date(orderDate);
  const now = new Date();
  const days = range === "Last 7 days" ? 7 : range === "Last 30 days" ? 30 : 90;
  const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
}

export default function OrderManagementPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("All");
  const [orderedByFilter, setOrderedByFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All");
  const [statusDrawerOpen, setStatusDrawerOpen] = useState(false);
  const [orderForStatus, setOrderForStatus] = useState<OrderRow | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("Pending");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !search ||
        [o.id, o.customerName].some((v) => String(v).toLowerCase().includes(search.toLowerCase()));
      const matchOrderStatus = orderStatusFilter === "All" || o.orderStatus === orderStatusFilter;
      const matchPaymentStatus = paymentStatusFilter === "All" || o.paymentStatus === paymentStatusFilter;
      const matchOrderedBy = orderedByFilter === "All" || o.orderedBy === orderedByFilter;
      const matchDate = isDateInRange(o.orderDate, dateFilter as (typeof DATE_FILTER_OPTIONS)[number]);
      return matchSearch && matchOrderStatus && matchPaymentStatus && matchOrderedBy && matchDate;
    });
  }, [orders, search, orderStatusFilter, paymentStatusFilter, orderedByFilter, dateFilter]);

  const kpiItems = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.orderStatus === "Pending" || o.orderStatus === "Processing").length;
    const delivered = orders.filter((o) => o.orderStatus === "Delivered").length;
    const cancelled = orders.filter((o) => o.orderStatus === "Cancelled").length;
    const revenue = orders
      .filter((o) => o.orderStatus === "Delivered" && o.paymentStatus === "Paid")
      .reduce((s, o) => s + o.amountInr, 0);
    return [
      { title: "Total Orders", value: total, delta: "All orders", icon: <ShoppingBag className="h-4 w-4" /> },
      { title: "Pending Orders", value: pending, delta: "Awaiting processing", icon: <Clock className="h-4 w-4" /> },
      { title: "Orders Delivered", value: delivered, delta: "Successfully delivered", icon: <CheckCircle2 className="h-4 w-4" /> },
      { title: "Cancelled Orders", value: cancelled, delta: "Cancelled orders", icon: <XCircle className="h-4 w-4" /> },
      { title: "Total Revenue", value: `₹${revenue.toLocaleString("en-IN")}`, delta: "From delivered orders", icon: <IndianRupee className="h-4 w-4" /> },
    ];
  }, [orders]);

  const handleUpdateStatus = (order: OrderRow, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, orderStatus: newStatus } : o))
    );
    setStatusDrawerOpen(false);
    setOrderForStatus(null);
  };

  const handleCancelOrder = (order: OrderRow) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id ? { ...o, orderStatus: "Cancelled" as OrderStatus, paymentStatus: o.paymentStatus === "Paid" ? "Refunded" : o.paymentStatus } : o
      )
    );
  };

  const handleProcessRefund = (order: OrderRow) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, paymentStatus: "Refunded" as PaymentStatus } : o))
    );
  };

  const openStatusDrawer = (order: OrderRow) => {
    setOrderForStatus(order);
    setSelectedStatus(order.orderStatus);
    setStatusDrawerOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                  Order Management
                </h1>
                <p className="text-xs text-gray-500">
                  View and manage orders, update status, process refunds, and track shipments.
                </p>
              </div>
            </div>

            <KpiCards items={kpiItems} />

            <DataTable<OrderRow>
              title="All Orders"
              columns={orderColumns}
              data={filtered}
              pageSize={10}
              searchPlaceholder="Search by order ID or customer name..."
              searchValue={search}
              onSearchValueChange={setSearch}
              hideFiltersButton
              showIndexColumn
              indexColumnLabel="Sr No."
              onRowClick={(row) => router.push(`/dashboard/order-management/order-details?orderId=${row.id}`)}
              headerContent={
                <FiltersBar
                  searchPlaceholder="Search by order ID or customer name..."
                  searchValue={search}
                  onSearchValueChange={setSearch}
                  right={
                    <>
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        <option value="All">All status</option>
                        {ORDER_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <select
                        value={paymentStatusFilter}
                        onChange={(e) => setPaymentStatusFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        <option value="All">All payment</option>
                        {PAYMENT_STATUS_OPTIONS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <select
                        value={orderedByFilter}
                        onChange={(e) => setOrderedByFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        <option value="All">All roles</option>
                        {ORDERED_BY_OPTIONS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        {DATE_FILTER_OPTIONS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </>
                  }
                />
              }
              renderActionMenuItems={(row) => (
                <>
                  <DropdownMenuItem
                    onClick={() => router.push(`/dashboard/order-management/order-details?orderId=${row.id}`)}
                    className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                  >
                    <Eye className="mr-2 h-3.5 w-3.5 text-blue-600" />
                    View details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openStatusDrawer(row)}
                    className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                  >
                    <RefreshCw className="mr-2 h-3.5 w-3.5 text-emerald-600" />
                    Update status
                  </DropdownMenuItem>
                  {row.orderStatus !== "Cancelled" && (
                    <DropdownMenuItem
                      onClick={() => handleCancelOrder(row)}
                      className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                    >
                      <Ban className="mr-2 h-3.5 w-3.5 text-rose-600" />
                      Cancel order
                    </DropdownMenuItem>
                  )}
                  {row.paymentStatus === "Paid" && row.orderStatus !== "Cancelled" && (
                    <DropdownMenuItem
                      onClick={() => handleProcessRefund(row)}
                      className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                    >
                      <Receipt className="mr-2 h-3.5 w-3.5 text-amber-600" />
                      Process refund
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => window.open(`/api/invoice/${row.id}`, "_blank")}
                    className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                  >
                    <FileText className="mr-2 h-3.5 w-3.5 text-violet-600" />
                    Generate invoice
                  </DropdownMenuItem>
                  {row.orderStatus !== "Cancelled" && row.orderStatus !== "Pending" && (
                    <DropdownMenuItem
                      onClick={() => {}}
                      className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                    >
                      <Truck className="mr-2 h-3.5 w-3.5 text-sky-600" />
                      Track shipment
                    </DropdownMenuItem>
                  )}
                </>
              )}
            />

            {/* Update order status drawer */}
            <SideDrawer
              open={statusDrawerOpen}
              onOpenChange={(open) => {
                setStatusDrawerOpen(open);
                if (!open) setOrderForStatus(null);
              }}
            >
              <SideDrawerContent className="gap-4">
                <SideDrawerHeader>
                  <SideDrawerTitle>Update order status</SideDrawerTitle>
                </SideDrawerHeader>
                {orderForStatus && (
                  <>
                    <p className="text-sm text-gray-600">
                      Order <span className="font-semibold text-gray-900">{orderForStatus.id}</span> · {orderForStatus.customerName}
                    </p>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">New status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        {ORDER_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <SideDrawerFooter>
                      <Button variant="outline" onClick={() => setStatusDrawerOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleUpdateStatus(orderForStatus, selectedStatus)}
                      >
                        Update status
                      </Button>
                    </SideDrawerFooter>
                  </>
                )}
              </SideDrawerContent>
            </SideDrawer>
          </div>
        </main>
      </div>
    </div>
  );
}
