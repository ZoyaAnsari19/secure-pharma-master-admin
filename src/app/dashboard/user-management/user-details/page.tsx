"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
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
  Warehouse,
  ClipboardList,
  Truck,
  ArrowLeftRight,
  AlertTriangle,
  Boxes,
} from "lucide-react";

const USER_DETAILS_STORAGE_KEY = "userDetailsView";

type UserDetails = {
  id: number;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  // Optional: name of the user who referred this customer / user
  referredByName?: string;
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
  createdUsersCount: number;
  totalNetworkOrders: number;
  networkRevenue: number;
};

type CreatedUser = {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: string;
  registeredDate: string;
};

type OrderRecord = {
  id: string;
  date: string;
  amount: number;
  status: string;
  items?: string;
  productName?: string;
};

type ReturnRefundRecord = {
  id: string;
  date: string;
  type: "Return" | "Refund";
  amount: number;
  orderId: string;
  reason?: string;
};

// Stock Manager – inventory & warehouse
type InventoryActivitySummary = {
  warehousesManaged: number;
  productsManaged: number;
  grnEntries: number;
  dispatchOrders: number;
  stockTransfers: number;
  lowStockAlerts: number;
};

type WarehouseAssignment = {
  id: string;
  name: string;
  location: string;
  assignedSince: string;
  productsCount: number;
};

type GRNRecord = {
  id: string;
  date: string;
  supplier: string;
  items: number;
  status: string;
};

type DispatchOrderRecord = {
  id: string;
  date: string;
  destination: string;
  items: number;
  status: string;
};

type StockUpdateRecord = {
  id: string;
  date: string;
  type: "In" | "Out" | "Adjustment";
  product: string;
  quantity: number;
  warehouse: string;
};

function getMockInventoryActivitySummary(_userId: string): InventoryActivitySummary {
  return {
    warehousesManaged: 4,
    productsManaged: 342,
    grnEntries: 28,
    dispatchOrders: 156,
    stockTransfers: 42,
    lowStockAlerts: 7,
  };
}

function getMockWarehouseAssignments(_userId: string): WarehouseAssignment[] {
  return [
    { id: "WH-MUM-01", name: "Mumbai Central", location: "Mumbai", assignedSince: "2024-01-15", productsCount: 120 },
    { id: "WH-MUM-02", name: "Mumbai East", location: "Mumbai", assignedSince: "2024-02-01", productsCount: 95 },
    { id: "WH-PUN-01", name: "Pune Hub", location: "Pune", assignedSince: "2024-02-20", productsCount: 78 },
    { id: "WH-NAG-01", name: "Nagpur Warehouse", location: "Nagpur", assignedSince: "2024-03-01", productsCount: 49 },
  ];
}

function getMockGRNRecords(_userId: string): GRNRecord[] {
  return [
    { id: "GRN-2847", date: "2024-03-14", supplier: "ABC Supplies", items: 12, status: "Completed" },
    { id: "GRN-2843", date: "2024-03-12", supplier: "XYZ Traders", items: 8, status: "Completed" },
    { id: "GRN-2839", date: "2024-03-10", supplier: "Global Goods", items: 15, status: "Completed" },
    { id: "GRN-2835", date: "2024-03-08", supplier: "ABC Supplies", items: 6, status: "Pending" },
    { id: "GRN-2830", date: "2024-03-05", supplier: "XYZ Traders", items: 22, status: "Completed" },
  ];
}

function getMockDispatchOrders(_userId: string): DispatchOrderRecord[] {
  return [
    { id: "DSP-1024", date: "2024-03-14", destination: "FRN-001 Mumbai", items: 45, status: "Dispatched" },
    { id: "DSP-1021", date: "2024-03-13", destination: "FRN-002 Delhi", items: 32, status: "Delivered" },
    { id: "DSP-1018", date: "2024-03-11", destination: "FRN-003 Bangalore", items: 28, status: "Delivered" },
    { id: "DSP-1015", date: "2024-03-09", destination: "FRN-004 Hyderabad", items: 19, status: "In transit" },
    { id: "DSP-1012", date: "2024-03-07", destination: "FRN-005 Chennai", items: 56, status: "Delivered" },
  ];
}

