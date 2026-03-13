"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SideBar } from "@/components/sideBar";
import { TopBar } from "@/components/topBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowLeft,
  CalendarDays,
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
} from "lucide-react";
import Link from "next/link";

type OrderStatus = "Completed" | "Pending" | "Cancelled";

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  priceInr: number;
};

type OrderDetail = {
  id: string;
  orderDate: string;
  clientName: string;
  clientWebsite: string;
  status: OrderStatus;
  totalAmountInr: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: "UPI" | "Card" | "Netbanking" | "COD";
  paymentStatus: "Paid" | "Pending" | "Failed" | "Refunded";
  transactionId: string;
  items: OrderItem[];
  timeline: {
    placedAt: string;
    processingAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
};

// Temporary mock data – in a real app this would come from the backend.
const mockOrders: OrderDetail[] = [
  {
    id: "ORD-1042",
    orderDate: "2025-03-08T10:30:00Z",
    clientName: "Glow Studio Mumbai",
    clientWebsite: "mumbai.glow.truebeauty.in",
    status: "Completed",
    totalAmountInr: 2499,
    customerName: "Aditi Sharma",
    customerEmail: "aditi.sharma@example.com",
    customerPhone: "+91 98765 43210",
    shippingAddress:
      "Flat 704, Emerald Heights, Lokhandwala Complex,\nAndheri West, Mumbai, Maharashtra 400053",
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    transactionId: "TXN-8842-IND-UPI",
    items: [
      {
        id: "ITEM-1",
        productName: "HydraGlow Facial Kit",
        quantity: 1,
        priceInr: 2499,
      },
    ],
    timeline: {
      placedAt: "2025-03-08T10:30:00Z",
      processingAt: "2025-03-08T11:05:00Z",
      shippedAt: "2025-03-09T09:15:00Z",
      deliveredAt: "2025-03-11T16:45:00Z",
    },
  },
];

function formatDateTime(value: string, withTime = false) {
  const date = new Date(value);
  if (!withTime) {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadge(status: OrderStatus) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";
  if (status === "Completed") {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700`}>
        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
        Completed
      </span>
    );
  }
  if (status === "Pending") {
    return (
      <span className={`${base} bg-amber-50 text-amber-700`}>
        <Clock className="mr-1.5 h-3.5 w-3.5" />
        Pending
      </span>
    );
  }
  return (
    <span className={`${base} bg-rose-50 text-rose-700`}>
      <Clock className="mr-1.5 h-3.5 w-3.5" />
      Cancelled
    </span>
  );
}

function OrderDetailsContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const order = useMemo(
    () => mockOrders.find((o) => o.id === orderId) ?? null,
    [orderId]
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <SideBar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1200px] space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Link
                  href="/orderManagement"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-pink-100 bg-white text-slate-500 shadow-sm hover:border-pink-200 hover:bg-pink-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                    Order Details
                  </h1>
                  <p className="text-xs text-gray-500">
                    Complete summary, user information and timeline for this
                    order.
                  </p>
                </div>
              </div>
            </div>

            {!order ? (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center text-sm text-slate-500">
                  Order not found. Please go back to the Orders list and try
                  again.
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Client information + payment details row */}
                <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
                  <Card>
                    <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                          <ShoppingBag className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold text-gray-900">
                            Client Information
                          </CardTitle>
                          <p className="text-xs text-gray-500">
                            The client website and brand this order belongs to.
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid gap-4 text-sm text-gray-800 sm:grid-cols-3">
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Client Name
                          </dt>
                          <dd className="mt-1 text-xs">{order.clientName}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Client Website
                          </dt>
                          <dd className="mt-1 text-xs text-pink-600">
                            {order.clientWebsite}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-start gap-2 text-left">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-gray-900">
                          Payment Details
                        </CardTitle>
                        <p className="text-xs text-gray-500">
                          Transaction and payment information.
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 text-xs text-gray-800 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                          Payment Method
                        </p>
                        <p className="mt-1 text-xs">{order.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                          Payment Status
                        </p>
                        <p className="mt-1 text-xs font-medium text-emerald-700">
                          {order.paymentStatus}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                          Total Amount
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-900">
                          ₹ {order.totalAmountInr.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                          Transaction ID
                        </p>
                        <p className="mt-1 text-xs font-mono text-slate-700">
                          {order.transactionId}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
                  {/* User info */}
                  <div className="space-y-6">
                    {/* User information */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-start gap-2 text-left">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                          <User2 className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold text-gray-900">
                            User Information
                          </CardTitle>
                          <p className="text-xs text-gray-500">
                            Basic contact and shipping details.
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 text-xs text-gray-800">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                              User Name
                            </p>
                            <p className="flex items-center gap-1.5 text-xs">
                              <User2 className="h-3.5 w-3.5 text-slate-400" />
                              {order.customerName}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                              Phone Number
                            </p>
                            <p className="flex items-center gap-1.5 text-xs">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              {order.customerPhone}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                              Email
                            </p>
                            <p className="flex items-center gap-1.5 break-all text-xs">
                              <Mail className="h-3.5 w-3.5 text-slate-400" />
                              {order.customerEmail}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Shipping Address
                          </p>
                          <p className="flex items-start gap-1.5 text-xs">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 text-slate-400" />
                            <span className="whitespace-pre-line">
                              {order.shippingAddress}
                            </span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-6">
                    {/* Order timeline */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-start gap-2 text-left">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                          <Truck className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold text-gray-900">
                            Order Timeline
                          </CardTitle>
                          <p className="text-xs text-gray-500">
                            Key milestones from placement to delivery.
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ol className="space-y-3 text-xs text-gray-800">
                          <li className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </span>
                            <div>
                              <p className="font-medium">Order Placed</p>
                              <p className="text-[11px] text-gray-500">
                                {formatDateTime(order.timeline.placedAt, true)}
                              </p>
                            </div>
                          </li>
                          {order.timeline.processingAt && (
                            <li className="flex items-start gap-3">
                              <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                                <Clock className="h-3.5 w-3.5" />
                              </span>
                              <div>
                                <p className="font-medium">Processing</p>
                                <p className="text-[11px] text-gray-500">
                                  {formatDateTime(
                                    order.timeline.processingAt,
                                    true
                                  )}
                                </p>
                              </div>
                            </li>
                          )}
                          {order.timeline.shippedAt && (
                            <li className="flex items-start gap-3">
                              <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                                <Truck className="h-3.5 w-3.5" />
                              </span>
                              <div>
                                <p className="font-medium">Shipped</p>
                                <p className="text-[11px] text-gray-500">
                                  {formatDateTime(
                                    order.timeline.shippedAt,
                                    true
                                  )}
                                </p>
                              </div>
                            </li>
                          )}
                          {order.timeline.deliveredAt && (
                            <li className="flex items-start gap-3">
                              <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                <PackageCheck className="h-3.5 w-3.5" />
                              </span>
                              <div>
                                <p className="font-medium">Delivered</p>
                                <p className="text-[11px] text-gray-500">
                                  {formatDateTime(
                                    order.timeline.deliveredAt,
                                    true
                                  )}
                                </p>
                              </div>
                            </li>
                          )}
                        </ol>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Order items table - full width */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-start gap-2 text-left">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-gray-900">
                        Order Items
                      </CardTitle>
                      <p className="text-xs text-gray-500">
                        Products purchased in this order.
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table className="min-w-[640px] text-xs">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16 text-center">
                            Sr No.
                          </TableHead>
                          <TableHead>Product Name</TableHead>
                          <TableHead className="w-24 text-right">
                            Quantity
                          </TableHead>
                          <TableHead className="w-32 text-right">
                            Price
                          </TableHead>
                          <TableHead className="w-32 text-right">
                            Total
                          </TableHead>
                          <TableHead className="w-32 text-right">
                            Order Status
                          </TableHead>
                          <TableHead className="w-40 text-right">
                            Order Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map((item, index) => {
                          const lineTotal = item.quantity * item.priceInr;
                          return (
                            <TableRow key={item.id}>
                              <TableCell className="text-center text-xs text-slate-500">
                                {index + 1}
                              </TableCell>
                              <TableCell className="text-xs text-slate-800">
                                {item.productName}
                              </TableCell>
                              <TableCell className="text-right text-xs text-slate-700">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-right text-xs text-slate-700">
                                ₹ {item.priceInr.toLocaleString("en-IN")}
                              </TableCell>
                              <TableCell className="text-right text-xs font-semibold text-slate-900">
                                ₹ {lineTotal.toLocaleString("en-IN")}
                              </TableCell>
                              <TableCell className="text-right text-[11px] text-slate-700">
                                {order.status}
                              </TableCell>
                              <TableCell className="text-right text-[11px] text-slate-700">
                                {formatDateTime(order.orderDate)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading order details...</div>}>
      <OrderDetailsContent />
    </Suspense>
  );
}

