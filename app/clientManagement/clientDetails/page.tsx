"use client";

import { Button } from "@/components/ui/button";
import { SideBar } from "@/components/sideBar";
import { TopBar } from "@/components/topBar";
import { KpiCards } from "@/components/ui/kpiCards";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  FileText,
  Globe2,
  History,
  Mail,
  Phone,
  ShieldCheck,
  ShoppingBag,
  User,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesPerformanceData = [
  { month: "Oct", orders: 45, products: 120, revenue: 3.8 },
  { month: "Nov", orders: 62, products: 150, revenue: 4.4 },
  { month: "Dec", orders: 71, products: 176, revenue: 5.2 },
  { month: "Jan", orders: 58, products: 160, revenue: 4.7 },
  { month: "Feb", orders: 66, products: 181, revenue: 5.5 },
  { month: "Mar", orders: 74, products: 196, revenue: 6.1 },
];

export default function ClientDetailsPage() {
  const [activeTab, setActiveTab] = useState<
    | "clientInfo"
    | "kyc"
    | "subscription"
    | "usage"
    | "documents"
    | "activity"
  >("clientInfo");

  const [hasMounted, setHasMounted] = useState(false);
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    try {
      const url = new URL(window.location.href);
      const idParam = url.searchParams.get("id");
      if (!idParam) {
        setClient(null);
        return;
      }

      const id = Number(idParam);
      if (!Number.isFinite(id)) {
        setClient(null);
        return;
      }

      const raw = window.localStorage.getItem("super-admin.clients.v1");
      if (!raw) {
        setClient(null);
        return;
      }
      const parsed = JSON.parse(raw) as Array<any>;
      if (!Array.isArray(parsed)) {
        setClient(null);
        return;
      }
      setClient(parsed.find((c) => Number(c?.id) === id) ?? null);
    } catch {
      setClient(null);
    }
  }, [hasMounted]);

  const clientName = hasMounted ? client?.clientName ?? "Client" : "Client";
  const companyName = hasMounted ? client?.brandName ?? "—" : "—";
  const domain = hasMounted ? client?.websiteDomain ?? "—" : "—";
  const plan = hasMounted ? client?.plan ?? "—" : "—";
  const status: "Active" | "Suspended" | "Expiring" | "Inactive" = hasMounted
    ? (client?.status ?? "Inactive")
    : "Inactive";

  const admin = {
    name: hasMounted ? client?.clientName ?? "—" : "—",
    email: hasMounted ? client?.adminEmail ?? client?.clientEmail ?? "—" : "—",
    phone: hasMounted
      ? client?.clientPhone
        ? `+91 ${client.clientPhone}`
        : "—"
      : "—",
    location: "—",
    lastLogin: "—",
    adminUrl: domain !== "—" ? `https://${domain}/admin` : "#",
  };

  const subscription = {
    planName: "Premium - Annual",
    startDate: "01 Mar 2025",
    expiryDate: "29 Feb 2026",
    billingStatus: "Paid - Auto renew enabled",
  };

  const companyDetails = {
    companyName,
    businessType: "Salon / Studio",
    industry: "Beauty & Wellness",
    teamSize: "10–25",
    companyAddress: "—",
    country: "India",
    state: "—",
    city: "—",
    postalCode: "—",
  };

  const kyc = {
    status: "Pending" as "Pending" | "Verified" | "Rejected",
    updatedAt: "Today, 11:12 AM",
    docs: [
      { name: "PAN Card", file: "pan_card.pdf", status: "Uploaded" as const },
      { name: "Aadhar Card", file: "aadhar_card.pdf", status: "Uploaded" as const },
      { name: "GST Certificate", file: "gst_certificate.pdf", status: "Uploaded" as const },
      { name: "Address Proof", file: "address_proof.pdf", status: "Missing" as const },
    ],
  };

  const billingHistory = [
    { id: "INV-1042", date: "01 Mar 2025", amount: "₹ 29,999", status: "Paid" },
    { id: "INV-0987", date: "01 Mar 2024", amount: "₹ 29,999", status: "Paid" },
    { id: "INV-0874", date: "01 Mar 2023", amount: "₹ 24,999", status: "Paid" },
  ];

  const subscriptionBillingHistory = [
    {
      invoiceId: "INV-1042",
      itemName: "Premium Plan (Annual)",
      cycle: "Annual",
      method: "UPI",
      amountInr: 29999,
      status: "Paid" as const,
      date: "01 Mar 2025",
    },
    {
      invoiceId: "INV-1031",
      itemName: "Add-on: Extra Staff Seats (10)",
      cycle: "One-time",
      method: "Card",
      amountInr: 4999,
      status: "Paid" as const,
      date: "15 Feb 2025",
    },
    {
      invoiceId: "INV-1022",
      itemName: "Upgrade: Standard → Premium",
      cycle: "Prorated",
      method: "NetBanking",
      amountInr: 7999,
      status: "Paid" as const,
      date: "01 Jan 2025",
    },
    {
      invoiceId: "INV-1015",
      itemName: "Refund: Add-on chargeback",
      cycle: "Refund",
      method: "UPI",
      amountInr: -1499,
      status: "Refunded" as const,
      date: "20 Dec 2024",
    },
    {
      invoiceId: "INV-1008",
      itemName: "Premium Plan Renewal (Monthly)",
      cycle: "Monthly",
      method: "Card",
      amountInr: 2999,
      status: "Failed" as const,
      date: "01 Dec 2024",
    },
    {
      invoiceId: "INV-1007",
      itemName: "Premium Plan Renewal (Monthly)",
      cycle: "Monthly",
      method: "Card",
      amountInr: 2999,
      status: "Pending" as const,
      date: "01 Nov 2024",
    },
  ];

  const billingSummary = useMemo(() => {
    const totalPaid = subscriptionBillingHistory.reduce((sum, r) => {
      if (r.status !== "Paid") return sum;
      return sum + Math.max(0, r.amountInr);
    }, 0);

    const lastPayment =
      subscriptionBillingHistory.find((r) => r.status === "Paid") ?? null;

    return {
      totalPaidInr: totalPaid,
      lastPayment,
      nextBillingDate: subscription.expiryDate,
    };
  }, [subscription.expiryDate, subscriptionBillingHistory]);

  const usageMetrics = [
    { label: "API Requests", value: "128,540", hint: "+12% (30d)" },
    { label: "Storage Used", value: "3.2 GB", hint: "of 10 GB" },
    { label: "Active Staff", value: "26", hint: "assigned" },
    { label: "Orders (30d)", value: "312", hint: "processed" },
  ];

  const documents = [
    { name: "Agreement", type: "PDF", updated: "12 Feb 2025" },
    { name: "Brand Assets", type: "ZIP", updated: "05 Jan 2025" },
    { name: "KYC Bundle", type: "PDF", updated: "Today" },
  ];

  const activityLogs = [
    { at: "Today, 11:12 AM", event: "KYC review initiated", by: "Super Admin" },
    { at: "Yesterday, 05:24 PM", event: "Subscription renewed", by: "System" },
    { at: "Yesterday, 04:10 PM", event: "Client status changed to Active", by: "Operations" },
    { at: "12 Feb 2025, 10:02 AM", event: "Updated company details", by: "Super Admin" },
  ];

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
            <div className="flex flex-col gap-4">
              <div className="space-y-3">
                <div className="relative flex items-center justify-between gap-2">
                  <Link
                    href="/clientManagement"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-pink-500 hover:text-pink-600"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to clients
                  </Link>
                  <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2">
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
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Website
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Open Admin Panel
                    </Button>
                  </div>
                </div>
                {hasMounted && !client && (
                  <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-rose-100">
                    <p className="text-sm font-semibold text-gray-900">
                      Client not found
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Please go back and select a client again.
                    </p>
                  </div>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <p className="text-xs font-medium text-gray-800">{companyName}</p>
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

            {/* Overview cards */}
            <KpiCards items={overviewItems} />

            {/* Tabs */}
            <div className="space-y-4">
              <div className="sticky top-16 z-20 -mx-4 border-b border-gray-200 bg-gray-50/80 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="flex gap-2 overflow-x-auto py-2">
                  {[
                    { id: "clientInfo", label: "Client Information" },
                    { id: "kyc", label: "KYC Verification" },
                    { id: "subscription", label: "Subscription" },
                    { id: "usage", label: "Usage & Analytics" },
                    { id: "documents", label: "Documents" },
                    { id: "activity", label: "Activity Logs" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as typeof activeTab)}
                      className={
                        "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition " +
                        (activeTab === (t.id as typeof activeTab)
                          ? "bg-pink-500 text-white shadow-sm"
                          : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-pink-50 hover:ring-pink-100")
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              {activeTab === "clientInfo" && (
                <div className="space-y-6">
                  <section className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">
                          Client Information
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                          Contact details and primary identity for this client.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                          Primary admin
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Client name
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                          <User className="h-3.5 w-3.5 text-pink-500" />
                          {admin.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Client email
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-gray-900">
                          <Mail className="h-3.5 w-3.5 text-pink-500" />
                          {admin.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Phone number
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-gray-900">
                          <Phone className="h-3.5 w-3.5 text-pink-500" />
                          {admin.phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Company name
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-gray-900">
                          <Building2 className="h-3.5 w-3.5 text-pink-500" />
                          {companyName}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Status
                        </p>
                        <span
                          className={
                            "mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium " +
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
                    </div>
                  </section>

                  <section className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">
                          Company Details
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                          Business information for this client account.
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 space-y-5">
                      <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Company Name
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {companyDetails.companyName}
                        </p>
                        </div>
                        <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Business Type
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {companyDetails.businessType}
                        </p>
                        </div>
                        <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Industry
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {companyDetails.industry}
                        </p>
                        </div>
                        <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Team Size
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {companyDetails.teamSize}
                        </p>
                        </div>
                      </div>
                      <div className="h-px bg-gray-100" />
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Company Address
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {companyDetails.companyAddress}
                        </p>
                      </div>
                      <div className="h-px bg-gray-100" />
                      <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Country
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {companyDetails.country}
                        </p>
                        </div>
                        <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          State
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {companyDetails.state}
                        </p>
                        </div>
                        <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          City
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {companyDetails.city}
                        </p>
                        </div>
                        <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Postal Code
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {companyDetails.postalCode}
                        </p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "kyc" && (
                <section className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">
                        KYC Verification
                      </h2>
                      <p className="mt-1 text-xs text-gray-500">
                        Review and verify business documents for compliance.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 " +
                          (kyc.status === "Verified"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200/60"
                            : kyc.status === "Rejected"
                            ? "bg-rose-50 text-rose-700 ring-rose-200/60"
                            : "bg-amber-50 text-amber-700 ring-amber-200/60")
                        }
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {kyc.status}
                      </span>
                      <Button variant="outline" size="sm">
                        Upload document
                      </Button>
                      <Button variant="primary" size="sm" className="gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        Verify
                      </Button>
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-gray-100">
                    <div className="bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600">
                      Uploaded documents
                    </div>
                    <div className="divide-y divide-gray-100 bg-white">
                      {kyc.docs.map((d) => (
                        <div key={d.name} className="flex items-center justify-between gap-3 px-4 py-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {d.name}
                            </p>
                            <p className="truncate text-xs text-gray-500">{d.file}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={
                                "rounded-full px-2.5 py-0.5 text-[11px] font-medium " +
                                (d.status === "Uploaded"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-50 text-slate-600")
                              }
                            >
                              {d.status}
                            </span>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "subscription" && (
                <div className="space-y-6">
                  <section className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">
                          Subscription
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                          Plan details, expiry date, and renewal controls.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Change plan
                        </Button>
                        <Button variant="primary" size="sm">
                          Renew
                        </Button>
                      </div>
                    </div>

                    <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-gray-100">
                        <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Plan name
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-gray-900">
                          {subscription.planName}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-gray-100">
                        <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Subscription start
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-gray-900">
                          {subscription.startDate}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-gray-100">
                        <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Expiry date
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-gray-900">
                          {subscription.expiryDate}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-gray-100">
                        <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                          Billing status
                        </dt>
                        <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                          <ShieldCheck className="h-4 w-4" />
                          {subscription.billingStatus}
                        </dd>
                      </div>
                    </dl>
                  </section>

                  <section className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">
                          Billing & Payments History
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                          Subscription billing history including upgrades, add-ons, and refunds.
                        </p>
                      </div>
                      <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-3 sm:gap-3">
                        <div className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-gray-100">
                          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                            Total paid
                          </p>
                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            ₹ {billingSummary.totalPaidInr.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-gray-100">
                          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                            Last payment
                          </p>
                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {billingSummary.lastPayment
                              ? `${billingSummary.lastPayment.date} • ₹ ${billingSummary.lastPayment.amountInr.toLocaleString(
                                  "en-IN"
                                )}`
                              : "—"}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-gray-100">
                          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                            Next billing
                          </p>
                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {billingSummary.nextBillingDate}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-gray-100">
                      <div className="grid grid-cols-7 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600">
                        <span>Invoice</span>
                        <span className="col-span-2">Item / plan</span>
                        <span>Cycle</span>
                        <span>Method</span>
                        <span>Amount</span>
                        <span className="text-right">Status</span>
                      </div>
                      <div className="divide-y divide-gray-100 bg-white">
                        {subscriptionBillingHistory.map((r) => (
                          <div
                            key={r.invoiceId}
                            className="grid grid-cols-7 items-center gap-3 px-4 py-3"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-gray-900">
                                {r.invoiceId}
                              </p>
                              <p className="text-xs text-gray-500">{r.date}</p>
                            </div>
                            <div className="col-span-2 min-w-0">
                              <p className="truncate text-sm text-gray-700">
                                {r.itemName}
                              </p>
                            </div>
                            <span className="text-sm text-gray-600">{r.cycle}</span>
                            <span className="text-sm text-gray-600">{r.method}</span>
                            <span className="text-sm text-gray-700">
                              ₹ {Math.abs(r.amountInr).toLocaleString("en-IN")}
                            </span>
                            <div className="flex items-center justify-end gap-2">
                              <span
                                className={
                                  "rounded-full px-2.5 py-0.5 text-[11px] font-medium " +
                                  (r.status === "Paid"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : r.status === "Pending"
                                    ? "bg-amber-50 text-amber-700"
                                    : r.status === "Refunded"
                                    ? "bg-sky-50 text-sky-700"
                                    : "bg-rose-50 text-rose-700")
                                }
                              >
                                {r.status}
                              </span>
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "usage" && (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                  <section className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-sm font-semibold text-gray-900">
                        Usage & Analytics
                      </h2>
                      <span className="text-xs text-gray-500">Last 6 months</span>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="h-1.5 w-5 rounded-full bg-pink-500" />
                          Orders
                        </div>
                        <div className="inline-flex items-center gap-1.5">
                          <span className="h-1.5 w-5 rounded-full bg-rose-400" />
                          Products sold
                        </div>
                        <div className="inline-flex items-center gap-1.5">
                          <span className="h-1.5 w-5 rounded-full bg-amber-400" />
                          Revenue (₹L)
                        </div>
                      </div>
                      <div className="mt-1 h-64 rounded-xl bg-slate-50 px-3 pb-4 pt-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={salesPerformanceData}
                            margin={{ left: -12, right: 4, top: 10, bottom: 0 }}
                            barCategoryGap="18%"
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#fce0ec"
                              vertical={false}
                            />
                            <XAxis
                              dataKey="month"
                              axisLine={false}
                              tickLine={false}
                              tickMargin={8}
                              tick={{ fontSize: 11, fill: "#9f8ca5" }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tickMargin={8}
                              tick={{ fontSize: 11, fill: "#9f8ca5" }}
                            />
                            <Tooltip
                              formatter={(value: number, name: string) => {
                                if (name === "Revenue") {
                                  return [`₹ ${value.toFixed(1)}L`, "Revenue"];
                                }
                                if (name === "Products sold") {
                                  return [value, "Products sold"];
                                }
                                return [value, "Orders"];
                              }}
                              labelFormatter={(label) => `Month: ${label}`}
                              contentStyle={{
                                borderRadius: 16,
                                borderColor: "#f9ccd9",
                                boxShadow: "0 18px 45px rgba(236,90,135,0.1)",
                                fontSize: 11,
                              }}
                            />
                            <Bar
                              dataKey="orders"
                              name="Orders"
                              radius={[6, 6, 0, 0]}
                              barSize={12}
                              fill="#ec5a87"
                            />
                            <Bar
                              dataKey="products"
                              name="Products sold"
                              radius={[6, 6, 0, 0]}
                              barSize={12}
                              fill="#fb7185"
                            />
                            <Bar
                              dataKey="revenue"
                              name="Revenue"
                              radius={[6, 6, 0, 0]}
                              barSize={12}
                              fill="#fbbf24"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">
                        System usage
                      </h3>
                      <Button variant="outline" size="sm">
                        View report
                      </Button>
                    </div>
                    <div className="mt-4 grid gap-3">
                      {usageMetrics.map((m) => (
                        <div
                          key={m.label}
                          className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-gray-100"
                        >
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                              {m.label}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">
                              {m.value}
                            </p>
                          </div>
                          <p className="text-xs font-medium text-gray-500">
                            {m.hint}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "documents" && (
                <section className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">
                        Documents
                      </h2>
                      <p className="mt-1 text-xs text-gray-500">
                        Agreements, assets, and verification bundles.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Upload
                    </Button>
                  </div>

                  <div className="mt-5 divide-y divide-gray-100 overflow-hidden rounded-2xl ring-1 ring-gray-100">
                    {documents.map((d) => (
                      <div key={d.name} className="flex items-center justify-between gap-3 bg-white px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {d.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {d.type} • Updated {d.updated}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === "activity" && (
                <section className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">
                        Activity Logs
                      </h2>
                      <p className="mt-1 text-xs text-gray-500">
                        Audit trail of actions performed on this client.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <History className="h-4 w-4" />
                      Export
                    </Button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {activityLogs.map((log, idx) => (
                      <div
                        key={`${log.at}-${idx}`}
                        className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-gray-100"
                      >
                        <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                          <Clock className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {log.event}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {log.at} • by {log.by}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

