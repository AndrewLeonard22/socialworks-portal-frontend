"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const handleThemeToggle = () => {
    // Disabled: light theme only. .dark token overrides exist but nothing
    // should ever put .dark on <html> (ThemeInit also force-removes it on
    // every load). Kept as a no-op so a future mount cannot flip the app.
    // const isDark = document.documentElement.classList.toggle("dark");
    // document.cookie = `theme=${isDark ? "dark" : "light"}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <button
      type="button"
      onClick={handleThemeToggle}
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-btn border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-muted"
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="hidden h-4 w-4 dark:block" />
    </button>
  );
}
