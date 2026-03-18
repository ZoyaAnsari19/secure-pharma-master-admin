"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  Banknote,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Hash,
  ThumbsDown,
  ThumbsUp,
  User,
  Wallet,
  XCircle,
} from "lucide-react";

type WithdrawStatus = "Pending" | "Approved" | "Rejected" | "Paid";
type UserRole = "Retailer" | "Distributor" | "Franchise" | "Agent";
type PaymentMethod = "UPI" | "Bank Transfer" | "Wallet" | "Card";

type WithdrawalRequestRow = {
  id: string;
  user: string;
  role: UserRole;
  amountInr: number;
  paymentMethod: PaymentMethod;
  status: WithdrawStatus;
  date: string; // YYYY-MM-DD

  walletBalanceInr: number;
  payout: {
    upiId?: string;
    bank?: {
      accountHolder: string;
      accountNumberMasked: string;
      ifsc: string;
      bankName: string;
    };
  };
  transactions: Array<{
    id: string;
    type: "Credit" | "Debit";
    source: string;
    amountInr: number;
    date: string; // YYYY-MM-DD
    status: "Success" | "Pending" | "Failed";
  }>;
};

const initialRequests: WithdrawalRequestRow[] = [
  {
    id: "WD-1208",
    user: "Aditi Sharma",
    role: "Retailer",
    amountInr: 2500,
    paymentMethod: "UPI",
    status: "Pending",
    date: "2026-03-14",
    walletBalanceInr: 8720,
    payout: { upiId: "aditi.sharma@upi" },
    transactions: [
      { id: "TXN-8841", type: "Credit", source: "Order commission", amountInr: 1200, date: "2026-03-11", status: "Success" },
      { id: "TXN-8849", type: "Credit", source: "Referral bonus", amountInr: 800, date: "2026-03-12", status: "Success" },
      { id: "TXN-8856", type: "Debit", source: "Withdrawal request", amountInr: 2500, date: "2026-03-14", status: "Pending" },
    ],
  },
  {
    id: "WD-1206",
    user: "Imran Ali",
    role: "Agent",
    amountInr: 6000,
    paymentMethod: "UPI",
    status: "Pending",
    date: "2026-03-13",
    walletBalanceInr: 15400,
    payout: { upiId: "imran.ali@upi" },
    transactions: [
      { id: "TXN-8820", type: "Credit", source: "Agent incentive", amountInr: 4200, date: "2026-03-10", status: "Success" },
      { id: "TXN-8833", type: "Credit", source: "Lead conversion", amountInr: 2100, date: "2026-03-12", status: "Success" },
      { id: "TXN-8839", type: "Debit", source: "Withdrawal request", amountInr: 6000, date: "2026-03-13", status: "Pending" },
    ],
  },
  {
    id: "WD-1201",
    user: "Rahul Verma",
    role: "Retailer",
    amountInr: 12500,
    paymentMethod: "Bank Transfer",
    status: "Approved",
    date: "2026-03-10",
    walletBalanceInr: 22650,
    payout: {
      bank: {
        accountHolder: "Rahul Verma",
        accountNumberMasked: "XXXXXX3489",
        ifsc: "HDFC0000123",
        bankName: "HDFC Bank",
      },
    },
    transactions: [
      { id: "TXN-8712", type: "Credit", source: "Retail margin", amountInr: 9200, date: "2026-03-06", status: "Success" },
      { id: "TXN-8729", type: "Credit", source: "Incentive", amountInr: 6000, date: "2026-03-08", status: "Success" },
      { id: "TXN-8734", type: "Debit", source: "Withdrawal request", amountInr: 12500, date: "2026-03-10", status: "Success" },
    ],
  },
  {
    id: "WD-1193",
    user: "Sara Khan",
    role: "Distributor",
    amountInr: 50000,
    paymentMethod: "Bank Transfer",
    status: "Paid",
    date: "2026-03-05",
    walletBalanceInr: 104200,
    payout: {
      bank: {
        accountHolder: "Sara Khan",
        accountNumberMasked: "XXXXXX9921",
        ifsc: "ICIC0000456",
        bankName: "ICICI Bank",
      },
    },
    transactions: [
      { id: "TXN-8602", type: "Credit", source: "Distributor payout", amountInr: 80000, date: "2026-03-02", status: "Success" },
      { id: "TXN-8617", type: "Debit", source: "Withdrawal paid", amountInr: 50000, date: "2026-03-05", status: "Success" },
    ],
  },
  {
    id: "WD-1188",
    user: "Vikram Mehta",
    role: "Franchise",
    amountInr: 8000,
    paymentMethod: "Wallet",
    status: "Rejected",
    date: "2026-03-03",
    walletBalanceInr: 4500,
    payout: {},
    transactions: [
      { id: "TXN-8544", type: "Credit", source: "Franchise earnings", amountInr: 6500, date: "2026-03-01", status: "Success" },
      { id: "TXN-8550", type: "Debit", source: "Withdrawal request", amountInr: 8000, date: "2026-03-03", status: "Failed" },
    ],
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getStatusSteps(row: WithdrawalRequestRow) {
  if (row.status === "Rejected") {
    return {
      steps: [
        { label: "Requested", description: "Withdrawal request created" },
        { label: "Rejected", description: "Request declined by admin" },
      ],
      activeIndex: 1,
      variant: "rejected" as const,
    };
  }

  const steps = [
    { label: "Requested", description: "Request submitted by user" },
    { label: "Approved", description: "Approved by admin" },
    { label: "Paid", description: "Payout completed" },
  ];

  let activeIndex = 0;
  if (row.status === "Approved") activeIndex = 1;
  if (row.status === "Paid") activeIndex = 2;
  return { steps, activeIndex, variant: "default" as const };
}

function pillForStatus(status: WithdrawalRequestRow["status"]) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium";
  const map: Record<WithdrawalRequestRow["status"], { className: string; icon: React.ReactNode }> = {
    Pending: { className: "bg-amber-50 text-amber-700", icon: <Clock className="mr-1 h-3 w-3" /> },
    Approved: { className: "bg-sky-50 text-sky-700", icon: <CheckCircle2 className="mr-1 h-3 w-3" /> },
    Rejected: { className: "bg-rose-50 text-rose-700", icon: <XCircle className="mr-1 h-3 w-3" /> },
    Paid: { className: "bg-emerald-50 text-emerald-700", icon: <BadgeCheck className="mr-1 h-3 w-3" /> },
  };
  const { className, icon } = map[status];
  return (
    <span className={`${base} ${className}`}>
      {icon}
      {status}
    </span>
  );
}

function pillForTxnStatus(status: "Success" | "Pending" | "Failed") {
  const styles =
    status === "Success"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Pending"
        ? "bg-amber-50 text-amber-700"
        : "bg-rose-50 text-rose-700";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styles}`}>
      {status}
    </span>
  );
}

function pillForRole(role: WithdrawalRequestRow["role"]) {
  const styles =
    role === "Retailer"
      ? "bg-violet-50 text-violet-700"
      : role === "Distributor"
        ? "bg-sky-50 text-sky-700"
        : role === "Franchise"
          ? "bg-amber-50 text-amber-700"
          : "bg-emerald-50 text-emerald-700";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styles}`}>
      {role}
    </span>
  );
}

