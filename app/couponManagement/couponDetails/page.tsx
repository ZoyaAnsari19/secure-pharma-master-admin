"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SideBar } from "@/components/sideBar";
import { TopBar } from "@/components/topBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  TicketPercent,
  CheckCircle2,
  XCircle,
  Building2,
  Globe,
  LayoutDashboard,
  Tag,
  User,
  Mail,
  ShoppingBag,
} from "lucide-react";

type CouponStatus = "Active" | "Used" | "Expired";

type CouponDetail = {
  id: string;
  code: string;
  clientName: string;
  clientWebsite: string;
  /** Client admin panel URL */
  clientAdminPanelUrl?: string;
  applicableCategory: string;
  applicableProduct: string;
  discountLabel: string;
  /** Product / applicable item actual price (₹) */
  productPriceInr?: number;
  startDate: string;
  expiryDate: string;
  status: CouponStatus;
  /** Set when status is Used (single-use redemption) */
  usedBy?: { name: string; email: string };
  orderId?: string;
};

const mockCouponDetails: CouponDetail[] = [
  {
    id: "CPN-NEWYEAR-10",
    code: "NEWYEAR10",
    clientName: "Glow Studio Mumbai",
    clientWebsite: "mumbai.glow.truebeauty.in",
    clientAdminPanelUrl: "https://admin.mumbai.glow.truebeauty.in",
    applicableCategory: "All categories",
    applicableProduct: "All products",
    discountLabel: "10% off",
    productPriceInr: 2499,
    startDate: "2024-12-20",
    expiryDate: "2025-01-15",
    status: "Active",
  },
  {
    id: "CPN-FACIAL-20",
    code: "FACIAL20",
    clientName: "Blush Hub Delhi",
    clientWebsite: "delhi.blush.truebeauty.in",
    clientAdminPanelUrl: "https://admin.delhi.blush.truebeauty.in",
    applicableCategory: "Skincare",
    applicableProduct: "HydraGlow Facial Kit",
    discountLabel: "₹ 500 off",
    productPriceInr: 2999,
    startDate: "2025-01-01",
    expiryDate: "2025-03-31",
    status: "Used",
    usedBy: { name: "Priya Verma", email: "priya.verma@example.com" },
    orderId: "ORD-1042",
  },
  {
    id: "CPN-SUMMER-SKIN",
    code: "SUMMERSKIN15",
    clientName: "SkinCraft Pune",
    clientWebsite: "pune.skincraft.truebeauty.in",
    clientAdminPanelUrl: "https://admin.pune.skincraft.truebeauty.in",
    applicableCategory: "Sunscreens",
    applicableProduct: "—",
    discountLabel: "15% off",
    productPriceInr: 899,
    startDate: "2024-05-01",
    expiryDate: "2024-06-30",
    status: "Expired",
  },
  {
    id: "CPN-MINIMAL-5",
    code: "MINIMAL5",
    clientName: "MinimalGlow Bangalore",
    clientWebsite: "bangalore.minimal.truebeauty.in",
    clientAdminPanelUrl: "https://admin.bangalore.minimal.truebeauty.in",
    applicableCategory: "Bundles",
    applicableProduct: "MinimalGlow bundle",
    discountLabel: "5% off",
    productPriceInr: 4599,
    startDate: "2025-02-01",
    expiryDate: "2025-04-30",
    status: "Active",
  },
  {
    id: "CPN-RADIANT-LAUNCH",
    code: "RADIANTLAUNCH",
    clientName: "Radiant Touch Chennai",
    clientWebsite: "chennai.radiant.truebeauty.in",
    clientAdminPanelUrl: "https://admin.chennai.radiant.truebeauty.in",
    applicableCategory: "New arrivals",
    applicableProduct: "—",
    discountLabel: "₹ 300 off",
    productPriceInr: 1899,
    startDate: "2025-06-01",
    expiryDate: "2025-07-01",
    status: "Active",
  },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusBadge(status: CouponStatus) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";
  if (status === "Active") {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700`}>
        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
        Active
      </span>
    );
  }
  if (status === "Used") {
    return (
      <span className={`${base} bg-amber-50 text-amber-700`}>
        <TicketPercent className="mr-1.5 h-3.5 w-3.5" />
        Used
      </span>
    );
  }
  return (
    <span className={`${base} bg-rose-50 text-rose-700`}>
      <XCircle className="mr-1.5 h-3.5 w-3.5" />
      Expired
    </span>
  );
}

export default function CouponDetailsPage() {
  const searchParams = useSearchParams();
  const couponId = searchParams.get("couponId");

  const coupon = useMemo(
    () => mockCouponDetails.find((c) => c.id === couponId) ?? null,
    [couponId]
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <SideBar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1200px] space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Link
                  href="/couponManagement"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-pink-100 bg-white text-slate-500 shadow-sm hover:border-pink-200 hover:bg-pink-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                    Coupon Details
                  </h1>
                  <p className="text-xs text-gray-500">
                    Full coupon information and redemption details (single-use).
                  </p>
                </div>
              </div>
            </div>

            {!coupon ? (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center text-sm text-slate-500">
                  Coupon not found. Please go back to Coupons and try again.
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
                  {/* Coupon & discount */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-start gap-2 text-left">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                        <TicketPercent className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-gray-900">
                          Coupon Information
                        </CardTitle>
                        <p className="text-xs text-gray-500">
                          Code, discount and validity.
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid gap-4 text-sm text-gray-800 sm:grid-cols-2">
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Coupon Code
                          </dt>
                          <dd className="mt-1 text-sm font-semibold tracking-wide text-slate-900">
                            {coupon.code}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Discount Value
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-slate-900">
                            {coupon.discountLabel}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Applicable Category
                          </dt>
                          <dd className="mt-1 text-xs text-slate-700">
                            {coupon.applicableCategory}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Applicable Product
                          </dt>
                          <dd className="mt-1 text-xs text-slate-700">
                            {coupon.applicableProduct}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Price
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-slate-900">
                            {coupon.productPriceInr != null
                              ? `₹ ${coupon.productPriceInr.toLocaleString("en-IN")}`
                              : "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Coupon Status
                          </dt>
                          <dd className="mt-2">{statusBadge(coupon.status)}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Start Date
                          </dt>
                          <dd className="mt-1 text-xs text-slate-700">
                            {formatDate(coupon.startDate)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Expiry Date
                          </dt>
                          <dd className="mt-1 text-xs text-slate-700">
                            {formatDate(coupon.expiryDate)}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>

                  {/* Client */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-start gap-2 text-left">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-gray-900">
                          Client
                        </CardTitle>
                        <p className="text-xs text-gray-500">
                          Client name and website for this coupon.
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid gap-4 text-sm text-gray-800">
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-gray-400 flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5" />
                            Client Name
                          </dt>
                          <dd className="mt-1 text-xs">{coupon.clientName}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-gray-400 flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5" />
                            Client Website
                          </dt>
                          <dd className="mt-1 text-xs text-pink-600">
                            {coupon.clientWebsite}
                          </dd>
                        </div>
                        {coupon.clientAdminPanelUrl && (
                          <div>
                            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400 flex items-center gap-1.5">
                              <LayoutDashboard className="h-3.5 w-3.5" />
                              Client Admin Panel URL
                            </dt>
                            <dd className="mt-1">
                              <a
                                href={coupon.clientAdminPanelUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-pink-600 hover:underline break-all"
                              >
                                {coupon.clientAdminPanelUrl}
                              </a>
                            </dd>
                          </div>
                        )}
                      </dl>
                    </CardContent>
                  </Card>
                </div>

                {/* Redemption (Used By + Order ID) – only when status is Used */}
                {coupon.status === "Used" && (coupon.usedBy || coupon.orderId) && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-start gap-2 text-left">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                        <Tag className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-gray-900">
                          Redemption (Single-use)
                        </CardTitle>
                        <p className="text-xs text-gray-500">
                          User and order where this coupon was applied.
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid gap-4 text-sm text-gray-800 sm:grid-cols-2">
                        {coupon.usedBy && (
                          <>
                            <div>
                              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400 flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" />
                                Used By (Name)
                              </dt>
                              <dd className="mt-1 text-xs font-medium text-slate-900">
                                {coupon.usedBy.name}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400 flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                Used By (Email)
                              </dt>
                              <dd className="mt-1 text-xs text-slate-700">
                                {coupon.usedBy.email}
                              </dd>
                            </div>
                          </>
                        )}
                        {coupon.orderId && (
                          <div>
                            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400 flex items-center gap-1.5">
                              <ShoppingBag className="h-3.5 w-3.5" />
                              Order ID
                            </dt>
                            <dd className="mt-1 text-xs font-mono font-medium text-slate-900">
                              {coupon.orderId}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
