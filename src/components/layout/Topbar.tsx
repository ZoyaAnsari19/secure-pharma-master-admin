"use client";

import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Topbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 md:hidden"
            onClick={() => {
              if (typeof window === "undefined") return;
              window.dispatchEvent(new CustomEvent("dashboard:openSidebar"));
            }}
          >
            <span className="sr-only">Open menu</span>
            <Menu className="h-4 w-4" />
          </Button>

          <div className="hidden min-w-0 md:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
              Dashboard
            </p>
            <p className="truncate text-sm font-semibold text-gray-800">
              Secure Pharma Master Admin Overview
            </p>
          </div>
        </div>

        <div className="relative min-w-0 flex-1 sm:mx-auto sm:max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 sm:left-4" />
          <Input
            placeholder="Search across platform, users, products..."
            className="h-9 w-full min-w-[140px] rounded-full border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-700 placeholder:text-[11px] placeholder:text-gray-400 shadow-sm sm:h-10 sm:min-w-0 sm:pl-10 sm:pr-4 sm:text-sm sm:placeholder:text-xs"
          />
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 sm:gap-3">
          <Button
            variant="outline"
            size="icon"
            className="relative h-8 w-8 rounded-full border border-pink-100 bg-white text-pink-500 hover:bg-pink-50 max-[380px]:h-7 max-[380px]:w-7 sm:h-9 sm:w-9"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-pink-500 text-[9px] font-semibold text-white">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border border-pink-100 bg-white p-1.5 text-left shadow-sm transition hover:bg-pink-50 sm:px-2.5 sm:py-1.5">
                <Avatar className="h-8 w-8 max-[380px]:h-7 max-[380px]:w-7">
                  <AvatarFallback className="bg-pink-500 text-[11px] font-semibold text-white">
                    SA
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-xs md:block">
                  <p className="font-semibold text-gray-800">Master Admin</p>
                  <p className="text-[11px] text-gray-500">
                    truebeauty@admin.com
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-1">
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Switch workspace</DropdownMenuItem>
              <DropdownMenuItem>Billing &amp; plan</DropdownMenuItem>
              <DropdownMenuItem className="text-pink-600">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
