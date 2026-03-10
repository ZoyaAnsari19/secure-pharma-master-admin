"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SideBar } from "@/components/sideBar";
import { TopBar } from "@/components/topBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KpiCards } from "@/components/ui/kpiCards";
import { DataTable, Column } from "@/components/ui/table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  SideDrawer,
  SideDrawerContent,
  SideDrawerDescription,
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
  websiteDomain: string;
  brandName: string;
  adminEmail: string;
  plan: ClientPlan;
  status: ClientStatus;
  joinDate: string;
};

const initialClients: Client[] = [
  {
    id: 1,
    clientName: "Glow Studio Mumbai",
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
    websiteDomain: "chennai.radiant.truebeauty.in",
    brandName: "True Beauty Radiant Touch",
    adminEmail: "admin@radianttouchchennai.in",
    plan: "Standard",
    status: "Suspended",
    joinDate: "2022-12-01",
  },
];

const clientColumns: Column<Client>[] = [
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
    websiteDomain: "",
    brandName: "",
    adminEmail: "",
    adminPassword: "",
    plan: "Standard" as ClientPlan,
    subscriptionDuration: "12 months",
    status: "Active" as ClientStatus,
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editForm, setEditForm] = useState({
    clientName: "",
    websiteDomain: "",
    brandName: "",
    adminEmail: "",
    plan: "Standard" as ClientPlan,
    subscriptionDuration: "12 months",
    status: "Active" as ClientStatus,
  });

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
      !formState.websiteDomain ||
      !formState.adminEmail ||
      !formState.adminPassword
    ) {
      return;
    }

    const newClient: Client = {
      id: Date.now(),
      clientName: formState.clientName,
      websiteDomain: formState.websiteDomain,
      brandName: formState.brandName || `${formState.clientName} - True Beauty`,
      adminEmail: formState.adminEmail,
      plan: formState.plan,
      status: formState.status,
      joinDate: new Date().toISOString().slice(0, 10),
    };

    setClients((prev) => [newClient, ...prev]);
    setIsDialogOpen(false);
    setFormState({
      clientName: "",
      websiteDomain: "",
      brandName: "",
      adminEmail: "",
      adminPassword: "",
      plan: "Standard",
      subscriptionDuration: "12 months",
      status: "Active",
    });
  };

  const openEditClient = (client: Client) => {
    setEditingClient(client);
    setEditForm({
      clientName: client.clientName,
      websiteDomain: client.websiteDomain,
      brandName: client.brandName,
      adminEmail: client.adminEmail,
      plan: client.plan,
      subscriptionDuration: "12 months",
      status: client.status,
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
              websiteDomain: editForm.websiteDomain,
              brandName: editForm.brandName,
              adminEmail: editForm.adminEmail,
              plan: editForm.plan,
              status: editForm.status,
            }
          : c
      )
    );
    setEditDialogOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <SideBar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
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
                        <SideDrawerDescription>
                          Create a new client account with their website,
                          admin panel, and subscription details.
                        </SideDrawerDescription>
                      </SideDrawerHeader>
                      <form className="grid gap-4 rounded-2xl bg-white/60 p-4 shadow-sm ring-1 ring-pink-50 sm:p-5">
                        <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-xs font-medium text-gray-700">
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
                            />
                          </div>
                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-xs font-medium text-gray-700">
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
                            />
                          </div>
                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-xs font-medium text-gray-700">
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
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-700">
                              Admin Email
                            </label>
                            <Input
                              type="email"
                              placeholder="owner@clientdomain.in"
                              value={formState.adminEmail}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  adminEmail: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-700">
                              Admin Password
                            </label>
                            <Input
                              type="password"
                              placeholder="Temporary password"
                              value={formState.adminPassword}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  adminPassword: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-700">
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
                              className="h-9 w-full rounded-full border border-pink-100 bg-white px-3 text-sm text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                            >
                              <option value="Basic">Basic</option>
                              <option value="Standard">Standard</option>
                              <option value="Premium">Premium</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-700">
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
                              className="h-9 w-full rounded-full border border-pink-100 bg-white px-3 text-sm text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                            >
                              <option value="6 months">6 months</option>
                              <option value="12 months">12 months</option>
                              <option value="24 months">24 months</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-700">
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
                              className="h-9 w-full rounded-full border border-pink-100 bg-white px-3 text-sm text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Suspended">Suspended</option>
                              <option value="Expiring">Expiring</option>
                            </select>
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
                          <Button type="button" onClick={handleAddClient}>
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
                        <SideDrawerDescription>
                          Update this client&apos;s details and plan information.
                        </SideDrawerDescription>
                      </SideDrawerHeader>
                      {editingClient && (
                        <form
                          className="grid gap-4 rounded-2xl bg-white/60 p-4 shadow-sm ring-1 ring-pink-50 sm:p-5"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateClient();
                          }}
                        >
                          <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5 sm:col-span-2">
                              <label className="text-xs font-medium text-gray-700">
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
                              />
                            </div>
                            <div className="space-y-1.5 sm:col-span-2">
                              <label className="text-xs font-medium text-gray-700">
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
                              />
                            </div>
                            <div className="space-y-1.5 sm:col-span-2">
                              <label className="text-xs font-medium text-gray-700">
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
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
                                Admin Email
                              </label>
                              <Input
                                type="email"
                                placeholder="owner@clientdomain.in"
                                value={editForm.adminEmail}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    adminEmail: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
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
                                className="h-9 w-full rounded-full border border-pink-100 bg-white px-3 text-sm text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                              >
                                <option value="Basic">Basic</option>
                                <option value="Standard">Standard</option>
                                <option value="Premium">Premium</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
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
                                className="h-9 w-full rounded-full border border-pink-100 bg-white px-3 text-sm text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                              >
                                <option value="6 months">6 months</option>
                                <option value="12 months">12 months</option>
                                <option value="24 months">24 months</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700">
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
                                className="h-9 w-full rounded-full border border-pink-100 bg-white px-3 text-sm text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                              >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspended">Suspended</option>
                                <option value="Expiring">Expiring</option>
                              </select>
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
                            <Button type="submit">Save changes</Button>
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
                        router.push("/clientManagement/clientDetails")
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