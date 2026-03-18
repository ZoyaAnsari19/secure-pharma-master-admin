"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  Package,
  ShoppingBag,
  Undo2,
  CreditCard,
  Percent,
  Bell,
  LineChart,
  BarChart3,
  PieChart,
  Palette,
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
      { label: "Refunds / Returns", icon: <Undo2 className="h-4 w-4" />, href: "/dashboard/refund-return-management" },
      { label: "Withdraw Requests", icon: <CreditCard className="h-4 w-4" />, href: "/dashboard/withdrawe-requests-management" },
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
      { label: "User Reports", icon: <BarChart3 className="h-4 w-4" />, href: "/dashboard/user-analytics" },
      { label: "Product Reports", icon: <Package className="h-4 w-4" />, href: "/dashboard/product-analytics" },
      { label: "Order Reports", icon: <ShoppingBag className="h-4 w-4" />, href: "/dashboard/order-analytics" },
      { label: "Inventory Reports", icon: <PieChart className="h-4 w-4" />, href: "/dashboard/inventory-analytics" },
      { label: "Network Analytics", icon: <BarChart3 className="h-4 w-4" />, href: "/dashboard/network-analytics" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Web Theme", icon: <Palette className="h-4 w-4" />, href: "/dashboard/web-theme" },
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

  // Allow Topbar (and others) to open the drawer without prop-drilling.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const open = () => {
      setMobileOpen(true);
      onOpenChange?.(true);
    };
    const toggle = () => {
      setMobileOpen((prev) => {
        const next = !prev;
        onOpenChange?.(next);
        return next;
      });
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        onOpenChange?.(false);
      }
    };

    window.addEventListener("dashboard:openSidebar", open as EventListener);
    window.addEventListener("dashboard:toggleSidebar", toggle as EventListener);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("dashboard:openSidebar", open as EventListener);
      window.removeEventListener("dashboard:toggleSidebar", toggle as EventListener);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onOpenChange]);

  // Lock scroll while the off-canvas drawer is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    onOpenChange?.(false);
  };

  const renderNav = (collapsed: boolean) => (
    <div className="space-y-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
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
                    {!collapsed && <span>{item.label}</span>}
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
  );

  return (
    <>
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-gray-200 bg-white md:flex",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        <div className="flex h-full w-full flex-col bg-white">
          <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4 pr-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 overflow-hidden"
            >
              <div className="relative h-10 w-40 sm:h-11 sm:w-44 md:h-12 md:w-52 lg:h-14 lg:w-60">
                <Image
                  src="/images/logo.png"
                  alt="Secure Pharma Organics & Food Industries"
                  fill
                  className="object-contain"
                  sizes="(min-width: 1024px) 208px, (min-width: 768px) 176px, 160px"
                  priority
                />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col leading-none">
                  <span className="whitespace-nowrap text-xs font-semibold tracking-tight text-gray-900 sm:text-sm">
                    Secure Pharma
                  </span>
                </div>
              )}
            </Link>
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

          <div className="beauty-scroll flex-1 overflow-y-auto px-4 pb-6 pt-2">
            {renderNav(isCollapsed)}
          </div>
        </div>
      </aside>

      <div className="md:hidden">
        {/* Off-canvas drawer (mobile) */}
        <div
          className={cn(
            "fixed inset-0 z-[60] transition",
            mobileOpen ? "pointer-events-auto" : "pointer-events-none"
          )}
          aria-hidden={!mobileOpen}
        >
          <button
            className={cn(
              "absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-200",
              mobileOpen ? "opacity-100" : "opacity-0"
            )}
            onClick={closeMobile}
          />

          <aside
            className={cn(
              "absolute left-0 top-0 flex h-full w-[78vw] max-w-[320px] flex-col border-r border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out",
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 overflow-hidden"
                onClick={closeMobile}
              >
                <div className="relative h-10 w-40">
                  <Image
                    src="/images/logo.png"
                    alt="Secure Pharma Organics & Food Industries"
                    fill
                    className="object-contain"
                    sizes="160px"
                    priority
                  />
                </div>
              </Link>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-50 text-pink-600"
                onClick={closeMobile}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Force expanded labels in drawer for usability */}
            <div className="beauty-scroll flex-1 overflow-y-auto px-4 pb-6 pt-2">
              {renderNav(false)}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
