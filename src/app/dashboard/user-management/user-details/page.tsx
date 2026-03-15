"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Hash,
  Shield,
  Calendar,
  ShoppingBag,
  Package,
  TrendingUp,
  Users,
  IndianRupee,
  Receipt,
  Undo2,
} from "lucide-react";

const USER_DETAILS_STORAGE_KEY = "userDetailsView";

type UserDetails = {
  id: number;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  city: string;
  state: string;
  pinCode?: string;
  status: "Active" | "Inactive" | "Suspended";
  registrationDate: string;
  profilePhotoUrl?: string;
};

// Mock analytics – in production these would be fetched by user id
type ActivitySummary = {
  totalOrders: number;
  productsPurchased: number;
  productsSold: number;
  returns: number;
  refunds: number;
  totalRevenue: number;
};

type NetworkPerformance = {
  directUsers: number;
  totalNetworkOrders: number;
  networkRevenue: number;
};

type OrderRecord = {
  id: string;
  date: string;
  amount: number;
  status: string;
  items?: string;
};

type ReturnRefundRecord = {
  id: string;
  date: string;
  type: "Return" | "Refund";
  amount: number;
  orderId: string;
  reason?: string;
};

function getMockActivitySummary(_userId: string): ActivitySummary {
  return {
    totalOrders: 48,
    productsPurchased: 126,
    productsSold: 89,
    returns: 3,
    refunds: 2,
    totalRevenue: 186420,
  };
}

function getMockNetworkPerformance(_userId: string): NetworkPerformance {
  return {
    directUsers: 12,
    totalNetworkOrders: 234,
    networkRevenue: 452100,
  };
}

function getMockRecentOrders(_userId: string): OrderRecord[] {
  return [
    { id: "ORD-1089", date: "2024-03-14", amount: 3240, status: "Delivered", items: "2 items" },
    { id: "ORD-1085", date: "2024-03-10", amount: 1890, status: "Shipped", items: "1 item" },
    { id: "ORD-1080", date: "2024-03-05", amount: 4590, status: "Delivered", items: "3 items" },
    { id: "ORD-1076", date: "2024-02-28", amount: 1200, status: "Delivered", items: "1 item" },
    { id: "ORD-1072", date: "2024-02-22", amount: 2890, status: "Delivered", items: "2 items" },
  ];
}

function getMockPurchaseHistory(_userId: string): OrderRecord[] {
  return [
    { id: "ORD-1089", date: "2024-03-14", amount: 3240, status: "Delivered" },
    { id: "ORD-1085", date: "2024-03-10", amount: 1890, status: "Shipped" },
    { id: "ORD-1080", date: "2024-03-05", amount: 4590, status: "Delivered" },
    { id: "ORD-1076", date: "2024-02-28", amount: 1200, status: "Delivered" },
    { id: "ORD-1072", date: "2024-02-22", amount: 2890, status: "Delivered" },
    { id: "ORD-1068", date: "2024-02-15", amount: 1560, status: "Delivered" },
    { id: "ORD-1062", date: "2024-02-08", amount: 2100, status: "Delivered" },
  ];
}

function getMockReturnRefundHistory(_userId: string): ReturnRefundRecord[] {
  return [
    { id: "REF-012", date: "2024-03-01", type: "Refund", amount: 1890, orderId: "ORD-1078", reason: "Product defect" },
    { id: "RET-008", date: "2024-02-20", type: "Return", amount: 1200, orderId: "ORD-1065", reason: "Wrong size" },
    { id: "REF-009", date: "2024-02-05", type: "Refund", amount: 899, orderId: "ORD-1055" },
  ];
}