function getMockStockUpdates(_userId: string): StockUpdateRecord[] {
  return [
    { id: "SU-892", date: "2024-03-14", type: "In", product: "SKU-12045", quantity: 200, warehouse: "WH-MUM-01" },
    { id: "SU-891", date: "2024-03-14", type: "Out", product: "SKU-12012", quantity: 50, warehouse: "WH-MUM-02" },
    { id: "SU-890", date: "2024-03-13", type: "Adjustment", product: "SKU-11890", quantity: -5, warehouse: "WH-MUM-01" },
    { id: "SU-889", date: "2024-03-13", type: "In", product: "SKU-11902", quantity: 100, warehouse: "WH-PUN-01" },
    { id: "SU-888", date: "2024-03-12", type: "Out", product: "SKU-12045", quantity: 80, warehouse: "WH-MUM-01" },
  ];
}

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
    createdUsersCount: 12,
    totalNetworkOrders: 234,
    networkRevenue: 452100,
  };
}

function getMockCreatedUsers(_userId: string): CreatedUser[] {
  return [
    { id: 101, userId: "USR-101", name: "Riya Mehta", email: "riya@example.com", role: "Retailer", registeredDate: "2024-03-10" },
    { id: 102, userId: "USR-102", name: "Arjun Nair", email: "arjun@example.com", role: "Customer", registeredDate: "2024-03-08" },
    { id: 103, userId: "USR-103", name: "Kavya Reddy", email: "kavya@example.com", role: "Agent", registeredDate: "2024-03-05" },
    { id: 104, userId: "USR-104", name: "Vikram Joshi", email: "vikram@example.com", role: "Networker", registeredDate: "2024-02-28" },
    { id: 105, userId: "USR-105", name: "Ananya Singh", email: "ananya@example.com", role: "Customer", registeredDate: "2024-02-25" },
    { id: 106, userId: "USR-106", name: "Rohan Patel", email: "rohan@example.com", role: "Retailer", registeredDate: "2024-02-20" },
    { id: 107, userId: "USR-107", name: "Isha Gupta", email: "isha@example.com", role: "Agent", registeredDate: "2024-02-15" },
    { id: 108, userId: "USR-108", name: "Aditya Kumar", email: "aditya@example.com", role: "Customer", registeredDate: "2024-02-10" },
    { id: 109, userId: "USR-109", name: "Sneha Iyer", email: "sneha@example.com", role: "Networker", registeredDate: "2024-02-05" },
    { id: 110, userId: "USR-110", name: "Manish Desai", email: "manish@example.com", role: "Retailer", registeredDate: "2024-01-28" },
    { id: 111, userId: "USR-111", name: "Pooja Sharma", email: "pooja@example.com", role: "Customer", registeredDate: "2024-01-22" },
    { id: 112, userId: "USR-112", name: "Karan Malhotra", email: "karan@example.com", role: "Agent", registeredDate: "2024-01-18" },
  ];
}

function getMockRecentOrders(_userId: string): OrderRecord[] {
  return [
    { id: "ORD-1089", date: "2024-03-14", amount: 3240, status: "Delivered", items: "2 items", productName: "Glow Serum Pro" },
    { id: "ORD-1085", date: "2024-03-10", amount: 1890, status: "Shipped", items: "1 item", productName: "Hydra Moisturizer" },
    { id: "ORD-1080", date: "2024-03-05", amount: 4590, status: "Delivered", items: "3 items", productName: "Vitamin C Serum" },
    { id: "ORD-1076", date: "2024-02-28", amount: 1200, status: "Delivered", items: "1 item", productName: "Sunscreen SPF 50" },
    { id: "ORD-1072", date: "2024-02-22", amount: 2890, status: "Delivered", items: "2 items", productName: "Night Repair Cream" },
  ];
}

function getMockPurchaseHistory(_userId: string): OrderRecord[] {
  return [
    { id: "ORD-1089", date: "2024-03-14", amount: 3240, status: "Delivered", productName: "Glow Serum Pro" },
    { id: "ORD-1085", date: "2024-03-10", amount: 1890, status: "Shipped", productName: "Hydra Moisturizer" },
    { id: "ORD-1080", date: "2024-03-05", amount: 4590, status: "Delivered", productName: "Vitamin C Serum" },
    { id: "ORD-1076", date: "2024-02-28", amount: 1200, status: "Delivered", productName: "Sunscreen SPF 50" },
    { id: "ORD-1072", date: "2024-02-22", amount: 2890, status: "Delivered", productName: "Night Repair Cream" },
    { id: "ORD-1068", date: "2024-02-15", amount: 1560, status: "Delivered", productName: "Glow Serum Pro" },
    { id: "ORD-1062", date: "2024-02-08", amount: 2100, status: "Delivered", productName: "Hydra Moisturizer" },
  ];
}

