"use client";

import { useEffect, useMemo, useState } from "react";
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
  Monitor,
  Eye,
  CheckCircle2,
  Moon,
  SunMedium,
  Rows3,
  Columns3,
} from "lucide-react";
import {
  DEFAULT_THEME_ID,
  THEME_STORAGE_KEY,
  getAllThemes,
  loadCustomThemes,
  saveCustomThemes,
  type ThemeConfig,
  type ThemeStatus,
} from "@/config/themes";
import {
  SideDrawer,
  SideDrawerContent,
  SideDrawerFooter,
  SideDrawerHeader,
  SideDrawerTitle,
  SideDrawerTrigger,
} from "@/components/ui/sideDrawer";

type ThemeRow = ThemeConfig & {
  createdOn: string;
  lastUpdated: string;
};

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
  // Theme selected in the library (but not necessarily previewed yet)
  const [selectedThemeId, setSelectedThemeId] =
    useState<ThemeConfig["id"]>(DEFAULT_THEME_ID);
  // Theme currently being previewed in the live preview card
  const [previewThemeId, setPreviewThemeId] =
    useState<ThemeConfig["id"]>(DEFAULT_THEME_ID);
  // Theme considered as "applied" (for UX only – not global)
  const [appliedThemeId, setAppliedThemeId] =
    useState<ThemeConfig["id"]>(DEFAULT_THEME_ID);
  const [themeLibrary, setThemeLibrary] = useState<ThemeConfig[]>(() =>
    getAllThemes()
  );
  const [isMounted, setIsMounted] = useState(false);
  const [newThemeOpen, setNewThemeOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newThemeForm, setNewThemeForm] = useState<
    ThemeConfig & { status: ThemeStatus }
  >({
    id: "",
    name: "",
    description: "",
    status: "Draft",
    mode: "Light",
    layout: "Full width",
    primaryColor: "#ec4899",
    secondaryColor: "#6366f1",
    accentColor: "#f97316",
    backgroundColor: "#f8fafc",
    surfaceColor: "#ffffff",
    textColor: "#0f172a",
    borderRadius: "rounded",
    fontFamily: "Inter",
    fontSize: "md",
    spacing: "comfortable",
    showHeroBanner: true,
    showPromoStrip: true,
    showTestimonials: true,
    showFeaturedGrid: true,
    headerStyle: "solid",
    footerStyle: "minimal",
    buttonStyle: "pill",
    cardStyle: "elevated",
    customCss: "",
  });

  // Hydrate theme selection from persisted admin setting
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedId =
      window.localStorage.getItem(THEME_STORAGE_KEY) ?? DEFAULT_THEME_ID;
    setSelectedThemeId(storedId as ThemeConfig["id"]);
    setPreviewThemeId(storedId as ThemeConfig["id"]);
    setAppliedThemeId(storedId as ThemeConfig["id"]);
    // Refresh library with any custom themes stored in localStorage.
    setThemeLibrary(getAllThemes());
    setIsMounted(true);
  }, []);

  const themeRows: ThemeRow[] = useMemo(() => {
    const customThemes = loadCustomThemes() as (ThemeConfig & {
      createdOn?: string;
      lastUpdated?: string;
    })[];
    const now = new Date().toISOString().slice(0, 10);

    return getAllThemes().map((theme) => {
      const customMeta = customThemes.find((t) => t.id === theme.id);
      if (theme.id === "modern-light") {
        return {
          ...theme,
          createdOn: "2025-01-10",
          lastUpdated: customMeta?.lastUpdated ?? "2025-03-02",
        };
      }
      if (theme.id === "elegant-dark") {
        return {
          ...theme,
          createdOn: "2025-02-18",
          lastUpdated: customMeta?.lastUpdated ?? "2025-02-20",
        };
      }
      if (theme.id === "minimal-split") {
        return {
          ...theme,
          createdOn: "2024-10-04",
          lastUpdated: customMeta?.lastUpdated ?? "2025-01-01",
        };
      }
      return {
        ...theme,
        createdOn: customMeta?.createdOn ?? now,
        lastUpdated: customMeta?.lastUpdated ?? now,
      };
    });
  }, [themeLibrary]);

  const filteredRows = useMemo(
    () =>
      themeRows.filter((theme) => {
        const matchesSearch =
          !search ||
          [theme.name, theme.description].some((value) =>
            value.toLowerCase().includes(search.toLowerCase())
          );
        const matchesStatus =
          statusFilter === "All" || theme.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [search, statusFilter, themeRows]
  );

  const activeTheme = useMemo(
    () => themeLibrary.find((t) => t.id === previewThemeId) ?? themeLibrary[0],
    [previewThemeId, themeLibrary]
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

  const newThemePreviewJson = useMemo(
    () =>
      JSON.stringify(
        { ...newThemeForm, id: newThemeForm.id || "<auto-generated>" },
        null,
        2
      ),
    [newThemeForm]
  );

  if (!isMounted) {
    // Avoid SSR/CSR mismatches by rendering only after hydration.
    return null;
  }

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
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-50 text-pink-500">
                      <Monitor className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Live Theme Preview
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        See how the preview theme will look on your storefront
                        before applying globally.
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-nowrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full px-3 text-xs"
                      onClick={() => setPreviewThemeId(selectedThemeId)}
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      Preview
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-full px-3 text-xs"
                      onClick={() => {
                        setAppliedThemeId(previewThemeId);
                        if (typeof window !== "undefined") {
                          window.localStorage.setItem(
                            THEME_STORAGE_KEY,
                            previewThemeId
                          );
                          window.dispatchEvent(
                            new CustomEvent("super-admin-theme-changed", {
                              detail: previewThemeId,
                            })
                          );
                        }
                      }}
                    >
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                      Apply theme
                    </Button>
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
                      {themeLibrary.length > 0 ? (
                        <p>
                          Applied theme:{" "}
                          <span className="font-semibold">
                            {
                              (themeLibrary.find(
                                (t) => t.id === appliedThemeId
                              ) ?? themeLibrary[0]
                            ).name
                          }
                        </span>
                        </p>
                      ) : null}
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
                  <SideDrawer open={newThemeOpen} onOpenChange={setNewThemeOpen}>
                    <SideDrawerTrigger asChild>
                      <Button
                        size="sm"
                        variant="primary"
                        className="rounded-full px-4"
                      >
                        <Palette className="mr-1.5 h-3.5 w-3.5" />
                        New theme
                      </Button>
                    </SideDrawerTrigger>
                    <SideDrawerContent className="gap-0">
                      <SideDrawerHeader>
                        <SideDrawerTitle>Create new theme</SideDrawerTitle>
                      </SideDrawerHeader>
                      <form
                        className="mt-4 grid gap-5 pb-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const id =
                            newThemeForm.id && newThemeForm.id.trim().length > 0
                              ? newThemeForm.id.trim()
                              : `custom-${Date.now()}`;

                          const themeToSave: ThemeConfig = {
                            ...newThemeForm,
                            id,
                          };

                          const existingCustom = loadCustomThemes();
                          const now = new Date().toISOString().slice(0, 10);
                          const updatedCustom = [
                            ...existingCustom,
                            {
                              ...themeToSave,
                              createdOn: now,
                              lastUpdated: now,
                            } as any,
                          ];
                          saveCustomThemes(updatedCustom as any);
                          setThemeLibrary(getAllThemes());
                          setSelectedThemeId(id);
                          setPreviewThemeId(id);
                          setNewThemeOpen(false);
                        }}
                      >
                        {/* 1. Basic information */}
                        <section className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3.5">
                          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Basic information
                          </h3>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-700">
                                Theme name
                              </label>
                              <Input
                                value={newThemeForm.name}
                                onChange={(e) =>
                                  setNewThemeForm((t) => ({
                                    ...t,
                                    name: e.target.value,
                                  }))
                                }
                                placeholder="e.g. Brand Light Theme"
                                required
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-700">
                                Identifier (optional)
                              </label>
                              <Input
                                value={newThemeForm.id}
                                onChange={(e) =>
                                  setNewThemeForm((t) => ({
                                    ...t,
                                    id: e.target.value,
                                  }))
                                }
                                placeholder="e.g. brand-light"
                              />
                            </div>
                          </div>
                          <div className="mt-3 space-y-1.5">
                            <label className="text-xs font-medium text-slate-700">
                              Description
                            </label>
                            <textarea
                              className="min-h-[60px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                              value={newThemeForm.description}
                              onChange={(e) =>
                                setNewThemeForm((t) => ({
                                  ...t,
                                  description: e.target.value,
                                }))
                              }
                              placeholder="Short description of where this theme will be used..."
                            />
                          </div>
                          <div className="mt-3 grid grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-700">
                                Mode
                              </label>
                              <select
                                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                                value={newThemeForm.mode}
                                onChange={(e) =>
                                  setNewThemeForm((t) => ({
                                    ...t,
                                    mode: e.target.value as ThemeConfig["mode"],
                                  }))
                                }
                              >
                                <option value="Light">Light</option>
                                <option value="Dark">Dark</option>
                                <option value="Auto">Auto</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-700">
                                Status
                              </label>
                              <select
                                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                                value={newThemeForm.status}
                                onChange={(e) =>
                                  setNewThemeForm((t) => ({
                                    ...t,
                                    status: e.target.value as ThemeStatus,
                                  }))
                                }
                              >
                                <option value="Draft">Draft</option>
                                <option value="Active">Active</option>
                                <option value="Archived">Archived</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-700">
                                Layout
                              </label>
                              <select
                                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                                value={newThemeForm.layout}
                                onChange={(e) =>
                                  setNewThemeForm((t) => ({
                                    ...t,
                                    layout: e.target
                                      .value as ThemeConfig["layout"],
                                  }))
                                }
                              >
                                <option value="Full width">Full width</option>
                                <option value="Boxed">Boxed</option>
                                <option value="Split">Split</option>
                              </select>
                            </div>
                          </div>
                        </section>

                        {/* 2. Colors */}
                        <section className="rounded-xl border border-slate-100 bg-white px-4 py-3.5">
                          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Colors
                          </h3>
                          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                            {([
                            ["Primary", "primaryColor"],
                            ["Secondary", "secondaryColor"],
                            ["Accent", "accentColor"],
                            ["Background", "backgroundColor"],
                            ["Text", "textColor"],
                          ] as const).map(([label, key]) => (
                            <div key={key} className="space-y-1">
                              <label className="text-xs font-medium text-slate-700">
                                {label} color
                              </label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="color"
                                  value={newThemeForm[key] ?? "#000000"}
                                  onChange={(e) =>
                                    setNewThemeForm((t) => ({
                                      ...t,
                                      [key]: e.target.value,
                                    }))
                                  }
                                  className="h-8 w-10 cursor-pointer rounded-full border border-slate-200 bg-transparent p-1"
                                />
                                <Input
                                  value={newThemeForm[key] ?? ""}
                                  onChange={(e) =>
                                    setNewThemeForm((t) => ({
                                      ...t,
                                      [key]: e.target.value,
                                    }))
                                  }
                                  className="h-8 flex-1 rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                                />
                              </div>
                            </div>
                          ))}
                          </div>
                        </section>

                        {/* 3. Typography + 4. Layout & UI */}
                        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div className="rounded-xl border border-slate-100 bg-white px-4 py-3.5">
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Typography
                            </h3>
                            <div className="space-y-3">
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">
                                  Font family
                                </label>
                                <select
                                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                                  value={newThemeForm.fontFamily}
                                  onChange={(e) =>
                                    setNewThemeForm((t) => ({
                                      ...t,
                                      fontFamily: e.target
                                        .value as ThemeConfig["fontFamily"],
                                    }))
                                  }
                                >
                                  <option value="Inter">Inter</option>
                                  <option value="Poppins">Poppins</option>
                                  <option value="System">System</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">
                                  Font size
                                </label>
                                <select
                                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                                  value={newThemeForm.fontSize}
                                  onChange={(e) =>
                                    setNewThemeForm((t) => ({
                                      ...t,
                                      fontSize: e.target.value as
                                        | "sm"
                                        | "md"
                                        | "lg",
                                    }))
                                  }
                                >
                                  <option value="sm">Compact</option>
                                  <option value="md">Default</option>
                                  <option value="lg">Large</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border border-slate-100 bg-white px-4 py-3.5">
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Layout & UI
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">
                                  Spacing
                                </label>
                                <select
                                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                                  value={newThemeForm.spacing}
                                  onChange={(e) =>
                                    setNewThemeForm((t) => ({
                                      ...t,
                                      spacing: e.target.value as
                                        | "compact"
                                        | "comfortable"
                                        | "relaxed",
                                    }))
                                  }
                                >
                                  <option value="compact">Compact</option>
                                  <option value="comfortable">Comfortable</option>
                                  <option value="relaxed">Relaxed</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">
                                  Border radius
                                </label>
                                <select
                                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                                  value={newThemeForm.borderRadius}
                                  onChange={(e) =>
                                    setNewThemeForm((t) => ({
                                      ...t,
                                      borderRadius: e.target
                                        .value as ThemeConfig["borderRadius"],
                                    }))
                                  }
                                >
                                  <option value="soft">Soft</option>
                                  <option value="rounded">Rounded</option>
                                  <option value="pill">Pill</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">
                                  Button style
                                </label>
                                <select
                                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                                  value={newThemeForm.buttonStyle}
                                  onChange={(e) =>
                                    setNewThemeForm((t) => ({
                                      ...t,
                                      buttonStyle: e.target
                                        .value as ThemeConfig["buttonStyle"],
                                    }))
                                  }
                                >
                                  <option value="pill">Pill</option>
                                  <option value="rounded">Rounded</option>
                                  <option value="soft">Soft</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">
                                  Card style
                                </label>
                                <select
                                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                                  value={newThemeForm.cardStyle}
                                  onChange={(e) =>
                                    setNewThemeForm((t) => ({
                                      ...t,
                                      cardStyle: e.target
                                        .value as ThemeConfig["cardStyle"],
                                    }))
                                  }
                                >
                                  <option value="elevated">Elevated</option>
                                  <option value="flat">Flat</option>
                                  <option value="outlined">Outlined</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </section>

                        {/* 5. Header & Footer + 6. Components */}
                        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div className="rounded-xl border border-slate-100 bg-white px-4 py-3.5">
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Header & Footer
                            </h3>
                            <div className="space-y-3">
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">
                                  Header style
                                </label>
                                <select
                                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                                  value={newThemeForm.headerStyle}
                                  onChange={(e) =>
                                    setNewThemeForm((t) => ({
                                      ...t,
                                      headerStyle: e.target
                                        .value as ThemeConfig["headerStyle"],
                                    }))
                                  }
                                >
                                  <option value="solid">Solid</option>
                                  <option value="transparent">Transparent</option>
                                  <option value="glass">Glass</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">
                                  Footer style
                                </label>
                                <select
                                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                                  value={newThemeForm.footerStyle}
                                  onChange={(e) =>
                                    setNewThemeForm((t) => ({
                                      ...t,
                                      footerStyle: e.target
                                        .value as ThemeConfig["footerStyle"],
                                    }))
                                  }
                                >
                                  <option value="minimal">Minimal</option>
                                  <option value="columns">Columns</option>
                                  <option value="centered">Centered</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border border-slate-100 bg-white px-4 py-3.5">
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Components
                            </h3>
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                              {[
                                ["Hero banner", "showHeroBanner"],
                                ["Promo strip", "showPromoStrip"],
                                ["Testimonials", "showTestimonials"],
                                ["Featured products", "showFeaturedGrid"],
                              ].map(([label, key]) => (
                                <label
                                  key={key}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1 text-slate-700"
                                >
                                  <input
                                    type="checkbox"
                                    className="h-3.5 w-3.5 rounded border-slate-300 text-pink-500 focus:ring-pink-200"
                                    checked={Boolean(
                                      newThemeForm[key as keyof ThemeConfig]
                                    )}
                                    onChange={(e) =>
                                      setNewThemeForm((t) => ({
                                        ...t,
                                        [key]: e.target.checked,
                                      }))
                                    }
                                  />
                                  <span>{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </section>

                        {/* Advanced settings */}
                        <section className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 px-4 py-3">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between text-xs font-medium text-slate-700"
                            onClick={() => setShowAdvanced((v) => !v)}
                          >
                            <span>Advanced settings</span>
                            <span className="text-[11px] text-slate-500">
                              {showAdvanced ? "Hide" : "Show"}
                            </span>
                          </button>
                          {showAdvanced && (
                            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">
                                  Custom CSS (optional)
                                </label>
                                <textarea
                                  className="min-h-[80px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                                  value={newThemeForm.customCss ?? ""}
                                  onChange={(e) =>
                                    setNewThemeForm((t) => ({
                                      ...t,
                                      customCss: e.target.value,
                                    }))
                                  }
                                  placeholder=":root { --button-radius: 999px; }"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">
                                  Theme JSON preview
                                </label>
                                <textarea
                                  className="min-h-[80px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-mono text-slate-800"
                                  value={newThemePreviewJson}
                                  readOnly
                                />
                              </div>
                            </div>
                          )}
                        </section>

                        <SideDrawerFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setNewThemeOpen(false)}
                          >
                            Cancel
                          </Button>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Local preview without saving
                                const tempId = newThemeForm.id || "preview-temp";
                                setPreviewThemeId(tempId);
                              }}
                            >
                              Preview only
                            </Button>
                            <Button type="submit" variant="primary">
                              Save theme
                            </Button>
                          </div>
                        </SideDrawerFooter>
                      </form>
                    </SideDrawerContent>
                  </SideDrawer>
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