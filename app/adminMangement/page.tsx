"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiltersBar } from "@/components/ui/filters";
import { DataTable, Column } from "@/components/ui/table";
import {
  SideDrawer,
  SideDrawerContent,
  SideDrawerHeader,
  SideDrawerTitle,
  SideDrawerFooter,
  SideDrawerTrigger,
} from "@/components/ui/sideDrawer";
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
  Eye,
  User,
  Mail,
  Phone,
  BadgeCheck,
  KeyRound,
  Clock,
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
  phone: string;
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
    phone: "9876543210",
    role: "Super Admin",
    permissions: ["Users", "Orders", "Settings"],
    status: "Active",
    lastActive: "2 min ago",
  },
  {
    id: 2,
    name: "Ankit Verma",
    email: "ankit@truebeauty.in",
    phone: "9123456789",
    role: "Operations",
    permissions: ["Orders", "Inventory"],
    status: "Active",
    lastActive: "12 min ago",
  },
  {
    id: 3,
    name: "Sara Khan",
    email: "sara@truebeauty.in",
    phone: "9988776655",
    role: "Marketing",
    permissions: ["Campaigns", "Analytics"],
    status: "Suspended",
    lastActive: "3 days ago",
  },
  {
    id: 4,
    name: "Rahul Jain",
    email: "rahul@truebeauty.in",
    phone: "8765432109",
    role: "Support",
    permissions: ["Tickets", "Users"],
    status: "Active",
    lastActive: "58 min ago",
  },
  {
    id: 5,
    name: "Divya Mehta",
    email: "divya@truebeauty.in",
    phone: "7654321098",
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
  const [search, setSearch] = useState("");
  const [admins, setAdmins] = useState<AdminRow[]>(initialAdmins);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingAdmin, setViewingAdmin] = useState<AdminRow | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminRow | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
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
        title: "Total Sub Admins",
        value: admins.length,
        delta: "On platform",
        icon: <Shield className="h-4 w-4" />,
      },
      {
        title: "Active Sub Admins",
        value: active,
        delta: "Currently active",
        icon: <UserCheck className="h-4 w-4" />,
      },
      {
        title: "Suspended Sub Admins",
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
      phone: form.phone,
      role: form.role,
      permissions: form.permissions ? form.permissions.split(",").map((p) => p.trim()) : [],
      status: form.status,
      lastActive: "Just now",
    };
    setAdmins((prev) => [...prev, newAdmin]);
    setForm({
      fullName: "",
      email: "",
      phone: "",
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
    phone: "",
    role: "Operations",
    permissions: "" as string,
    status: "Active" as "Active" | "Suspended",
  });

  const openEditModal = (admin: AdminRow) => {
    setEditingAdmin(admin);
    setEditForm({
      fullName: admin.name,
      email: admin.email,
      phone: admin.phone,
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
              phone: editForm.phone,
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
                Super Sub Admin Management
              </h1>
              <SideDrawer open={addModalOpen} onOpenChange={setAddModalOpen}>
                <SideDrawerTrigger asChild>
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Admin
                  </Button>
                </SideDrawerTrigger>
                <SideDrawerContent className="gap-4">
                      <SideDrawerHeader>
                        <SideDrawerTitle>Add Admin</SideDrawerTitle>
                      </SideDrawerHeader>
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
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setForm((f) => ({ ...f, phone: v }));
                            }}
                            placeholder="e.g. 9876543210"
                            maxLength={10}
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
                        <SideDrawerFooter>
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
                        </SideDrawerFooter>
                      </form>
                    </SideDrawerContent>
              </SideDrawer>
            </div>

            <KpiCards items={kpiItems} />
            {/* View Admin (read-only) side drawer — modern SaaS layout */}
            <SideDrawer
              open={viewModalOpen}
              onOpenChange={(open) => {
                setViewModalOpen(open);
                if (!open) setViewingAdmin(null);
              }}
            >
              <SideDrawerContent className="flex h-full flex-col gap-0 overflow-hidden p-0">
                <SideDrawerHeader className="mb-0 flex h-16 flex-shrink-0 -mx-6 flex-row items-center border-b border-gray-200 bg-pink-50 px-6 pr-14">
                  <div className="flex flex-col justify-center gap-0.5">
                    <SideDrawerTitle className="text-base font-semibold leading-tight text-gray-900">
                      Admin Details
                    </SideDrawerTitle>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                      Read-only view
                    </p>
                  </div>
                </SideDrawerHeader>
                {viewingAdmin && (
                  <>
                    <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
                      {/* Profile / Basic info card */}
                      <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Basic information
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                              <User className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Full name
                              </p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                {viewingAdmin.name}
                              </p>
                            </div>
                          </div>
                          <div className="h-px bg-gray-200/80" />
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                              <Mail className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Email
                              </p>
                              <p className="mt-0.5 break-all text-sm font-semibold text-gray-900">
                                {viewingAdmin.email}
                              </p>
                            </div>
                          </div>
                          <div className="h-px bg-gray-200/80" />
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                              <Phone className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Phone number
                              </p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                {viewingAdmin.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>

                      <div className="my-4 h-px bg-gray-200/60" />

                      {/* Role & access card */}
                      <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Role & access
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                              <BadgeCheck className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Role
                              </p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                {viewingAdmin.role}
                              </p>
                            </div>
                          </div>
                          <div className="h-px bg-gray-200/80" />
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                              <KeyRound className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Permissions
                              </p>
                              {viewingAdmin.permissions.length ? (
                                <div className="flex flex-wrap gap-2">
                                  {viewingAdmin.permissions.map((perm) => (
                                    <span
                                      key={perm}
                                      className="inline-flex items-center rounded-md bg-pink-100 px-2.5 py-1 text-xs font-medium text-pink-700 ring-1 ring-pink-200/50"
                                    >
                                      {perm}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm font-medium text-gray-400">—</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </section>

                      <div className="my-4 h-px bg-gray-200/60" />

                      {/* Status & activity card */}
                      <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Status & activity
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                              Status
                            </p>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                                viewingAdmin.status === "Active"
                                  ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/60"
                                  : "bg-amber-100 text-amber-800 ring-1 ring-amber-200/60"
                              }`}
                            >
                              {viewingAdmin.status === "Active" ? (
                                <UserCheck className="h-3.5 w-3.5" />
                              ) : (
                                <UserX className="h-3.5 w-3.5" />
                              )}
                              {viewingAdmin.status}
                            </span>
                          </div>
                          <div className="h-px bg-gray-200/80" />
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200/80 text-gray-500">
                              <Clock className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                Last active
                              </p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                {viewingAdmin.lastActive}
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                    <SideDrawerFooter className="flex-shrink-0 border-t border-gray-200/80 bg-gray-50/80 px-6 py-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setViewModalOpen(false);
                          setViewingAdmin(null);
                        }}
                        className="w-full sm:w-auto"
                      >
                        Close
                      </Button>
                    </SideDrawerFooter>
                  </>
                )}
              </SideDrawerContent>
            </SideDrawer>
            {/* Edit Admin side drawer (prefilled) */}
            <SideDrawer
              open={editModalOpen}
              onOpenChange={(open) => {
                setEditModalOpen(open);
                if (!open) setEditingAdmin(null);
              }}
            >
              <SideDrawerContent className="gap-4">
                <SideDrawerHeader>
                  <SideDrawerTitle>Edit Admin</SideDrawerTitle>
                </SideDrawerHeader>
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
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setEditForm((f) => ({ ...f, phone: v }));
                        }}
                        placeholder="e.g. 9876543210"
                        maxLength={10}
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
                    <SideDrawerFooter>
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
                    </SideDrawerFooter>
                  </form>
                )}
              </SideDrawerContent>
            </SideDrawer>
            <DataTable<AdminRow>
              title="Sub Admins"
              columns={adminColumns}
              data={filteredByRole}
              onRowClick={(row) => {
                setViewingAdmin(row);
                setViewModalOpen(true);
              }}
              searchPlaceholder="Search sub admins..."
              searchValue={search}
              onSearchValueChange={setSearch}
              pageSize={8}
              hideFiltersButton
              headerContent={
                <FiltersBar
                  searchPlaceholder="Search sub admins..."
                  searchValue={search}
                  onSearchValueChange={setSearch}
                  right={
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
                />
              }
              renderActions={(row) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full border border-pink-100 bg-white text-slate-500 shadow-none hover:border-pink-200 hover:bg-pink-50 hover:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-pink-200"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setViewingAdmin(row);
                        setViewModalOpen(true);
                      }}
                      className="text-[13px] text-slate-700 hover:bg-pink-50"
                    >
                      <Eye className="h-3.5 w-3.5 text-slate-500" />
                      <span className="font-medium">View</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openEditModal(row)}
                      className="text-[13px] text-slate-700 hover:bg-pink-50"
                    >
                      <Pencil className="h-3.5 w-3.5 text-slate-500" />
                      <span className="font-medium">Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSuspend(row.id)}
                      className="text-[13px] text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                    >
                      <PauseCircle className="h-3.5 w-3.5 text-amber-500" />
                      <span className="font-medium">
                        {row.status === "Active" ? "Suspend" : "Activate"}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(row.id)}
                      className="text-[13px] text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                      <span className="font-semibold text-rose-600">
                        Delete
                      </span>
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
