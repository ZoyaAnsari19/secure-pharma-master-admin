"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SideBar } from "@/components/sideBar";
import { TopBar } from "@/components/topBar";
import { KpiCards } from "@/components/ui/kpiCards";
import { DataTable, Column } from "@/components/ui/table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Shield, UserCheck, UserX, Users } from "lucide-react";

type ClientStatus = "Active" | "Inactive";

type UserRow = {
  id: number;
  clientName: string;
  clientWebsite: string;
  totalUsers: number;
  affiliateUsers: number;
  status: ClientStatus;
  joinedDate: string;
};

const initialUsers: UserRow[] = [
  {
    id: 1,
    clientName: "Glow Studio Mumbai",
    clientWebsite: "mumbai.glow.truebeauty.in",
    status: "Active",
    totalUsers: 320,
    affiliateUsers: 28,
    joinedDate: "2024-01-10",
  },
  {
    id: 2,
    clientName: "Blush Hub Delhi",
    clientWebsite: "delhi.blush.truebeauty.in",
    status: "Inactive",
    totalUsers: 85,
    affiliateUsers: 6,
    joinedDate: "2023-11-22",
  },
  {
    id: 3,
    clientName: "SkinCraft Pune",
    clientWebsite: "pune.skincraft.truebeauty.in",
    status: "Active",
    totalUsers: 140,
    affiliateUsers: 12,
    joinedDate: "2023-09-05",
  },
  {
    id: 4,
    clientName: "MinimalGlow Bangalore",
    clientWebsite: "bangalore.minimal.truebeauty.in",
    status: "Active",
    totalUsers: 52,
    affiliateUsers: 4,
    joinedDate: "2024-02-01",
  },
  {
    id: 5,
    clientName: "Radiant Touch Chennai",
    clientWebsite: "chennai.radiant.truebeauty.in",
    status: "Inactive",
    totalUsers: 19,
    affiliateUsers: 1,
    joinedDate: "2022-12-14",
  },
];

const userColumns: Column<UserRow>[] = [
  { key: "clientName", label: "Client Name" },
  { key: "clientWebsite", label: "Client Website" },
  {
    key: "totalUsers",
    label: "Registered Users",
    render: (row) => (
      <span className="text-sm font-medium text-gray-800">{row.totalUsers}</span>
    ),
  },
  {
    key: "affiliateUsers",
    label: "Affiliate Users",
    render: (row) => (
      <span className="text-sm font-medium text-gray-800">
        {row.affiliateUsers}
      </span>
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
            : "bg-amber-50 text-amber-700"
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
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [clientFilter, setClientFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | ClientStatus>("All");

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

  const totalUsersRaw = users.reduce(
    (acc, u) => acc + (typeof u.totalUsers === "number" ? u.totalUsers : 0),
    0
  );
  const activeClientsRaw = users.filter((u) => u.status === "Active").length;
  const inactiveClientsRaw = users.filter((u) => u.status === "Inactive").length;
  const newUsersRaw = users.filter((u) => {
    const joined = new Date(u.joinedDate);
    const now = new Date();
    const diffDays = (now.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  }).length;

  const totalUsers = Number.isFinite(totalUsersRaw) ? totalUsersRaw : 0;
  const activeClients = Number.isFinite(activeClientsRaw) ? activeClientsRaw : 0;
  const inactiveClients = Number.isFinite(inactiveClientsRaw)
    ? inactiveClientsRaw
    : 0;
  const newUsers = Number.isFinite(newUsersRaw) ? newUsersRaw : 0;

  const handleToggleBlock = (user: UserRow) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
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
        title: "Total Registered Users",
        value: totalUsers,
        delta: "Across all client websites",
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: "Active Clients",
        value: activeClients,
        delta: "Clients currently live",
        icon: <UserCheck className="h-4 w-4" />,
      },
      {
        title: "Inactive Clients",
        value: inactiveClients,
        delta: "Clients with low or no activity",
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
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/userManagement/userDetails?id=${row.id}`)
                    }
                    className="flex items-center gap-2 text-[13px] text-slate-900 hover:bg-gray-50"
                  >
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleToggleBlock(row)}
                    className="flex items-center gap-2 text-[13px] text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                  >
                    <span>
                      {row.status === "Active" ? "Deactivate Client" : "Activate Client"}
                    </span>
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
                      setStatusFilter(e.target.value as "All" | ClientStatus)
                    }
                    className="h-9 w-28 rounded-full border border-pink-100 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  >
                    <option value="All">All statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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