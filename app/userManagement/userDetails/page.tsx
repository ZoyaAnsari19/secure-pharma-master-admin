"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SideBar } from "@/components/sideBar";
import { TopBar } from "@/components/topBar";
import { KpiCards } from "@/components/ui/kpiCards";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  ShieldCheck,
  ShoppingBag,
  User,
  Globe2,
  CreditCard,
  Package2,
} from "lucide-react";

type UserStatus = "Active" | "Blocked";

type UserSummary = {
  id: number;
  name: string;
  email: string;
  phone: string;
  clientWebsite: string;
  status: UserStatus;
  joinedDate: string;
};

type UserOrder = {
  id: string;
  productName: string;
  quantity: number;
  amountInr: number;
  status: "Delivered" | "Processing" | "Cancelled" | "Refunded";
  date: string;
};

const mockUsers: UserSummary[] = [
  {
    id: 1,
    name: "Aditi Sharma",
    email: "aditi.sharma@example.com",
    phone: "+91 98765 43210",
    clientWebsite: "mumbai.glow.truebeauty.in",
    status: "Active",
    joinedDate: "2024-01-10",
  },
  {
    id: 2,
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    phone: "+91 91234 56789",
    clientWebsite: "delhi.blush.truebeauty.in",
    status: "Blocked",
    joinedDate: "2023-11-22",
  },
  {
    id: 3,
    name: "Sara Khan",
    email: "sara.khan@example.com",
    phone: "+91 99887 76655",
    clientWebsite: "pune.skincraft.truebeauty.in",
    status: "Active",
    joinedDate: "2023-09-05",
  },
  {
    id: 4,
    name: "Vikram Mehta",
    email: "vikram.mehta@example.com",
    phone: "+91 87654 32109",
    clientWebsite: "bangalore.minimal.truebeauty.in",
    status: "Active",
    joinedDate: "2024-02-01",
  },
  {
    id: 5,
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+91 76543 21098",
    clientWebsite: "chennai.radiant.truebeauty.in",
    status: "Blocked",
    joinedDate: "2022-12-14",
  },
];

const mockOrders: UserOrder[] = [
  {
    id: "ORD-1042",
    productName: "HydraGlow Facial Kit",
    quantity: 2,
    amountInr: 2499,
    status: "Delivered",
    date: "2025-03-08",
  },
  {
    id: "ORD-1037",
    productName: "Vitamin C Brightening Serum",
    quantity: 1,
    amountInr: 1499,
    status: "Delivered",
    date: "2025-02-27",
  },
  {
    id: "ORD-1029",
    productName: "Acne Defense Cleanser",
    quantity: 3,
    amountInr: 1999,
    status: "Processing",
    date: "2025-02-15",
  },
  {
    id: "ORD-1018",
    productName: "SPF 50+ Daily Sunscreen",
    quantity: 1,
    amountInr: 899,
    status: "Delivered",
    date: "2025-01-20",
  },
  {
    id: "ORD-1009",
    productName: "Glow Boost Night Cream",
    quantity: 1,
    amountInr: 1799,
    status: "Cancelled",
    date: "2024-12-05",
  },
];