export default function UserDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [user, setUser] = useState<UserDetails | null>(null);
  const [notFound, setNotFound] = useState(false);

  const loadUser = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(USER_DETAILS_STORAGE_KEY);
      if (!raw) {
        setNotFound(true);
        return;
      }
      const data = JSON.parse(raw) as UserDetails;
      if (id != null && String(data.id) !== id) {
        setNotFound(true);
        return;
      }
      setUser(data);
      setNotFound(false);
    } catch {
      setNotFound(true);
    }
  }, [id]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const userIdForAnalytics = user?.userId ?? "";
  const activitySummary = useMemo(() => getMockActivitySummary(userIdForAnalytics), [userIdForAnalytics]);
  const networkPerformance = useMemo(() => getMockNetworkPerformance(userIdForAnalytics), [userIdForAnalytics]);
  const recentOrders = useMemo(() => getMockRecentOrders(userIdForAnalytics), [userIdForAnalytics]);
  const purchaseHistory = useMemo(() => getMockPurchaseHistory(userIdForAnalytics), [userIdForAnalytics]);
  const returnRefundHistory = useMemo(() => getMockReturnRefundHistory(userIdForAnalytics), [userIdForAnalytics]);

  if (notFound || (!user && id)) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="beauty-scroll flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <User className="h-7 w-7" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-800">User not found</h2>
                <p className="mt-1 max-w-sm text-center text-sm text-gray-500">
                  The user may have been removed or the link is invalid. Go back to the list to
                  select a user.
                </p>
                <Button variant="outline" className="mt-6" asChild>
                  <Link href="/dashboard/user-management">Back to User Management</Link>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
          </main>
        </div>
      </div>
    );
  }

  const statusStyles =
    user.status === "Active"
      ? "bg-emerald-50 text-emerald-700"
      : user.status === "Suspended"
        ? "bg-amber-50 text-amber-700"
        : "bg-gray-100 text-gray-600";

  const registrationFormatted = new Date(user.registrationDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Breadcrumb & back */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  asChild
                >
                  <Link href="/dashboard/user-management">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Link>
                </Button>
                <span className="text-gray-300">|</span>
                <nav className="flex items-center gap-1.5 text-sm">
                  <Link
                    href="/dashboard"
                    className="text-gray-500 transition hover:text-gray-800"
                  >
                    Dashboard
                  </Link>
                  <span className="text-gray-400">/</span>
                  <Link
                    href="/dashboard/user-management"
                    className="text-gray-500 transition hover:text-gray-800"
                  >
                    User Management
                  </Link>
                  <span className="text-gray-400">/</span>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </nav>
              </div>
            </div>

            {/* Header card */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 bg-gradient-to-r from-pink-50 to-white px-6 py-6 sm:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                      <User className="h-7 w-7 text-pink-500" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                        {user.name}
                      </h1>
                      <p className="mt-0.5 text-sm text-gray-600">{user.email}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles}`}
                        >
                          {user.status}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {user.userId}
                        </span>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0" asChild>
                    <Link href="/dashboard/user-management">Back to list</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Basic Info + Location - full width */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Shield className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Basic Info
                </h2>
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    User ID
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                    <Hash className="h-3.5 w-3.5 text-gray-400" />
                    {user.userId}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Full Name
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{user.name}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Role
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{user.role}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Registration Date
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    {registrationFormatted}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Email
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    <a
                      href={`mailto:${user.email}`}
                      className="text-pink-600 hover:underline"
                    >
                      {user.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Phone
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    <a
                      href={`tel:${user.phone}`}
                      className="text-pink-600 hover:underline"
                    >
                      {user.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    State
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    {user.state}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    City
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{user.city}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Pin Code
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">
                    {user.pinCode ?? "—"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* User Activity Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  User Activity Summary
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Total Orders</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-gray-900">{activitySummary.totalOrders}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Products Purchased</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-gray-900">{activitySummary.productsPurchased}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Products Sold</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-gray-900">{activitySummary.productsSold}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Returns</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-gray-900">{activitySummary.returns}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Refunds</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-gray-900">{activitySummary.refunds}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-emerald-50/80 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Total Revenue</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-emerald-700">
                    ₹{activitySummary.totalRevenue.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Network Performance */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <Users className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Network Performance
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Direct Users</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900">{networkPerformance.directUsers}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
                  <div className="flex items-center gap-2 text-gray-500">
                    <ShoppingBag className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Total Network Orders</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900">{networkPerformance.totalNetworkOrders}</p>
                </div>
                <div className="rounded-xl border border-violet-100 bg-violet-50/80 p-5">
                  <div className="flex items-center gap-2 text-violet-700">
                    <IndianRupee className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Network Revenue</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-violet-800">
                    ₹{networkPerformance.networkRevenue.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Analytics */}
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                <Receipt className="h-4 w-4" />
                Order Analytics
              </h2>

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Orders */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1">
                  <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <Package className="h-3.5 w-3.5" />
                    Recent Orders
                  </h3>
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5 text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{order.id}</p>
                          <p className="text-xs text-gray-500">{order.date} · {order.items ?? ""}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{order.amount.toLocaleString("en-IN")}</p>
                          <span className="text-[10px] font-medium text-emerald-600">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase History */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1">
                  <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Purchase History
                  </h3>
                  <div className="space-y-3">
                    {purchaseHistory.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5 text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{order.id}</p>
                          <p className="text-xs text-gray-500">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{order.amount.toLocaleString("en-IN")}</p>
                          <span className="text-[10px] text-gray-500">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Return / Refund History */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1">
                  <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <Undo2 className="h-3.5 w-3.5" />
                    Return / Refund History
                  </h3>
                  <div className="space-y-3">
                    {returnRefundHistory.map((record) => (
                      <div
                        key={record.id}
                        className="rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5 text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${record.type === "Refund" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>
                            {record.type}
                          </span>
                          <span className="font-semibold text-gray-900">₹{record.amount.toLocaleString("en-IN")}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600">{record.orderId} · {record.date}</p>
                        {record.reason && <p className="mt-0.5 text-[11px] text-gray-500">{record.reason}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
