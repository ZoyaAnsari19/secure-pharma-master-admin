"use client";

import { useMemo, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, type Column } from "@/components/ui/table";
import { FiltersBar } from "@/components/ui/filters";
import {
  Palette,
  LayoutTemplate,
  Monitor,
  Eye,
  CheckCircle2,
  Moon,
  SunMedium,
  Rows3,
  Columns3,
} from "lucide-react";

type ThemeStatus = "Active" | "Draft" | "Archived";
type ThemeLayout = "Full width" | "Boxed" | "Split";
type ThemeMode = "Light" | "Dark" | "Auto";

type ThemeConfig = {
  id: string;
  name: string;
  description: string;
  status: ThemeStatus;
  mode: ThemeMode;
  layout: ThemeLayout;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  borderRadius: "soft" | "rounded" | "pill";
  fontFamily: "Inter" | "Poppins" | "System";
  showHeroBanner: boolean;
  showPromoStrip: boolean;
  showTestimonials: boolean;
  showFeaturedGrid: boolean;
};

const THEME_LIBRARY: ThemeConfig[] = [
  {
    id: "modern-light",
    name: "Modern Light",
    description: "Clean light layout with soft cards and pastel accents.",
    status: "Active",
    mode: "Light",
    layout: "Full width",
    primaryColor: "#ec4899",
    secondaryColor: "#6366f1",
    accentColor: "#f97316",
    backgroundColor: "#f8fafc",
    surfaceColor: "#ffffff",
    borderRadius: "rounded",
    fontFamily: "Inter",
    showHeroBanner: true,
    showPromoStrip: true,
    showTestimonials: true,
    showFeaturedGrid: true,
  },
  {
    id: "elegant-dark",
    name: "Elegant Dark",
    description: "High-contrast dark theme for premium night-time browsing.",
    status: "Draft",
    mode: "Dark",
    layout: "Boxed",
    primaryColor: "#f472b6",
    secondaryColor: "#a855f7",
    accentColor: "#22c55e",
    backgroundColor: "#020617",
    surfaceColor: "#020617",
    borderRadius: "soft",
    fontFamily: "Poppins",
    showHeroBanner: true,
    showPromoStrip: false,
    showTestimonials: true,
    showFeaturedGrid: true,
  },
  {
    id: "minimal-split",
    name: "Minimal Split Layout",
    description: "Two-column split layout with focus on product discovery.",
    status: "Archived",
    mode: "Auto",
    layout: "Split",
    primaryColor: "#0ea5e9",
    secondaryColor: "#64748b",
    accentColor: "#84cc16",
    backgroundColor: "#f9fafb",
    surfaceColor: "#ffffff",
    borderRadius: "pill",
    fontFamily: "System",
    showHeroBanner: false,
    showPromoStrip: true,
    showTestimonials: false,
    showFeaturedGrid: true,
  },
];

type ThemeRow = ThemeConfig & {
  createdOn: string;
  lastUpdated: string;
};

const THEME_ROWS: ThemeRow[] = [
  {
    ...THEME_LIBRARY[0],
    createdOn: "2025-01-10",
    lastUpdated: "2025-03-02",
  },
  {
    ...THEME_LIBRARY[1],
    createdOn: "2025-02-18",
    lastUpdated: "2025-02-20",
  },
  {
    ...THEME_LIBRARY[2],
    createdOn: "2024-10-04",
    lastUpdated: "2025-01-01",
  },
];

const THEME_COLUMNS: Column<ThemeRow>[] = [
  { key: "name", label: "Theme Name" },
  { key: "status", label: "Status" },
  { key: "mode", label: "Mode" },
  { key: "layout", label: "Layout" },
  { key: "fontFamily", label: "Font" },
  { key: "createdOn", label: "Created On" },
  { key: "lastUpdated", label: "Last Updated" },
];

