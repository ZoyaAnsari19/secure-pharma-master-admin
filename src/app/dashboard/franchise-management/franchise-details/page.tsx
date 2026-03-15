"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Store,
  Mail,
  Phone,
  MapPin,
  Building2,
  Hash,
  Truck,
  Wallet,
  Package,
  FileText,
} from "lucide-react";

const FRANCHISE_DETAILS_STORAGE_KEY = "franchiseDetailsView";

type FranchiseDetails = {
  id: number;
  franchiseId: string;
  name: string;
  companyName: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  gstNumber?: string;
  pinCode?: string;
  assignedDistributor: string;
  walletBalance: number;
  totalOrders: number;
  status: "Active" | "Inactive" | "Suspended";
};

function FranchiseDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [franchise, setFranchise] = useState<FranchiseDetails | null>(null);
  const [notFound, setNotFound] = useState(false);

  const loadFranchise = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(FRANCHISE_DETAILS_STORAGE_KEY);
      if (!raw) {
        setNotFound(true);
        return;
      }
      const data = JSON.parse(raw) as FranchiseDetails;
      if (id != null && String(data.id) !== id) {
        setNotFound(true);
        return;
      }
      setFranchise(data);
      setNotFound(false);
    } catch {
      setNotFound(true);
    }
  }, [id]);

  useEffect(() => {
    loadFranchise();
  }, [loadFranchise]);

  if (notFound || (!franchise && id)) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="beauty-scroll flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <Store className="h-7 w-7" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-800">Franchise not found</h2>
                <p className="mt-1 max-w-sm text-center text-sm text-gray-500">
                  The franchise may have been removed or the link is invalid. Go back to the list to
                  select a franchise.
                </p>
                <Button variant="outline" className="mt-6" asChild>
                  <Link href="/dashboard/franchise-management">Back to Franchise Management</Link>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!franchise) {
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
    franchise.status === "Active"
      ? "bg-emerald-50 text-emerald-700"
      : franchise.status === "Suspended"
        ? "bg-amber-50 text-amber-700"
        : "bg-gray-100 text-gray-600";

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
                  <Link href="/dashboard/franchise-management">
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
                    href="/dashboard/franchise-management"
                    className="text-gray-500 transition hover:text-gray-800"
                  >
                    Franchise Management
                  </Link>
                  <span className="text-gray-400">/</span>
                  <span className="font-medium text-gray-900">{franchise.name}</span>
                </nav>
              </div>
            </div>

            {/* Header card */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 bg-gradient-to-r from-pink-50 to-white px-6 py-6 sm:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                      <Store className="h-7 w-7 text-pink-500" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                        {franchise.name}
                      </h1>
                      <p className="mt-0.5 text-sm text-gray-600">{franchise.companyName}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles}`}
                        >
                          {franchise.status}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {franchise.franchiseId}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0" asChild>
                    <Link href="/dashboard/franchise-management">Back to list</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Detail cards grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Basic Info */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Basic Info
                  </h2>
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Franchise ID
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Hash className="h-3.5 w-3.5 text-gray-400" />
                      {franchise.franchiseId}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Franchise Name
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{franchise.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Company Name
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{franchise.companyName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      GST Number
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                      <FileText className="h-3.5 w-3.5 text-gray-400" />
                      {franchise.gstNumber ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Email
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <a
                        href={`mailto:${franchise.email}`}
                        className="text-pink-600 hover:underline"
                      >
                        {franchise.email}
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
                        href={`tel:${franchise.phone}`}
                        className="text-pink-600 hover:underline"
                      >
                        {franchise.phone}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Location & Distributor */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Location & Distributor
                  </h2>
                </div>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Assigned Distributor
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Truck className="h-3.5 w-3.5 text-gray-400" />
                      {franchise.assignedDistributor}
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        State & City
                      </dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        {franchise.state}, {franchise.city}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Pin Code
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-gray-900">
                        {franchise.pinCode ?? "—"}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>

              {/* Performance - full width, 3 in a row */}
              <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <Package className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Total Balance
                  </h2>
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Wallet Balance
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <Wallet className="h-4 w-4 text-gray-400" />
                      ₹{franchise.walletBalance.toLocaleString("en-IN")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Total Orders
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <Package className="h-4 w-4 text-gray-400" />
                      {franchise.totalOrders.toLocaleString("en-IN")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Status
                    </dt>
                    <dd className="mt-1">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles}`}
                      >
                        {franchise.status}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function FranchiseDetailsFallback() {
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

export default function FranchiseDetailsPage() {
  return (
    <Suspense fallback={<FranchiseDetailsFallback />}>
      <FranchiseDetailsContent />
    </Suspense>
  );
}
