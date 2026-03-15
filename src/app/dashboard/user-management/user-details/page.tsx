"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { KpiCards } from "@/components/ui/kpiCards";
import { DataTable, type Column } from "@/components/ui/table";
import {
  ArrowLeft,
  ShieldCheck,
  ShoppingBag,
  Globe2,
  CreditCard,
  Users,
  UserCheck,
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

type AffiliateSale = {
  id: string;
  affiliateName: string;
  productName: string;
  purchasersCount: number;
  productPriceInr: number;
  commissionPerOrderInr: number;
};

type ClientUserStats = {
  id: number;
  name: string;
  totalOrders: number;
  totalAmountInr: number;
  lastOrderDate: string;
   isAffiliate: boolean;
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

const mockAffiliateSales: AffiliateSale[] = [
  {
    id: "AFF-001",
    affiliateName: "Aditi Sharma",
    productName: "HydraGlow Facial Kit",
    purchasersCount: 18,
    productPriceInr: 2499,
    commissionPerOrderInr: 250,
  },
  {
    id: "AFF-002",
    affiliateName: "Aditi Sharma",
    productName: "Vitamin C Brightening Serum",
    purchasersCount: 12,
    productPriceInr: 1499,
    commissionPerOrderInr: 180,
  },
  {
    id: "AFF-003",
    affiliateName: "Sara Khan",
    productName: "Acne Defense Cleanser",
    purchasersCount: 9,
    productPriceInr: 1999,
    commissionPerOrderInr: 220,
  },
  {
    id: "AFF-004",
    affiliateName: "Sara Khan",
    productName: "Glow Boost Night Cream",
    purchasersCount: 6,
    productPriceInr: 1799,
    commissionPerOrderInr: 200,
  },
];

const mockClientUsers: ClientUserStats[] = [
  {
    id: 1,
    name: "Aditi Sharma",
    totalOrders: 5,
    totalAmountInr: 8695,
    lastOrderDate: "2025-03-08",
    isAffiliate: true,
  },
  {
    id: 2,
    name: "Rahul Verma",
    totalOrders: 3,
    totalAmountInr: 5499,
    lastOrderDate: "2025-02-27",
    isAffiliate: false,
  },
  {
    id: 3,
    name: "Sara Khan",
    totalOrders: 4,
    totalAmountInr: 7299,
    lastOrderDate: "2025-02-15",
    isAffiliate: true,
  },
  {
    id: 4,
    name: "Vikram Mehta",
    totalOrders: 2,
    totalAmountInr: 2999,
    lastOrderDate: "2025-01-20",
    isAffiliate: false,
  },
  {
    id: 5,
    name: "Priya Nair",
    totalOrders: 1,
    totalAmountInr: 1799,
    lastOrderDate: "2024-12-05",
    isAffiliate: false,
  },
];

const clientUserColumns: Column<ClientUserStats>[] = [
  {
    key: "name",
    label: "User Name",
    render: (row) => (
      <span className="text-xs font-medium text-slate-900">{row.name}</span>
    ),
  },
  {
    key: "totalOrders",
    label: "Total Orders",
    render: (row) => (
      <span className="text-xs font-semibold text-slate-900">
        {row.totalOrders}
      </span>
    ),
  },
  {
    key: "totalAmountInr",
    label: "Total Amount",
    render: (row) => (
      <span className="text-xs font-semibold text-slate-900">
        ₹ {row.totalAmountInr.toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    key: "lastOrderDate",
    label: "Last Order Date",
    render: (row) =>
      new Date(row.lastOrderDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
];

const affiliateColumns: Column<AffiliateSale>[] = [
  {
    key: "affiliateName",
    label: "Affiliate Name",
  },
  {
    key: "productName",
    label: "Product",
  },
  {
    key: "purchasersCount",
    label: "Users Purchased",
    render: (row) => (
      <span className="text-xs font-semibold text-slate-900">
        {row.purchasersCount}
      </span>
    ),
  },
  {
    key: "productPriceInr",
    label: "Product Price",
    render: (row) => (
      <span className="text-xs font-semibold text-slate-900">
        ₹ {row.productPriceInr.toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    key: "commissionPerOrderInr",
    label: "Commission / Order",
    render: (row) => (
      <span className="text-xs font-semibold text-emerald-700">
        ₹ {row.commissionPerOrderInr.toLocaleString("en-IN")}
      </span>
    ),
  },
];

function UserDetailsPageContent() {
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

  const clientUserSummary = useMemo(() => {
    const totalUsers = mockClientUsers.length;
    const totalOrders = mockClientUsers.reduce(
      (acc, u) => acc + (Number.isFinite(u.totalOrders) ? u.totalOrders : 0),
      0
    );
    const totalAmount = mockClientUsers.reduce(
      (acc, u) =>
        acc + (Number.isFinite(u.totalAmountInr) ? u.totalAmountInr : 0),
      0
    );
    const totalAffiliateUsers = mockClientUsers.filter(
      (u) => u.isAffiliate
    ).length;

    return { totalUsers, totalOrders, totalAmount, totalAffiliateUsers };
  }, []);

  const userAffiliateSales = useMemo(() => {
    if (!user) return [];
    return mockAffiliateSales.filter(
      (sale) => sale.affiliateName === user.name
    );
  }, [user]);

  const statusBadgeClass =
    user?.status === "Active"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-rose-50 text-rose-700";

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/user-management"
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
                  title: "Total Users",
                  value: clientUserSummary.totalUsers,
                  delta: "Registered on this client platform",
                  icon: <Users className="h-4 w-4" />,
                },
                {
                  title: "Total Orders",
                  value: clientUserSummary.totalOrders,
                  delta: "Orders placed by all users",
                  icon: <ShoppingBag className="h-4 w-4" />,
                },
                {
                  title: "Total Amount",
                  value: `₹ ${clientUserSummary.totalAmount.toLocaleString(
                    "en-IN"
                  )}`,
                  delta: "Total revenue from this platform",
                  icon: <CreditCard className="h-4 w-4" />,
                },
                {
                  title: "Total Affiliate Users",
                  value: clientUserSummary.totalAffiliateUsers,
                  delta: "Users marked as affiliates",
                  icon: <UserCheck className="h-4 w-4" />,
                },
              ]}
            />

            {/* Main layout */}
            <div className="grid gap-6">
              {/* Client info + platform users table */}
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

                {/* Client users table */}
                <DataTable<ClientUserStats>
                  title="Platform Users"
                  columns={clientUserColumns}
                  data={mockClientUsers}
                  pageSize={5}
                  searchPlaceholder="Search platform users..."
                  hideFiltersButton
                  showIndexColumn
                  indexColumnLabel="Sr No."
                />

                {/* Affiliate performance table (per affiliate link) */}
                {userAffiliateSales.length > 0 && (
                  <DataTable<AffiliateSale>
                    title="Affiliate Performance"
                    columns={affiliateColumns}
                    data={userAffiliateSales}
                    pageSize={5}
                    searchPlaceholder="Search affiliate products..."
                    hideFiltersButton
                    showIndexColumn
                    indexColumnLabel="Sr No."
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function UserDetailsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading user details...</div>}>
      <UserDetailsPageContent />
    </Suspense>
  );
}
