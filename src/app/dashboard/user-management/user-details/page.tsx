"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Hash,
  Shield,
  Calendar,
} from "lucide-react";

const USER_DETAILS_STORAGE_KEY = "userDetailsView";

type UserDetails = {
  id: number;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  city: string;
  state: string;
  pinCode?: string;
  status: "Active" | "Inactive" | "Suspended";
  registrationDate: string;
  profilePhotoUrl?: string;
};

export default function UserDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [user, setUser] = useState<UserDetails | null>(null);
  const [notFound, setNotFound] = useState(false);

  const loadUser = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(USER_DETAILS_STORAGE_KEY);
      if (!raw) {
        setNotFound(true);
        return;
      }
      const data = JSON.parse(raw) as UserDetails;
      if (id != null && String(data.id) !== id) {
        setNotFound(true);
        return;
      }
      setUser(data);
      setNotFound(false);
    } catch {
      setNotFound(true);
    }
  }, [id]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (notFound || (!user && id)) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="beauty-scroll flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <User className="h-7 w-7" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-800">User not found</h2>
                <p className="mt-1 max-w-sm text-center text-sm text-gray-500">
                  The user may have been removed or the link is invalid. Go back to the list to
                  select a user.
                </p>
                <Button variant="outline" className="mt-6" asChild>
                  <Link href="/dashboard/user-management">Back to User Management</Link>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
          </main>
        </div>
      </div>
    );
  }

  const statusStyles =
    user.status === "Active"
      ? "bg-emerald-50 text-emerald-700"
      : user.status === "Suspended"
        ? "bg-amber-50 text-amber-700"
        : "bg-gray-100 text-gray-600";

  const registrationFormatted = new Date(user.registrationDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Breadcrumb & back */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  asChild
                >
                  <Link href="/dashboard/user-management">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Link>
                </Button>
                <span className="text-gray-300">|</span>
                <nav className="flex items-center gap-1.5 text-sm">
                  <Link
                    href="/dashboard"
                    className="text-gray-500 transition hover:text-gray-800"
                  >
                    Dashboard
                  </Link>
                  <span className="text-gray-400">/</span>
                  <Link
                    href="/dashboard/user-management"
                    className="text-gray-500 transition hover:text-gray-800"
                  >
                    User Management
                  </Link>
                  <span className="text-gray-400">/</span>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </nav>
              </div>
            </div>

            {/* Header card */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 bg-gradient-to-r from-pink-50 to-white px-6 py-6 sm:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                      <User className="h-7 w-7 text-pink-500" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                        {user.name}
                      </h1>
                      <p className="mt-0.5 text-sm text-gray-600">{user.email}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles}`}
                        >
                          {user.status}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {user.userId}
                        </span>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0" asChild>
                    <Link href="/dashboard/user-management">Back to list</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Detail cards grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Basic Info */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Shield className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Basic Info
                  </h2>
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      User ID
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Hash className="h-3.5 w-3.5 text-gray-400" />
                      {user.userId}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Full Name
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{user.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Role
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{user.role}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Registration Date
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {registrationFormatted}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Email
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <a
                        href={`mailto:${user.email}`}
                        className="text-pink-600 hover:underline"
                      >
                        {user.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Phone
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      <a
                        href={`tel:${user.phone}`}
                        className="text-pink-600 hover:underline"
                      >
                        {user.phone}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Location - right of Basic Info */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Location
                  </h2>
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      State
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {user.state}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      City
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{user.city}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Pin Code
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {user.pinCode ?? "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
