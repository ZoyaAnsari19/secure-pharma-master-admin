"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { KpiCards } from "@/components/ui/kpiCards";
import { DataTable, type Column } from "@/components/ui/table";
import { FiltersBar } from "@/components/ui/filters";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  BadgeCheck,
  Banknote,
  CheckCircle2,
  Clock,
  Eye,
  IndianRupee,
  Receipt,
  ThumbsDown,
  ThumbsUp,
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

const STATUS_OPTIONS: WithdrawStatus[] = ["Pending", "Approved", "Rejected", "Paid"];
const ROLE_OPTIONS: UserRole[] = ["Retailer", "Distributor", "Franchise", "Agent"];
const PAYMENT_METHOD_OPTIONS: PaymentMethod[] = ["UPI", "Bank Transfer", "Wallet", "Card"];

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

function pillForStatus(status: WithdrawStatus) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium";
  const map: Record<WithdrawStatus, { className: string; icon: React.ReactNode }> = {
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

function pillForRole(role: UserRole) {
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

const columns: Column<WithdrawalRequestRow>[] = [
  { key: "id", label: "Request ID" },
  { key: "user", label: "User" },
  {
    key: "role",
    label: "Role",
    render: (row) => pillForRole(row.role),
  },
  {
    key: "amountInr",
    label: "Amount",
    render: (row) => (
      <span className="text-sm font-semibold text-gray-900">{formatInr(row.amountInr)}</span>
    ),
  },
  { key: "paymentMethod", label: "Payment method" },
  {
    key: "status",
    label: "Status",
    render: (row) => pillForStatus(row.status),
  },
  {
    key: "date",
    label: "Date",
    render: (row) => formatDate(row.date),
  },
];

export default function WithdrawalRequestsManagementPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<WithdrawalRequestRow[]>(initialRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [methodFilter, setMethodFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        !search ||
        [r.id, r.user, r.role, r.paymentMethod]
          .some((v) => String(v).toLowerCase().includes(search.toLowerCase()));
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      const matchRole = roleFilter === "All" || r.role === roleFilter;
      const matchMethod = methodFilter === "All" || r.paymentMethod === methodFilter;
      return matchSearch && matchStatus && matchRole && matchMethod;
    });
  }, [requests, search, statusFilter, roleFilter, methodFilter]);

  const kpiItems = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "Pending").length;
    const approved = requests.filter((r) => r.status === "Approved").length;
    const rejected = requests.filter((r) => r.status === "Rejected").length;
    const totalAmount = requests.reduce((sum, r) => sum + r.amountInr, 0);

    return [
      { title: "Total Requests", value: total, delta: "All time", icon: <Receipt className="h-4 w-4" /> },
      { title: "Pending", value: pending, delta: "Awaiting review", icon: <Clock className="h-4 w-4" /> },
      { title: "Approved", value: approved, delta: "Ready to pay", icon: <CheckCircle2 className="h-4 w-4" /> },
      { title: "Rejected", value: rejected, delta: "Declined", icon: <XCircle className="h-4 w-4" /> },
      { title: "Total Withdraw Amount", value: formatInr(totalAmount), delta: "Requested total", icon: <IndianRupee className="h-4 w-4" /> },
    ];
  }, [requests]);

  const approveRequest = (row: WithdrawalRequestRow) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: "Approved" } : r))
    );
  };

  const rejectRequest = (row: WithdrawalRequestRow) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: "Rejected" } : r))
    );
  };

  const markPaid = (row: WithdrawalRequestRow) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: "Paid" } : r))
    );
  };

  const openDetailsPage = (row: WithdrawalRequestRow) => {
    router.push(`/dashboard/withdrawe-requests-management/withdraw-request-details?id=${encodeURIComponent(row.id)}`);
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
                  Withdraw Requests
                </h1>
                <p className="text-xs text-gray-500">
                  Review withdrawal requests, approve/reject, and mark payouts as paid.
                </p>
              </div>
            </div>

            <KpiCards items={kpiItems} />

            <DataTable<WithdrawalRequestRow>
              title="Withdraw requests"
              columns={columns}
              data={filtered}
              onRowClick={(row) => openDetailsPage(row)}
              pageSize={10}
              searchPlaceholder="Search by request ID, user, role, or payment method..."
              searchValue={search}
              onSearchValueChange={setSearch}
              hideFiltersButton
              showIndexColumn
              indexColumnLabel="Sr No."
              headerContent={
                <FiltersBar
                  searchPlaceholder="Search by request ID, user, role, or payment method..."
                  searchValue={search}
                  onSearchValueChange={setSearch}
                  right={
                    <>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        <option value="All">All status</option>
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        <option value="All">All roles</option>
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <select
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        <option value="All">All methods</option>
                        {PAYMENT_METHOD_OPTIONS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </>
                  }
                />
              }
              renderActionMenuItems={(row) => {
                const canApproveReject = row.status === "Pending";
                const canMarkPaid = row.status === "Approved";

                return (
                  <>
                    <DropdownMenuItem
                      onClick={() => openDetailsPage(row)}
                      className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                    >
                      <Eye className="mr-2 h-3.5 w-3.5 text-blue-600" />
                      View
                    </DropdownMenuItem>
                    {canApproveReject && (
                      <DropdownMenuItem
                        onClick={() => approveRequest(row)}
                        className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                      >
                        <ThumbsUp className="mr-2 h-3.5 w-3.5 text-emerald-600" />
                        Approve
                      </DropdownMenuItem>
                    )}
                    {canApproveReject && (
                      <DropdownMenuItem
                        onClick={() => rejectRequest(row)}
                        className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                      >
                        <ThumbsDown className="mr-2 h-3.5 w-3.5 text-rose-600" />
                        Reject
                      </DropdownMenuItem>
                    )}
                    {canMarkPaid && (
                      <DropdownMenuItem
                        onClick={() => markPaid(row)}
                        className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                      >
                        <Banknote className="mr-2 h-3.5 w-3.5 text-amber-600" />
                        Mark as paid
                      </DropdownMenuItem>
                    )}
                  </>
                );
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}