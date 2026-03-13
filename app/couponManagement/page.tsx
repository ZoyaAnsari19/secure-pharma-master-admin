"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SideBar } from "@/components/sideBar";
import { TopBar } from "@/components/topBar";
import { KpiCards } from "@/components/ui/kpiCards";
import { DataTable, type Column } from "@/components/ui/table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  TicketPercent,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
} from "lucide-react";

type CouponStatus = "Active" | "Expired" | "Scheduled";

type CouponRow = {
  id: string;
  code: string;
  clientName: string;
  clientWebsite: string;
  appliesTo: string;
  discountLabel: string;
  usageLimit: number;
  usedCount: number;
  status: CouponStatus;
  expiryDate: string;
};

const initialCoupons: CouponRow[] = [
  {
    id: "CPN-NEWYEAR-10",
    code: "NEWYEAR10",
    clientName: "Glow Studio Mumbai",
    clientWebsite: "mumbai.glow.truebeauty.in",
    appliesTo: "All products",
    discountLabel: "10% off",
    usageLimit: 200,
    usedCount: 142,
    status: "Active",
    expiryDate: "2025-01-15",
  },
  {
    id: "CPN-FACIAL-20",
    code: "FACIAL20",
    clientName: "Blush Hub Delhi",
    clientWebsite: "delhi.blush.truebeauty.in",
    appliesTo: "HydraGlow Facial Kit",
    discountLabel: "₹ 500 off",
    usageLimit: 100,
    usedCount: 67,
    status: "Active",
    expiryDate: "2025-03-31",
  },
  {
    id: "CPN-SUMMER-SKIN",
    code: "SUMMERSKIN15",
    clientName: "SkinCraft Pune",
    clientWebsite: "pune.skincraft.truebeauty.in",
    appliesTo: "Sunscreens category",
    discountLabel: "15% off",
    usageLimit: 150,
    usedCount: 150,
    status: "Expired",
    expiryDate: "2024-06-30",
  },
  {
    id: "CPN-MINIMAL-5",
    code: "MINIMAL5",
    clientName: "MinimalGlow Bangalore",
    clientWebsite: "bangalore.minimal.truebeauty.in",
    appliesTo: "MinimalGlow bundle",
    discountLabel: "5% off",
    usageLimit: 50,
    usedCount: 18,
    status: "Active",
    expiryDate: "2025-04-30",
  },
  {
    id: "CPN-RADIANT-LAUNCH",
    code: "RADIANTLAUNCH",
    clientName: "Radiant Touch Chennai",
    clientWebsite: "chennai.radiant.truebeauty.in",
    appliesTo: "New arrivals",
    discountLabel: "₹ 300 off",
    usageLimit: 80,
    usedCount: 0,
    status: "Scheduled",
    expiryDate: "2025-07-01",
  },
];

const couponColumns: Column<CouponRow>[] = [
  {
    key: "code",
    label: "Coupon Code",
    render: (row) => (
      <span className="text-xs font-semibold tracking-wide text-slate-900 sm:text-sm">
        {row.code}
      </span>
    ),
  },
  {
    key: "clientName",
    label: "Client Name",
    render: (row) => (
      <span className="max-w-[200px] truncate text-xs text-slate-800 sm:text-sm">
        {row.clientName}
      </span>
    ),
  },
  {
    key: "appliesTo",
    label: "Product / Category",
    render: (row) => (
      <span className="max-w-[220px] truncate text-xs text-slate-700 sm:text-sm">
        {row.appliesTo}
      </span>
    ),
  },
  {
    key: "discountLabel",
    label: "Discount",
  },
  {
    key: "usageLimit",
    label: "Usage Limit",
    render: (row) => (
      <span className="text-xs font-medium text-slate-800 sm:text-sm">
        {row.usageLimit}
      </span>
    ),
  },
  {
    key: "usedCount",
    label: "Used Count",
    render: (row) => (
      <span className="text-xs font-semibold text-slate-900 sm:text-sm">
        {row.usedCount}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const base =
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium";
      if (row.status === "Active") {
        return (
          <span className={`${base} bg-emerald-50 text-emerald-700`}>
            <CheckCircle2 className="mr-1.5 h-3 w-3" />
            Active
          </span>
        );
      }
      if (row.status === "Scheduled") {
        return (
          <span className={`${base} bg-sky-50 text-sky-700`}>
            <Clock className="mr-1.5 h-3 w-3" />
            Scheduled
          </span>
        );
      }
      return (
        <span className={`${base} bg-rose-50 text-rose-700`}>
          <XCircle className="mr-1.5 h-3 w-3" />
          Expired
        </span>
      );
    },
  },
  {
    key: "expiryDate",
    label: "Expiry Date",
    render: (row) =>
      new Date(row.expiryDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
];

export default function CouponManagementPage() {
  const router = useRouter();
  const [coupons] = useState<CouponRow[]>(initialCoupons);
  const [clientFilter, setClientFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] =
    useState<"All" | CouponStatus>("All");

  const clientOptions = useMemo(() => {
    const names = Array.from(new Set(coupons.map((c) => c.clientName)));
    return ["All", ...names];
  }, [coupons]);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchesClient =
        clientFilter === "All" || c.clientName === clientFilter;
      const matchesStatus =
        statusFilter === "All" || c.status === statusFilter;
      return matchesClient && matchesStatus;
    });
  }, [coupons, clientFilter, statusFilter]);

  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.status === "Active").length;
  const expiredCoupons = coupons.filter((c) => c.status === "Expired").length;
  const totalUsageRaw = coupons.reduce(
    (acc, c) => acc + (Number.isFinite(c.usedCount) ? c.usedCount : 0),
    0
  );
  const totalUsage = Number.isFinite(totalUsageRaw) ? totalUsageRaw : 0;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <SideBar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Page header */}
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                  Coupons
                </h1>
                <p className="text-xs text-gray-500">
                  Monitor coupon performance across all client platforms.
                </p>
              </div>
            </div>

            {/* Statistics cards */}
            <KpiCards
              items={[
                {
                  title: "Total Coupons",
                  value: totalCoupons,
                  delta: "Across all client websites",
                  icon: <TicketPercent className="h-4 w-4" />,
                },
                {
                  title: "Active Coupons",
                  value: activeCoupons,
                  delta: "Currently available for users",
                  icon: <CheckCircle2 className="h-4 w-4" />,
                },
                {
                  title: "Expired Coupons",
                  value: expiredCoupons,
                  delta: "No longer valid",
                  icon: <XCircle className="h-4 w-4" />,
                },
                {
                  title: "Total Coupon Usage",
                  value: totalUsage,
                  delta: "Total times coupons were applied",
                  icon: <BarChart3 className="h-4 w-4" />,
                },
              ]}
            />

            {/* Coupons table */}
            <DataTable<CouponRow>
              title="All Coupons"
              columns={couponColumns}
              data={filteredCoupons}
              pageSize={10}
              searchPlaceholder="Search coupons by code, client or product..."
              hideFiltersButton
              showIndexColumn
              renderActionMenuItems={(row) => (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(
                        `/couponManagement/couponDetails?couponId=${row.id}`
                      )
                    }
                    className="flex items-center gap-2 text-[13px] text-slate-900 hover:bg-gray-50"
                  >
                    <span>View Details</span>
                  </DropdownMenuItem>
                </>
              )}
              rightHeader={
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                    className="h-9 w-32 rounded-full border border-pink-100 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  >
                    {clientOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === "All" ? "All Clients" : opt}
                      </option>
                    ))}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as "All" | CouponStatus)
                    }
                    className="h-9 w-32 rounded-full border border-pink-100 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
}

