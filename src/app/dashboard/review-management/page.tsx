"use client";

import { useMemo, useState } from "react";
import { DataTable, Column } from "@/components/ui/table";
import { KpiCards } from "@/components/ui/kpiCards";
import { FiltersBar } from "@/components/ui/filters";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  Star,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  AlertOctagon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ReviewStatus = "Pending" | "Approved" | "Rejected" | "Spam";

type ReviewRow = {
  id: string;
  productName: string;
  userName: string;
  rating: number;
  reviewText: string;
  date: string;
  status: ReviewStatus;
};

const STATUS_OPTIONS: ReviewStatus[] = ["Pending", "Approved", "Rejected", "Spam"];
const RATING_OPTIONS = ["All", "1", "2", "3", "4", "5"] as const;
const PRODUCT_OPTIONS = [
  "All",
  "Lakmé 9to5 Vitamin C+ Serum",
  "Lakmé Absolute Gel Addict Lipstick",
  "Lakmé Absolute Skin Gloss Gel Creme",
  "Lakmé Absolute Blur Perfect Makeup Primer",
  "Lakmé Absolute Highlighter",
];

const initialReviews: ReviewRow[] = [
  {
    id: "REV-001",
    productName: "Lakmé 9to5 Vitamin C+ Serum",
    userName: "Priya Sharma",
    rating: 5,
    reviewText: "Amazing product! My skin feels so much brighter after 2 weeks.",
    date: "2024-03-12",
    status: "Approved",
  },
  {
    id: "REV-002",
    productName: "Lakmé Absolute Gel Addict Lipstick",
    userName: "Ankit Verma",
    rating: 4,
    reviewText: "Long-lasting and vibrant shades. Would buy again.",
    date: "2024-03-11",
    status: "Approved",
  },
  {
    id: "REV-003",
    productName: "Lakmé Absolute Skin Gloss Gel Creme",
    userName: "Sara Khan",
    rating: 3,
    reviewText: "Decent moisturizer but a bit heavy for oily skin.",
    date: "2024-03-10",
    status: "Pending",
  },
  {
    id: "REV-004",
    productName: "Lakmé Absolute Blur Perfect Makeup Primer",
    userName: "Rahul Jain",
    rating: 5,
    reviewText: "Best primer I have used. Blurs pores nicely.",
    date: "2024-03-09",
    status: "Pending",
  },
  {
    id: "REV-005",
    productName: "Lakmé 9to5 Vitamin C+ Serum",
    userName: "Divya Mehta",
    rating: 2,
    reviewText: "Did not see any visible results. Overhyped.",
    date: "2024-03-08",
    status: "Rejected",
  },
  {
    id: "REV-006",
    productName: "Lakmé Absolute Highlighter",
    userName: "Nisha Gupta",
    rating: 5,
    reviewText: "Perfect glow! Love it.",
    date: "2024-03-07",
    status: "Approved",
  },
  {
    id: "REV-007",
    productName: "Lakmé Absolute Gel Addict Lipstick",
    userName: "Unknown User",
    rating: 1,
    reviewText: "Buy now!!! Best deal!!! Click here!!!",
    date: "2024-03-06",
    status: "Spam",
  },
  {
    id: "REV-008",
    productName: "Lakmé Absolute Skin Gloss Gel Creme",
    userName: "Kavita Reddy",
    rating: 4,
    reviewText: "Light texture, absorbs quickly. Good for daily use.",
    date: "2024-03-05",
    status: "Pending",
  },
];

