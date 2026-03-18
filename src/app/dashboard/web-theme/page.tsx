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
  srNo: number;
  createdOn: string;
  lastUpdated: string;
};

const THEME_COLUMNS: Column<ThemeRow>[] = [
  {
    key: "srNo",
    label: "Sr No.",
    render: (_row, index) => <span className="text-xs font-semibold">{index + 1}</span>,
  },
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
  const [previewDraftTheme, setPreviewDraftTheme] = useState(false);
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

  // When creating a new theme, preview it live while editing.
  useEffect(() => {
    if (!newThemeOpen) {
      setPreviewDraftTheme(false);
      return;
    }
    setPreviewDraftTheme(true);
    setShowAdvanced(false);
  }, [newThemeOpen]);

  const themeRows: ThemeRow[] = useMemo(() => {
    const customThemes = loadCustomThemes() as (ThemeConfig & {
      createdOn?: string;
      lastUpdated?: string;
    })[];
    const now = new Date().toISOString().slice(0, 10);

    return getAllThemes().map((theme, index) => {
      const customMeta = customThemes.find((t) => t.id === theme.id);
      if (theme.id === "modern-light") {
        return {
          srNo: index + 1,
          ...theme,
          createdOn: "2025-01-10",
          lastUpdated: customMeta?.lastUpdated ?? "2025-03-02",
        };
      }
      if (theme.id === "elegant-dark") {
        return {
          srNo: index + 1,
          ...theme,
          createdOn: "2025-02-18",
          lastUpdated: customMeta?.lastUpdated ?? "2025-02-20",
        };
      }
      if (theme.id === "minimal-split") {
        return {
          srNo: index + 1,
          ...theme,
          createdOn: "2024-10-04",
          lastUpdated: customMeta?.lastUpdated ?? "2025-01-01",
        };
      }
      return {
        srNo: index + 1,
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

  const activeTheme = useMemo(() => {
    if (previewDraftTheme) {
      return { ...newThemeForm, id: "draft-preview" } as ThemeConfig;
    }
    return themeLibrary.find((t) => t.id === previewThemeId) ?? themeLibrary[0];
  }, [previewDraftTheme, newThemeForm, previewThemeId, themeLibrary]);

  const previewTextColor =
    activeTheme.textColor ??
    (activeTheme.mode === "Dark" ? "#e2e8f0" : "#0f172a");
  const previewMutedTextColor =
    activeTheme.mode === "Dark" ? "rgba(226,232,240,0.72)" : "#64748b";

  const previewSpacing =
    activeTheme.spacing === "compact"
      ? { pad: "p-4", gap: "gap-3" }
      : activeTheme.spacing === "relaxed"
      ? { pad: "p-6", gap: "gap-6" }
      : { pad: "p-5", gap: "gap-4" };

  const previewFontSize =
    activeTheme.fontSize === "sm"
      ? { body: "text-[11px]", title: "text-base", hero: "text-xl md:text-2xl" }
      : activeTheme.fontSize === "lg"
      ? { body: "text-sm", title: "text-lg", hero: "text-2xl md:text-3xl" }
      : { body: "text-xs", title: "text-base", hero: "text-xl md:text-2xl" };

  const previewButtonRadius =
    activeTheme.buttonStyle === "pill" || activeTheme.borderRadius === "pill"
      ? "rounded-full"
      : activeTheme.buttonStyle === "soft" || activeTheme.borderRadius === "soft"
      ? "rounded-lg"
      : "rounded-xl";

  const previewCardClass =
    activeTheme.cardStyle === "outlined"
      ? "border border-slate-200/80 shadow-none"
      : activeTheme.cardStyle === "flat"
      ? "border border-slate-100 shadow-none"
      : "border border-slate-200/80 shadow-sm";

  const previewContainerClass =
    activeTheme.layout === "Boxed"
      ? "mx-auto max-w-[980px]"
      : activeTheme.layout === "Split"
      ? "mx-auto max-w-[1100px]"
      : "w-full";

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
                      onClick={() => {
                        setPreviewDraftTheme(false);
                        setPreviewThemeId(selectedThemeId);
                      }}
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      Preview
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-full px-3 text-xs"
                      disabled={previewDraftTheme}
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
                    {/* Mini storefront preview (Secure Mart style) */}
                    <div
                      className={`${previewContainerClass} ${previewSpacing.pad}`}
                      style={{
                        color: previewTextColor,
                      }}
                    >
                      {/* Header */}
                      <header
                        className={`flex items-center justify-between ${previewSpacing.gap}`}
                        style={{
                          background:
                            activeTheme.headerStyle === "glass"
                              ? "rgba(255,255,255,0.6)"
                              : activeTheme.headerStyle === "transparent"
                              ? "transparent"
                              : activeTheme.surfaceColor,
                          borderColor:
                            activeTheme.mode === "Dark"
                              ? "rgba(148,163,184,0.35)"
                              : "rgba(226,232,240,0.9)",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold"
                            style={{
                              background: activeTheme.primaryColor,
                              color: "#ffffff",
                            }}
                          >
                            SM
                          </span>
                          <div className="leading-tight">
                            <p className={`font-semibold ${previewFontSize.title}`}>
                              Secure Mart
                            </p>
                            <p
                              className={`${previewFontSize.body}`}
                              style={{ color: previewMutedTextColor }}
                            >
                              Everyday essentials
                            </p>
                          </div>
                        </div>
                        <div className="hidden items-center gap-2 md:flex">
                          {["Home", "Shop", "Deals", "Support"].map((t) => (
                            <button
                              key={t}
                              type="button"
                              className="px-2 py-1 text-[11px] font-medium"
                              style={{ color: previewMutedTextColor }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`hidden md:flex items-center gap-2 ${previewButtonRadius} border px-3 py-2`}
                            style={{
                              borderColor:
                                activeTheme.mode === "Dark"
                                  ? "rgba(148,163,184,0.35)"
                                  : "rgba(226,232,240,0.9)",
                              background: activeTheme.surfaceColor,
                            }}
                          >
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ background: activeTheme.secondaryColor }}
                            />
                            <span
                              className="text-[11px]"
                              style={{ color: previewMutedTextColor }}
                            >
                              Search products…
                            </span>
                          </div>
                          <button
                            type="button"
                            className={`${previewButtonRadius} border px-3 py-2 text-[11px] font-semibold`}
                            style={{
                              borderColor: activeTheme.primaryColor,
                              color: activeTheme.primaryColor,
                              background: "transparent",
                            }}
                          >
                            Cart (2)
                          </button>
                        </div>
                      </header>

                      {/* Promo strip */}
                      {activeTheme.showPromoStrip && (
                        <div
                          className={`mt-4 ${previewButtonRadius} px-4 py-2 text-[11px] font-medium`}
                          style={{
                            background: activeTheme.accentColor,
                            color: "#0b1220",
                          }}
                        >
                          Free delivery above ₹499 · Today only: extra 10% off on
                          essentials
                        </div>
                      )}

                      {/* Hero */}
                      {activeTheme.showHeroBanner && (
                        <section className={`mt-5 grid gap-4 md:grid-cols-2 ${previewSpacing.gap}`}>
                          <div className="space-y-3">
                            <p
                              className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                              style={{ color: activeTheme.secondaryColor }}
                            >
                              Smart savings, secure checkout
                            </p>
                            <h2 className={`font-semibold leading-tight ${previewFontSize.hero}`}>
                              Fresh groceries delivered in under 60 minutes.
                            </h2>
                            <p
                              className={`${previewFontSize.body} leading-relaxed`}
                              style={{ color: previewMutedTextColor }}
                            >
                              A realistic preview of your storefront: header,
                              hero, product cards and CTAs styled by your theme
                              tokens.
                            </p>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <button
                                type="button"
                                className={`${previewButtonRadius} px-4 py-2 text-[11px] font-semibold`}
                                style={{
                                  background: activeTheme.primaryColor,
                                  color: "#ffffff",
                                }}
                              >
                                Shop now
                              </button>
                              <button
                                type="button"
                                className={`${previewButtonRadius} border px-4 py-2 text-[11px] font-semibold`}
                                style={{
                                  borderColor: activeTheme.primaryColor,
                                  color: activeTheme.primaryColor,
                                  background: activeTheme.surfaceColor,
                                }}
                              >
                                View categories
                              </button>
                              <span
                                className={`${previewButtonRadius} border px-3 py-2 text-[10px] font-medium`}
                                style={{
                                  borderColor:
                                    activeTheme.mode === "Dark"
                                      ? "rgba(148,163,184,0.35)"
                                      : "rgba(226,232,240,0.9)",
                                  color: previewMutedTextColor,
                                  background: activeTheme.surfaceColor,
                                }}
                              >
                                {activeTheme.layout} · {activeTheme.spacing ?? "comfortable"} spacing
                              </span>
                            </div>
                          </div>

                          <div
                            className={`${themePreviewClasses.radius} relative overflow-hidden ${previewCardClass}`}
                            style={{
                              background:
                                activeTheme.mode === "Dark"
                                  ? "rgba(2,6,23,0.35)"
                                  : "rgba(248,250,252,0.9)",
                            }}
                          >
                            <div
                              className="absolute inset-0 opacity-80"
                              style={{
                                background: `linear-gradient(135deg, ${activeTheme.primaryColor}22, ${activeTheme.secondaryColor}22, ${activeTheme.accentColor}22)`,
                              }}
                            />
                            <div className="relative p-4">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`${previewButtonRadius} px-2.5 py-1 text-[10px] font-semibold`}
                                  style={{
                                    background: activeTheme.primaryColor,
                                    color: "#ffffff",
                                  }}
                                >
                                  Deal of the day
                                </span>
                                <span className="text-[10px]" style={{ color: previewMutedTextColor }}>
                                  Trusted by 12k+ customers
                                </span>
                              </div>
                              <div className="mt-4 grid grid-cols-3 gap-2">
                                {["Fruits", "Dairy", "Snacks"].map((c) => (
                                  <div
                                    key={c}
                                    className={`${previewButtonRadius} border px-3 py-3 text-center text-[10px] font-semibold`}
                                    style={{
                                      borderColor:
                                        activeTheme.mode === "Dark"
                                          ? "rgba(148,163,184,0.35)"
                                          : "rgba(226,232,240,0.9)",
                                      background: activeTheme.surfaceColor,
                                    }}
                                  >
                                    {c}
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-[11px]">
                                <span style={{ color: previewMutedTextColor }}>
                                  Secure payments · Fast refunds
                                </span>
                                <span
                                  className="h-2.5 w-10 rounded-full"
                                  style={{ background: activeTheme.accentColor }}
                                />
                              </div>
                            </div>
                          </div>
                        </section>
                      )}

                      {/* Product grid */}
                      <section className="mt-6">
                        <div className="mb-3 flex items-end justify-between">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: previewMutedTextColor }}>
                              Featured products
                            </p>
                            <p className="text-sm font-semibold">Top picks for you</p>
                          </div>
                          <button
                            type="button"
                            className="text-[11px] font-semibold"
                            style={{ color: activeTheme.primaryColor }}
                          >
                            View all →
                          </button>
                        </div>

                        <div
                          className={`grid ${previewSpacing.gap} grid-cols-2 md:grid-cols-3`}
                        >
                          {[
                            { name: "Organic Apples", price: "₹149", tag: "Fresh" },
                            { name: "Whole Milk 1L", price: "₹68", tag: "Daily" },
                            { name: "Brown Bread", price: "₹45", tag: "Bestseller" },
                            { name: "Almonds 200g", price: "₹299", tag: "Premium" },
                            { name: "Instant Oats", price: "₹129", tag: "Healthy" },
                            { name: "Dark Chocolate", price: "₹99", tag: "Deal" },
                          ].map((p) => (
                            <div
                              key={p.name}
                              className={`${themePreviewClasses.radius} ${previewCardClass} overflow-hidden`}
                              style={{ background: activeTheme.surfaceColor }}
                            >
                              <div
                                className="h-20"
                                style={{
                                  background: `linear-gradient(135deg, ${activeTheme.secondaryColor}22, ${activeTheme.primaryColor}22)`,
                                }}
                              />
                              <div className="p-3">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-xs font-semibold truncate">{p.name}</p>
                                  <span
                                    className={`${previewButtonRadius} px-2 py-0.5 text-[10px] font-semibold`}
                                    style={{
                                      background: activeTheme.accentColor,
                                      color: "#0b1220",
                                    }}
                                  >
                                    {p.tag}
                                  </span>
                                </div>
                                <p className="mt-1 text-[11px]" style={{ color: previewMutedTextColor }}>
                                  ★ 4.6 · 1.2k reviews
                                </p>
                                <div className="mt-2 flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold">{p.price}</span>
                                  <button
                                    type="button"
                                    className={`${previewButtonRadius} px-2.5 py-1.5 text-[10px] font-semibold`}
                                    style={{
                                      background: activeTheme.primaryColor,
                                      color: "#ffffff",
                                    }}
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Testimonials */}
                      {activeTheme.showTestimonials && (
                        <section className="mt-6">
                          <div
                            className={`${themePreviewClasses.radius} ${previewCardClass} p-4`}
                            style={{ background: activeTheme.surfaceColor }}
                          >
                            <p className="text-sm font-semibold">What customers say</p>
                            <p className="mt-1 text-[11px]" style={{ color: previewMutedTextColor }}>
                              “Fast delivery and great packaging. Love the clean UI.”
                            </p>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[11px] font-medium" style={{ color: previewMutedTextColor }}>
                                — Riya, Mumbai
                              </span>
                              <span className="text-[11px] font-semibold" style={{ color: activeTheme.primaryColor }}>
                                ★★★★★
                              </span>
                            </div>
                          </div>
                        </section>
                      )}

                      {/* Footer */}
                      <footer className="mt-6 border-t pt-4" style={{ borderColor: "rgba(226,232,240,0.9)" }}>
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <p className="text-[11px]" style={{ color: previewMutedTextColor }}>
                            © Secure Mart · Powered by your theme settings
                          </p>
                          <div className="flex items-center gap-3 text-[11px]" style={{ color: previewMutedTextColor }}>
                            <span>Privacy</span>
                            <span>Terms</span>
                            <span>Contact</span>
                          </div>
                        </div>
                      </footer>
                    </div>
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
                          const themeWithMeta = {
                            ...themeToSave,
                            createdOn: now,
                            lastUpdated: now,
                          } as any;
                          const updatedCustom = [
                            ...existingCustom,
                            {
                              ...themeWithMeta,
                            } as any,
                          ];
                          saveCustomThemes(updatedCustom as any);
                          // Make the newly created theme immediately visible in the library.
                          setSearch("");
                          setStatusFilter("All");
                          setThemeLibrary((prev) => [themeWithMeta as ThemeConfig, ...prev]);
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
                          <div className="grid grid-cols-1 gap-3">
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
                          <div className="grid grid-cols-1 gap-3">
                            {(
                              [
                                [
                                  "Primary",
                                  "primaryColor",
                                  "Primary actions, highlights, key links",
                                ],
                                [
                                  "Secondary",
                                  "secondaryColor",
                                  "Secondary accents, tags, subtle emphasis",
                                ],
                                [
                                  "Accent",
                                  "accentColor",
                                  "Badges, attention states, supporting accents",
                                ],
                                [
                                  "Background",
                                  "backgroundColor",
                                  "Page background and large surfaces",
                                ],
                                [
                                  "Text",
                                  "textColor",
                                  "Default text on light backgrounds",
                                ],
                              ] as const
                            ).map(([label, key, description]) => {
                              const value = (newThemeForm[key] ??
                                "#000000") as string;
                              return (
                                <div
                                  key={key}
                                  className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5"
                                >
                                  <div className="flex items-start gap-2.5">
                                    <span
                                      className="mt-0.5 h-7 w-7 rounded-full border border-white shadow-sm ring-1 ring-slate-200"
                                      style={{ backgroundColor: value }}
                                      aria-hidden="true"
                                    />
                                    <div className="min-w-0">
                                      <p className="text-xs font-semibold text-slate-800">
                                        {label}
                                      </p>
                                      <p className="mt-0.5 text-[11px] text-slate-500">
                                        {description}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="color"
                                      aria-label={`${label} color picker`}
                                      value={value}
                                      onChange={(e) =>
                                        setNewThemeForm((t) => ({
                                          ...t,
                                          [key]: e.target.value,
                                        }))
                                      }
                                      className="h-8 w-10 cursor-pointer rounded-full border border-slate-200 bg-white p-1"
                                    />
                                    <Input
                                      aria-label={`${label} hex value`}
                                      value={value}
                                      onChange={(e) =>
                                        setNewThemeForm((t) => ({
                                          ...t,
                                          [key]: e.target.value,
                                        }))
                                      }
                                      className="h-8 w-[110px] rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
                                    />
                                  </div>
                                </div>
                              );
                            })}
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