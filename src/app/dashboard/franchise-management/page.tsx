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
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import {
  Plus,
  Store,
  Wallet,
  Package,
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

type FranchiseRow = {
  id: number;
  franchiseId: string;
  name: string;
  companyName: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  gstNumber?: string;
  pinCode?: string;
  assignedDistributor: string;
  walletBalance: number;
  totalOrders: number;
  status: "Active" | "Inactive" | "Suspended";
};

const STATUS_OPTIONS = ["All", "Active", "Inactive", "Suspended"] as const;
const CITIES = ["All", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"];

// Distributors available for assignment (ID — Name)
const DISTRIBUTOR_OPTIONS = [
  { id: "DIS-001", name: "Rajesh Kumar" },
  { id: "DIS-002", name: "Priya Sharma" },
  { id: "DIS-003", name: "Amit Patel" },
  { id: "DIS-004", name: "Sneha Reddy" },
  { id: "DIS-005", name: "Vikram Singh" },
  { id: "DIS-006", name: "Anita Desai" },
];

const initialFranchises: FranchiseRow[] = [
  {
    id: 1,
    franchiseId: "FRN-001",
    name: "Metro Mart Andheri",
    companyName: "Metro Retail Pvt Ltd",
    city: "Mumbai",
    state: "Maharashtra",
    email: "andheri@metromart.in",
    phone: "9876543210",
    gstNumber: "27AABCU9603R1ZM",
    pinCode: "400058",
    assignedDistributor: "Rajesh Kumar",
    walletBalance: 85000,
    totalOrders: 1240,
    status: "Active",
  },
  {
    id: 2,
    franchiseId: "FRN-002",
    name: "QuickMart North Delhi",
    companyName: "QuickMart Franchise Ltd",
    city: "Delhi",
    state: "Delhi",
    email: "north@quickmart.in",
    phone: "9123456789",
    gstNumber: "07AAGCS1234M1ZV",
    pinCode: "110001",
    assignedDistributor: "Priya Sharma",
    walletBalance: 62000,
    totalOrders: 892,
    status: "Active",
  },
  {
    id: 3,
    franchiseId: "FRN-003",
    name: "SuperStore Koramangala",
    companyName: "SuperStore India",
    city: "Bangalore",
    state: "Karnataka",
    email: "koramangala@superstore.in",
    phone: "9988776655",
    pinCode: "560034",
    assignedDistributor: "Amit Patel",
    walletBalance: 0,
    totalOrders: 156,
    status: "Inactive",
  },
  {
    id: 4,
    franchiseId: "FRN-004",
    name: "Daily Needs Secunderabad",
    companyName: "Daily Needs Retail",
    city: "Hyderabad",
    state: "Telangana",
    email: "sec@dailyneeds.in",
    phone: "8765432109",
    gstNumber: "36AABCR1234A1ZK",
    pinCode: "500003",
    assignedDistributor: "Sneha Reddy",
    walletBalance: 145000,
    totalOrders: 2103,
    status: "Active",
  },
  {
    id: 5,
    franchiseId: "FRN-005",
    name: "City Mart T Nagar",
    companyName: "City Mart Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    email: "tnagar@citymart.in",
    phone: "7654321098",
    gstNumber: "33AABCS5678B1ZP",
    pinCode: "600017",
    assignedDistributor: "Vikram Singh",
    walletBalance: 38000,
    totalOrders: 445,
    status: "Suspended",
  },
  {
    id: 6,
    franchiseId: "FRN-006",
    name: "Pune Central",
    companyName: "Pune Central Retail",
    city: "Pune",
    state: "Maharashtra",
    email: "info@punecentral.in",
    phone: "6543210987",
    gstNumber: "27AAGFD9876C1ZQ",
    pinCode: "411001",
    assignedDistributor: "Anita Desai",
    walletBalance: 98000,
    totalOrders: 1678,
    status: "Active",
  },
];

const franchiseColumns: Column<FranchiseRow>[] = [
  { key: "franchiseId", label: "ID" },
  { key: "name", label: "Franchise Name" },
  { key: "companyName", label: "Company" },
  { key: "city", label: "City" },
  { key: "assignedDistributor", label: "Assigned Distributor" },
  {
    key: "email",
    label: "Contact",
    render: (row) => (
      <span className="text-gray-700">
        {row.email}
        <span className="block text-[11px] text-gray-500">{row.phone}</span>
      </span>
    ),
  },
  {
    key: "totalOrders",
    label: "Orders",
    render: (row) => (
      <span className="tabular-nums text-gray-700">{row.totalOrders}</span>
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
            : row.status === "Suspended"
              ? "bg-amber-50 text-amber-700"
              : "bg-gray-100 text-gray-600"
        }`}
      >
        {row.status}
      </span>
    ),
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

type AddFormState = {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  gstNumber: string;
  city: string;
  state: string;
  pinCode: string;
  assignedDistributor: string;
  walletBalance: string;
  status: "Active" | "Inactive" | "Suspended";
};

const initialForm: AddFormState = {
  name: "",
  companyName: "",
  email: "",
  phone: "",
  gstNumber: "",
  city: "",
  state: "",
  pinCode: "",
  assignedDistributor: "",
  walletBalance: "0",
  status: "Active",
};

export default function FranchiseManagementPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [distributorFilter, setDistributorFilter] = useState<string>("All");
  const [cityFilter, setCityFilter] = useState<string>("All");
  const [franchises, setFranchises] = useState<FranchiseRow[]>(initialFranchises);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form, setForm] = useState<AddFormState>(initialForm);
  const [viewingFranchise, setViewingFranchise] = useState<FranchiseRow | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFranchise, setEditingFranchise] = useState<FranchiseRow | null>(null);
  const [editForm, setEditForm] = useState<AddFormState>(initialForm);

  const filtered = useMemo(() => {
    return franchises.filter((f) => {
      const matchSearch =
        !search ||
        [f.name, f.companyName, f.franchiseId, f.city, f.email, f.phone, f.assignedDistributor]
          .some((v) => String(v).toLowerCase().includes(search.toLowerCase()));
      const matchStatus = statusFilter === "All" || f.status === statusFilter;
      const matchDistributor = distributorFilter === "All" || f.assignedDistributor === distributorFilter;
      const matchCity = cityFilter === "All" || f.city === cityFilter;
      return matchSearch && matchStatus && matchDistributor && matchCity;
    });
  }, [franchises, search, statusFilter, distributorFilter, cityFilter]);

  const kpiItems = useMemo(() => {
    const active = franchises.filter((f) => f.status === "Active").length;
    const suspended = franchises.filter((f) => f.status === "Suspended").length;
    const totalWallet = franchises.reduce((s, f) => s + f.walletBalance, 0);
    return [
      {
        title: "Total Franchises",
        value: franchises.length,
        delta: "On platform",
        icon: <Store className="h-4 w-4" />,
      },
      {
        title: "Active Franchises",
        value: active,
        delta: "Currently active",
        icon: <Package className="h-4 w-4" />,
      },
      {
        title: "Suspended Franchises",
        value: suspended,
        delta: "Access suspended",
        icon: <PauseCircle className="h-4 w-4" />,
      },
      {
        title: "Total Wallet Balance",
        value: `₹${(totalWallet / 1000).toFixed(0)}K`,
        delta: "Across all franchises",
        icon: <Wallet className="h-4 w-4" />,
      },
    ];
  }, [franchises]);

  const handleAddFranchise = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = franchises.length + 1;
    const newRow: FranchiseRow = {
      id: nextId,
      franchiseId: `FRN-${String(nextId).padStart(3, "0")}`,
      name: form.name,
      companyName: form.companyName,
      city: form.city,
      state: form.state,
      email: form.email,
      phone: form.phone,
      gstNumber: form.gstNumber || undefined,
      pinCode: form.pinCode || undefined,
      assignedDistributor: form.assignedDistributor || (DISTRIBUTOR_OPTIONS[0]?.name ?? ""),
      walletBalance: Number(form.walletBalance) || 0,
      totalOrders: 0,
      status: form.status,
    };
    setFranchises((prev) => [...prev, newRow]);
    setForm(initialForm);
    setAddModalOpen(false);
  };

  const handleSuspend = (id: number) => {
    setFranchises((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: f.status === "Active" ? "Suspended" : "Active" }
          : f
      )
    );
  };

  const handleDelete = (id: number) => {
    setFranchises((prev) => prev.filter((f) => f.id !== id));
  };

  const openEditDrawer = (row: FranchiseRow) => {
    setEditingFranchise(row);
    setEditForm({
      name: row.name,
      companyName: row.companyName,
      email: row.email,
      phone: row.phone,
      gstNumber: row.gstNumber ?? "",
      city: row.city,
      state: row.state,
      pinCode: row.pinCode ?? "",
      assignedDistributor: row.assignedDistributor,
      walletBalance: String(row.walletBalance),
      status: row.status,
    });
    setEditModalOpen(true);
  };

  const handleUpdateFranchise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFranchise) return;
    setFranchises((prev) =>
      prev.map((f) =>
        f.id === editingFranchise.id
          ? {
              ...f,
              name: editForm.name,
              companyName: editForm.companyName,
              email: editForm.email,
              phone: editForm.phone,
              gstNumber: editForm.gstNumber || undefined,
              pinCode: editForm.pinCode || undefined,
              city: editForm.city,
              state: editForm.state,
              assignedDistributor: editForm.assignedDistributor,
              walletBalance: Number(editForm.walletBalance) || 0,
              status: editForm.status,
            }
          : f
      )
    );
    setEditModalOpen(false);
    setEditingFranchise(null);
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
                Franchise Management
              </h1>
              <SideDrawer open={addModalOpen} onOpenChange={setAddModalOpen}>
                <SideDrawerTrigger asChild>
                  <Button size="sm" variant="primary" className="w-full sm:w-auto">
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Franchise
                  </Button>
                </SideDrawerTrigger>
                <SideDrawerContent className="gap-4">
                  <SideDrawerHeader>
                    <SideDrawerTitle>Add Franchise</SideDrawerTitle>
                  </SideDrawerHeader>
                  <form onSubmit={handleAddFranchise} className="grid gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Franchise Name
                      </label>
                      <Input
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Metro Mart Andheri"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Company Name
                      </label>
                      <Input
                        value={form.companyName}
                        onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                        placeholder="e.g. Metro Retail Pvt Ltd"
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
                        placeholder="franchise@company.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Phone
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
                        GST Number
                      </label>
                      <Input
                        value={form.gstNumber}
                        onChange={(e) => setForm((f) => ({ ...f, gstNumber: e.target.value }))}
                        placeholder="e.g. 27AABCU9603R1ZM"
                      />
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
                        Assigned Distributor
                      </label>
                      <select
                        value={form.assignedDistributor}
                        onChange={(e) => setForm((f) => ({ ...f, assignedDistributor: e.target.value }))}
                        className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                        required
                      >
                        <option value="">Select distributor</option>
                        {DISTRIBUTOR_OPTIONS.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name} ({d.id})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Wallet Balance (₹)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={form.walletBalance}
                        onChange={(e) => setForm((f) => ({ ...f, walletBalance: e.target.value }))}
                        placeholder="0"
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
                            status: e.target.value as AddFormState["status"],
                          }))
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
                        Add Franchise
                      </Button>
                    </SideDrawerFooter>
                  </form>
                </SideDrawerContent>
              </SideDrawer>
            </div>

            <KpiCards items={kpiItems} />

            {/* View franchise side drawer */}
            <SideDrawer
              open={viewModalOpen}
              onOpenChange={(open) => {
                setViewModalOpen(open);
                if (!open) setViewingFranchise(null);
              }}
            >
              <SideDrawerContent className="flex h-full flex-col gap-0 overflow-hidden p-0">
                <SideDrawerHeader className="-mx-6 mb-0 flex h-16 flex-shrink-0 flex-row items-center border-b border-gray-200 bg-pink-50 px-6 pr-14">
                  <div className="flex flex-col justify-center gap-0.5">
                    <SideDrawerTitle className="text-base font-semibold leading-tight text-gray-900">
                      Franchise Details
                    </SideDrawerTitle>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                      Read-only view
                    </p>
                  </div>
                </SideDrawerHeader>
                {viewingFranchise && (
                  <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
                    <div className="space-y-4">
                      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Basic Info
                        </h3>
                        <dl className="space-y-2 text-sm">
                          <div>
                            <dt className="text-[11px] text-gray-500">Franchise ID</dt>
                            <dd className="font-medium text-gray-900">{viewingFranchise.franchiseId}</dd>
                          </div>
                          <div>
                            <dt className="text-[11px] text-gray-500">Name</dt>
                            <dd className="font-medium text-gray-900">{viewingFranchise.name}</dd>
                          </div>
                          <div>
                            <dt className="text-[11px] text-gray-500">Company</dt>
                            <dd className="font-medium text-gray-900">{viewingFranchise.companyName}</dd>
                          </div>
                          <div>
                            <dt className="text-[11px] text-gray-500">Email / Phone</dt>
                            <dd className="font-medium text-gray-900">{viewingFranchise.email}</dd>
                            <dd className="text-gray-600">{viewingFranchise.phone}</dd>
                          </div>
                        </dl>
                      </div>
                      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Location & Distributor
                        </h3>
                        <dl className="space-y-2 text-sm">
                          <div>
                            <dt className="text-[11px] text-gray-500">State, City</dt>
                            <dd className="font-medium text-gray-900">
                              {viewingFranchise.state}, {viewingFranchise.city}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[11px] text-gray-500">Pin Code</dt>
                            <dd className="font-medium text-gray-900">{viewingFranchise.pinCode ?? "—"}</dd>
                          </div>
                          <div>
                            <dt className="text-[11px] text-gray-500">Assigned Distributor</dt>
                            <dd className="font-medium text-gray-900">{viewingFranchise.assignedDistributor}</dd>
                          </div>
                        </dl>
                      </div>
                      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Performance
                        </h3>
                        <dl className="space-y-2 text-sm">
                          <div>
                            <dt className="text-[11px] text-gray-500">Wallet Balance</dt>
                            <dd className="font-semibold text-gray-900">
                              ₹{viewingFranchise.walletBalance.toLocaleString("en-IN")}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[11px] text-gray-500">Total Orders</dt>
                            <dd className="font-semibold text-gray-900">{viewingFranchise.totalOrders}</dd>
                          </div>
                          <div>
                            <dt className="text-[11px] text-gray-500">Status</dt>
                            <dd>
                              <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                                  viewingFranchise.status === "Active"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : viewingFranchise.status === "Suspended"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {viewingFranchise.status}
                              </span>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}
                {viewingFranchise && (
                  <SideDrawerFooter className="flex-shrink-0 justify-start border-t border-gray-200 bg-gray-50/80 px-6 py-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setViewModalOpen(false);
                        setViewingFranchise(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </SideDrawerFooter>
                )}
              </SideDrawerContent>
            </SideDrawer>

            {/* Edit franchise side drawer */}
            <SideDrawer
              open={editModalOpen}
              onOpenChange={(open) => {
                setEditModalOpen(open);
                if (!open) setEditingFranchise(null);
              }}
            >
              <SideDrawerContent className="gap-4">
                <SideDrawerHeader>
                  <SideDrawerTitle>Edit Franchise</SideDrawerTitle>
                </SideDrawerHeader>
                {editingFranchise && (
                  <form onSubmit={handleUpdateFranchise} className="grid gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Franchise Name
                      </label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Metro Mart Andheri"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Company Name
                      </label>
                      <Input
                        value={editForm.companyName}
                        onChange={(e) => setEditForm((f) => ({ ...f, companyName: e.target.value }))}
                        placeholder="e.g. Metro Retail Pvt Ltd"
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
                        placeholder="franchise@company.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Phone
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
                        GST Number
                      </label>
                      <Input
                        value={editForm.gstNumber}
                        onChange={(e) => setEditForm((f) => ({ ...f, gstNumber: e.target.value }))}
                        placeholder="e.g. 27AABCU9603R1ZM"
                      />
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
                        Assigned Distributor
                      </label>
                      <select
                        value={editForm.assignedDistributor}
                        onChange={(e) => setEditForm((f) => ({ ...f, assignedDistributor: e.target.value }))}
                        className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                        required
                      >
                        <option value="">Select distributor</option>
                        {DISTRIBUTOR_OPTIONS.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name} ({d.id})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Wallet Balance (₹)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={editForm.walletBalance}
                        onChange={(e) => setEditForm((f) => ({ ...f, walletBalance: e.target.value }))}
                        placeholder="0"
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
                            status: e.target.value as AddFormState["status"],
                          }))
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
                          setEditingFranchise(null);
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

            <DataTable<FranchiseRow>
              title="Franchises"
              columns={franchiseColumns}
              data={filtered}
              onRowClick={(row) => {
                setViewingFranchise(row);
                setViewModalOpen(true);
              }}
              searchPlaceholder="Search by name, company, ID, city..."
              searchValue={search}
              onSearchValueChange={setSearch}
              pageSize={8}
              hideFiltersButton
              headerContent={
                <FiltersBar
                  searchPlaceholder="Search by name, company, ID, city..."
                  searchValue={search}
                  onSearchValueChange={setSearch}
                  right={
                    <>
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
                      <select
                        value={distributorFilter}
                        onChange={(e) => setDistributorFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        <option value="All">All distributors</option>
                        {DISTRIBUTOR_OPTIONS.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        {CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c === "All" ? "All locations" : c}
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
                      onClick={() => {
                        setViewingFranchise(row);
                        setViewModalOpen(true);
                      }}
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
