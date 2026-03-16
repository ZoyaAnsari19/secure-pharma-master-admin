"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  Wallet,
  Package,
  Boxes,
  ShoppingBag,
  Undo2,
  CreditCard,
  Percent,
  Bell,
  LineChart,
  BarChart3,
  PieChart,
  Palette,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Truck,
  Store,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

type NavItem = {
  label: string;
  icon: ReactNode;
  href?: string;
};

const sidebarSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, href: "/dashboard" },
    ],
  },
  {
    title: "Platform Management",
    items: [
      { label: "Sub Admin Management", icon: <Shield className="h-4 w-4" />, href: "/dashboard/admin-management" },
      { label: "User Management", icon: <Users className="h-4 w-4" />, href: "/dashboard/user-management" },
      { label: "Distributor Management", icon: <Truck className="h-4 w-4" />, href: "/dashboard/distributor-management" },
      { label: "Franchise Management", icon: <Store className="h-4 w-4" />, href: "/dashboard/franchise-management" },
      { label: "Review Management", icon: <MessageSquare className="h-4 w-4" />, href: "/dashboard/review-management" },
    ],
  },
  {
    title: "Orders & Finance",
    items: [
      {
        label: "Order Management",
        icon: <ShoppingBag className="h-4 w-4" />,
        href: "/dashboard/order-management",
      },
      { label: "Refunds / Returns", icon: <Undo2 className="h-4 w-4" /> },
      { label: "Withdraw Requests", icon: <CreditCard className="h-4 w-4" /> },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "Coupons", icon: <Percent className="h-4 w-4" />, href: "/dashboard/coupon-management" },
      { label: "Notifications", icon: <Bell className="h-4 w-4" />, href: "/dashboard/notifications" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { label: "Sales Reports", icon: <LineChart className="h-4 w-4" />, href: "/dashboard/sales-analytics" },
      { label: "User Reports", icon: <BarChart3 className="h-4 w-4" /> },
      { label: "Affiliate Reports", icon: <PieChart className="h-4 w-4" /> },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Web Theme", icon: <Palette className="h-4 w-4" /> },
    ],
  },
];

type SidebarProps = {
  onOpenChange?: (open: boolean) => void;
};

export function Sidebar({ onOpenChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Responsive behaviour: desktop full, tablet collapsed, mobile drawer
  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyLayoutForWidth = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setIsCollapsed(false);
        setMobileOpen(false);
      } else if (width >= 768) {
        setIsCollapsed(true);
        setMobileOpen(false);
      } else {
        setIsCollapsed(false);
      }
    };

    applyLayoutForWidth();
    window.addEventListener("resize", applyLayoutForWidth);
    return () => window.removeEventListener("resize", applyLayoutForWidth);
  }, []);

  const closeMobile = () => {
    setMobileOpen(false);
    onOpenChange?.(false);
  };

  const SidebarContent = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4 pr-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-50 text-pink-500 shadow-sm">
            <span className="text-sm font-semibold">TB</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-gray-900">
                Secure Pharma
              </span>
              <span className="text-[11px] font-medium text-gray-500">
                Master Admin
              </span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-gray-900 shadow-sm hover:bg-pink-100"
          onClick={() => setIsCollapsed((v) => !v)}
        >
          <span className="sr-only">Toggle sidebar</span>
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-900" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-900" />
          )}
        </Button>
      </div>
      <div className="beauty-scroll mt-2 flex-1 space-y-4 overflow-y-auto px-4 pb-6">
        {sidebarSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = item.href
                  ? item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.href || pathname.startsWith(item.href + "/")
                  : false;
                const content = (
                  <>
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-500 group-hover:bg-white group-hover:text-pink-500",
                        isActive && "bg-white text-pink-600 shadow-sm"
                      )}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && <span>{item.label}</span>}
                  </>
                );
                if (item.href) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={closeMobile}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-[13px] font-medium text-gray-600 transition hover:bg-gray-100",
                        isActive && "bg-pink-100 text-pink-600 hover:bg-pink-100"
                      )}
                    >
                      {content}
                    </Link>
                  );
                }
                return (
                  <button
                    key={item.label}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-[13px] font-medium text-gray-600 transition hover:bg-gray-100",
                      isActive && "bg-pink-100 text-pink-600 hover:bg-pink-100"
                    )}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-gray-200 bg-white md:flex",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        <div className="flex w-full flex-col">{SidebarContent}</div>
      </aside>

      <div className="md:hidden">
        <button
          className="fixed left-4 top-4 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md"
          onClick={() => {
            setMobileOpen(true);
            onOpenChange?.(true);
          }}
        >
          <Menu className="h-4 w-4 text-pink-500" />
        </button>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="relative flex w-64 flex-col border-r border-gray-200 bg-white pb-4 pt-3 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <span className="text-sm font-semibold text-gray-900">
                  True Beauty
                </span>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-pink-500"
                  onClick={closeMobile}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex-1 px-1">{SidebarContent}</div>
            </div>
            <button
              className="flex-1 bg-black/20 backdrop-blur-sm"
              onClick={closeMobile}
            />
          </div>
        )}
      </div>
    </>
  );
}
