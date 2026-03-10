"use client";

import { Button } from "@/components/ui/button";
import { SideBar } from "@/components/sideBar";
import { TopBar } from "@/components/topBar";
import { KpiCards } from "@/components/ui/kpiCards";
import { DataTable, Column } from "@/components/ui/table";
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  Globe2,
  Mail,
  ShieldCheck,
  ShoppingBag,
  User,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";

type Activity = {
  id: number;
  type: string;
  description: string;
  actor: string;
  timestamp: string;
};

const activityColumns: Column<Activity>[] = [
  {
    key: "type",
    label: "Activity",
  },
  {
    key: "description",
    label: "Details",
  },
  {
    key: "actor",
    label: "Performed By",
  },
  {
    key: "timestamp",
    label: "When",
  },
];

const mockActivities: Activity[] = [
  {
    id: 1,
    type: "Admin Login",
    description: "Primary admin logged into dashboard",
    actor: "Priya Sharma",
    timestamp: "Today, 10:24 AM",
  },
  {
    id: 2,
    type: "Order Placed",
    description: "New order #TB-10423 created",
    actor: "Client Storefront",
    timestamp: "Today, 09:51 AM",
  },
  {
    id: 3,
    type: "Product Update",
    description: "Updated pricing for 6 products",
    actor: "Priya Sharma",
    timestamp: "Yesterday, 05:12 PM",
  },
  {
    id: 4,
    type: "Subscription",
    description: "Plan renewed to Premium (12 months)",
    actor: "System",
    timestamp: "Mar 01, 2026",
  },
];

export default function ClientDetailsPage() {
  const clientName = "Glow Studio Mumbai";
  const companyName = "True Beauty Glow Studio";
  const domain = "mumbai.glow.truebeauty.in";
  const plan = "Premium";
  const status: "Active" | "Suspended" | "Expiring" | "Inactive" = "Active";

  const admin = {
    name: "Priya Sharma",
    email: "admin@mumbaiglow.in",
    lastLogin: "Today, 10:24 AM from Mumbai, India",
    adminUrl: "https://mumbai.glow.truebeauty.in/admin",
  };

  const subscription = {
    planName: "Premium - Annual",
    startDate: "01 Mar 2025",
    expiryDate: "29 Feb 2026",
    billingStatus: "Paid - Auto renew enabled",
  };

  const overviewItems = [
    {
      title: "Total Users",
      value: "1,248",
      delta: "+68 this month",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Total Orders",
      value: "3,942",
      delta: "+312 this month",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      title: "Total Products",
      value: "186",
      delta: "Catalog items",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      title: "Total Revenue",
      value: "₹ 48.9L",
      delta: "LTV across all orders",
      icon: <Wallet className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <SideBar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <Link
                  href="/clientManagement"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-pink-500 hover:text-pink-600"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to clients
                </Link>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                        {clientName}
                      </h1>
                      <span
                        className={
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium " +
                          (status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : status === "Suspended"
                            ? "bg-rose-50 text-rose-700"
                            : status === "Expiring"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-50 text-slate-600")
                        }
                      >
                        {status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs font-medium text-gray-500">
                      {companyName}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] text-gray-600 ring-1 ring-gray-100">
                        <Globe2 className="h-3.5 w-3.5 text-pink-500" />
                        {domain}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-2.5 py-1 text-[11px] font-medium text-pink-700 ring-1 ring-pink-100">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {plan} Plan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Quick actions */}
              <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open Website
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Open Admin Panel
                </Button>
                <Button variant="primary" size="sm" className="gap-1.5">
                  Edit Client
                </Button>
              </div>
            </div>

            {/* Overview cards */}
            <KpiCards items={overviewItems} />

            {/* Detail grid */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
              {/* Left column */}
              <div className="space-y-6">
                {/* Admin information */}
                <section className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold text-gray-900">
                      Client Information
                    </h2>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                      Primary admin
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Client name
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-gray-900">
                          <User className="h-3.5 w-3.5 text-pink-500" />
                          {admin.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Client email
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-gray-700">
                          <Mail className="h-3.5 w-3.5 text-pink-500" />
                          {admin.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Last login
                        </p>
                        <p className="mt-1 text-sm text-gray-700">
                          {admin.lastLogin}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Admin panel URL
                        </p>
                        <Link
                          href={admin.adminUrl}
                          target="_blank"
                          className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-pink-600 hover:text-pink-700"
                        >
                          {admin.adminUrl}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Activity logs */}
                <section className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold text-gray-900">
                      Activity Logs
                    </h2>
                    <p className="text-xs text-gray-400">
                      Last 30 days of client activity
                    </p>
                  </div>
                  <div className="mt-4">
                    <DataTable<Activity>
                      title="Recent activity"
                      columns={activityColumns}
                      data={mockActivities}
                      searchPlaceholder="Search in activity log..."
                      pageSize={5}
                      hideFiltersButton
                    />
                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Subscription details */}
                <section className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Subscription Details
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Plan and billing information for this client.
                  </p>
                  <dl className="mt-4 space-y-4 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Plan name
                        </dt>
                        <dd className="mt-1 font-medium text-gray-900">
                          {subscription.planName}
                        </dd>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-pink-50 px-2.5 py-0.5 text-[11px] font-medium text-pink-700 ring-1 ring-pink-100">
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        {plan}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Subscription start
                        </dt>
                        <dd className="mt-1 text-gray-800">
                          {subscription.startDate}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Expiry date
                        </dt>
                        <dd className="mt-1 text-gray-800">
                          {subscription.expiryDate}
                        </dd>
                      </div>
                    </div>
                    <div>
                      <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                        Billing status
                      </dt>
                      <dd className="mt-1 inline-flex items-center gap-1.5 text-sm text-emerald-700">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {subscription.billingStatus}
                      </dd>
                    </div>
                  </dl>
                </section>

                {/* Client metadata */}
                <section className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Client Metadata
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Snapshot of how this client is configured on True Beauty.
                  </p>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-gray-500">Join date</dt>
                      <dd className="font-medium text-gray-900">15 Jan 2024</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-gray-500">Region</dt>
                      <dd className="font-medium text-gray-900">
                        Mumbai, India
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-gray-500">Storefront URL</dt>
                      <dd className="inline-flex items-center gap-1.5 text-xs font-medium text-pink-600">
                        <Globe2 className="h-3.5 w-3.5" />
                        {domain}
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

