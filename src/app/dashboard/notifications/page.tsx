"use client";

import { useMemo, useState, useRef } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { KpiCards } from "@/components/ui/kpiCards";
import { DataTable, type Column } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  SideDrawer,
  SideDrawerContent,
  SideDrawerHeader,
  SideDrawerTitle,
  SideDrawerDescription,
  SideDrawerFooter,
} from "@/components/ui/sideDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Bell,
  Send,
  UserCog,
  Building2,
  Plus,
  Eye,
  Trash2,
  MoreVertical,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  Calendar,
  Link2,
  FileText,
} from "lucide-react";

type CreatedBy = "Super Admin" | "Client Admin";
type TargetType = "All Clients" | "Specific Client" | "Users";
type NotificationStatus = "Sent" | "Scheduled" | "Draft";

type NotificationRow = {
  id: string;
  title: string;
  message: string;
  createdBy: CreatedBy;
  target: string; // "All Clients" | client name | "Users"
  category: string;
  status: NotificationStatus;
  createdDate: string;
  /** For view details */
  description?: string;
  imageUrl?: string;
  link?: string;
  scheduledAt?: string;
  locationState?: string;
  locationCity?: string;
  locationPincode?: string;
};

const initialNotifications: NotificationRow[] = [
  {
    id: "NOTIF-001",
    title: "New Year Sale",
    message: "Get up to 30% off on selected products. Limited time only.",
    createdBy: "Super Admin",
    target: "All Clients",
    category: "Promotional",
    status: "Sent",
    createdDate: "2025-01-01T09:00:00Z",
    description: "Platform-wide New Year sale announcement.",
    imageUrl: "/placeholder-banner.jpg",
    link: "https://truebeauty.in/sale",
  },
  {
    id: "NOTIF-002",
    title: "HydraGlow Kit Launch",
    message: "Introducing the new HydraGlow Facial Kit at Blush Hub.",
    createdBy: "Client Admin",
    target: "Blush Hub Delhi",
    category: "Announcement",
    status: "Sent",
    createdDate: "2025-02-15T11:30:00Z",
    description: "Client-specific product launch.",
  },
  {
    id: "NOTIF-003",
    title: "Summer Skincare Tips",
    message: "Expert tips to protect your skin this summer.",
    createdBy: "Super Admin",
    target: "Users",
    category: "Informational",
    status: "Scheduled",
    createdDate: "2025-03-10T14:00:00Z",
    scheduledAt: "2025-03-20T10:00:00Z",
    description: "Seasonal skincare guide for all users.",
  },
  {
    id: "NOTIF-004",
    title: "Flash Weekend Offer",
    message: "Weekend special: 20% off on MinimalGlow bundle.",
    createdBy: "Client Admin",
    target: "MinimalGlow Bangalore",
    category: "Promotional",
    status: "Sent",
    createdDate: "2025-03-08T08:00:00Z",
  },
  {
    id: "NOTIF-005",
    title: "Maintenance Notice",
    message: "Scheduled maintenance on March 15, 2–4 AM IST.",
    createdBy: "Super Admin",
    target: "All Clients",
    category: "Alert",
    status: "Draft",
    createdDate: "2025-03-12T16:00:00Z",
    description: "Platform maintenance notification.",
  },
];

