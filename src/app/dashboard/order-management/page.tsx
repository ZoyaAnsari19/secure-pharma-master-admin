"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { KpiCards } from "@/components/ui/kpiCards";
import { DataTable, type Column } from "@/components/ui/table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  CreditCard,
  ShoppingBag,
  Wallet,
  XCircle,
  Clock,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";

type OrderStatus = "Completed" | "Pending" | "Cancelled";

type OrderRow = {
  id: string;
  userName: string;
  clientName: string;
  clientWebsite: string;
  productName: string;
  amountInr: number;
  status: OrderStatus;
  paymentMethod: "UPI" | "Card" | "Netbanking" | "COD";
  orderDate: string;
};

const initialOrders: OrderRow[] = [
  {
    id: "ORD-1042",
    userName: "Aditi Sharma",
    clientName: "Glow Studio Mumbai",
    clientWebsite: "mumbai.glow.truebeauty.in",
    productName: "HydraGlow Facial Kit",
    amountInr: 2499,
    status: "Completed",
    paymentMethod: "UPI",
    orderDate: "2025-03-08",
  },
  {
    id: "ORD-1037",
    userName: "Rahul Verma",
    clientName: "Blush Hub Delhi",
    clientWebsite: "delhi.blush.truebeauty.in",
    productName: "Vitamin C Brightening Serum",
    amountInr: 1499,
    status: "Completed",
    paymentMethod: "Card",
    orderDate: "2025-02-27",
  },
  {
    id: "ORD-1029",
    userName: "Sara Khan",
    clientName: "SkinCraft Pune",
    clientWebsite: "pune.skincraft.truebeauty.in",
    productName: "Acne Defense Cleanser",
    amountInr: 1999,
    status: "Pending",
    paymentMethod: "UPI",
    orderDate: "2025-02-15",
  },
  {
    id: "ORD-1018",
    userName: "Vikram Mehta",
    clientName: "MinimalGlow Bangalore",
    clientWebsite: "bangalore.minimal.truebeauty.in",
    productName: "SPF 50+ Daily Sunscreen",
    amountInr: 899,
    status: "Completed",
    paymentMethod: "Card",
    orderDate: "2025-01-20",
  },
  {
    id: "ORD-1009",
    userName: "Priya Nair",
    clientName: "Radiant Touch Chennai",
    clientWebsite: "chennai.radiant.truebeauty.in",
    productName: "Glow Boost Night Cream",
    amountInr: 1799,
    status: "Cancelled",
    paymentMethod: "Netbanking",
    orderDate: "2024-12-05",
  },
];

const orderColumns: Column<OrderRow>[] = [
  { key: "userName", label: "User Name" },
  { key: "clientName", label: "Client Name" },
  { key: "productName", label: "Product Name" },
  {
    key: "amountInr",
    label: "Amount",
    render: (row) => (
      <span className="text-sm font-semibold text-slate-900">
        ₹ {row.amountInr.toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    key: "status",
    label: "Order Status",
    render: (row) => {
      const base =
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium";
      if (row.status === "Completed") {
        return (
          <span className={`${base} bg-emerald-50 text-emerald-700`}>
            <CheckCircle2 className="mr-1.5 h-3 w-3" />
            Completed
          </span>
        );
      }
      if (row.status === "Pending") {
        return (
          <span className={`${base} bg-amber-50 text-amber-700`}>
            <Clock className="mr-1.5 h-3 w-3" />
            Pending
          </span>
        );
      }
      return (
        <span className={`${base} bg-rose-50 text-rose-700`}>
          <XCircle className="mr-1.5 h-3 w-3" />
          Cancelled
        </span>
      );
    },
  },
  {
    key: "orderDate",
    label: "Order Date",
    render: (row) =>
      new Date(row.orderDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
];

export default function OrderManagementPage() {
  const router = useRouter();
  const [orders] = useState<OrderRow[]>(initialOrders);
  const [clientFilter, setClientFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");

  const clientOptions = useMemo(() => {
    const websites = Array.from(new Set(orders.map((o) => o.clientWebsite)));
    return ["All", ...websites];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesClient =
        clientFilter === "All" || o.clientWebsite === clientFilter;
      const matchesStatus =
        statusFilter === "All" || o.status === statusFilter;
      return matchesClient && matchesStatus;
    });
  }, [orders, clientFilter, statusFilter]);

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "Completed").length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;
  const totalRevenueRaw = orders
    .filter((o) => o.status === "Completed")
    .reduce((acc, o) => acc + (Number.isFinite(o.amountInr) ? o.amountInr : 0), 0);
  const totalRevenue = Number.isFinite(totalRevenueRaw) ? totalRevenueRaw : 0;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Page header */}
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                  Orders
                </h1>
                <p className="text-xs text-gray-500">
                  View and manage all orders placed across client websites.
                </p>
              </div>
            </div>

            {/* Statistics cards */}
            <KpiCards
              items={[
                {
                  title: "Total Orders",
                  value: totalOrders,
                  delta: "Across all client websites",
                  icon: <ShoppingBag className="h-4 w-4" />,
                },
                {
                  title: "Completed Orders",
                  value: completedOrders,
                  delta: "Successfully delivered orders",
                  icon: <CheckCircle2 className="h-4 w-4" />,
                },
                {
                  title: "Pending Orders",
                  value: pendingOrders,
                  delta: "Awaiting fulfillment or payment",
                  icon: <Clock className="h-4 w-4" />,
                },
                {
                  title: "Cancelled Orders",
                  value: cancelledOrders,
                  delta: "Cancelled or refunded orders",
                  icon: <XCircle className="h-4 w-4" />,
                },
                {
                  title: "Total Revenue",
                  value: `₹ ${totalRevenue.toLocaleString("en-IN")}`,
                  delta: "From completed orders",
                  icon: <IndianRupee className="h-4 w-4" />,
                },
              ]}
            />

            {/* Orders table */}
            <DataTable<OrderRow>
              title="All Orders"
              columns={orderColumns}
              data={filteredOrders}
              pageSize={10}
              searchPlaceholder="Search orders by ID, user, client or product..."
              hideFiltersButton
              showIndexColumn
              onRowClick={(row) =>
                router.push(`/dashboard/order-management/order-details?orderId=${row.id}`)
              }
              renderActionMenuItems={(row) => (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/dashboard/order-management/order-details?orderId=${row.id}`)
                    }
                    className="flex items-center gap-2 text-[13px] text-slate-900 hover:bg-gray-50"
                  >
                    <CreditCard className="h-3.5 w-3.5 text-pink-500" />
                    <span>View Order Details</span>
                  </DropdownMenuItem>
                </>
              )}
              rightHeader={
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                    className="h-9 w-32 rounded-full border border-pink-100 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  >
                    {clientOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === "All" ? "All Clients" : opt}
                      </option>
                    ))}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as "All" | OrderStatus)
                    }
                    className="h-9 w-32 rounded-full border border-pink-100 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
}

