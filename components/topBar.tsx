"use client";

import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-3 items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: title */}
        <div className="hidden md:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
            Dashboard
          </p>
          <p className="text-sm font-semibold text-gray-800">
            Super Admin Overview
          </p>
        </div>

        {/* Center: search */}
        <div className="relative mx-auto w-full max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search across platform, users, products..."
            className="w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-xs text-gray-700 placeholder:text-gray-400 shadow-sm"
          />
        </div>

        {/* Right: notification + profile */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            size="icon"
            className="relative h-9 w-9 rounded-full border border-pink-100 bg-white text-pink-500 hover:bg-pink-50"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-pink-500 text-[9px] font-semibold text-white">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border border-pink-100 bg-white px-2.5 py-1.5 text-left shadow-sm transition hover:bg-pink-50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-pink-500 text-[11px] font-semibold text-white">
                    SA
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-xs md:block">
                  <p className="font-semibold text-gray-800">Super Admin</p>
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