const reviewColumns: Column<ReviewRow>[] = [
  { key: "id", label: "Review ID" },
  { key: "productName", label: "Product" },
  { key: "userName", label: "User" },
  {
    key: "rating",
    label: "Rating",
    render: (row) => (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
        {row.rating}
      </span>
    ),
  },
  {
    key: "reviewText",
    label: "Review",
    render: (row) => (
      <span className="max-w-[220px] truncate text-gray-600" title={row.reviewText}>
        {row.reviewText}
      </span>
    ),
  },
  {
    key: "date",
    label: "Date",
    render: (row) =>
      new Date(row.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
          row.status === "Approved"
            ? "bg-emerald-50 text-emerald-700"
            : row.status === "Pending"
              ? "bg-amber-50 text-amber-700"
              : row.status === "Rejected"
                ? "bg-rose-50 text-rose-700"
                : "bg-gray-100 text-gray-600"
        }`}
      >
        {row.status}
      </span>
    ),
  },
];

export default function ReviewManagementPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>(initialReviews);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("All");
  const [productFilter, setProductFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const matchSearch =
        !search ||
        [r.id, r.productName, r.userName, r.reviewText]
          .some((v) => String(v).toLowerCase().includes(search.toLowerCase()));
      const matchRating = ratingFilter === "All" || String(r.rating) === ratingFilter;
      const matchProduct = productFilter === "All" || r.productName === productFilter;
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchRating && matchProduct && matchStatus;
    });
  }, [reviews, search, ratingFilter, productFilter, statusFilter]);

  const kpiItems = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter((r) => r.status === "Pending").length;
    const approved = reviews.filter((r) => r.status === "Approved").length;
    const avgRating =
      total > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
        : "0.0";
    return [
      { title: "Total Reviews", value: total, delta: "All time", icon: <MessageSquare className="h-4 w-4" /> },
      { title: "Pending", value: pending, delta: "Awaiting moderation", icon: <Clock className="h-4 w-4" /> },
      { title: "Approved", value: approved, delta: "Published", icon: <CheckCircle className="h-4 w-4" /> },
      { title: "Avg. Rating", value: avgRating, delta: "Out of 5", icon: <Star className="h-4 w-4" /> },
    ];
  }, [reviews]);

  const handleApprove = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" as ReviewStatus } : r))
    );
  };

  const handleReject = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected" as ReviewStatus } : r))
    );
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const handleMarkSpam = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Spam" as ReviewStatus } : r))
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
              Review Management
            </h1>

            <KpiCards items={kpiItems} />

            <DataTable<ReviewRow>
              title="Reviews"
              columns={reviewColumns}
              data={filtered}
              searchPlaceholder="Search by ID, product, user, or review text..."
              searchValue={search}
              onSearchValueChange={setSearch}
              pageSize={8}
              hideFiltersButton
              headerContent={
                <FiltersBar
                  searchPlaceholder="Search by ID, product, user, or review text..."
                  searchValue={search}
                  onSearchValueChange={setSearch}
                  right={
                    <>
                      <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        {RATING_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r === "All" ? "All ratings" : `${r} star${r === "1" ? "" : "s"}`}
                          </option>
                        ))}
                      </select>
                      <select
                        value={productFilter}
                        onChange={(e) => setProductFilter(e.target.value)}
                        className="h-9 min-w-[180px] rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        {PRODUCT_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p === "All" ? "All products" : p.length > 28 ? p.slice(0, 28) + "…" : p}
                          </option>
                        ))}
                      </select>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                      >
                        <option value="All">All status</option>
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </>
                  }
                />
              }
              renderActionMenuItems={(row) => (
                <>
                  <DropdownMenuItem
                    onClick={() => handleApprove(row.id)}
                    className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                  >
                    <ThumbsUp className="mr-2 h-3.5 w-3.5 text-emerald-600" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleReject(row.id)}
                    className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                  >
                    <ThumbsDown className="mr-2 h-3.5 w-3.5 text-rose-600" />
                    Reject
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleMarkSpam(row.id)}
                    className="cursor-pointer text-[13px] font-medium text-black hover:bg-slate-50 focus:bg-slate-50"
                  >
                    <AlertOctagon className="mr-2 h-3.5 w-3.5 text-amber-600" />
                    Mark as spam
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(row.id)}
                    className="cursor-pointer text-[13px] font-medium text-red-600 hover:bg-slate-50 focus:bg-slate-50"
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5 text-red-600" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