export default function WebThemePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ThemeStatus>("All");
  const [selectedThemeId, setSelectedThemeId] =
    useState<ThemeConfig["id"]>("modern-light");

  const filteredRows = useMemo(
    () =>
      THEME_ROWS.filter((theme) => {
        const matchesSearch =
          !search ||
          [theme.name, theme.description].some((value) =>
            value.toLowerCase().includes(search.toLowerCase())
          );
        const matchesStatus =
          statusFilter === "All" || theme.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [search, statusFilter]
  );

  const activeTheme = useMemo(
    () => THEME_LIBRARY.find((t) => t.id === selectedThemeId) ?? THEME_LIBRARY[0],
    [selectedThemeId]
  );

  const themePreviewClasses = useMemo(() => {
    const radius =
      activeTheme.borderRadius === "pill"
        ? "rounded-3xl"
        : activeTheme.borderRadius === "rounded"
        ? "rounded-2xl"
        : "rounded-xl";

    const fontClass =
      activeTheme.fontFamily === "Poppins"
        ? "font-[Poppins,system-ui,sans-serif]"
        : activeTheme.fontFamily === "System"
        ? "font-sans"
        : "font-[Inter,system-ui,sans-serif]";

    return { radius, fontClass };
  }, [activeTheme.borderRadius, activeTheme.fontFamily]);

  return (
    <div className="flex h-screen bg-slate-50/80 text-slate-900">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col">
        <Topbar />
        <main className="beauty-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                Web Theme Management
              </h1>
              <p className="text-sm text-slate-500">
                Create, preview and apply website themes using a reusable,
                config-driven theme library.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-50 text-pink-500">
                        <Monitor className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">
                          Live Theme Preview
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-500">
                          See how the selected theme will look on your storefront.
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full px-3 text-xs"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        Preview
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="rounded-full px-3 text-xs"
                      >
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                        Apply theme
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className={`mt-2 overflow-hidden border border-slate-200/80 ${themePreviewClasses.radius} ${themePreviewClasses.fontClass}`}
                    style={{
                      background: activeTheme.backgroundColor,
                    }}
                  >
                    <div
                      className="border-b px-4 py-3 text-xs font-medium flex items-center justify-between"
                      style={{
                        background: activeTheme.surfaceColor,
                        color: activeTheme.primaryColor,
                      }}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold"
                          style={{
                            background: activeTheme.primaryColor,
                            color: "#ffffff",
                          }}
                        >
                          TB
                        </span>
                        <span>Brand storefront</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Moon className="h-3.5 w-3.5" />
                        <SunMedium className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    {activeTheme.showHeroBanner && (
                      <div className="flex flex-col gap-4 px-5 py-5 md:flex-row">
                        <div className="space-y-2 md:w-3/5">
                          <p
                            className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                            style={{ color: activeTheme.secondaryColor }}
                          >
                            New launch collection
                          </p>
                          <h2
                            className="text-xl font-semibold leading-tight md:text-2xl"
                            style={{ color: "#0f172a" }}
                          >
                            Bring your beauty storefront to life with a curated
                            theme.
                          </h2>
                          <p className="text-xs leading-relaxed text-slate-600">
                            Themes control colors, typography, layout density and
                            homepage modules. Configure once and reuse across
                            your entire network.
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <span
                              className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium shadow-sm"
                              style={{
                                background: activeTheme.primaryColor,
                                color: "#ffffff",
                              }}
                            >
                              Primary button
                            </span>
                            <span
                              className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium"
                              style={{
                                borderColor: activeTheme.primaryColor,
                                color: activeTheme.primaryColor,
                              }}
                            >
                              Secondary button
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-1 flex-col gap-2 text-[11px] text-slate-600 md:w-2/5">
                          <div className="grid grid-cols-3 gap-2">
                            <div
                              className="h-16 rounded-xl border text-center text-[10px] font-medium flex items-center justify-center"
                              style={{ borderColor: activeTheme.primaryColor }}
                            >
                              Primary
                            </div>
                            <div
                              className="h-16 rounded-xl border text-center text-[10px] font-medium flex items-center justify-center"
                              style={{ borderColor: activeTheme.secondaryColor }}
                            >
                              Secondary
                            </div>
                            <div
                              className="h-16 rounded-xl border text-center text-[10px] font-medium flex items-center justify-center"
                              style={{ borderColor: activeTheme.accentColor }}
                            >
                              Accent
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                            <div className="space-y-0.5">
                              <p className="text-[11px] font-medium text-slate-700">
                                Layout preset
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {activeTheme.layout} •{" "}
                                {activeTheme.borderRadius === "pill"
                                  ? "Pill corners"
                                  : activeTheme.borderRadius === "rounded"
                                  ? "Rounded corners"
                                  : "Soft corners"}
                              </p>
                            </div>
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-500">
                              {activeTheme.layout === "Split" ? (
                                <Rows3 className="h-4 w-4" />
                              ) : (
                                <Columns3 className="h-4 w-4" />
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTheme.showFeaturedGrid && (
                      <div
                        className="border-t px-5 py-4 text-[11px]"
                        style={{
                          borderColor: activeTheme.surfaceColor,
                          background: activeTheme.surfaceColor,
                        }}
                      >
                        <p className="mb-2 text-[11px] font-medium text-slate-600">
                          Featured components
                        </p>
                        <div className="grid gap-2 md:grid-cols-3">
                          {["Hero banner", "Promo strip", "Testimonials"].map(
                            (label) => {
                              const isEnabled =
                                (label === "Hero banner" &&
                                  activeTheme.showHeroBanner) ||
                                (label === "Promo strip" &&
                                  activeTheme.showPromoStrip) ||
                                (label === "Testimonials" &&
                                  activeTheme.showTestimonials);
                              return (
                                <div
                                  key={label}
                                  className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                                    isEnabled
                                      ? "border-pink-100 bg-pink-50/50 text-pink-700"
                                      : "border-slate-100 bg-slate-50 text-slate-500"
                                  }`}
                                >
                                  <span className="text-[11px] font-medium">
                                    {label}
                                  </span>
                                  {isEnabled && (
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p className="font-semibold text-slate-700">
                        Config snapshot
                      </p>
                      <p>
                        Mode:{" "}
                        <span className="font-semibold">{activeTheme.mode}</span>{" "}
                        · Font:{" "}
                        <span className="font-semibold">
                          {activeTheme.fontFamily}
                        </span>
                      </p>
                      <p>
                        Status:{" "}
                        <span className="font-semibold">{activeTheme.status}</span>
                      </p>
                    </div>
                    <div className="space-y-2 text-xs text-slate-600">
                      <p className="font-semibold text-slate-700">
                        Quick overrides
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Input
                          type="color"
                          aria-label="Primary color"
                          defaultValue={activeTheme.primaryColor}
                          className="h-8 w-14 cursor-pointer rounded-full border border-slate-200 bg-transparent p-1"
                          disabled
                        />
                        <Input
                          type="color"
                          aria-label="Background color"
                          defaultValue={activeTheme.backgroundColor}
                          className="h-8 w-14 cursor-pointer rounded-full border border-slate-200 bg-transparent p-1"
                          disabled
                        />
                        <span className="text-[11px] text-slate-400">
                          (Config-driven; connect to design tokens in API)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      Theme Library
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-500">
                      Centralised list of reusable themes with status and layout
                      configuration.
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="primary" className="rounded-full px-4">
                    <Palette className="mr-1.5 h-3.5 w-3.5" />
                    New theme
                  </Button>
                </CardHeader>
                <CardContent>
                  <DataTable<ThemeRow>
                    title=""
                    columns={THEME_COLUMNS}
                    data={filteredRows}
                    pageSize={5}
                    searchPlaceholder="Search themes by name or description..."
                    searchValue={search}
                    onSearchValueChange={setSearch}
                    hideFiltersButton
                    onRowClick={(row) => setSelectedThemeId(row.id)}
                    headerContent={
                      <FiltersBar
                        searchPlaceholder="Search themes..."
                        searchValue={search}
                        onSearchValueChange={setSearch}
                        right={
                          <select
                            value={statusFilter}
                            onChange={(e) =>
                              setStatusFilter(
                                e.target.value as "All" | ThemeStatus
                              )
                            }
                            className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-700 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                          >
                            <option value="All">All statuses</option>
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                            <option value="Archived">Archived</option>
                          </select>
                        }
                      />
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}