"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import {
  Plus,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  MoreVertical,
  Pencil,
  Eye,
  Trash2,
  PauseCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserStatus = "Active" | "Inactive" | "Suspended";
type UserRole =
  | "Sub Admin"
  | "Stock Manager"
  | "Distributor"
  | "Franchise"
  | "Retailer"
  | "Networker"
  | "Customer"
  | "Seller";

type UserRow = {
  id: number;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  city: string;
  state: string;
  pinCode?: string;
  status: UserStatus;
  registrationDate: string;
  profilePhotoUrl?: string;
};

const ROLE_OPTIONS: UserRole[] = [
  "Sub Admin",
  "Stock Manager",
  "Distributor",
  "Franchise",
  "Retailer",
  "Networker",
  "Customer",
  "Seller",
];
const STATUS_OPTIONS = ["All", "Active", "Inactive", "Suspended"] as const;
const CITIES = ["All", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"];

const initialUsers: UserRow[] = [
  {
    id: 1,
    userId: "USR-001",
    name: "Priya Sharma",
    email: "priya@truebeauty.in",
    phone: "9876543210",
    role: "Sub Admin",
    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "400001",
    status: "Active",
    registrationDate: "2024-01-15",
  },
  {
    id: 2,
    userId: "USR-002",
    name: "Ankit Verma",
    email: "ankit@truebeauty.in",
    phone: "9123456789",
    role: "Stock Manager",
    city: "Delhi",
    state: "Delhi",
    pinCode: "110001",
    status: "Active",
    registrationDate: "2024-02-20",
  },
  {
    id: 3,
    userId: "USR-003",
    name: "Sara Khan",
    email: "sara@truebeauty.in",
    phone: "9988776655",
    role: "Seller",
    city: "Bangalore",
    state: "Karnataka",
    pinCode: "560001",
    status: "Suspended",
    registrationDate: "2023-11-08",
  },
  {
    id: 4,
    userId: "USR-004",
    name: "Rahul Jain",
    email: "rahul@truebeauty.in",
    phone: "8765432109",
    role: "Distributor",
    city: "Hyderabad",
    state: "Telangana",
    pinCode: "500001",
    status: "Active",
    registrationDate: "2024-03-01",
  },
  {
    id: 5,
    userId: "USR-005",
    name: "Divya Mehta",
    email: "divya@truebeauty.in",
    phone: "7654321098",
    role: "Customer",
    city: "Chennai",
    state: "Tamil Nadu",
    pinCode: "600001",
    status: "Inactive",
    registrationDate: "2023-09-12",
  },
  {
    id: 6,
    userId: "USR-006",
    name: "Nisha Gupta",
    email: "nisha@example.com",
    phone: "6543210987",
    role: "Customer",
    city: "Pune",
    state: "Maharashtra",
    pinCode: "411001",
    status: "Active",
    registrationDate: "2024-03-10",
  },
];

const userColumns: Column<UserRow>[] = [
  { key: "userId", label: "User ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "city", label: "City" },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
          row.status === "Active"
            ? "bg-emerald-50 text-emerald-700"
            : row.status === "Suspended"
              ? "bg-amber-50 text-amber-700"
              : "bg-gray-100 text-gray-600"
        }`}
      >
        {row.status}
      </span>
    ),
  },
  {
    key: "registrationDate",
    label: "Registration Date",
    render: (row) =>
      new Date(row.registrationDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Delhi", "Karnataka", "Maharashtra", "Tamil Nadu",
  "Telangana", "West Bengal", "Gujarat", "Rajasthan", "Uttar Pradesh",
];

const STATE_CITIES: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Kakinada", "Rajahmundry", "Tirupati", "Kadapa", "Anantapur"],
  Delhi: ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi", "Dwarka", "Rohini", "Saket", "Karol Bagh"],
  Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary", "Bijapur", "Shimoga"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Navi Mumbai"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Erode", "Vellore", "Thoothukudi"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Siddipet"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Baharampur", "Habra", "Kharagpur"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Nadiad"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Bharatpur", "Sikar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Aligarh", "Moradabad"],
};

type AddUserFormState = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  city: string;
  state: string;
  pinCode: string;
  status: UserStatus;
};

const initialAddForm: AddUserFormState = {
  name: "",
  email: "",
  phone: "",
  role: "Customer",
  city: "",
  state: "",
  pinCode: "",
  status: "Active",
};

const USER_DETAILS_STORAGE_KEY = "userDetailsView";

export default function UserManagementPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form, setForm] = useState<AddUserFormState>(initialAddForm);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [editForm, setEditForm] = useState<AddUserFormState>(initialAddForm);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        [u.name, u.email, u.userId, u.phone, u.city, u.role]
          .some((v) => String(v).toLowerCase().includes(search.toLowerCase()));
      const matchRole = roleFilter === "All" || u.role === roleFilter;
      const matchStatus = statusFilter === "All" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const kpiItems = useMemo(() => {
    const active = users.filter((u) => u.status === "Active").length;
    const inactive = users.filter((u) => u.status === "Inactive").length;
    const suspended = users.filter((u) => u.status === "Suspended").length;
    const newLast30d = users.filter((u) => {
      const d = new Date(u.registrationDate);
      const now = new Date();
      const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 30;
    }).length;
    return [
      { title: "Total Users", value: users.length, delta: "On platform", icon: <Users className="h-4 w-4" /> },
      { title: "Active Users", value: active, delta: "Currently active", icon: <UserCheck className="h-4 w-4" /> },
      { title: "Inactive / Suspended", value: inactive + suspended, delta: "Inactive or suspended", icon: <UserX className="h-4 w-4" /> },
      { title: "New (30 days)", value: newLast30d, delta: "Registered in last 30 days", icon: <UserPlus className="h-4 w-4" /> },
    ];
  }, [users]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = users.length + 1;
    const newRow: UserRow = {
      id: nextId,
      userId: `USR-${String(nextId).padStart(3, "0")}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      city: form.city,
      state: form.state,
      pinCode: form.pinCode || undefined,
      status: form.status,
      registrationDate: new Date().toISOString().slice(0, 10),
    };
    setUsers((prev) => [...prev, newRow]);
    setForm(initialAddForm);
    setAddModalOpen(false);
  };

  const handleSuspend = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
          : u
      )
    );
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const openUserDetails = (row: UserRow) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(USER_DETAILS_STORAGE_KEY, JSON.stringify(row));
    }
    router.push(`/dashboard/user-management/user-details?id=${row.id}`);
  };

  const openEditDrawer = (row: UserRow) => {
    setEditingUser(row);
    setEditForm({
      name: row.name,
      email: row.email,
      phone: row.phone,
      role: row.role,
      city: row.city,
      state: row.state,
      pinCode: row.pinCode ?? "",
      status: row.status,
    });
    setEditModalOpen(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              name: editForm.name,
              email: editForm.email,
              phone: editForm.phone,
              role: editForm.role,
              city: editForm.city,
              state: editForm.state,
              pinCode: editForm.pinCode || undefined,
              status: editForm.status,
            }
          : u
      )
    );
    setEditModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                User Management
              </h1>
              <SideDrawer open={addModalOpen} onOpenChange={setAddModalOpen}>
                <SideDrawerTrigger asChild>
                  <Button size="sm" variant="primary" className="w-full sm:w-auto">
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add User
                  </Button>
                </SideDrawerTrigger>
                <SideDrawerContent className="gap-4">
                  <SideDrawerHeader>
                    <SideDrawerTitle>Add User</SideDrawerTitle>
                  </SideDrawerHeader>
                  <form onSubmit={handleAddUser} className="grid gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Full Name
                      </label>
                      <Input
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="user@example.com"
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
                          setForm((f) => ({ ...f, role: e.target.value as UserRole }))
                        }
                        className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                        required
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-600">
                          State
                        </label>
                        <select
                          value={form.state}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, state: e.target.value, city: "" }))
                          }
                          className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                          required
                        >
                          <option value="">Select state</option>
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-600">
                          City
                        </label>
                        <select
                          value={form.city}
                          onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                          className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                          required
                          disabled={!form.state}
                        >
                          <option value="">Select city</option>
                          {(STATE_CITIES[form.state] ?? []).map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Pin Code
                      </label>
                      <Input
                        value={form.pinCode}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setForm((f) => ({ ...f, pinCode: v }));
                        }}
                        placeholder="e.g. 400001"
                        maxLength={6}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Status
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, status: e.target.value as UserStatus }))
                        }
                        className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                    <SideDrawerFooter>
                      <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary">
                        Add User
                      </Button>
                    </SideDrawerFooter>
                  </form>
                </SideDrawerContent>
              </SideDrawer>
            </div>

            <KpiCards items={kpiItems} />

            {/* Edit User side drawer */}
            <SideDrawer
              open={editModalOpen}
              onOpenChange={(open) => {
                setEditModalOpen(open);
                if (!open) setEditingUser(null);
              }}
            >
              <SideDrawerContent className="gap-4">
                <SideDrawerHeader>
                  <SideDrawerTitle>Edit User</SideDrawerTitle>
                </SideDrawerHeader>
                {editingUser && (
                  <form onSubmit={handleUpdateUser} className="grid gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Full Name
                      </label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
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
                        value={editForm.email}
                        onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="user@example.com"
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
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Role
                      </label>
                      <select
                        value={editForm.role}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, role: e.target.value as UserRole }))
                        }
                        className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                        required
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-600">
                          State
                        </label>
                        <select
                          value={editForm.state}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, state: e.target.value, city: "" }))
                          }
                          className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                          required
                        >
                          <option value="">Select state</option>
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-600">
                          City
                        </label>
                        <select
                          value={editForm.city}
                          onChange={(e) => setEditForm((f) => ({ ...f, city: e.target.value }))}
                          className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                          required
                          disabled={!editForm.state}
                        >
                          <option value="">Select city</option>
                          {(STATE_CITIES[editForm.state] ?? []).map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Pin Code
                      </label>
                      <Input
                        value={editForm.pinCode}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setEditForm((f) => ({ ...f, pinCode: v }));
                        }}
                        placeholder="e.g. 400001"
                        maxLength={6}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Status
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, status: e.target.value as UserStatus }))
                        }
                        className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                    <SideDrawerFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditModalOpen(false);
                          setEditingUser(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary">
                        Save changes
                      </Button>
                    </SideDrawerFooter>
                  </form>
                )}
              </SideDrawerContent>
            </SideDrawer>

            <DataTable<UserRow>
              title="Users"
              columns={userColumns}
              data={filtered}
              onRowClick={(row) => openUserDetails(row)}
              searchPlaceholder="Search by name, email, ID, phone, city..."
              searchValue={search}
              onSearchValueChange={setSearch}
              pageSize={8}
              hideFiltersButton
              headerContent={
                <FiltersBar
                  searchPlaceholder="Search by name, email, ID, phone, city..."
                  searchValue={search}
                  onSearchValueChange={setSearch}
                  right={
                    <>
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        <option value="All">All roles</option>
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s === "All" ? "All status" : s}
                          </option>
                        ))}
                      </select>
                    </>
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
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[140px]">
                    <DropdownMenuItem
                      onClick={() => openUserDetails(row)}
                      className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                    >
                      <Eye className="mr-2 h-3.5 w-3.5 text-blue-600" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openEditDrawer(row)}
                      className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                    >
                      <Pencil className="mr-2 h-3.5 w-3.5 text-emerald-600" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSuspend(row.id)}
                      className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                    >
                      <PauseCircle className="mr-2 h-3.5 w-3.5 text-orange-500" />
                      {row.status === "Active" ? "Suspend" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(row.id)}
                      className="cursor-pointer text-[13px] font-medium text-red-600 hover:bg-slate-50 focus:bg-slate-50"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5 text-red-600" />
                      Delete
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
