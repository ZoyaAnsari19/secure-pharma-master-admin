"use client";

import { Button } from "@/components/ui/button";
import { DataTableShell, Column } from "./DataTableShell";

type OrderRow = {
  id: number;
  orderId: string;
  customer: string;
  total: string;
  status: string;
  placedOn: string;
};

const columns: Column<OrderRow>[] = [
  { key: "orderId", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "total", label: "Total" },
  { key: "status", label: "Status" },
  { key: "placedOn", label: "Placed On" },
];

const rows: OrderRow[] = [
  {
    id: 1,
    orderId: "#TB-9821",
    customer: "Riya Malhotra",
    total: "₹2,340",
    status: "Delivered",
    placedOn: "Today, 10:02 AM",
  },
  {
    id: 2,
    orderId: "#TB-9819",
    customer: "Sagar Arora",
    total: "₹1,120",
    status: "Shipped",
    placedOn: "Today, 09:48 AM",
  },
  {
    id: 3,
    orderId: "#TB-9807",
    customer: "Palak Sethi",
    total: "₹3,890",
    status: "Processing",
    placedOn: "Yesterday, 04:37 PM",
  },
  {
    id: 4,
    orderId: "#TB-9798",
    customer: "Neeraj Kumar",
    total: "₹780",
    status: "Pending",
    placedOn: "Yesterday, 01:19 PM",
  },
];

export function OrdersTable() {
  return (
    <DataTableShell
      title="Recent Orders"
      columns={columns}
      data={rows}
      renderActions={() => (
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]">
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-[11px] text-amber-600"
          >
            Refund
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-[11px] text-rose-600"
          >
            Cancel
          </Button>
        </div>
      )}
    />
  );
}

