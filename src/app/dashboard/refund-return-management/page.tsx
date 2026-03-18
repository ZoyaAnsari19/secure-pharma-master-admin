"use client";

import { useMemo, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { KpiCards } from "@/components/ui/kpiCards";
import { DataTable, type Column } from "@/components/ui/table";
import { FiltersBar } from "@/components/ui/filters";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  SideDrawer,
  SideDrawerContent,
  SideDrawerFooter,
  SideDrawerHeader,
  SideDrawerTitle,
} from "@/components/ui/sideDrawer";
import {
  CheckCircle2,
  Clock,
  Package,
  ThumbsDown,
  ThumbsUp,
  Truck,
  XCircle,
  IndianRupee,
  Eye,
  Hash,
  User,
  Calendar,
  Package2,
  MapPin,
  BadgeCheck,
  AlertOctagon,
  Banknote,
} from "lucide-react";

type ReturnStatus = "Pending" | "Approved" | "Rejected" | "Received";
type RefundStatus = "Not Initiated" | "Pending" | "Refunded";

type ReturnRow = {
  id: string; // return ID (DataTable requires `id`)
  orderId: string;
  user: string;
  product: string;
  reason: string;
  returnStatus: ReturnStatus;
  refundStatus: RefundStatus;
  refundAmountInr: number;
  date: string; // YYYY-MM-DD
};

const RETURN_STATUS_OPTIONS: ReturnStatus[] = ["Pending", "Approved", "Rejected", "Received"];
const REFUND_STATUS_OPTIONS: RefundStatus[] = ["Not Initiated", "Pending", "Refunded"];

const initialReturns: ReturnRow[] = [
  {
    id: "RET-2103",
    orderId: "ORD-1042",
    user: "Aditi Sharma",
    product: "Noise Buds VS104",
    reason: "Damaged product on arrival",
    returnStatus: "Pending",
    refundStatus: "Not Initiated",
    refundAmountInr: 1499,
    date: "2026-03-12",
  },
  {
    id: "RET-2097",
    orderId: "ORD-1037",
    user: "Rahul Verma",
    product: "Boat Rockerz 450",
    reason: "Wrong item delivered",
    returnStatus: "Approved",
    refundStatus: "Pending",
    refundAmountInr: 1299,
    date: "2026-03-09",
  },
  {
    id: "RET-2091",
    orderId: "ORD-1029",
    user: "Sara Khan",
    product: "Nike Running Shoes",
    reason: "Size issue",
    returnStatus: "Received",
    refundStatus: "Refunded",
    refundAmountInr: 3999,
    date: "2026-03-06",
  },
  {
    id: "RET-2084",
    orderId: "ORD-1025",
    user: "Vikram Mehta",
    product: "Apple MagSafe Charger",
    reason: "Changed mind",
    returnStatus: "Rejected",
    refundStatus: "Not Initiated",
    refundAmountInr: 0,
    date: "2026-03-02",
  },
  {
    id: "RET-2076",
    orderId: "ORD-1018",
    user: "Priya Nair",
    product: "Samsung USB-C Cable",
    reason: "Quality not as expected",
    returnStatus: "Received",
    refundStatus: "Pending",
    refundAmountInr: 299,
    date: "2026-02-24",
  },
  {
    id: "RET-2069",
    orderId: "ORD-1009",
    user: "Kavita Reddy",
    product: "Philips Hair Dryer",
    reason: "Damaged product on arrival",
    returnStatus: "Approved",
    refundStatus: "Not Initiated",
    refundAmountInr: 2199,
    date: "2026-02-19",
  },
  {
    id: "RET-2061",
    orderId: "ORD-1045",
    user: "Anil Kumar",
    product: "Mi Power Bank 10000mAh",
    reason: "Other",
    returnStatus: "Pending",
    refundStatus: "Not Initiated",
    refundAmountInr: 999,
    date: "2026-02-15",
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

function pillForReturnStatus(status: ReturnStatus) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium";
  const map: Record<ReturnStatus, { className: string; icon: React.ReactNode }> = {
    Pending: { className: "bg-amber-50 text-amber-700", icon: <Clock className="mr-1 h-3 w-3" /> },
    Approved: { className: "bg-emerald-50 text-emerald-700", icon: <CheckCircle2 className="mr-1 h-3 w-3" /> },
    Rejected: { className: "bg-rose-50 text-rose-700", icon: <XCircle className="mr-1 h-3 w-3" /> },
    Received: { className: "bg-sky-50 text-sky-700", icon: <Truck className="mr-1 h-3 w-3" /> },
  };
  const { className, icon } = map[status];
  return (
    <span className={`${base} ${className}`}>
      {icon}
      {status}
    </span>
  );
}

function pillForRefundStatus(status: RefundStatus) {
  const styles =
    status === "Refunded"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Pending"
        ? "bg-amber-50 text-amber-700"
        : "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styles}`}>
      {status}
    </span>
  );
}

