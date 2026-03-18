export type ThemeStatus = "Active" | "Draft" | "Archived";
export type ThemeLayout = "Full width" | "Boxed" | "Split";
export type ThemeMode = "Light" | "Dark" | "Auto";

export type ThemeConfig = {
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
  textColor?: string;
  borderRadius: "soft" | "rounded" | "pill";
  fontFamily: "Inter" | "Poppins" | "System";
  fontSize?: "sm" | "md" | "lg";
  spacing?: "compact" | "comfortable" | "relaxed";
  showHeroBanner: boolean;
  showPromoStrip: boolean;
  showTestimonials: boolean;
  showFeaturedGrid: boolean;
  headerStyle?: "solid" | "transparent" | "glass";
  footerStyle?: "minimal" | "columns" | "centered";
  buttonStyle?: "pill" | "rounded" | "soft";
  cardStyle?: "flat" | "elevated" | "outlined";
  customCss?: string;
};

export const THEME_STORAGE_KEY = "super-admin.theme.appliedId";
export const CUSTOM_THEMES_STORAGE_KEY = "super-admin.theme.customThemes";

export const THEME_LIBRARY: ThemeConfig[] = [
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

export const DEFAULT_THEME_ID: ThemeConfig["id"] = "modern-light";

export function loadCustomThemes(): ThemeConfig[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_THEMES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ThemeConfig[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveCustomThemes(themes: ThemeConfig[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    CUSTOM_THEMES_STORAGE_KEY,
    JSON.stringify(themes ?? [])
  );
}

export function getAllThemes(): ThemeConfig[] {
  // On the server we only have the static library.
  if (typeof window === "undefined") return THEME_LIBRARY;
  return [...THEME_LIBRARY, ...loadCustomThemes()];
}

export function getThemeById(id: string | null | undefined): ThemeConfig {
  const allThemes = getAllThemes();
  if (!id) return allThemes[0];
  return allThemes.find((t) => t.id === id) ?? allThemes[0];
}