export default function WithdrawRequestDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("id") ?? "";

  const [requests, setRequests] = useState<WithdrawalRequestRow[]>(initialRequests);

  const request = useMemo(
    () => (requestId ? requests.find((r) => r.id === requestId) ?? null : null),
    [requestId, requests]
  );

  const approveRequest = () => {
    if (!request) return;
    setRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status: "Approved" } : r)));
  };

  const rejectRequest = () => {
    if (!request) return;
    setRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status: "Rejected" } : r)));
  };

  const markPaid = () => {
    if (!request) return;
    setRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status: "Paid" } : r)));
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                  Withdraw Request Details
                </h1>
                <p className="text-xs text-gray-500">
                  {request ? `${request.id} · ${request.user}` : "Request not found"}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => router.back()}
              >
                <ChevronLeft className="mr-1.5 h-4 w-4" />
                Back
              </Button>
            </div>

            {!request ? (
              <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-600">
                No request found for ID: <span className="font-semibold text-gray-900">{requestId || "—"}</span>
              </div>
            ) : (
              <>
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="space-y-6 lg:col-span-2">
                    {/* Request details */}
                    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                      <h2 className="text-sm font-semibold text-gray-900">Request details</h2>
                      <p className="mt-1 text-xs text-gray-500">Core request metadata and current state.</p>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                              <Hash className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Request ID</p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">{request.id}</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-200/80 text-gray-500">
                              <Calendar className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Requested on</p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">{formatDate(request.date)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                              <Banknote className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Amount</p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">{formatInr(request.amountInr)}</p>
                              <p className="mt-1 text-xs text-gray-500">Method: <span className="font-medium text-gray-700">{request.paymentMethod}</span></p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                              <BadgeCheck className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Status</p>
                              <div className="mt-1">{pillForStatus(request.status)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* User information */}
                    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                      <h2 className="text-sm font-semibold text-gray-900">User information</h2>
                      <p className="mt-1 text-xs text-gray-500">Requester identity snapshot.</p>

                      <div className="mt-4 flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                          <User className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1 space-y-1 text-sm text-gray-800">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="min-w-0 truncate">
                              <span className="font-medium text-gray-600">Name</span>
                              {": "}
                              <span className="font-semibold text-gray-900">{request.user}</span>
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-600">Role:</span>
                              {pillForRole(request.role)}
                            </div>
                          </div>
                          <p className="text-gray-700">
                            <span className="font-medium text-gray-600">Email</span>
                            {": "}
                            <span className="font-semibold text-gray-900">{request.user.toLowerCase().replace(/\s+/g, ".")}@example.com</span>
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Transaction history */}
                    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                      <h2 className="text-sm font-semibold text-gray-900">Transaction history</h2>
                      <p className="mt-1 text-xs text-gray-500">Wallet ledger entries associated with this request.</p>

                      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <table className="w-full border-collapse text-sm text-slate-700">
                          <thead className="bg-gray-50 text-xs font-semibold text-gray-600">
                            <tr>
                              <th className="px-4 py-3 text-left">Txn ID</th>
                              <th className="px-4 py-3 text-left">Type</th>
                              <th className="px-4 py-3 text-left">Source</th>
                              <th className="px-4 py-3 text-left">Amount</th>
                              <th className="px-4 py-3 text-left">Status</th>
                              <th className="px-4 py-3 text-left">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {request.transactions.map((t) => (
                              <tr key={t.id} className="hover:bg-pink-50/40">
                                <td className="px-4 py-3 text-xs font-semibold text-gray-800">{t.id}</td>
                                <td className="px-4 py-3 text-xs text-gray-600">{t.type}</td>
                                <td className="px-4 py-3 text-xs text-gray-600">{t.source}</td>
                                <td className="px-4 py-3 text-xs font-semibold text-gray-900">
                                  {t.type === "Debit" ? "-" : "+"}{formatInr(t.amountInr)}
                                </td>
                                <td className="px-4 py-3 text-xs">{pillForTxnStatus(t.status)}</td>
                                <td className="px-4 py-3 text-xs text-gray-600">{formatDate(t.date)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </div>

                  <aside className="space-y-6">
                    {/* Wallet */}
                    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                      <h2 className="text-sm font-semibold text-gray-900">Wallet</h2>
                      <p className="mt-1 text-xs text-gray-500">Balance snapshot for review.</p>

                      <div className="mt-4 flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                          <Wallet className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Available balance</p>
                          <p className="mt-0.5 text-sm font-semibold text-gray-900">{formatInr(request.walletBalanceInr)}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            Requested: <span className="font-semibold text-gray-800">{formatInr(request.amountInr)}</span>
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Payment details */}
                    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                      <h2 className="text-sm font-semibold text-gray-900">Payment details</h2>
                      <p className="mt-1 text-xs text-gray-500">Payout destination for processing.</p>

                      <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <p className="text-sm text-gray-800">
                          <span className="font-medium text-gray-600">Method:</span>{" "}
                          <span className="font-semibold text-gray-900">{request.paymentMethod}</span>
                        </p>
                        {request.paymentMethod === "UPI" && request.payout.upiId ? (
                          <p className="mt-1 text-xs text-gray-500">
                            UPI ID: <span className="font-medium text-gray-700">{request.payout.upiId}</span>
                          </p>
                        ) : null}
                        {request.paymentMethod === "Bank Transfer" && request.payout.bank ? (
                          <div className="mt-2 space-y-1 text-xs text-gray-500">
                            <p>
                              A/C Holder: <span className="font-medium text-gray-700">{request.payout.bank.accountHolder}</span>
                            </p>
                            <p>
                              Account: <span className="font-medium text-gray-700">{request.payout.bank.accountNumberMasked}</span>
                            </p>
                            <p>
                              IFSC: <span className="font-medium text-gray-700">{request.payout.bank.ifsc}</span>
                            </p>
                            <p>
                              Bank: <span className="font-medium text-gray-700">{request.payout.bank.bankName}</span>
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </section>

                    {/* Status tracking */}
                    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                      <h2 className="text-sm font-semibold text-gray-900">Status tracking</h2>
                      <p className="mt-1 text-xs text-gray-500">Expected flow for admin actions.</p>

                      <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        {(() => {
                          const { steps, activeIndex, variant } = getStatusSteps(request);
                          return (
                            <ol className="space-y-3">
                              {steps.map((step, idx) => {
                                const isDone = idx < activeIndex;
                                const isActive = idx === activeIndex;
                                const dotClass =
                                  variant === "rejected"
                                    ? idx === activeIndex
                                      ? "bg-rose-500 ring-rose-200"
                                      : "bg-gray-300 ring-gray-200"
                                    : isDone
                                      ? "bg-emerald-500 ring-emerald-200"
                                      : isActive
                                        ? "bg-pink-500 ring-pink-200"
                                        : "bg-gray-300 ring-gray-200";
                                const lineClass =
                                  variant === "rejected"
                                    ? "bg-gray-200"
                                    : isDone
                                      ? "bg-emerald-200"
                                      : "bg-gray-200";

                                return (
                                  <li key={step.label} className="flex items-start gap-3">
                                    <div className="flex flex-col items-center">
                                      <span className={`mt-1 h-3.5 w-3.5 rounded-full ring-4 ${dotClass}`} />
                                      {idx !== steps.length - 1 && (
                                        <span className={`mt-1 h-8 w-0.5 ${lineClass}`} />
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-gray-900">{step.label}</p>
                                        {idx === activeIndex && (
                                          <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-semibold text-pink-700 ring-1 ring-pink-100">
                                            <BadgeCheck className="h-3 w-3" />
                                            Current
                                          </span>
                                        )}
                                      </div>
                                      <p className="mt-0.5 text-xs text-gray-500">{step.description}</p>
                                    </div>
                                  </li>
                                );
                              })}
                            </ol>
                          );
                        })()}
                      </div>
                    </section>
                  </aside>
                </div>

                {/* Fixed footer actions */}
                <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/80 bg-white/95 px-4 py-4 backdrop-blur md:ml-64">
                  <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Current status</span>
                      {pillForStatus(request.status)}
                    </div>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={request.status !== "Pending"}
                        onClick={rejectRequest}
                      >
                        <ThumbsDown className="mr-2 h-4 w-4 text-rose-600" />
                        Reject
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={request.status !== "Pending"}
                        onClick={approveRequest}
                      >
                        <ThumbsUp className="mr-2 h-4 w-4 text-emerald-600" />
                        Approve
                      </Button>
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