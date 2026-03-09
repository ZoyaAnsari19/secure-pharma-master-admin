
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
import { Button } from "@/components/ui/button";
import { RevenueOverviewChart } from "@/charts/RevenueOverviewChart";
import { OrdersOverviewChart } from "@/charts/OrdersOverviewChart";
import { UserGrowthChart } from "@/charts/UserGrowthChart";
import { AffiliateEarningsChart } from "@/charts/AffiliateEarningsChart";
import { AdminManagementTable } from "@/tables/AdminManagementTable";
import { UserManagementTable } from "@/tables/UserManagementTable";
import { WithdrawRequestsTable } from "@/tables/WithdrawRequestsTable";
import { OrdersTable } from "@/tables/OrdersTable";
import { KpiCards } from "@/components/ui/kpiCards";
import { SideBar } from "@/components/sideBar";
import { TopBar } from "@/components/topBar";
import {
  ArrowUpRight,
  Users,
  ShoppingBag,
  IndianRupee,
  Package,
  UserCheck,
  Wallet,
} from "lucide-react";

const statCards = [
  {
    label: "Total Users",
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
    label: "Total Affiliates",
    value: "1,245",
    delta: "+6.1%",
    icon: UserCheck,
  },
  {
    label: "Pending Withdraw Requests",
    value: "22",
    delta: "Pending today",
    icon: Wallet,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <SideBar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                    Good morning, Admin ✨
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    A soft overview of what&apos;s happening across True Beauty
                    today.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="subtle" size="sm">
                    <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />
                    Live store
                  </Button>
                  <Button size="sm">Create campaign</Button>
                </div>
              </div>

              {/* Stat cards */}
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

              {/* Charts */}
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

              {/* Tables */}
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
                  <AdminManagementTable />
                </TabsContent>
                <TabsContent value="users">
                  <UserManagementTable />
                </TabsContent>
                <TabsContent value="withdraw">
                  <WithdrawRequestsTable />
                </TabsContent>
                <TabsContent value="orders">
                  <OrdersTable />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
