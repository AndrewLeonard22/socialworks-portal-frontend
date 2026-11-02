"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearAuth } from "@/store/auth/reducer";
import { auth_apis } from "@/api/auth";
import { Icon } from "@/components/icons";
import { navItems } from "@/components/layout/nav";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const PAGE_META: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clients": "Clients",
  "/workspace": "My workspace",
  "/onboarding": "Onboarding",
  "/onboarding/payment": "Payment",
  "/onboarding/basic-details": "Finish setting up",
  "/branding": "Branding",
  "/agencies": "Agencies",
  "/users": "Users",
  "/plans": "Plans",
  "/billing": "Billing",
  "/assets": "Assets",
  "/integrations": "Integrations",
  "/settings": "Settings",
  "/integrations/ghl": "GoHighLevel",
  "/leads": "Leads",
  "/ads": "Ads",
  "/reports": "Reports",
  "/integrations/google/callback": "Connecting Google",
};

const PAGE_META_PREFIXES: [string, string][] = [
  ["/onboarding/tasks/", "Setup task"],
  ["/agencies/", "Agency"],
];

function initials(name: string, email: string) {
  const source = name.trim() || email.split("@")[0];
  const parts = source.split(/\s+/);
  return (parts[0]?.[0] ?? "?").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase();
}

export function PrivateHeader() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pageTitle =
    PAGE_META[pathname] ??
    PAGE_META_PREFIXES.find(([prefix]) => pathname.startsWith(prefix))?.[1] ??
    "";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await auth_apis.logout();
    } catch {
      // session may already be gone; local state still clears
    }
    dispatch(clearAuth());
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-[60px] items-center justify-between border-b border-app-line bg-surface px-6 lg:hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex size-10 items-center justify-center rounded-lg text-text-secondary hover:bg-app-band-2 lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        <Link href="/dashboard" className="lg:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user?.brand?.logo_url ?? "/icon.png"}
            alt="SocialWorks"
            className="size-[32px] rounded-[9px] object-contain"
          />
        </Link>
        <div className="hidden items-center gap-1.5 text-[13px] lg:flex">
          <span className="font-inter font-normal text-app-faint">
            {user?.role === "superadmin" ? "Platform" : "Portal"}
          </span>
          <span className="font-manrope font-normal text-app-faint">/</span>
          <span className="font-inter font-medium text-app-ink">
            {pageTitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell />
        <div className="flex size-[34px] items-center justify-center rounded-full border border-app-line bg-app-band-2">
          <span className="font-inter text-xs font-semibold text-muted dark:text-text-secondary">
            {user ? initials(user.name, user.email) : "?"}
          </span>
        </div>
        <button
          type="button"
          aria-label="Log out"
          onClick={() => setIsLogoutConfirmOpen(true)}
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-app-band-2 hover:text-text-heading"
        >
          <LogOut className="size-5" />
        </button>
      </div>

      <ConfirmDialog
        open={isLogoutConfirmOpen}
        title="Log out?"
        body="You will need to sign in again to access the portal."
        confirmLabel="Log out"
        isLoading={isLoggingOut}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />

      {isMenuOpen && (
        <nav
          aria-label="Main"
          className="absolute inset-x-0 top-[60px] border-b border-app-line bg-surface px-6 py-4 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {navItems(user).map((item) => {
              const isActive =
                item.href !== "#" && pathname.startsWith(item.href);
              const cls = `flex items-center gap-3 rounded-lg px-2 py-2 font-jakarta text-base ${
                item.isLocked
                  ? "text-app-faint"
                  : isActive
                    ? "bg-app-band-2 font-medium text-app-ink"
                    : "text-app-ink"
              }`;
              const inner = (
                <>
                  <Icon
                    name={item.isLocked && item.locked ? "oLock" : item.icon}
                    size={18}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.lockHint && (
                    <span className="text-xs text-app-faint">
                      {item.lockHint}
                    </span>
                  )}
                </>
              );
              return item.isLocked ? (
                <span key={item.label} className={cls} aria-disabled="true">
                  {inner}
                </span>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cls}
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
