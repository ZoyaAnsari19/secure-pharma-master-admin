"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RevenueOverviewChart } from "@/components/charts/RevenueOverviewChart";
import { OrdersOverviewChart } from "@/components/charts/OrdersOverviewChart";
import { UserGrowthChart } from "@/components/charts/UserGrowthChart";
import { AffiliateEarningsChart } from "@/components/charts/AffiliateEarningsChart";
import { DataTable, Column } from "@/components/ui/table";
import { KpiCards } from "@/components/ui/kpiCards";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Users,
  ShoppingBag,
  IndianRupee,
  Package,
  Wallet,
  Truck,
  Building2,
} from "lucide-react";

const statCards = [
  {
    label: "Total Distributer",
    value: "156",
    delta: "+5 this month",
    icon: Truck,
  },
  {
    label: "Total Franchise",
    value: "42",
    delta: "+3 this month",
    icon: Building2,
  },
  {
    label: "Total Users/Agents",
    value: "12,543",
    delta: "+12.5%",
    icon: Users,
  },
  {
    label: "Total Orders",
    value: "3,421",
    delta: "+8.2%",
    icon: ShoppingBag,
  },
  {
    label: "Total Revenue",
    value: "₹45,231.00",
    delta: "+15.3%",
    icon: IndianRupee,
  },
  {
    label: "Total Products",
    value: "684",
    delta: "+3.1%",
    icon: Package,
  },
  {
    label: "Pending Withdraw Requests",
    value: "22",
    delta: "Pending today",
    icon: Wallet,
  },
];

const adminColumns: Column<{ id: number; name: string; email: string; role: string; status: string; lastActive: string }>[] = [
  { key: "name", label: "Admin" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "lastActive", label: "Last Active" },
];
const adminRows = [
  { id: 1, name: "Priya Sharma", email: "priya@truebeauty.in", role: "Master Admin", status: "Active", lastActive: "2 min ago" },
  { id: 2, name: "Ankit Verma", email: "ankit@truebeauty.in", role: "Operations", status: "Active", lastActive: "12 min ago" },
  { id: 3, name: "Sara Khan", email: "sara@truebeauty.in", role: "Marketing", status: "Suspended", lastActive: "3 days ago" },
  { id: 4, name: "Rahul Jain", email: "rahul@truebeauty.in", role: "Support", status: "Active", lastActive: "58 min ago" },
  { id: 5, name: "Divya Mehta", email: "divya@truebeauty.in", role: "Finance", status: "Active", lastActive: "1 hr ago" },
];

const userColumns: Column<{ id: number; name: string; email: string; tier: string; orders: string; status: string }>[] = [
  { key: "name", label: "User" },
  { key: "email", label: "Email" },
  { key: "tier", label: "Tier" },
  { key: "orders", label: "Orders" },
  { key: "status", label: "Status" },
];
const userRows = [
  { id: 1, name: "Nisha Gupta", email: "nisha@example.com", tier: "Gold", orders: "48", status: "Active" },
  { id: 2, name: "Karan Patel", email: "karan@example.com", tier: "Silver", orders: "21", status: "Active" },
  { id: 3, name: "Anjali Rao", email: "anjali@example.com", tier: "Platinum", orders: "82", status: "VIP" },
  { id: 4, name: "Vikram Singh", email: "vikram@example.com", tier: "Bronze", orders: "9", status: "On hold" },
  { id: 5, name: "Simran Kaur", email: "simran@example.com", tier: "Gold", orders: "32", status: "Active" },
];

const withdrawColumns: Column<{ id: number; affiliate: string; amount: string; method: string; status: string; requestedOn: string }>[] = [
  { key: "affiliate", label: "Affiliate" },
  { key: "amount", label: "Amount" },
  { key: "method", label: "Method" },
  { key: "status", label: "Status" },
  { key: "requestedOn", label: "Requested On" },
];
const withdrawRows = [
  { id: 1, affiliate: "GlowWithIra", amount: "₹18,500", method: "UPI", status: "Pending", requestedOn: "Today, 09:32 AM" },
  { id: 2, affiliate: "BlushByMeera", amount: "₹12,300", method: "Bank transfer", status: "Processing", requestedOn: "Today, 08:15 AM" },
  { id: 3, affiliate: "SkinStory", amount: "₹9,750", method: "UPI", status: "Completed", requestedOn: "Yesterday, 05:40 PM" },
  { id: 4, affiliate: "MinimalGlow", amount: "₹7,120", method: "Bank transfer", status: "Pending", requestedOn: "Yesterday, 01:17 PM" },
];

const orderColumns: Column<{ id: number; orderId: string; customer: string; total: string; status: string; placedOn: string }>[] = [
  { key: "orderId", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "total", label: "Total" },
  { key: "status", label: "Status" },
  { key: "placedOn", label: "Placed On" },
];
const orderRows = [
  { id: 1, orderId: "#TB-9821", customer: "Riya Malhotra", total: "₹2,340", status: "Delivered", placedOn: "Today, 10:02 AM" },
  { id: 2, orderId: "#TB-9819", customer: "Sagar Arora", total: "₹1,120", status: "Shipped", placedOn: "Today, 09:48 AM" },
  { id: 3, orderId: "#TB-9807", customer: "Palak Sethi", total: "₹3,890", status: "Processing", placedOn: "Yesterday, 04:37 PM" },
  { id: 4, orderId: "#TB-9798", customer: "Neeraj Kumar", total: "₹780", status: "Pending", placedOn: "Yesterday, 01:19 PM" },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                    Master Admin ✨
                  </h1>
                </div>
              </div>

              <KpiCards
                items={statCards.map((card) => {
                  const Icon = card.icon;
                  return {
                    title: card.label,
                    value: card.value,
                    delta: card.delta,
                    icon: <Icon className="h-4 w-4" />,
                  };
                })}
              />

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        Revenue Overview
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        Last 6 months performance
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RevenueOverviewChart />
                  </CardContent>
                </Card>
                <Card className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        Orders Overview
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        Order breakdown by day
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <OrdersOverviewChart />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        User Growth
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        New vs returning users
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <UserGrowthChart />
                  </CardContent>
                </Card>
                <Card className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        Affiliate Earnings
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        Top affiliate performance
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <AffiliateEarningsChart />
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="admins">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <TabsList>
                    <TabsTrigger value="admins">Admin Management</TabsTrigger>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="withdraw">
                      Withdraw Requests
                    </TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="admins">
                  <DataTable
                    title="Admin Management"
                    columns={adminColumns}
                    data={adminRows}
                    renderActionMenuItems={() => (
                      <>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-amber-600">
                          Suspend
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-rose-600">
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  />
                </TabsContent>
                <TabsContent value="users">
                  <DataTable
                    title="User Management"
                    columns={userColumns}
                    data={userRows}
                    renderActionMenuItems={() => (
                      <>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-amber-600">
                          Suspend
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-rose-600">
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  />
                </TabsContent>
                <TabsContent value="withdraw">
                  <DataTable
                    title="Withdraw Requests"
                    columns={withdrawColumns}
                    data={withdrawRows}
                    renderActionMenuItems={() => (
                      <>
                        <DropdownMenuItem className="text-emerald-600">
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-amber-600">
                          Hold
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-rose-600">
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                  />
                </TabsContent>
                <TabsContent value="orders">
                  <DataTable
                    title="Recent Orders"
                    columns={orderColumns}
                    data={orderRows}
                    renderActionMenuItems={() => (
                      <>
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem className="text-amber-600">
                          Refund
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-rose-600">
                          Cancel
                        </DropdownMenuItem>
                      </>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
