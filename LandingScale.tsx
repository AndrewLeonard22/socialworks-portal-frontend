"use client";

import { useSyncExternalStore } from "react";

const DESIGN_WIDTH = 1920;

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

/**
 * Locks the landing page to the 1920px design frame: below that viewport
 * width the whole page zooms out proportionally instead of reflowing.
 * Media queries still evaluate against the effective (unzoomed) width, so
 * the desktop layout always applies. Browsers without `zoom` support fall
 * back to the responsive layout.
 */
export function LandingScale({ children }: { children: React.ReactNode }) {
  const scale = useSyncExternalStore(
    subscribe,
    () => Math.min(1, window.innerWidth / DESIGN_WIDTH),
    () => 1
  );

  return <div style={{ zoom: scale }}>{children}</div>;
}
