"use client";

import { useMemo, useState } from "react";
import { SideBar } from "@/components/sideBar";
import { TopBar } from "@/components/topBar";
import { KpiCards } from "@/components/ui/kpiCards";
import { DataTable, Column } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Shield, UserCheck, UserX, Users } from "lucide-react";

type UserStatus = "Active" | "Blocked";

type UserRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  clientWebsite: string;
  ordersCount: number;
  status: UserStatus;
  joinedDate: string;
};

const initialUsers: UserRow[] = [
  {
    id: 1,
    name: "Aditi Sharma",
    email: "aditi.sharma@example.com",
    phone: "+91 98765 43210",
    clientWebsite: "mumbai.glow.truebeauty.in",
    ordersCount: 32,
    status: "Active",
    joinedDate: "2024-01-10",
  },
  {
    id: 2,
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    phone: "+91 91234 56789",
    clientWebsite: "delhi.blush.truebeauty.in",
    ordersCount: 5,
    status: "Blocked",
    joinedDate: "2023-11-22",
  },
  {
    id: 3,
    name: "Sara Khan",
    email: "sara.khan@example.com",
    phone: "+91 99887 76655",
    clientWebsite: "pune.skincraft.truebeauty.in",
    ordersCount: 18,
    status: "Active",
    joinedDate: "2023-09-05",
  },
  {
    id: 4,
    name: "Vikram Mehta",
    email: "vikram.mehta@example.com",
    phone: "+91 87654 32109",
    clientWebsite: "bangalore.minimal.truebeauty.in",
    ordersCount: 2,
    status: "Active",
    joinedDate: "2024-02-01",
  },
  {
    id: 5,
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+91 76543 21098",
    clientWebsite: "chennai.radiant.truebeauty.in",
    ordersCount: 0,
    status: "Blocked",
    joinedDate: "2022-12-14",
  },
];

const userColumns: Column<UserRow>[] = [
  { key: "name", label: "User Name" },
  { key: "clientWebsite", label: "Client Website" },
  {
    key: "ordersCount",
    label: "Orders Count",
    render: (row) => (
      <span className="text-sm font-medium text-gray-800">{row.ordersCount}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
          row.status === "Active"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-rose-50 text-rose-700"
        }`}
      >
        {row.status}
      </span>
    ),
  },
  {
    key: "joinedDate",
    label: "Joined Date",
    render: (row) =>
      new Date(row.joinedDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [clientFilter, setClientFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | UserStatus>("All");

  const clientOptions = useMemo(() => {
    const websites = Array.from(new Set(users.map((u) => u.clientWebsite)));
    return ["All", ...websites];
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesClient =
        clientFilter === "All" || u.clientWebsite === clientFilter;
      const matchesStatus =
        statusFilter === "All" || u.status === statusFilter;
      return matchesClient && matchesStatus;
    });
  }, [users, clientFilter, statusFilter]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const blockedUsers = users.filter((u) => u.status === "Blocked").length;
  const newUsers = users.filter((u) => {
    const joined = new Date(u.joinedDate);
    const now = new Date();
    const diffDays = (now.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  }).length;

  const handleToggleBlock = (user: UserRow) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" }
          : u
      )
    );
  };

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
                  User Management
                </h1>
                <p className="text-xs text-gray-500">
                  View and manage all end-users across client websites.
                </p>
              </div>
            </div>

            {/* User statistics cards */}
            <KpiCards
              items={[
                {
                  title: "Total Users",
                  value: totalUsers,
                  delta: "Across all client websites",
                  icon: <Users className="h-4 w-4" />,
                },
                {
                  title: "Active Users",
                  value: activeUsers,
                  delta: "Can sign in and place orders",
                  icon: <UserCheck className="h-4 w-4" />,
                },
                {
                  title: "Blocked Users",
                  value: blockedUsers,
                  delta: "Access temporarily restricted",
                  icon: <UserX className="h-4 w-4" />,
                },
                {
                  title: "New Users (30d)",
                  value: newUsers,
                  delta: "Joined in the last 30 days",
                  icon: <Shield className="h-4 w-4" />,
                },
              ]}
            />

            {/* Users table */}
            <DataTable<UserRow>
              title="Platform Users"
              columns={userColumns}
              data={filteredUsers}
              pageSize={10}
              searchPlaceholder="Search users by name, email or domain..."
              hideFiltersButton
              showIndexColumn
              renderActionMenuItems={(row) => (
                <>
                  <DropdownMenuItem className="flex items-center gap-2 text-[13px] text-slate-900 hover:bg-gray-50">
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleToggleBlock(row)}
                    className="flex items-center gap-2 text-[13px] text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                  >
                    <span>{row.status === "Active" ? "Block User" : "Unblock User"}</span>
                  </DropdownMenuItem>
                </>
              )}
              rightHeader={
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                    className="h-9 w-28 rounded-full border border-pink-100 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  >
                    {clientOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === "All" ? "All" : opt}
                      </option>
                    ))}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as "All" | UserStatus)
                    }
                    className="h-9 w-28 rounded-full border border-pink-100 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  >
                    <option value="All">All statuses</option>
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
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