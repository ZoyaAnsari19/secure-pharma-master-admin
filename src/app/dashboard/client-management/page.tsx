"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KpiCards } from "@/components/ui/kpiCards";
import { DataTable, Column } from "@/components/ui/table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  SideDrawer,
  SideDrawerContent,
  SideDrawerFooter,
  SideDrawerHeader,
  SideDrawerTitle,
  SideDrawerTrigger,
} from "@/components/ui/sideDrawer";
import {
  Building2,
  Globe2,
  Mail,
  ShieldCheck,
  UserPlus,
  Eye,
  Pencil,
  PauseCircle,
  Trash2,
} from "lucide-react";

type ClientStatus = "Active" | "Inactive" | "Suspended" | "Expiring";
type ClientPlan = "Basic" | "Standard" | "Premium";

type Client = {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  websiteDomain: string;
  brandName: string;
  adminEmail: string;
  plan: ClientPlan;
  status: ClientStatus;
  joinDate: string;
  businessType?: string;
  industry?: string;
  teamSize?: string;
  companyAddress?: string;
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
};

const CLIENTS_STORAGE_KEY = "super-admin.clients.v1";

const initialClients: Client[] = [
  {
    id: 1,
    clientName: "Glow Studio Mumbai",
    clientEmail: "admin@mumbaiglow.in",
    clientPhone: "9876543210",
    websiteDomain: "mumbai.glow.truebeauty.in",
    brandName: "True Beauty Glow Studio",
    adminEmail: "admin@mumbaiglow.in",
    plan: "Premium",
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    clientName: "Blush Hub Delhi",
    clientEmail: "owner@blushhubdelhi.in",
    clientPhone: "9123456789",
    websiteDomain: "delhi.blush.truebeauty.in",
    brandName: "True Beauty Blush Hub",
    adminEmail: "owner@blushhubdelhi.in",
    plan: "Standard",
    status: "Active",
    joinDate: "2023-11-03",
  },
  {
    id: 3,
    clientName: "SkinCraft Pune",
    clientEmail: "support@skincraftpune.in",
    clientPhone: "9988776655",
    websiteDomain: "pune.skincraft.truebeauty.in",
    brandName: "True Beauty SkinCraft",
    adminEmail: "support@skincraftpune.in",
    plan: "Basic",
    status: "Inactive",
    joinDate: "2023-07-22",
  },
  {
    id: 4,
    clientName: "MinimalGlow Bangalore",
    clientEmail: "hello@minimalglowblr.in",
    clientPhone: "8765432109",
    websiteDomain: "bangalore.minimal.truebeauty.in",
    brandName: "True Beauty MinimalGlow",
    adminEmail: "hello@minimalglowblr.in",
    plan: "Premium",
    status: "Expiring",
    joinDate: "2023-03-09",
  },
  {
    id: 5,
    clientName: "Radiant Touch Chennai",
    clientEmail: "admin@radianttouchchennai.in",
    clientPhone: "7654321098",
    websiteDomain: "chennai.radiant.truebeauty.in",
    brandName: "True Beauty Radiant Touch",
    adminEmail: "admin@radianttouchchennai.in",
    plan: "Standard",
    status: "Suspended",
    joinDate: "2022-12-01",
  },
];

