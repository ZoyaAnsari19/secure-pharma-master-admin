"use client";

import { Button } from "@/components/ui/button";
import { DataTableShell, Column } from "./DataTableShell";

type AdminRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
};

const columns: Column<AdminRow>[] = [
  { key: "name", label: "Admin" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "lastActive", label: "Last Active" },
];

const rows: AdminRow[] = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya@truebeauty.in",
    role: "Super Admin",
    status: "Active",
    lastActive: "2 min ago",
  },
  {
    id: 2,
    name: "Ankit Verma",
    email: "ankit@truebeauty.in",
    role: "Operations",
    status: "Active",
    lastActive: "12 min ago",
  },
  {
    id: 3,
    name: "Sara Khan",
    email: "sara@truebeauty.in",
    role: "Marketing",
    status: "Suspended",
    lastActive: "3 days ago",
  },
  {
    id: 4,
    name: "Rahul Jain",
    email: "rahul@truebeauty.in",
    role: "Support",
    status: "Active",
    lastActive: "58 min ago",
  },
  {
    id: 5,
    name: "Divya Mehta",
    email: "divya@truebeauty.in",
    role: "Finance",
    status: "Active",
    lastActive: "1 hr ago",
  },
];

export function AdminManagementTable() {
  return (
    <DataTableShell
      title="Admin Management"
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