function getMockReturnRefundHistory(_userId: string): ReturnRefundRecord[] {
  return [
    { id: "REF-012", date: "2024-03-01", type: "Refund", amount: 1890, orderId: "ORD-1078", reason: "Product defect" },
    { id: "RET-008", date: "2024-02-20", type: "Return", amount: 1200, orderId: "ORD-1065", reason: "Wrong size" },
    { id: "REF-009", date: "2024-02-05", type: "Refund", amount: 899, orderId: "ORD-1055" },
  ];
}

function UserDetailsContent() {
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
      // For now, add a dummy referred-by name so the UI can demonstrate this field.
      // In real implementation this should come from API / backend.
      const withReferral: UserDetails =
        data.role === "Customer" && !data.referredByName
          ? { ...data, referredByName: "Rohan Agent" }
          : data;
      setUser(withReferral);
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
  const createdUsers = useMemo(() => getMockCreatedUsers(userIdForAnalytics), [userIdForAnalytics]);
  const recentOrders = useMemo(() => getMockRecentOrders(userIdForAnalytics), [userIdForAnalytics]);
  const purchaseHistory = useMemo(() => getMockPurchaseHistory(userIdForAnalytics), [userIdForAnalytics]);
  const returnRefundHistory = useMemo(() => getMockReturnRefundHistory(userIdForAnalytics), [userIdForAnalytics]);
  const inventorySummary = useMemo(() => getMockInventoryActivitySummary(userIdForAnalytics), [userIdForAnalytics]);
  const warehouseAssignments = useMemo(() => getMockWarehouseAssignments(userIdForAnalytics), [userIdForAnalytics]);
  const grnRecords = useMemo(() => getMockGRNRecords(userIdForAnalytics), [userIdForAnalytics]);
  const dispatchOrders = useMemo(() => getMockDispatchOrders(userIdForAnalytics), [userIdForAnalytics]);
  const stockUpdates = useMemo(() => getMockStockUpdates(userIdForAnalytics), [userIdForAnalytics]);

  const [recentOrdersPage, setRecentOrdersPage] = useState(1);
  const [purchaseHistoryPage, setPurchaseHistoryPage] = useState(1);
  const ordersPageSize = 5;

  const recentOrdersTotalPages = Math.max(
    1,
    Math.ceil(recentOrders.length / ordersPageSize)
  );
  const purchaseHistoryTotalPages = Math.max(
    1,
    Math.ceil(purchaseHistory.length / ordersPageSize)
  );

  const paginatedRecentOrders = useMemo(() => {
    const start = (recentOrdersPage - 1) * ordersPageSize;
    return recentOrders.slice(start, start + ordersPageSize);
  }, [recentOrders, recentOrdersPage]);

  const paginatedPurchaseHistory = useMemo(() => {
    const start = (purchaseHistoryPage - 1) * ordersPageSize;
    return purchaseHistory.slice(start, start + ordersPageSize);
  }, [purchaseHistory, purchaseHistoryPage]);
  const [createdUsersPage, setCreatedUsersPage] = useState(1);
  const createdUsersPageSize = 5;
  const createdUsersTotalPages = Math.max(
    1,
    Math.ceil(createdUsers.length / createdUsersPageSize)
  );
  const paginatedCreatedUsers = useMemo(
    () => {
      const start = (createdUsersPage - 1) * createdUsersPageSize;
      return createdUsers.slice(start, start + createdUsersPageSize);
    },
    [createdUsers, createdUsersPage]
  );

  if (notFound || (!user && id)) {
    return (
      <div className="flex h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex h-full flex-1 flex-col">
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
      <div className="flex h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex h-full flex-1 flex-col">
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
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col">
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
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                        <p className="text-gray-600">{user.email}</p>
                        <span
                          className={`inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium ${statusStyles}`}
                        >
                          {user.status}
                        </span>
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {user.userId}
                        </span>
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
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
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
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
                {user.role === "Customer" && (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Referred By
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Users className="h-3.5 w-3.5 text-gray-400" />
                      {user.referredByName ?? "—"}
                    </dd>
                  </div>
                )}
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

            {/* Stock Manager: Inventory & Warehouse view */}
            {user.role === "Stock Manager" && (
              <>
                {/* Inventory Activity Summary */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                      <Boxes className="h-4 w-4" />
                    </div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                      Inventory Activity Summary
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Warehouses Managed</p>
                      <p className="mt-1 text-xl font-semibold tabular-nums text-gray-900">{inventorySummary.warehousesManaged}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Products Managed</p>
                      <p className="mt-1 text-xl font-semibold tabular-nums text-gray-900">{inventorySummary.productsManaged}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">GRN Entries</p>
                      <p className="mt-1 text-xl font-semibold tabular-nums text-gray-900">{inventorySummary.grnEntries}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Dispatch Orders</p>
                      <p className="mt-1 text-xl font-semibold tabular-nums text-gray-900">{inventorySummary.dispatchOrders}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Stock Transfers</p>
                      <p className="mt-1 text-xl font-semibold tabular-nums text-gray-900">{inventorySummary.stockTransfers}</p>
                    </div>
                    <div className="rounded-xl border border-amber-100 bg-amber-50/80 p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-amber-700">Low Stock Alerts</p>
                      <p className="mt-1 text-xl font-semibold tabular-nums text-amber-800">{inventorySummary.lowStockAlerts}</p>
                    </div>
                  </div>
                </div>

                {/* Warehouse Assignments */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                      <Warehouse className="h-4 w-4" />
                    </div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                      Warehouse Assignments
                    </h2>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          <th className="px-4 py-3">Warehouse ID</th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Location</th>
                          <th className="px-4 py-3">Products</th>
                          <th className="px-4 py-3">Assigned Since</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {warehouseAssignments.map((w) => (
                          <tr key={w.id} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3 font-medium text-gray-900">{w.id}</td>
                            <td className="px-4 py-3 text-gray-800">{w.name}</td>
                            <td className="px-4 py-3 text-gray-600">{w.location}</td>
                            <td className="px-4 py-3 tabular-nums text-gray-700">{w.productsCount}</td>
                            <td className="px-4 py-3 text-gray-500">
                              {new Date(w.assignedSince).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Inventory Activity */}
                <div className="space-y-6">
                  <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                    <ClipboardList className="h-4 w-4" />
                    Recent Inventory Activity
                  </h2>
                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        <Receipt className="h-3.5 w-3.5" />
                        GRN Records
                      </h3>
                      <div className="space-y-3">
                        {grnRecords.map((r) => (
                          <div key={r.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5 text-sm">
                            <div>
                              <p className="font-medium text-gray-900">{r.id}</p>
                              <p className="text-xs text-gray-500">{r.date} · {r.supplier}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{r.items} items</p>
                              <span className="text-[10px] font-medium text-emerald-600">{r.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        <Truck className="h-3.5 w-3.5" />
                        Dispatch Orders
                      </h3>
                      <div className="space-y-3">
                        {dispatchOrders.map((r) => (
                          <div key={r.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5 text-sm">
                            <div>
                              <p className="font-medium text-gray-900">{r.id}</p>
                              <p className="text-xs text-gray-500">{r.date} · {r.destination}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{r.items} items</p>
                              <span className="text-[10px] font-medium text-blue-600">{r.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        <ArrowLeftRight className="h-3.5 w-3.5" />
                        Stock Updates
                      </h3>
                      <div className="space-y-3">
                        {stockUpdates.map((r) => (
                          <div key={r.id} className="rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5 text-sm">
                            <div className="flex items-center justify-between">
                              <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${r.type === "In" ? "bg-emerald-50 text-emerald-700" : r.type === "Out" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
                                {r.type}
                              </span>
                              <span className="font-semibold text-gray-900">{r.quantity > 0 ? `+${r.quantity}` : r.quantity}</span>
                            </div>
                            <p className="mt-1 text-xs text-gray-600">{r.product} · {r.warehouse}</p>
                            <p className="text-[11px] text-gray-500">{r.date}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Non–Stock Manager: User Activity Summary */}
            {user.role !== "Stock Manager" && (
              <>
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

            {/* Network Performance & User Relationships (hide for customers) */}
            {user.role !== "Customer" && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Network Performance
                  </h2>
                  <p className="text-xs text-gray-400">Metrics from users registered through this user</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Created Users</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900">{networkPerformance.createdUsersCount}</p>
                  <p className="mt-0.5 text-[11px] text-gray-500">Registered through this user</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
                  <div className="flex items-center gap-2 text-gray-500">
                    <ShoppingBag className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900">{networkPerformance.totalNetworkOrders}</p>
                  <p className="mt-0.5 text-[11px] text-gray-500">From created users</p>
                </div>
                <div className="rounded-xl border border-violet-100 bg-violet-50/80 p-5">
                  <div className="flex items-center gap-2 text-violet-700">
                    <IndianRupee className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Total Revenue</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-violet-800">
                    ₹{networkPerformance.networkRevenue.toLocaleString("en-IN")}
                  </p>
                  <p className="mt-0.5 text-[11px] text-violet-600/80">From created users</p>
                </div>
              </div>

              {/* Created Users list */}
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <Users className="h-3.5 w-3.5" />
                  List of Created Users ({createdUsers.length})
                </h3>
                <div className="overflow-hidden rounded-xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        <th className="px-4 py-3">User ID</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginatedCreatedUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-medium text-gray-900">{u.userId}</td>
                          <td className="px-4 py-3 text-gray-800">{u.name}</td>
                          <td className="px-4 py-3 text-gray-600">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{u.role}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {new Date(u.registeredDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {createdUsersTotalPages > 1 && (
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Page {createdUsersPage} of {createdUsersTotalPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2"
                        disabled={createdUsersPage === 1}
                        onClick={() =>
                          setCreatedUsersPage((p) => Math.max(1, p - 1))
                        }
                      >
                        Previous
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2"
                        disabled={createdUsersPage === createdUsersTotalPages}
                        onClick={() =>
                          setCreatedUsersPage((p) =>
                            Math.min(createdUsersTotalPages, p + 1)
                          )
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}

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
                    {paginatedRecentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5 text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{order.id}</p>
                          <p className="mt-0.5 text-xs text-gray-600">
                            {order.productName ?? "—"}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
                              {order.date}
                            </span>
                            {order.items && (
                              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-700">
                                {order.items}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{order.amount.toLocaleString("en-IN")}</p>
                          <span className="text-[10px] font-medium text-emerald-600">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {recentOrdersTotalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>
                        Page {recentOrdersPage} of {recentOrdersTotalPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2"
                          disabled={recentOrdersPage === 1}
                          onClick={() =>
                            setRecentOrdersPage((p) => Math.max(1, p - 1))
                          }
                        >
                          Previous
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2"
                          disabled={recentOrdersPage === recentOrdersTotalPages}
                          onClick={() =>
                            setRecentOrdersPage((p) =>
                              Math.min(recentOrdersTotalPages, p + 1)
                            )
                          }
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Purchase History */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1">
                  <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Purchase History
                  </h3>
                  <div className="space-y-3">
                    {paginatedPurchaseHistory.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5 text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{order.id}</p>
                          <p className="mt-0.5 text-xs text-gray-600">
                            {order.productName ?? "—"}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
                              {order.date}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{order.amount.toLocaleString("en-IN")}</p>
                          <span className="text-[10px] text-gray-500">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {purchaseHistoryTotalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>
                        Page {purchaseHistoryPage} of {purchaseHistoryTotalPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2"
                          disabled={purchaseHistoryPage === 1}
                          onClick={() =>
                            setPurchaseHistoryPage((p) => Math.max(1, p - 1))
                          }
                        >
                          Previous
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2"
                          disabled={
                            purchaseHistoryPage === purchaseHistoryTotalPages
                          }
                          onClick={() =>
                            setPurchaseHistoryPage((p) =>
                              Math.min(purchaseHistoryTotalPages, p + 1)
                            )
                          }
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
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
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function UserDetailsFallback() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col">
        <Topbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        </main>
      </div>
    </div>
  );
}

export default function UserDetailsPage() {
  return (
    <Suspense fallback={<UserDetailsFallback />}>
      <UserDetailsContent />
    </Suspense>
  );
}
