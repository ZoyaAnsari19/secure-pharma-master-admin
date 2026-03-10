"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SideBar } from "@/components/sideBar";
import { TopBar } from "@/components/topBar";
import { Plus } from "lucide-react";

type AdminRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: "Active" | "Suspended";
  lastActive: string;
};

const ROLES = ["All", "Super Admin", "Operations", "Marketing", "Support", "Finance"];

const initialAdmins: AdminRow[] = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya@truebeauty.in",
    role: "Super Admin",
    permissions: ["Users", "Orders", "Settings"],
    status: "Active",
    lastActive: "2 min ago",
  },
  {
    id: 2,
    name: "Ankit Verma",
    email: "ankit@truebeauty.in",
    role: "Operations",
    permissions: ["Orders", "Inventory"],
    status: "Active",
    lastActive: "12 min ago",
  },
  {
    id: 3,
    name: "Sara Khan",
    email: "sara@truebeauty.in",
    role: "Marketing",
    permissions: ["Campaigns", "Analytics"],
    status: "Suspended",
    lastActive: "3 days ago",
  },
  {
    id: 4,
    name: "Rahul Jain",
    email: "rahul@truebeauty.in",
    role: "Support",
    permissions: ["Tickets", "Users"],
    status: "Active",
    lastActive: "58 min ago",
  },
  {
    id: 5,
    name: "Divya Mehta",
    email: "divya@truebeauty.in",
    role: "Finance",
    permissions: ["Payments", "Reports"],
    status: "Active",
    lastActive: "1 hr ago",
  },
];

const adminColumns: Column<AdminRow>[] = [
  { key: "name", label: "Admin Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  {
    key: "permissions",
    label: "Permissions",
    render: (row) => (
      <span className="text-xs text-gray-600">
        {Array.isArray(row.permissions) ? row.permissions.join(", ") : String(row.permissions)}
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
  { key: "lastActive", label: "Last Active" },
];

export default function AdminManagementPage() {
  const [roleFilter, setRoleFilter] = useState("All");
  const [admins, setAdmins] = useState<AdminRow[]>(initialAdmins);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Operations",
    permissions: "" as string,
    status: "Active" as "Active" | "Suspended",
  });

  const filteredByRole = useMemo(() => {
    if (roleFilter === "All") return admins;
    return admins.filter((a) => a.role === roleFilter);
  }, [admins, roleFilter]);

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdmin: AdminRow = {
      id: admins.length + 1,
      name: form.fullName,
      email: form.email,
      role: form.role,
      permissions: form.permissions ? form.permissions.split(",").map((p) => p.trim()) : [],
      status: form.status,
      lastActive: "Just now",
    };
    setAdmins((prev) => [...prev, newAdmin]);
    setForm({
      fullName: "",
      email: "",
      password: "",
      role: "Operations",
      permissions: "",
      status: "Active",
    });
    setAddModalOpen(false);
  };

  const handleSuspend = (id: number) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === "Active" ? "Suspended" : "Active" } : a))
    );
  };

  const handleDelete = (id: number) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <SideBar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
            <DataTable<AdminRow>
              title="Admin Management"
              columns={adminColumns}
              data={filteredByRole}
              searchPlaceholder="Search admins..."
              pageSize={8}
              hideFiltersButton
              rightHeader={
                <>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="h-9 rounded-full border border-pink-100 bg-white px-3 text-xs text-slate-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r === "All" ? "All" : r}>
                        {r === "All" ? "All roles" : r}
                      </option>
                    ))}
                  </select>
                  <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="rounded-full bg-pink-500 text-white hover:bg-pink-600"
                      >
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        Add Admin
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="gap-6">
                      <DialogHeader>
                        <DialogTitle>Add Admin</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddAdmin} className="grid gap-4">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Full Name
                          </label>
                          <Input
                            value={form.fullName}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, fullName: e.target.value }))
                            }
                            placeholder="e.g. Priya Sharma"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Email
                          </label>
                          <Input
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, email: e.target.value }))
                            }
                            placeholder="admin@truebeauty.in"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Password
                          </label>
                          <Input
                            type="password"
                            value={form.password}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, password: e.target.value }))
                            }
                            placeholder="••••••••"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Role
                          </label>
                          <select
                            value={form.role}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, role: e.target.value }))
                            }
                            className="h-9 w-full rounded-full border border-pink-100 bg-white px-4 text-sm text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                          >
                            {ROLES.filter((r) => r !== "All").map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Permissions (comma-separated)
                          </label>
                          <Input
                            value={form.permissions}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, permissions: e.target.value }))
                            }
                            placeholder="e.g. Users, Orders, Settings"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Status
                          </label>
                          <select
                            value={form.status}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                status: e.target.value as "Active" | "Suspended",
                              }))
                            }
                            className="h-9 w-full rounded-full border border-pink-100 bg-white px-4 text-sm text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                          >
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setAddModalOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
                            Add Admin
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </>
              }
              renderActions={(row) => (
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-[11px]"
                    onClick={() => {}}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-[11px] text-amber-600"
                    onClick={() => handleSuspend(row.id)}
                  >
                    {row.status === "Active" ? "Suspend" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-[11px] text-rose-600"
                    onClick={() => handleDelete(row.id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