const returnColumns: Column<ReturnRow>[] = [
  { key: "orderId", label: "Order ID" },
  { key: "user", label: "User" },
  { key: "product", label: "Product" },
  {
    key: "returnStatus",
    label: "Return status",
    render: (row) => pillForReturnStatus(row.returnStatus),
  },
  {
    key: "refundStatus",
    label: "Refund status",
    render: (row) => pillForRefundStatus(row.refundStatus),
  },
  {
    key: "date",
    label: "Date",
    render: (row) => formatDate(row.date),
  },
];

export default function RefundReturnManagementPage() {
  const [returns, setReturns] = useState<ReturnRow[]>(initialReturns);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [refundStatusFilter, setRefundStatusFilter] = useState<string>("All");
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [viewReturnId, setViewReturnId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return returns.filter((r) => {
      const matchSearch =
        !search ||
        [r.id, r.orderId, r.user, r.product, r.reason]
          .some((v) => String(v).toLowerCase().includes(search.toLowerCase()));
      const matchReturnStatus = statusFilter === "All" || r.returnStatus === statusFilter;
      const matchRefundStatus = refundStatusFilter === "All" || r.refundStatus === refundStatusFilter;
      return matchSearch && matchReturnStatus && matchRefundStatus;
    });
  }, [returns, search, statusFilter, refundStatusFilter]);

  const viewingReturn = useMemo(
    () => (viewReturnId ? returns.find((r) => r.id === viewReturnId) ?? null : null),
    [returns, viewReturnId]
  );

  const kpiItems = useMemo(() => {
    const total = returns.length;
    const pending = returns.filter((r) => r.returnStatus === "Pending").length;
    const approved = returns.filter((r) => r.returnStatus === "Approved" || r.returnStatus === "Received").length;
    const rejected = returns.filter((r) => r.returnStatus === "Rejected").length;
    const refundedAmount = returns
      .filter((r) => r.refundStatus === "Refunded")
      .reduce((sum, r) => sum + (r.refundAmountInr || 0), 0);

    return [
      { title: "Total Return Requests", value: total, delta: "All time", icon: <Package className="h-4 w-4" /> },
      { title: "Pending Requests", value: pending, delta: "Awaiting action", icon: <Clock className="h-4 w-4" /> },
      { title: "Approved Returns", value: approved, delta: "Approved / received", icon: <CheckCircle2 className="h-4 w-4" /> },
      { title: "Rejected Returns", value: rejected, delta: "Declined", icon: <XCircle className="h-4 w-4" /> },
      { title: "Total Refund Amount", value: `₹${refundedAmount.toLocaleString("en-IN")}`, delta: "Refunded to customers", icon: <IndianRupee className="h-4 w-4" /> },
    ];
  }, [returns]);

  const openViewDrawer = (row: ReturnRow) => {
    setViewReturnId(row.id);
    setViewDrawerOpen(true);
  };

  const approveReturn = (row: ReturnRow) => {
    setReturns((prev) => prev.map((r) => (r.id === row.id ? { ...r, returnStatus: "Approved" } : r)));
  };

  const rejectReturn = (row: ReturnRow) => {
    setReturns((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, returnStatus: "Rejected", refundStatus: "Not Initiated", refundAmountInr: 0 } : r
      )
    );
  };

  const markReceived = (row: ReturnRow) => {
    setReturns((prev) => prev.map((r) => (r.id === row.id ? { ...r, returnStatus: "Received" } : r)));
  };

  const processRefund = (row: ReturnRow) => {
    setReturns((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              refundStatus: "Refunded",
              refundAmountInr: r.refundAmountInr || 0,
            }
          : r
      )
    );
  };

  const getStatusSteps = (row: ReturnRow) => {
    if (row.returnStatus === "Rejected") {
      return {
        steps: [
          { label: "Requested", description: "Return request created" },
          { label: "Rejected", description: "Request declined by admin" },
        ],
        activeIndex: 1,
        variant: "rejected" as const,
      };
    }

    const steps = [
      { label: "Requested", description: "Request submitted by customer" },
      { label: "Approved", description: "Approved by admin" },
      { label: "Received", description: "Item received in warehouse" },
      { label: "Refunded", description: "Refund processed to customer" },
    ];

    let activeIndex = 0;
    if (row.returnStatus === "Approved") activeIndex = 1;
    if (row.returnStatus === "Received") activeIndex = 2;
    if (row.refundStatus === "Refunded") activeIndex = 3;
    return { steps, activeIndex, variant: "default" as const };
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
                  Refund & Return Management
                </h1>
                <p className="text-xs text-gray-500">
                  Review return requests, track refund progress, and take action on approvals, receiving, and payouts.
                </p>
              </div>
            </div>

            <KpiCards items={kpiItems} />

            <DataTable<ReturnRow>
              title="Return Requests"
              columns={returnColumns}
              data={filtered}
              onRowClick={(row) => openViewDrawer(row)}
              pageSize={10}
              searchPlaceholder="Search by order ID, user, product, or reason..."
              searchValue={search}
              onSearchValueChange={setSearch}
              hideFiltersButton
              showIndexColumn
              indexColumnLabel="Sr No."
              headerContent={
                <FiltersBar
                  searchPlaceholder="Search by order ID, user, product, or reason..."
                  searchValue={search}
                  onSearchValueChange={setSearch}
                  right={
                    <>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        <option value="All">All return status</option>
                        {RETURN_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <select
                        value={refundStatusFilter}
                        onChange={(e) => setRefundStatusFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        <option value="All">All refund status</option>
                        {REFUND_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </>
                  }
                />
              }
              renderActionMenuItems={(row) => {
                const canApproveReject = row.returnStatus === "Pending";
                const canMarkReceived = row.returnStatus === "Approved";
                const canProcessRefund =
                  (row.returnStatus === "Approved" || row.returnStatus === "Received") &&
                  row.refundStatus !== "Refunded";

                return (
                  <>
                    <DropdownMenuItem
                      onClick={() => openViewDrawer(row)}
                      className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                    >
                      <Eye className="mr-2 h-3.5 w-3.5 text-blue-600" />
                      View
                    </DropdownMenuItem>
                    {canApproveReject && (
                      <DropdownMenuItem
                        onClick={() => approveReturn(row)}
                        className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                      >
                        <ThumbsUp className="mr-2 h-3.5 w-3.5 text-emerald-600" />
                        Approve return
                      </DropdownMenuItem>
                    )}
                    {canApproveReject && (
                      <DropdownMenuItem
                        onClick={() => rejectReturn(row)}
                        className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                      >
                        <ThumbsDown className="mr-2 h-3.5 w-3.5 text-rose-600" />
                        Reject return
                      </DropdownMenuItem>
                    )}
                    {canMarkReceived && (
                      <DropdownMenuItem
                        onClick={() => markReceived(row)}
                        className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                      >
                        <Truck className="mr-2 h-3.5 w-3.5 text-sky-600" />
                        Mark as received
                      </DropdownMenuItem>
                    )}
                    {canProcessRefund && (
                      <DropdownMenuItem
                        onClick={() => processRefund(row)}
                        className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                      >
                        <IndianRupee className="mr-2 h-3.5 w-3.5 text-amber-600" />
                        Process refund
                      </DropdownMenuItem>
                    )}
                  </>
                );
              }}
            />

            <SideDrawer
              open={viewDrawerOpen}
              onOpenChange={(open) => {
                setViewDrawerOpen(open);
                if (!open) setViewReturnId(null);
              }}
            >
              <SideDrawerContent className="flex h-full flex-col gap-0 overflow-hidden p-0">
                <SideDrawerHeader className="-mx-6 mb-0 flex h-16 flex-shrink-0 flex-row items-center border-b border-gray-200 bg-pink-50 px-6 pr-14">
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                    <SideDrawerTitle className="text-base font-semibold leading-tight text-gray-900">
                      Return request details
                    </SideDrawerTitle>
                    <p className="truncate text-[11px] font-medium uppercase tracking-wider text-gray-500">
                      {viewingReturn ? `${viewingReturn.orderId} · ${viewingReturn.user}` : "—"}
                    </p>
                  </div>
                </SideDrawerHeader>

                {viewingReturn && (
                  <>
                    <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
                      {/* Order information */}
                      <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Order information
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                              <Hash className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Order ID
                              </p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                {viewingReturn.orderId}
                              </p>
                            </div>
                          </div>
                          <div className="h-px bg-gray-200/80" />
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200/80 text-gray-500">
                              <Calendar className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Requested on
                              </p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                {formatDate(viewingReturn.date)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>

                      <div className="my-4 h-px bg-gray-200/60" />

                      {/* Customer details */}
                      <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Customer details
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                              <User className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Customer
                              </p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                {viewingReturn.user}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                Email: <span className="font-medium text-gray-700">{viewingReturn.user.toLowerCase().replace(/\s+/g, ".")}@example.com</span>
                              </p>
                            </div>
                          </div>
                          <div className="h-px bg-gray-200/80" />
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                              <BadgeCheck className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Return status
                              </p>
                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                {pillForReturnStatus(viewingReturn.returnStatus)}
                              </div>
                            </div>
                          </div>
                          <div className="h-px bg-gray-200/80" />
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                              <MapPin className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Pickup / delivery address
                              </p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                221B, Business Bay, Bengaluru
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                PIN: <span className="font-medium text-gray-700">560001</span> · Phone:{" "}
                                <span className="font-medium text-gray-700">+91 98xxxxxx12</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>

                      <div className="my-4 h-px bg-gray-200/60" />

                      {/* Product details */}
                      <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Product details
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                              <Package2 className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Product
                              </p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                {viewingReturn.product}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                SKU: <span className="font-medium text-gray-700">SKU-{viewingReturn.orderId.slice(-3)}-{viewingReturn.id.slice(-2)}</span> · Qty:{" "}
                                <span className="font-medium text-gray-700">1</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>

                      <div className="my-4 h-px bg-gray-200/60" />

                      {/* Return reason + images */}
                      <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Return reason & evidence
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                              <AlertOctagon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Reason
                              </p>
                              <p className="mt-0.5 text-sm text-gray-700 leading-relaxed">
                                {viewingReturn.reason}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                Note: Images are mocked placeholders and can be wired to your returns API.
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {["Front", "Back", "Damage"].map((label, idx) => (
                              <div
                                key={label}
                                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white"
                              >
                                <div
                                  className="h-20 w-full"
                                  style={{
                                    background:
                                      idx === 0
                                        ? "linear-gradient(135deg, rgba(236,90,135,0.20), rgba(139,92,246,0.18))"
                                        : idx === 1
                                          ? "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(16,185,129,0.18))"
                                          : "linear-gradient(135deg, rgba(249,115,22,0.22), rgba(236,90,135,0.14))",
                                  }}
                                />
                                <div className="flex items-center justify-between px-3 py-2">
                                  <p className="text-xs font-semibold text-gray-800">{label}</p>
                                  <span className="text-[10px] font-medium text-gray-400">
                                    IMG-{idx + 1}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>

                      <div className="my-4 h-px bg-gray-200/60" />

                      {/* Status tracking */}
                      <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Status tracking
                        </h3>
                        <div className="space-y-3">
                          {(() => {
                            const { steps, activeIndex, variant } = getStatusSteps(viewingReturn);
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
                                          <p className="text-sm font-semibold text-gray-900">
                                            {step.label}
                                          </p>
                                          {idx === activeIndex && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-semibold text-pink-700 ring-1 ring-pink-100">
                                              <BadgeCheck className="h-3 w-3" />
                                              Current
                                            </span>
                                          )}
                                        </div>
                                        <p className="mt-0.5 text-xs text-gray-500">
                                          {step.description}
                                        </p>
                                      </div>
                                    </li>
                                  );
                                })}
                              </ol>
                            );
                          })()}
                        </div>
                      </section>

                      <div className="my-4 h-px bg-gray-200/60" />

                      {/* Refund information */}
                      <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Refund information
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-200/80 text-slate-600">
                              <Banknote className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Refund amount
                              </p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                {formatInr(viewingReturn.refundAmountInr)}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                Method: <span className="font-medium text-gray-700">Original payment method</span> · Reference:{" "}
                                <span className="font-medium text-gray-700">RF-{viewingReturn.orderId.slice(-4)}-{viewingReturn.id.slice(-3)}</span>
                              </p>
                            </div>
                          </div>
                          <div className="h-px bg-gray-200/80" />
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                              Refund status
                            </p>
                            {pillForRefundStatus(viewingReturn.refundStatus)}
                          </div>
                        </div>
                      </section>
                    </div>

                    {/* Sticky action footer */}
                    <SideDrawerFooter className="sticky bottom-0 z-10 mt-0 flex-shrink-0 border-t border-gray-200/80 bg-white/95 px-6 py-4 backdrop-blur">
                      <div className="flex w-full items-center justify-between gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={viewingReturn.returnStatus !== "Pending"}
                          onClick={() => rejectReturn(viewingReturn)}
                        >
                          <ThumbsDown className="mr-2 h-4 w-4 text-rose-600" />
                          Reject
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={viewingReturn.returnStatus !== "Pending"}
                          onClick={() => approveReturn(viewingReturn)}
                        >
                          <ThumbsUp className="mr-2 h-4 w-4 text-emerald-600" />
                          Approve
                        </Button>
                      </div>
                    </SideDrawerFooter>
                  </>
                )}
              </SideDrawerContent>
            </SideDrawer>
          </div>
        </main>
      </div>
    </div>
  );
}