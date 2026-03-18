"use client";

import { useEffect } from "react";
import {
  DEFAULT_THEME_ID,
  THEME_STORAGE_KEY,
  getThemeById,
} from "@/config/themes";

function applyThemeToDocument(themeId: string) {
  if (typeof document === "undefined") return;
  const theme = getThemeById(themeId ?? DEFAULT_THEME_ID);

  const root = document.documentElement;
  root.dataset.themeId = theme.id;
  root.dataset.themeMode = theme.mode;

  root.style.setProperty("--app-primary", theme.primaryColor);
  root.style.setProperty("--app-secondary", theme.secondaryColor);
  root.style.setProperty("--app-accent", theme.accentColor);
  root.style.setProperty("--app-bg", theme.backgroundColor);
  root.style.setProperty("--app-surface", theme.surfaceColor);
  root.style.setProperty("--app-radius", theme.borderRadius);
  root.style.setProperty("--app-font-family", theme.fontFamily);

  // Provide an immediate visual cue by adjusting body background.
  document.body.style.backgroundColor = theme.backgroundColor;
}

export function ThemeBootstrap() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedId =
      window.localStorage.getItem(THEME_STORAGE_KEY) ?? DEFAULT_THEME_ID;
    applyThemeToDocument(storedId);

    const handleThemeChanged = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail === "string") {
        applyThemeToDocument(detail);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY && typeof event.newValue === "string") {
        applyThemeToDocument(event.newValue);
      }
    };

    window.addEventListener("super-admin-theme-changed", handleThemeChanged as EventListener);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "super-admin-theme-changed",
        handleThemeChanged as EventListener
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return null;
}

