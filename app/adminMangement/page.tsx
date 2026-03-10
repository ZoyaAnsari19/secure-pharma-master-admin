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
import { KpiCards } from "@/components/ui/kpiCards";
import { SideBar } from "@/components/sideBar";
import { TopBar } from "@/components/topBar";
import {
  Plus,
  Shield,
  UserCheck,
  UserX,
  Layers,
  MoreVertical,
  Pencil,
  PauseCircle,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  {
    key: "id",
    label: "Sr No.",
    render: (_row, index) => (
      <span className="text-xs text-gray-500">{index + 1}</span>
    ),
  },
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminRow | null>(null);
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

  const kpiItems = useMemo(() => {
    const active = admins.filter((a) => a.status === "Active").length;
    const suspended = admins.filter((a) => a.status === "Suspended").length;
    const roles = new Set(admins.map((a) => a.role)).size;
    return [
      {
        title: "Total Admins",
        value: admins.length,
        delta: "On platform",
        icon: <Shield className="h-4 w-4" />,
      },
      {
        title: "Active Admins",
        value: active,
        delta: "Currently active",
        icon: <UserCheck className="h-4 w-4" />,
      },
      {
        title: "Suspended",
        value: suspended,
        delta: "Access revoked",
        icon: <UserX className="h-4 w-4" />,
      },
      {
        title: "Roles",
        value: roles,
        delta: "Distinct roles",
        icon: <Layers className="h-4 w-4" />,
      },
    ];
  }, [admins]);

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

  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Operations",
    permissions: "" as string,
    status: "Active" as "Active" | "Suspended",
  });

  const openEditModal = (admin: AdminRow) => {
    setEditingAdmin(admin);
    setEditForm({
      fullName: admin.name,
      email: admin.email,
      password: "",
      role: admin.role,
      permissions: admin.permissions.join(", "),
      status: admin.status,
    });
    setEditModalOpen(true);
  };

  const handleUpdateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === editingAdmin.id
          ? {
              ...a,
              name: editForm.fullName,
              email: editForm.email,
              role: editForm.role,
              permissions: editForm.permissions
                ? editForm.permissions.split(",").map((p) => p.trim())
                : [],
              status: editForm.status,
            }
          : a
      )
    );
    setEditModalOpen(false);
    setEditingAdmin(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <SideBar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Page header: title left, Add button right */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                Admin Management
              </h1>
              <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full sm:w-auto"
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
                          <Button type="submit" variant="primary">
                            Add Admin
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
              </Dialog>
            </div>

            <KpiCards items={kpiItems} />
            {/* Edit Admin modal (prefilled) */}
            <Dialog
              open={editModalOpen}
              onOpenChange={(open) => {
                setEditModalOpen(open);
                if (!open) setEditingAdmin(null);
              }}
            >
              <DialogContent className="gap-6">
                <DialogHeader>
                  <DialogTitle>Edit Admin</DialogTitle>
                </DialogHeader>
                {editingAdmin && (
                  <form onSubmit={handleUpdateAdmin} className="grid gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Full Name
                      </label>
                      <Input
                        value={editForm.fullName}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            fullName: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Password
                      </label>
                      <Input
                        type="password"
                        value={editForm.password}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            password: e.target.value,
                          }))
                        }
                        placeholder="Update to reset (optional)"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Role
                      </label>
                      <select
                        value={editForm.role}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            role: e.target.value,
                          }))
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
                        value={editForm.permissions}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            permissions: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Status
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            status: e.target
                              .value as "Active" | "Suspended",
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
                        onClick={() => {
                          setEditModalOpen(false);
                          setEditingAdmin(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                      >
                        Save changes
                      </Button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>
            <DataTable<AdminRow>
              title="Admins"
              columns={adminColumns}
              data={filteredByRole}
              searchPlaceholder="Search admins..."
              pageSize={8}
              hideFiltersButton
              rightHeader={
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
              }
              renderActions={(row) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full border-pink-100 bg-white text-slate-500 shadow-none hover:border-pink-200 hover:bg-pink-50 hover:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => openEditModal(row)}
                    className="text-slate-700 hover:bg-pink-50"
                  >
                    <Pencil className="h-3.5 w-3.5 text-slate-500" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSuspend(row.id)}
                    className="text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                  >
                    <PauseCircle className="h-3.5 w-3.5 text-amber-500" />
                    <span>{row.status === "Active" ? "Suspend" : "Activate"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(row.id)}
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
