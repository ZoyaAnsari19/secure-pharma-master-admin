 "use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { SaleRevenueLineChart, RevenuePoint } from "@/components/charts/SaleRevenueLineChart";
import { DataTable, Column } from "@/components/ui/table";

const monthlyRevenue: RevenuePoint[] = [
  { label: "Jan", amount: 320000 },
  { label: "Feb", amount: 345000 },
  { label: "Mar", amount: 372000 },
  { label: "Apr", amount: 398000 },
  { label: "May", amount: 421000 },
  { label: "Jun", amount: 456000 },
];

const weeklyRevenue: RevenuePoint[] = [
  { label: "Week 1", amount: 98000 },
  { label: "Week 2", amount: 112000 },
  { label: "Week 3", amount: 104500 },
  { label: "Week 4", amount: 121300 },
];

const dailyRevenue: RevenuePoint[] = [
  { label: "Mon", amount: 15800 },
  { label: "Tue", amount: 17240 },
  { label: "Wed", amount: 16310 },
  { label: "Thu", amount: 18940 },
  { label: "Fri", amount: 20110 },
  { label: "Sat", amount: 17650 },
  { label: "Sun", amount: 14980 },
];

type RevenueRow = {
  id: number;
  period: string;
  granularity: "Monthly" | "Weekly" | "Daily";
  revenue: string;
  growth: string;
};

const revenueColumns: Column<RevenueRow>[] = [
  { key: "period", label: "Period" },
  { key: "granularity", label: "Type" },
  { key: "revenue", label: "Revenue" },
  { key: "growth", label: "Growth vs prev." },
];

const revenueRows: RevenueRow[] = [
  { id: 1, period: "Jun 2026", granularity: "Monthly", revenue: "₹4.56L", growth: "+8.3%" },
  { id: 2, period: "May 2026", granularity: "Monthly", revenue: "₹4.21L", growth: "+6.7%" },
  { id: 3, period: "Week 4 (Jun)", granularity: "Weekly", revenue: "₹1.21L", growth: "+9.4%" },
  { id: 4, period: "Week 3 (Jun)", granularity: "Weekly", revenue: "₹1.04L", growth: "+4.1%" },
  { id: 5, period: "Fri (last week)", granularity: "Daily", revenue: "₹20,110", growth: "+12.2%" },
];

export default function SalesAnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50/80 text-slate-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
            <div className="space-y-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                  Sales Analytics
                </h1>
                <p className="text-sm text-slate-500">
                  Revenue performance across different time ranges
                </p>
              </div>

              <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      Monthly Revenue
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-500">
                      Revenue trend for the last 6 months
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <SaleRevenueLineChart data={monthlyRevenue} granularity="monthly" />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Weekly Revenue
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Revenue by week in the current month
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SaleRevenueLineChart data={weeklyRevenue} granularity="weekly" />
                  </CardContent>
                </Card>

                <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Daily Revenue
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Revenue for the last 7 days
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SaleRevenueLineChart data={dailyRevenue} granularity="daily" />
                  </CardContent>
                </Card>
              </div>

              <DataTable
                title="Revenue Breakdown"
                columns={revenueColumns}
                data={revenueRows}
                pageSize={5}
                searchPlaceholder="Search by period..."
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

