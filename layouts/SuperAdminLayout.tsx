"use client";

import { ReactNode } from "react";

import { TopBar } from "@/components/topBar";
import { SideBar } from "@/components/sideBar";

type SuperAdminLayoutProps = {
  children: ReactNode;
};

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <SideBar />

      {/* Main Content */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Top Navbar */}
        <TopBar />

        {/* Main content area */}
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

