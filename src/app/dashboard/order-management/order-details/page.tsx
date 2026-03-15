"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowLeft,
  ShoppingBag,
  User2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  RefreshCw,
} from "lucide-react";

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
type PaymentStatus = "Paid" | "Pending" | "Refunded" | "Failed";
type OrderedBy = "Customer" | "Retailer";

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  priceInr: number;
  affiliateName?: string;
  affiliateCommissionInr?: number;
};

type OrderDetail = {
  id: string;
  orderDate: string;
  status: OrderStatus;
  orderedBy: OrderedBy;
  totalAmountInr: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  transactionId: string;
  items: OrderItem[];
  timeline: {
    placedAt: string;
    processingAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
  clientName?: string;
  clientWebsite?: string;
};

const mockOrders: OrderDetail[] = [
  {
    id: "ORD-1042",
    orderDate: "2025-03-08T10:30:00Z",
    status: "Delivered",
    orderedBy: "Customer",
    totalAmountInr: 2499,
    customerName: "Aditi Sharma",
    customerEmail: "aditi.sharma@example.com",
    customerPhone: "+91 98765 43210",
    shippingAddress: "Flat 704, Emerald Heights, Lokhandwala Complex, Andheri West, Mumbai, Maharashtra 400053",
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    transactionId: "TXN-8842-IND-UPI",
    clientName: "Glow Studio Mumbai",
    clientWebsite: "mumbai.glow.truebeauty.in",
    items: [
      { id: "ITEM-1", productName: "HydraGlow Facial Kit", quantity: 1, priceInr: 2499, affiliateName: "Sara Khan", affiliateCommissionInr: 250 },
    ],
    timeline: { placedAt: "2025-03-08T10:30:00Z", processingAt: "2025-03-08T11:05:00Z", shippedAt: "2025-03-09T09:15:00Z", deliveredAt: "2025-03-11T16:45:00Z" },
  },
  {
    id: "ORD-1037",
    orderDate: "2025-02-27T14:00:00Z",
    status: "Delivered",
    orderedBy: "Retailer",
    totalAmountInr: 1499,
    customerName: "Rahul Verma",
    customerEmail: "rahul.v@example.com",
    customerPhone: "+91 91234 56789",
    shippingAddress: "12/B, Green Valley, Koramangala, Bangalore, Karnataka 560034",
    paymentMethod: "Card",
    paymentStatus: "Paid",
    transactionId: "TXN-7731-CARD",
    items: [{ id: "ITEM-1", productName: "Vitamin C Brightening Serum", quantity: 1, priceInr: 1499 }],
    timeline: { placedAt: "2025-02-27T14:00:00Z", processingAt: "2025-02-27T15:00:00Z", shippedAt: "2025-02-28T10:00:00Z", deliveredAt: "2025-03-02T11:00:00Z" },
  },
  {
    id: "ORD-1029",
    orderDate: "2025-02-15T09:20:00Z",
    status: "Pending",
    orderedBy: "Customer",
    totalAmountInr: 1999,
    customerName: "Sara Khan",
    customerEmail: "sara.k@example.com",
    customerPhone: "+91 99887 76655",
    shippingAddress: "45, Park Street, Pune, Maharashtra 411001",
    paymentMethod: "UPI",
    paymentStatus: "Pending",
    transactionId: "—",
    items: [
      { id: "ITEM-1", productName: "Acne Defense Cleanser", quantity: 1, priceInr: 999 },
      { id: "ITEM-2", productName: "Oil-Free Moisturizer", quantity: 1, priceInr: 1000 },
    ],
    timeline: { placedAt: "2025-02-15T09:20:00Z" },
  },
  {
    id: "ORD-1025",
    orderDate: "2025-03-10T11:00:00Z",
    status: "Shipped",
    orderedBy: "Retailer",
    totalAmountInr: 4599,
    customerName: "Vikram Mehta",
    customerEmail: "vikram.m@example.com",
    customerPhone: "+91 87654 32109",
    shippingAddress: "Block C, DLF Phase 2, Gurgaon, Haryana 122002",
    paymentMethod: "Netbanking",
    paymentStatus: "Paid",
    transactionId: "TXN-9025-NB",
    items: [
      { id: "ITEM-1", productName: "SPF 50 Sunscreen", quantity: 2, priceInr: 899 },
      { id: "ITEM-2", productName: "Night Repair Serum", quantity: 1, priceInr: 1899 },
      { id: "ITEM-3", productName: "Face Mask Pack", quantity: 1, priceInr: 902 },
    ],
    timeline: { placedAt: "2025-03-10T11:00:00Z", processingAt: "2025-03-10T12:00:00Z", shippedAt: "2025-03-11T09:00:00Z" },
  },
  {
    id: "ORD-1018",
    orderDate: "2025-01-20T16:45:00Z",
    status: "Delivered",
    orderedBy: "Customer",
    totalAmountInr: 899,
    customerName: "Priya Nair",
    customerEmail: "priya.n@example.com",
    customerPhone: "+91 76543 21098",
    shippingAddress: "7, Cathedral Road, Chennai, Tamil Nadu 600086",
    paymentMethod: "Card",
    paymentStatus: "Paid",
    transactionId: "TXN-6018-CARD",
    items: [{ id: "ITEM-1", productName: "SPF 50+ Daily Sunscreen", quantity: 1, priceInr: 899 }],
    timeline: { placedAt: "2025-01-20T16:45:00Z", processingAt: "2025-01-21T09:00:00Z", shippedAt: "2025-01-22T10:00:00Z", deliveredAt: "2025-01-24T14:00:00Z" },
  },
  {
    id: "ORD-1009",
    orderDate: "2024-12-05T10:00:00Z",
    status: "Cancelled",
    orderedBy: "Customer",
    totalAmountInr: 1799,
    customerName: "Kavita Reddy",
    customerEmail: "kavita.r@example.com",
    customerPhone: "+91 65432 10987",
    shippingAddress: "22, Jubilee Hills, Hyderabad, Telangana 500033",
    paymentMethod: "Netbanking",
    paymentStatus: "Refunded",
    transactionId: "TXN-5009-NB",
    items: [
      { id: "ITEM-1", productName: "Glow Boost Night Cream", quantity: 1, priceInr: 999 },
      { id: "ITEM-2", productName: "Cleansing Balm", quantity: 1, priceInr: 800 },
    ],
    timeline: { placedAt: "2024-12-05T10:00:00Z" },
  },
  {
    id: "ORD-1045",
    orderDate: "2025-03-12T08:30:00Z",
    status: "Processing",
    orderedBy: "Retailer",
    totalAmountInr: 6299,
    customerName: "Anil Kumar",
    customerEmail: "anil.k@example.com",
    customerPhone: "+91 98765 11223",
    shippingAddress: "5, MG Road, Secunderabad, Telangana 500003",
    paymentMethod: "COD",
    paymentStatus: "Pending",
    transactionId: "—",
    items: [
      { id: "ITEM-1", productName: "Vitamin C Serum", quantity: 2, priceInr: 1499 },
      { id: "ITEM-2", productName: "Retinol Cream", quantity: 1, priceInr: 1899 },
      { id: "ITEM-3", productName: "Sunscreen Stick", quantity: 2, priceInr: 701 },
    ],
    timeline: { placedAt: "2025-03-12T08:30:00Z", processingAt: "2025-03-12T10:00:00Z" },
  },
];

function formatDateTime(value: string, withTime = false) {
  const date = new Date(value);
  if (!withTime) {
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }
  return date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";
  const map: Record<OrderStatus, { className: string; icon: React.ReactNode }> = {
    Pending: { className: "bg-amber-50 text-amber-700", icon: <Clock className="mr-1.5 h-3.5 w-3.5" /> },
    Processing: { className: "bg-sky-50 text-sky-700", icon: <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> },
    Shipped: { className: "bg-violet-50 text-violet-700", icon: <Truck className="mr-1.5 h-3.5 w-3.5" /> },
    Delivered: { className: "bg-emerald-50 text-emerald-700", icon: <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> },
    Cancelled: { className: "bg-rose-50 text-rose-700", icon: <XCircle className="mr-1.5 h-3.5 w-3.5" /> },
  };
  const { className, icon } = map[status];
  return <span className={`${base} ${className}`}>{icon}{status}</span>;
}

function OrderDetailsContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    const found = orderId ? mockOrders.find((o) => o.id === orderId) ?? null : null;
    setOrder(found);
  }, [orderId]);

  const displayOrder = order;

  if (!orderId || !displayOrder) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="beauty-scroll flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1200px] p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-800">Order not found</h2>
                <p className="mt-1 max-w-sm text-center text-sm text-gray-500">
                  The order may have been removed or the link is invalid. Go back to the list to select an order.
                </p>
                <Button variant="outline" className="mt-6" asChild>
                  <Link href="/dashboard/order-management">Back to Order Management</Link>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const o = displayOrder;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1200px] space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Breadcrumb & back */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900" asChild>
                  <Link href="/dashboard/order-management">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Link>
                </Button>
                <span className="text-gray-300">|</span>
                <nav className="flex items-center gap-1.5 text-sm">
                  <Link href="/dashboard" className="text-gray-500 transition hover:text-gray-800">Dashboard</Link>
                  <span className="text-gray-400">/</span>
                  <Link href="/dashboard/order-management" className="text-gray-500 transition hover:text-gray-800">Order Management</Link>
                  <span className="text-gray-400">/</span>
                  <span className="font-medium text-gray-900">{o.id}</span>
                </nav>
              </div>
            </div>

            {/* Header card */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 bg-gradient-to-r from-pink-50 to-white px-6 py-6 sm:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                      <ShoppingBag className="h-7 w-7 text-pink-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">{o.id}</h1>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{o.customerName}</span>
                        <StatusBadge status={o.status} />
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${o.orderedBy === "Retailer" ? "bg-violet-100 text-violet-700" : "bg-sky-100 text-sky-700"}`}>
                          {o.orderedBy}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          ₹{o.totalAmountInr.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0" asChild>
                    <Link href="/dashboard/order-management">Back to list</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Customer & shipping */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-start gap-2 text-left">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-50 text-pink-500">
                    <User2 className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-gray-900">Customer & shipping</CardTitle>
                    <p className="text-xs text-gray-500">Contact and delivery address</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Name</p>
                      <p className="mt-1 flex items-center gap-1.5 text-gray-900">{o.customerName}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Phone</p>
                      <p className="mt-1 flex items-center gap-1.5 text-gray-900">{o.customerPhone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Email</p>
                      <p className="mt-1 break-all text-gray-900">{o.customerEmail}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Shipping address</p>
                      <p className="mt-1 flex items-start gap-1.5 text-gray-700">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                        <span className="whitespace-pre-line">{o.shippingAddress}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment details */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-start gap-2 text-left">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-gray-900">Payment details</CardTitle>
                    <p className="text-xs text-gray-500">Transaction and method</p>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Method</p>
                    <p className="mt-1 font-medium text-gray-900">{o.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Status</p>
                    <p className={`mt-1 font-medium ${
                      o.paymentStatus === "Paid" ? "text-emerald-700" : o.paymentStatus === "Refunded" ? "text-blue-700" : o.paymentStatus === "Pending" ? "text-amber-700" : "text-rose-700"
                    }`}>{o.paymentStatus}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Total</p>
                    <p className="mt-1 font-semibold text-gray-900">₹{o.totalAmountInr.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Transaction ID</p>
                    <p className="mt-1 font-mono text-xs text-gray-700">{o.transactionId}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Order timeline */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-start gap-2 text-left">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-gray-900">Order timeline</CardTitle>
                    <p className="text-xs text-gray-500">Key milestones</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">Order placed</p>
                        <p className="text-[11px] text-gray-500">{formatDateTime(o.timeline.placedAt, true)}</p>
                      </div>
                    </li>
                    {o.timeline.processingAt && (
                      <li className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                          <Clock className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">Processing</p>
                          <p className="text-[11px] text-gray-500">{formatDateTime(o.timeline.processingAt, true)}</p>
                        </div>
                      </li>
                    )}
                    {o.timeline.shippedAt && (
                      <li className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                          <Truck className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">Shipped</p>
                          <p className="text-[11px] text-gray-500">{formatDateTime(o.timeline.shippedAt, true)}</p>
                        </div>
                      </li>
                    )}
                    {o.timeline.deliveredAt && (
                      <li className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                          <PackageCheck className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">Delivered</p>
                          <p className="text-[11px] text-gray-500">{formatDateTime(o.timeline.deliveredAt, true)}</p>
                        </div>
                      </li>
                    )}
                  </ol>
                </CardContent>
              </Card>
            </div>

            {/* Order items */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-start gap-2 text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-50 text-pink-500">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-gray-900">Order items</CardTitle>
                  <p className="text-xs text-gray-500">{o.items.length} product(s) · Order date {formatDateTime(o.orderDate)}</p>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table className="min-w-[640px] text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-28 text-right">Qty</TableHead>
                      <TableHead className="w-32 text-right">Unit price</TableHead>
                      <TableHead className="w-32 text-right">Total</TableHead>
                      <TableHead className="w-36">Affiliate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {o.items.map((item, index) => {
                      const lineTotal = item.quantity * item.priceInr;
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="text-center text-gray-500">{index + 1}</TableCell>
                          <TableCell className="font-medium text-gray-900">{item.productName}</TableCell>
                          <TableCell className="text-right text-gray-700">{item.quantity}</TableCell>
                          <TableCell className="text-right text-gray-700">₹{item.priceInr.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="text-right font-semibold text-gray-900">₹{lineTotal.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="text-[12px] text-gray-600">
                            {item.affiliateName ?? "—"}
                            {typeof item.affiliateCommissionInr === "number" && (
                              <span className="block text-emerald-600">₹{item.affiliateCommissionInr.toLocaleString("en-IN")} commission</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Order total: ₹{o.totalAmountInr.toLocaleString("en-IN")}
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </div>
    }>
      <OrderDetailsContent />
    </Suspense>
  );
}