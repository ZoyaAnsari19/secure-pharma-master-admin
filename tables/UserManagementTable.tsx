"use client";

import { Button } from "@/components/ui/button";
import { DataTableShell, Column } from "./DataTableShell";

type UserRow = {
  id: number;
  name: string;
  email: string;
  tier: string;
  orders: string;
  status: string;
};

const columns: Column<UserRow>[] = [
  { key: "name", label: "User" },
  { key: "email", label: "Email" },
  { key: "tier", label: "Tier" },
  { key: "orders", label: "Orders" },
  { key: "status", label: "Status" },
];

const rows: UserRow[] = [
  {
    id: 1,
    name: "Nisha Gupta",
    email: "nisha@example.com",
    tier: "Gold",
    orders: "48",
    status: "Active",
  },
  {
    id: 2,
    name: "Karan Patel",
    email: "karan@example.com",
    tier: "Silver",
    orders: "21",
    status: "Active",
  },
  {
    id: 3,
    name: "Anjali Rao",
    email: "anjali@example.com",
    tier: "Platinum",
    orders: "82",
    status: "VIP",
  },
  {
    id: 4,
    name: "Vikram Singh",
    email: "vikram@example.com",
    tier: "Bronze",
    orders: "9",
    status: "On hold",
  },
  {
    id: 5,
    name: "Simran Kaur",
    email: "simran@example.com",
    tier: "Gold",
    orders: "32",
    status: "Active",
  },
];

export function UserManagementTable() {
  return (
    <DataTableShell
      title="User Management"
      columns={columns}
      data={rows}
      renderActions={() => (
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]">
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-[11px] text-amber-600"
          >
            Suspend
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-[11px] text-rose-600"
          >
            Delete
          </Button>
        </div>
      )}
    />
  );
}