export default function UserDetailsPage() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserSummary | null>(null);
  const [clientInfo, setClientInfo] = useState<{
    websiteDomain: string;
    clientName: string;
    brandName: string;
  } | null>(null);

  useEffect(() => {
    const idParam = searchParams.get("id");
    if (!idParam) {
      setUser(null);
      return;
    }

    const id = Number(idParam);
    if (!Number.isFinite(id)) {
      setUser(null);
      return;
    }

    const found = mockUsers.find((u) => u.id === id) ?? null;
    setUser(found);
  }, [searchParams]);

  useEffect(() => {
    if (!user) {
      setClientInfo(null);
      return;
    }

    try {
      const raw = window.localStorage.getItem("super-admin.clients.v1");
      if (!raw) {
        setClientInfo({
          websiteDomain: user.clientWebsite,
          clientName: "—",
          brandName: "—",
        });
        return;
      }

      const parsed = JSON.parse(raw) as Array<any>;
      if (!Array.isArray(parsed)) {
        setClientInfo({
          websiteDomain: user.clientWebsite,
          clientName: "—",
          brandName: "—",
        });
        return;
      }

      const matched =
        parsed.find(
          (c) =>
            c?.websiteDomain === user.clientWebsite ||
            c?.clientWebsite === user.clientWebsite
        ) ?? null;

      if (!matched) {
        setClientInfo({
          websiteDomain: user.clientWebsite,
          clientName: "—",
          brandName: "—",
        });
        return;
      }

      setClientInfo({
        websiteDomain: matched.websiteDomain ?? matched.clientWebsite ?? user.clientWebsite,
        clientName: matched.clientName ?? "—",
        brandName: matched.brandName ?? "—",
      });
    } catch {
      setClientInfo({
        websiteDomain: user.clientWebsite,
        clientName: "—",
        brandName: "—",
      });
    }
  }, [user]);

  const orderSummary = useMemo(() => {
    const totalOrders = mockOrders.length;
    const totalProducts = mockOrders.reduce((acc, o) => acc + o.quantity, 0);
    const totalAmount = mockOrders.reduce((acc, o) => acc + o.amountInr, 0);
    const lastOrderDate = mockOrders[0]?.date ?? null;

    return { totalOrders, totalProducts, totalAmount, lastOrderDate };
  }, []);

  const statusBadgeClass =
    user?.status === "Active"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-rose-50 text-rose-700";

  const joinedDateFormatted = user?.joinedDate
    ? new Date(user.joinedDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const lastOrderDateFormatted = orderSummary.lastOrderDate
    ? new Date(orderSummary.lastOrderDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <SideBar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/userManagement"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-pink-100 bg-white text-slate-500 shadow-sm hover:border-pink-200 hover:bg-pink-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                    User Details
                  </h1>
                  <p className="text-xs text-gray-500">
                    Complete profile, client mapping and order activity for this user.
                  </p>
                </div>
              </div>
              {user && (
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass}`}
                  >
                    <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                    {user.status === "Active" ? "Active User" : "Blocked User"}
                  </span>
                </div>
              )}
            </div>

            {/* KPI cards */}
            <KpiCards
              items={[
                {
                  title: "Total Orders",
                  value: orderSummary.totalOrders,
                  delta: "Orders placed across all time",
                  icon: <ShoppingBag className="h-4 w-4" />,
                },
                {
                  title: "Products Purchased",
                  value: orderSummary.totalProducts,
                  delta: "Line items across all orders",
                  icon: <Package2 className="h-4 w-4" />,
                },
                {
                  title: "Total Amount Spent",
                  value: `₹ ${orderSummary.totalAmount.toLocaleString("en-IN")}`,
                  delta: "Lifetime value",
                  icon: <CreditCard className="h-4 w-4" />,
                },
                {
                  title: "Last Order Date",
                  value: lastOrderDateFormatted,
                  delta: "Most recent successful order",
                  icon: <Calendar className="h-4 w-4" />,
                },
              ]}
            />

            {/* Main layout */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
              {/* Left column: client info + orders table */}
              <div className="space-y-6">
                {/* Client information */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                      <Globe2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Client Information
                      </h3>
                      <p className="text-xs text-gray-500">
                        The client website and brand this user belongs to.
                      </p>
                    </div>
                  </div>

                  <dl className="grid gap-4 text-sm text-gray-800 sm:grid-cols-3">
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Client Website / Domain
                      </dt>
                      <dd className="mt-1 flex items-center gap-1.5 text-xs">
                        <Globe2 className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate">
                          {clientInfo?.websiteDomain ?? user?.clientWebsite ?? "—"}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Client Name
                      </dt>
                      <dd className="mt-1 text-xs">
                        {clientInfo?.clientName ?? "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Client Brand Name
                      </dt>
                      <dd className="mt-1 text-xs">
                        {clientInfo?.brandName ?? "—"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Recent orders table */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Recent Orders
                      </h3>
                      <p className="text-xs text-gray-500">
                        Last {mockOrders.length} orders placed by this user.
                      </p>
                    </div>
                  </div>

                  <div className="beauty-scroll overflow-x-auto">
                    <table className="min-w-full border-collapse text-sm text-slate-700">
                      <thead className="bg-gray-50 text-xs font-semibold text-gray-600">
                        <tr>
                          <th className="whitespace-nowrap px-4 py-3 text-left">
                            Order ID
                          </th>
                          <th className="whitespace-nowrap px-4 py-3 text-left">
                            Product Name
                          </th>
                          <th className="whitespace-nowrap px-4 py-3 text-center">
                            Qty
                          </th>
                          <th className="whitespace-nowrap px-4 py-3 text-right">
                            Amount
                          </th>
                          <th className="whitespace-nowrap px-4 py-3 text-left">
                            Status
                          </th>
                          <th className="whitespace-nowrap px-4 py-3 text-left">
                            Order Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {mockOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-pink-50/40">
                            <td className="px-4 py-3 align-middle text-xs font-medium text-slate-900">
                              {order.id}
                            </td>
                            <td className="px-4 py-3 align-middle text-xs text-slate-800">
                              {order.productName}
                            </td>
                            <td className="px-4 py-3 align-middle text-center text-xs text-slate-700">
                              {order.quantity}
                            </td>
                            <td className="px-4 py-3 align-middle text-right text-xs font-semibold text-slate-900">
                              ₹ {order.amountInr.toLocaleString("en-IN")}
                            </td>
                            <td className="px-4 py-3 align-middle text-xs">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                                  order.status === "Delivered"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : order.status === "Processing"
                                    ? "bg-amber-50 text-amber-700"
                                    : order.status === "Cancelled"
                                    ? "bg-rose-50 text-rose-700"
                                    : "bg-sky-50 text-sky-700"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 align-middle text-xs text-slate-700">
                              {new Date(order.date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right column: user profile + quick summary */}
              <div className="space-y-6">
                {/* User profile card */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-base font-semibold text-gray-900">
                          {user?.name ?? "User"}
                        </h2>
                        <p className="text-xs text-gray-500">
                          Joined on {joinedDateFormatted}
                        </p>
                      </div>
                    </div>
                    {user && (
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusBadgeClass}`}
                      >
                        {user.status}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{user?.email ?? "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span>{user?.phone ?? "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe2 className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{user?.clientWebsite ?? "—"}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                      variant={user?.status === "Active" ? "outline" : "primary"}
                      className="h-9 rounded-full px-4 text-xs font-medium"
                    >
                      {user?.status === "Active" ? "Block User" : "Unblock User"}
                    </Button>
                    <Button
                      variant="outline"
                      className="h-9 rounded-full px-4 text-xs font-medium"
                    >
                      View Full Order History
                    </Button>
                  </div>
                </div>

                {/* Quick order summary */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Order Summary
                      </h3>
                      <p className="text-xs text-gray-500">
                        Lifetime order stats for this user.
                      </p>
                    </div>
                  </div>

                  <dl className="grid gap-4 text-sm text-gray-800 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Total Orders
                      </dt>
                      <dd className="mt-1 text-base font-semibold text-gray-900">
                        {orderSummary.totalOrders}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Products Purchased
                      </dt>
                      <dd className="mt-1 text-base font-semibold text-gray-900">
                        {orderSummary.totalProducts}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Amount Spent
                      </dt>
                      <dd className="mt-1 text-base font-semibold text-gray-900">
                        ₹ {orderSummary.totalAmount.toLocaleString("en-IN")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Last Order Date
                      </dt>
                      <dd className="mt-1 text-xs text-gray-800">
                        {lastOrderDateFormatted}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