const notificationColumns: Column<NotificationRow>[] = [
  {
    key: "title",
    label: "Notification Title",
    render: (row) => (
      <span className="max-w-[180px] truncate text-xs font-semibold text-slate-900 sm:text-sm">
        {row.title}
      </span>
    ),
  },
  {
    key: "createdBy",
    label: "Created By",
    render: (row) => (
      <span
        className={
          row.createdBy === "Super Admin"
            ? "inline-flex items-center rounded-full bg-pink-50 px-2.5 py-0.5 text-[11px] font-medium text-pink-700"
            : "inline-flex items-center rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-medium text-sky-700"
        }
      >
        {row.createdBy === "Super Admin" && <UserCog className="mr-1 h-3 w-3" />}
        {row.createdBy === "Client Admin" && <Building2 className="mr-1 h-3 w-3" />}
        {row.createdBy}
      </span>
    ),
  },
  {
    key: "target",
    label: "Target",
    render: (row) => (
      <span className="max-w-[140px] truncate text-xs text-slate-700 sm:text-sm">
        {row.target}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium";
      if (row.status === "Sent") {
        return (
          <span className={`${base} bg-emerald-50 text-emerald-700`}>
            <CheckCircle2 className="mr-1.5 h-3 w-3" />
            Sent
          </span>
        );
      }
      if (row.status === "Scheduled") {
        return (
          <span className={`${base} bg-amber-50 text-amber-700`}>
            <Clock className="mr-1.5 h-3 w-3" />
            Scheduled
          </span>
        );
      }
      return (
        <span className={`${base} bg-gray-100 text-gray-600`}>
          Draft
        </span>
      );
    },
  },
  {
    key: "createdDate",
    label: "Created Date",
    render: (row) =>
      new Date(row.createdDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
];

const CLIENT_OPTIONS = [
  "Glow Studio Mumbai",
  "Blush Hub Delhi",
  "SkinCraft Pune",
  "MinimalGlow Bangalore",
  "Radiant Touch Chennai",
];

const CATEGORY_OPTIONS = ["Promotional", "Announcement", "Informational", "Alert"];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRow[]>(initialNotifications);
  const [createdByFilter, setCreatedByFilter] = useState<"All" | CreatedBy>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | NotificationStatus>("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailNotification, setDetailNotification] = useState<NotificationRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Create form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const formImageInputRef = useRef<HTMLInputElement>(null);
  const [formTarget, setFormTarget] = useState<"All Clients" | "Specific Client">("All Clients");
  const [formSpecificClient, setFormSpecificClient] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formLink, setFormLink] = useState("");
  const [formState, setFormState] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formPincode, setFormPincode] = useState("");
  const [formSchedule, setFormSchedule] = useState<"Send Now" | "Schedule">("Send Now");
  const [formScheduledDate, setFormScheduledDate] = useState("");
  const [formScheduledTime, setFormScheduledTime] = useState("");

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchCreatedBy = createdByFilter === "All" || n.createdBy === createdByFilter;
      const matchStatus = statusFilter === "All" || n.status === statusFilter;
      return matchCreatedBy && matchStatus;
    });
  }, [notifications, createdByFilter, statusFilter]);

  const totalCount = notifications.length;
  const superAdminCount = notifications.filter((n) => n.createdBy === "Super Admin").length;
  const clientAdminCount = notifications.filter((n) => n.createdBy === "Client Admin").length;
  const sentCount = notifications.filter((n) => n.status === "Sent").length;

  const resetCreateForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormImageFile(null);
    if (formImageInputRef.current) formImageInputRef.current.value = "";
    setFormTarget("All Clients");
    setFormSpecificClient("");
    setFormCategory("");
    setFormLink("");
    setFormState("");
    setFormCity("");
    setFormPincode("");
    setFormSchedule("Send Now");
    setFormScheduledDate("");
    setFormScheduledTime("");
  };

  const handleCreateSubmit = () => {
    const targetLabel =
      formTarget === "All Clients" ? "All Clients" : formSpecificClient || "Specific Client";
    const newNotif: NotificationRow = {
      id: `NOTIF-${String(notifications.length + 1).padStart(3, "0")}`,
      title: formTitle,
      message: formDescription.slice(0, 80) + (formDescription.length > 80 ? "…" : ""),
      createdBy: "Super Admin",
      target: targetLabel,
      category: formCategory || "Announcement",
      status: formSchedule === "Send Now" ? "Sent" : "Scheduled",
      createdDate: new Date().toISOString(),
      description: formDescription,
      imageUrl: formImageFile ? formImageFile.name : undefined,
      link: formLink || undefined,
      scheduledAt:
        formSchedule === "Schedule" && formScheduledDate && formScheduledTime
          ? new Date(`${formScheduledDate}T${formScheduledTime}`).toISOString()
          : undefined,
      locationState: formState || undefined,
      locationCity: formCity || undefined,
      locationPincode: formPincode || undefined,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    resetCreateForm();
    setCreateOpen(false);
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                  Notifications
                </h1>
                <p className="text-xs text-gray-500">
                  Monitor and create platform-level and client notifications.
                </p>
              </div>
              <Button
                onClick={() => {
                  resetCreateForm();
                  setCreateOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-600"
              >
                <Plus className="h-4 w-4" />
                Create Notification
              </Button>
            </div>

            <KpiCards
              items={[
                {
                  title: "Total Notifications",
                  value: totalCount,
                  delta: "Across platform",
                  icon: <Bell className="h-4 w-4" />,
                },
                {
                  title: "By Super Admin",
                  value: superAdminCount,
                  delta: "Platform-level",
                  icon: <UserCog className="h-4 w-4" />,
                },
                {
                  title: "By Client Admin",
                  value: clientAdminCount,
                  delta: "Client-created",
                  icon: <Building2 className="h-4 w-4" />,
                },
                {
                  title: "Sent",
                  value: sentCount,
                  delta: "Delivered",
                  icon: <Send className="h-4 w-4" />,
                },
              ]}
            />

            <DataTable<NotificationRow>
              title="All Notifications"
              columns={notificationColumns}
              data={filteredNotifications}
              pageSize={10}
              searchPlaceholder="Search by title..."
              hideFiltersButton
              showIndexColumn
              onRowClick={(row) => setDetailNotification(row)}
              renderActionMenuItems={(row) => (
                <>
                  <DropdownMenuItem
                    onClick={() => setDetailNotification(row)}
                    className="flex items-center gap-2 text-[13px] text-slate-900 hover:bg-gray-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteId(row.id)}
                    className="flex items-center gap-2 text-[13px] text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
              rightHeader={
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={createdByFilter}
                    onChange={(e) => setCreatedByFilter(e.target.value as "All" | CreatedBy)}
                    className="h-9 w-36 rounded-full border border-pink-100 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  >
                    <option value="All">All Creators</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Client Admin">Client Admin</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as "All" | NotificationStatus)}
                    className="h-9 w-32 rounded-full border border-pink-100 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Sent">Sent</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              }
            />
          </div>
        </main>
      </div>

      {/* Create Notification – Side Drawer */}
      <SideDrawer open={createOpen} onOpenChange={setCreateOpen}>
        <SideDrawerContent className="max-w-lg" showClose={true}>
          <SideDrawerHeader>
            <SideDrawerTitle>Create Platform Notification</SideDrawerTitle>
            
          </SideDrawerHeader>
          <div className="grid gap-4 py-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Title</label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. New Year Sale"
                className="w-full"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Description</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Full message or description"
                rows={3}
                className="h-auto w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-300 focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Add image</label>
              <div className="flex h-10 w-full items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <input
                  ref={formImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormImageFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                  id="notification-image-upload"
                />
                <label
                  htmlFor="notification-image-upload"
                  className="flex h-full cursor-pointer items-center bg-pink-50 px-4 text-sm font-medium text-pink-600 transition hover:bg-pink-100"
                >
                  Choose file
                </label>
                <span className="flex-1 truncate px-4 text-sm text-slate-500">
                  {formImageFile ? formImageFile.name : "No file chosen"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Target</label>
                <select
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value as "All Clients" | "Specific Client")}
                  className="h-9 w-full rounded-xl border border-pink-100 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                >
                  <option value="All Clients">All Clients</option>
                  <option value="Specific Client">Specific Client</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="h-9 w-full rounded-xl border border-pink-100 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                >
                  <option value="">Select category</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {formTarget === "Specific Client" && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Client</label>
                <select
                  value={formSpecificClient}
                  onChange={(e) => setFormSpecificClient(e.target.value)}
                  className="h-9 w-full rounded-xl border border-pink-100 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                >
                  <option value="">Select client</option>
                  {CLIENT_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Link (optional)</label>
              <Input
                value={formLink}
                onChange={(e) => setFormLink(e.target.value)}
                placeholder="https://..."
                className="w-full"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                Location <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <div className="grid grid-cols-[1fr_1fr_100px] gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">State</label>
                  <Input
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white text-sm text-slate-700 shadow-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">City</label>
                  <Input
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white text-sm text-slate-700 shadow-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Pincode</label>
                  <Input
                    value={formPincode}
                    onChange={(e) => setFormPincode(e.target.value)}
                    placeholder="e.g. 400001"
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white text-sm text-slate-700 shadow-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                Schedule
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormSchedule("Send Now")}
                  className={
                    formSchedule === "Send Now"
                      ? "rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm"
                      : "rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-gray-50"
                  }
                >
                  Send now
                </button>
                <button
                  type="button"
                  onClick={() => setFormSchedule("Schedule")}
                  className={
                    formSchedule === "Schedule"
                      ? "rounded-xl border border-pink-200 bg-pink-50 px-4 py-2.5 text-sm font-medium text-pink-600 shadow-sm"
                      : "rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-gray-50"
                  }
                >
                  Schedule for later
                </button>
              </div>
              {formSchedule === "Schedule" && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Date</label>
                    <Input
                      type="date"
                      value={formScheduledDate}
                      onChange={(e) => setFormScheduledDate(e.target.value)}
                      className="h-10 w-full rounded-xl border border-gray-200 bg-white text-sm text-slate-700 shadow-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Time</label>
                    <Input
                      type="time"
                      value={formScheduledTime}
                      onChange={(e) => setFormScheduledTime(e.target.value)}
                      className="h-10 w-full rounded-xl border border-gray-200 bg-white text-sm text-slate-700 shadow-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <SideDrawerFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateSubmit}
              disabled={!formTitle.trim()}
              className="bg-pink-500 hover:bg-pink-600"
            >
              {formSchedule === "Send Now" ? "Send Now" : "Schedule"}
            </Button>
          </SideDrawerFooter>
        </SideDrawerContent>
      </SideDrawer>

      {/* View Details – Side Drawer (same layout as Sub Admin view drawer) */}
      <SideDrawer open={!!detailNotification} onOpenChange={(open) => !open && setDetailNotification(null)}>
        <SideDrawerContent className="flex h-full flex-col gap-0 overflow-hidden p-0" showClose={true}>
          <SideDrawerHeader className="mb-0 flex h-16 flex-shrink-0 -mx-6 flex-row items-center border-b border-gray-200 bg-pink-50 px-6 pr-14">
            <div className="flex flex-col justify-center gap-0.5">
              <SideDrawerTitle className="text-base font-semibold leading-tight text-gray-900">
                Notification Details
              </SideDrawerTitle>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                Read-only view
              </p>
            </div>
          </SideDrawerHeader>
          {detailNotification && (
            <>
              <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
                {/* Basic information */}
                <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                  <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Basic information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                        <Bell className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Title</p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-900">{detailNotification.title}</p>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200/80" />
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                        <Tag className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Category</p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-900">{detailNotification.category}</p>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200/80" />
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Status</p>
                        <span
                          className={`mt-0.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            detailNotification.status === "Sent"
                              ? "bg-emerald-100 text-emerald-800"
                              : detailNotification.status === "Scheduled"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {detailNotification.status}
                        </span>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200/80" />
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                        <UserCog className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Created By</p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-900">{detailNotification.createdBy}</p>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200/80" />
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <Building2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Target</p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-900">{detailNotification.target}</p>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200/80" />
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200/80 text-gray-500">
                        <Calendar className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Created Date</p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-900">
                          {new Date(detailNotification.createdDate).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="my-4 h-px bg-gray-200/60" />

                {/* Description */}
                <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                  <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Description
                  </h3>
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Description</p>
                      <p className="mt-0.5 text-sm text-gray-900">{detailNotification.description || "—"}</p>
                    </div>
                  </div>
                </section>

                {(detailNotification.locationState || detailNotification.locationCity || detailNotification.locationPincode) && (
                  <>
                    <div className="my-4 h-px bg-gray-200/60" />
                    <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Location
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                            <MapPin className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1 grid grid-cols-3 gap-3">
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">State</p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">{detailNotification.locationState || "—"}</p>
                            </div>
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">City</p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">{detailNotification.locationCity || "—"}</p>
                            </div>
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Pincode</p>
                              <p className="mt-0.5 text-sm font-semibold text-gray-900">{detailNotification.locationPincode || "—"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </>
                )}

                <div className="my-4 h-px bg-gray-200/60" />

                {/* Schedule & link */}
                <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                  <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Schedule & link
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <Clock className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Scheduled At</p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-900">
                          {detailNotification.scheduledAt
                            ? new Date(detailNotification.scheduledAt).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200/80" />
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                        <Link2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Link</p>
                        {detailNotification.link ? (
                          <a
                            href={detailNotification.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 block break-all text-sm font-medium text-pink-600 hover:underline"
                          >
                            {detailNotification.link}
                          </a>
                        ) : (
                          <p className="mt-0.5 text-sm text-gray-400">—</p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <SideDrawerFooter className="flex-shrink-0 border-t border-gray-200/80 bg-gray-50/80 px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDetailNotification(null)}
                  className="w-full sm:w-auto"
                >
                  Close
                </Button>
              </SideDrawerFooter>
            </>
          )}
        </SideDrawerContent>
      </SideDrawer>

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm" showClose={true}>
          <DialogHeader>
            <DialogTitle>Delete notification?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The notification will be removed from the list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-rose-500 text-white hover:bg-rose-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