const clientColumns: Column<Client>[] = [
  {
    key: "id",
    label: "Sr No.",
    render: (_row, index) => (
      <span className="text-xs text-gray-500">{index + 1}</span>
    ),
  },
  { key: "clientName", label: "Client Name" },
  { key: "websiteDomain", label: "Website Domain" },
  { key: "brandName", label: "Brand Name" },
  {
    key: "joinDate",
    label: "Join Date",
    render: (row) =>
      new Date(row.joinDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
];

export default function ClientManagement() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [statusFilter, setStatusFilter] = useState<"All" | ClientStatus>("All");
  const [planFilter, setPlanFilter] = useState<"All" | ClientPlan>("All");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    websiteDomain: "",
    brandName: "",
    adminEmail: "",
    plan: "Standard" as ClientPlan,
    subscriptionDuration: "12 months",
    status: "Active" as ClientStatus,
     businessType: "",
     industry: "",
     teamSize: "",
     companyAddress: "",
     country: "India",
     state: "",
     city: "",
     postalCode: "",
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editForm, setEditForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    websiteDomain: "",
    brandName: "",
    adminEmail: "",
    plan: "Standard" as ClientPlan,
    subscriptionDuration: "12 months",
    status: "Active" as ClientStatus,
    businessType: "",
    industry: "",
    teamSize: "",
    companyAddress: "",
    country: "India",
    state: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Client[];
      if (Array.isArray(parsed)) setClients(parsed);
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
    } catch {
      // ignore storage errors (e.g. private mode)
    }
  }, [clients]);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesStatus =
        statusFilter === "All" || client.status === statusFilter;
      const matchesPlan = planFilter === "All" || client.plan === planFilter;

      return matchesStatus && matchesPlan;
    });
  }, [clients, statusFilter, planFilter]);

  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === "Active").length;
  const inactiveClients = clients.filter(
    (c) => c.status === "Inactive" || c.status === "Suspended"
  ).length;
  const expiringSubscriptions = clients.filter(
    (c) => c.status === "Expiring"
  ).length;

  const handleAddClient = () => {
    if (
      !formState.clientName ||
      !formState.clientEmail ||
      !formState.websiteDomain
    ) {
      return;
    }

    const newClient: Client = {
      id: Date.now(),
      clientName: formState.clientName,
      clientEmail: formState.clientEmail,
      clientPhone: formState.clientPhone,
      websiteDomain: formState.websiteDomain,
      brandName: formState.brandName || `${formState.clientName} - True Beauty`,
      adminEmail: formState.clientEmail,
      plan: formState.plan,
      status: formState.status,
      joinDate: new Date().toISOString().slice(0, 10),
      businessType: formState.businessType,
      industry: formState.industry,
      teamSize: formState.teamSize,
      companyAddress: formState.companyAddress,
      country: formState.country,
      state: formState.state,
      city: formState.city,
      postalCode: formState.postalCode,
    };

    setClients((prev) => [newClient, ...prev]);
    setIsDialogOpen(false);
    setFormState({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      websiteDomain: "",
      brandName: "",
      adminEmail: "",
      plan: "Standard",
      subscriptionDuration: "12 months",
      status: "Active",
      businessType: "",
      industry: "",
      teamSize: "",
      companyAddress: "",
      country: "India",
      state: "",
      city: "",
      postalCode: "",
    });
  };

  const openEditClient = (client: Client) => {
    setEditingClient(client);
    setEditForm({
      clientName: client.clientName,
      clientEmail: client.clientEmail,
      clientPhone: client.clientPhone,
      websiteDomain: client.websiteDomain,
      brandName: client.brandName,
      adminEmail: client.adminEmail,
      plan: client.plan,
      subscriptionDuration: "12 months",
      status: client.status,
      businessType: client.businessType || "",
      industry: client.industry || "",
      teamSize: client.teamSize || "",
      companyAddress: client.companyAddress || "",
      country: client.country || "India",
      state: client.state || "",
      city: client.city || "",
      postalCode: client.postalCode || "",
    });
    setEditDialogOpen(true);
  };

  const handleUpdateClient = () => {
    if (!editingClient) return;
    setClients((prev) =>
      prev.map((c) =>
        c.id === editingClient.id
          ? {
              ...c,
              clientName: editForm.clientName,
              clientEmail: editForm.clientEmail,
              clientPhone: editForm.clientPhone,
              websiteDomain: editForm.websiteDomain,
              brandName: editForm.brandName,
              adminEmail: editForm.clientEmail,
              plan: editForm.plan,
              status: editForm.status,
              businessType: editForm.businessType,
              industry: editForm.industry,
              teamSize: editForm.teamSize,
              companyAddress: editForm.companyAddress,
              country: editForm.country,
              state: editForm.state,
              city: editForm.city,
              postalCode: editForm.postalCode,
            }
          : c
      )
    );
    setEditDialogOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              {/* Page header */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="whitespace-nowrap text-2xl font-semibold tracking-tight text-gray-800">
                    Client Management
                  </h1>
                 
                </div>
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <SideDrawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <SideDrawerTrigger asChild>
                      <Button variant="primary" className="h-10 px-4">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Client
                      </Button>
                    </SideDrawerTrigger>
                    <SideDrawerContent className="gap-4">
                      <SideDrawerHeader>
                        <SideDrawerTitle>Add New Client</SideDrawerTitle>
                      </SideDrawerHeader>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddClient();
                        }}
                        className="grid gap-4"
                      >
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Client Name
                          </label>
                          <Input
                            placeholder="e.g. Glow Studio Mumbai"
                            value={formState.clientName}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                clientName: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Client Email
                          </label>
                          <Input
                            type="email"
                            placeholder="e.g. owner@clientdomain.in"
                            value={formState.clientEmail}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                clientEmail: e.target.value,
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
                            value={formState.clientPhone}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setFormState((prev) => ({ ...prev, clientPhone: v }));
                            }}
                            placeholder="e.g. 9876543210"
                            maxLength={10}
                          />
                          
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Website Domain
                          </label>
                          <Input
                            placeholder="e.g. mumbai.glow.truebeauty.in"
                            value={formState.websiteDomain}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                websiteDomain: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Brand Name
                          </label>
                          <Input
                            placeholder="e.g. True Beauty Glow Studio"
                            value={formState.brandName}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                brandName: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Plan
                          </label>
                          <select
                            value={formState.plan}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                plan: e.target.value as ClientPlan,
                              }))
                            }
                            className="h-9 w-full rounded-full border border-pink-100 bg-white px-4 text-sm text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                          >
                            <option value="Basic">Basic</option>
                            <option value="Standard">Standard</option>
                            <option value="Premium">Premium</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Subscription Duration
                          </label>
                          <select
                            value={formState.subscriptionDuration}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                subscriptionDuration: e.target.value,
                              }))
                            }
                            className="h-9 w-full rounded-full border border-pink-100 bg-white px-4 text-sm text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                          >
                            <option value="6 months">6 months</option>
                            <option value="12 months">12 months</option>
                            <option value="24 months">24 months</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Status
                          </label>
                          <select
                            value={formState.status}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                status: e.target.value as ClientStatus,
                              }))
                            }
                            className="h-9 w-full rounded-full border border-pink-100 bg-white px-4 text-sm text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Expiring">Expiring</option>
                          </select>
                        </div>
                        <div className="mt-2 border-t border-gray-100 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                          Company details
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                              Business Type
                            </label>
                            <select
                              value={formState.businessType}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  businessType: e.target.value,
                                }))
                              }
                              className="h-9 w-full rounded-full border border-pink-100 bg-white px-4 text-sm text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                            >
                              <option value="">Select business type</option>
                              <option value="E-commerce">E-commerce</option>
                              <option value="Retail Store">Retail Store</option>
                              <option value="Brand/Manufacturer">Brand/Manufacturer</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                              Industry
                            </label>
                            <Input
                              placeholder="e.g. Beauty & Wellness"
                              value={formState.industry}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  industry: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                              Team Size
                            </label>
                            <select
                              value={formState.teamSize}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  teamSize: e.target.value,
                                }))
                              }
                              className="h-9 w-full rounded-full border border-pink-100 bg-white px-4 text-sm text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                            >
                              <option value="">Select team size</option>
                              <option value="1-5 employees">1-5 employees</option>
                              <option value="6-20 employees">6-20 employees</option>
                              <option value="21-100 employees">21-100 employees</option>
                              <option value="100+ employees">100+ employees</option>
                            </select>
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                              Company Address
                            </label>
                            <Input
                              placeholder="Street, area, landmark"
                              value={formState.companyAddress}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  companyAddress: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                              Country
                            </label>
                            <Input
                              placeholder="e.g. India"
                              value={formState.country}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  country: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                              State
                            </label>
                            <Input
                              placeholder="e.g. Maharashtra"
                              value={formState.state}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  state: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                              City
                            </label>
                            <Input
                              placeholder="e.g. Mumbai"
                              value={formState.city}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  city: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                              Postal Code
                            </label>
                            <Input
                              placeholder="e.g. 400001"
                              value={formState.postalCode}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  postalCode: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <SideDrawerFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" variant="primary">
                            Create Client
                          </Button>
                        </SideDrawerFooter>
                      </form>
                    </SideDrawerContent>
                  </SideDrawer>

                  {/* Edit client side drawer */}
                  <SideDrawer
                    open={editDialogOpen}
                    onOpenChange={(open) => {
                      setEditDialogOpen(open);
                      if (!open) setEditingClient(null);
                    }}
                  >
                    <SideDrawerContent className="gap-4">
                      <SideDrawerHeader>
                        <SideDrawerTitle>Edit Client</SideDrawerTitle>
                      </SideDrawerHeader>
                      {editingClient && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateClient();
                          }}
                          className="grid gap-4"
                        >
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                              Client Name
                            </label>
                            <Input
                              placeholder="e.g. Glow Studio Mumbai"
                              value={editForm.clientName}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  clientName: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                              Client Email
                            </label>
                            <Input
                              type="email"
                              placeholder="e.g. owner@clientdomain.in"
                              value={editForm.clientEmail}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  clientEmail: e.target.value,
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
                              value={editForm.clientPhone}
                              onChange={(e) => {
                                const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                                setEditForm((prev) => ({ ...prev, clientPhone: v }));
                              }}
                              placeholder="e.g. 9876543210"
                              maxLength={10}
                            />
                           
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                              Website Domain
                            </label>
                            <Input
                              placeholder="e.g. mumbai.glow.truebeauty.in"
                              value={editForm.websiteDomain}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  websiteDomain: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                              Brand Name
                            </label>
                            <Input
                              placeholder="e.g. True Beauty Glow Studio"
                              value={editForm.brandName}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  brandName: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                              Plan
                            </label>
                            <select
                              value={editForm.plan}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  plan: e.target.value as ClientPlan,
                                }))
                              }
                              className="h-9 w-full rounded-full border border-pink-100 bg-white px-4 text-sm text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                            >
                              <option value="Basic">Basic</option>
                              <option value="Standard">Standard</option>
                              <option value="Premium">Premium</option>
                            </select>
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                              Subscription Duration
                            </label>
                            <select
                              value={editForm.subscriptionDuration}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  subscriptionDuration: e.target.value,
                                }))
                              }
                              className="h-9 w-full rounded-full border border-pink-100 bg-white px-4 text-sm text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                            >
                              <option value="6 months">6 months</option>
                              <option value="12 months">12 months</option>
                              <option value="24 months">24 months</option>
                            </select>
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                              Status
                            </label>
                            <select
                              value={editForm.status}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  status: e.target.value as ClientStatus,
                                }))
                              }
                              className="h-9 w-full rounded-full border border-pink-100 bg-white px-4 text-sm text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Suspended">Suspended</option>
                              <option value="Expiring">Expiring</option>
                            </select>
                          </div>
                          <div className="mt-2 border-t border-gray-100 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                            Company details
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                Business Type
                              </label>
                              <select
                                value={editForm.businessType}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    businessType: e.target.value,
                                  }))
                                }
                                className="h-9 w-full rounded-full border border-pink-100 bg-white px-4 text-sm text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                              >
                                <option value="">Select business type</option>
                                <option value="E-commerce">E-commerce</option>
                                <option value="Retail Store">Retail Store</option>
                                <option value="Brand/Manufacturer">Brand/Manufacturer</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                Industry
                              </label>
                              <Input
                                placeholder="e.g. Beauty & Wellness"
                                value={editForm.industry}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    industry: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                Team Size
                              </label>
                              <select
                                value={editForm.teamSize}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    teamSize: e.target.value,
                                  }))
                                }
                                className="h-9 w-full rounded-full border border-pink-100 bg-white px-4 text-sm text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                              >
                                <option value="">Select team size</option>
                                <option value="1-5 employees">1-5 employees</option>
                                <option value="6-20 employees">6-20 employees</option>
                                <option value="21-100 employees">21-100 employees</option>
                                <option value="100+ employees">100+ employees</option>
                              </select>
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                Company Address
                              </label>
                              <Input
                                placeholder="Street, area, landmark"
                                value={editForm.companyAddress}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    companyAddress: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                Country
                              </label>
                              <Input
                                placeholder="e.g. India"
                                value={editForm.country}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    country: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                State
                              </label>
                              <Input
                                placeholder="e.g. Maharashtra"
                                value={editForm.state}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    state: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                City
                              </label>
                              <Input
                                placeholder="e.g. Mumbai"
                                value={editForm.city}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    city: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                Postal Code
                              </label>
                              <Input
                                placeholder="e.g. 400001"
                                value={editForm.postalCode}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    postalCode: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </div>
                          <SideDrawerFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setEditDialogOpen(false);
                                setEditingClient(null);
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
                </div>
              </div>

              {/* KPI cards */}
              <KpiCards
                items={[
                  {
                    title: "Total Clients",
                    value: totalClients,
                    delta: "+ New onboardings this month",
                    icon: <Building2 className="h-4 w-4" />,
                  },
                  {
                    title: "Active Clients",
                    value: activeClients,
                    delta: "Currently live on True Beauty",
                    icon: <ShieldCheck className="h-4 w-4" />,
                  },
                  {
                    title: "Inactive / Suspended",
                    value: inactiveClients,
                    delta: "Need attention or renewal",
                    icon: <Mail className="h-4 w-4" />,
                  },
                  {
                    title: "Expiring Subscriptions",
                    value: expiringSubscriptions,
                    delta: "Renewals due soon",
                    icon: <Globe2 className="h-4 w-4" />,
                  },
                ]}
              />

              {/* Clients table */}
              <DataTable
                title="Clients"
                columns={clientColumns}
                data={filteredClients}
                onRowClick={(row) => {
                  router.push(`/dashboard/client-management/client-details?id=${row.id}`);
                }}
                pageSize={8}
                searchPlaceholder="Search within listed clients..."
                hideFiltersButton
                rightHeader={
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(e.target.value as "All" | ClientStatus)
                      }
                      className="h-9 rounded-full border border-pink-100 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Expiring">Expiring</option>
                    </select>
                    <select
                      value={planFilter}
                      onChange={(e) =>
                        setPlanFilter(e.target.value as "All" | ClientPlan)
                      }
                      className="h-9 rounded-full border border-pink-100 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                    >
                      <option value="All">All Plans</option>
                      <option value="Basic">Basic</option>
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                }
                renderActionMenuItems={(row) => (
                  <>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/client-management/client-details?id=${row.id}`)
                      }
                      className="flex items-center gap-2 text-[13px] text-slate-900 hover:bg-gray-50"
                    >
                      <Eye className="h-3.5 w-3.5 text-slate-900" />
                      <span>View</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openEditClient(row)}
                      className="flex items-center gap-2 text-[13px] text-slate-900 hover:bg-gray-50"
                    >
                      <Pencil className="h-3.5 w-3.5 text-slate-900" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 text-[13px] text-slate-900 hover:bg-amber-50">
                      <PauseCircle className="h-3.5 w-3.5 text-amber-500" />
                      <span>Suspend</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 text-[13px] text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                      <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </>
                )}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}