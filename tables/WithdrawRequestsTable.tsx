"use client";

import { Button } from "@/components/ui/button";
import { DataTableShell, Column } from "./DataTableShell";

type WithdrawRow = {
  id: number;
  affiliate: string;
  amount: string;
  method: string;
  status: string;
  requestedOn: string;
};

const columns: Column<WithdrawRow>[] = [
  { key: "affiliate", label: "Affiliate" },
  { key: "amount", label: "Amount" },
  { key: "method", label: "Method" },
  { key: "status", label: "Status" },
  { key: "requestedOn", label: "Requested On" },
];

const rows: WithdrawRow[] = [
  {
    id: 1,
    affiliate: "GlowWithIra",
    amount: "₹18,500",
    method: "UPI",
    status: "Pending",
    requestedOn: "Today, 09:32 AM",
  },
  {
    id: 2,
    affiliate: "BlushByMeera",
    amount: "₹12,300",
    method: "Bank transfer",
    status: "Processing",
    requestedOn: "Today, 08:15 AM",
  },
  {
    id: 3,
    affiliate: "SkinStory",
    amount: "₹9,750",
    method: "UPI",
    status: "Completed",
    requestedOn: "Yesterday, 05:40 PM",
  },
  {
    id: 4,
    affiliate: "MinimalGlow",
    amount: "₹7,120",
    method: "Bank transfer",
    status: "Pending",
    requestedOn: "Yesterday, 01:17 PM",
  },
];

export function WithdrawRequestsTable() {
  return (
    <DataTableShell
      title="Withdraw Requests"
      columns={columns}
      data={rows}
      renderActions={() => (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-[11px] text-emerald-600"
          >
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-[11px] text-amber-600"
          >
            Hold
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-[11px] text-rose-600"
          >
            Reject
          </Button>
        </div>
      )}
    />
  );
}

