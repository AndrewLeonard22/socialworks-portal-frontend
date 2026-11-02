import type { IconName } from "@/components/icons";

export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
  locked?: boolean;
}

interface NavSection {
  items: NavItem[];
}

export const ONBOARDING_ITEM: NavItem = {
  label: "Onboarding",
  href: "/onboarding",
  icon: "clipboard",
};

const SETTINGS_ITEM: NavItem = {
  label: "Settings",
  href: "/settings",
  icon: "settings",
};

const NAV_BY_ROLE: Record<string, NavSection[]> = {
  superadmin: [
    {
      items: [
        { label: "Platform", href: "/dashboard", icon: "oGrid" },
        { label: "Agencies", href: "/agencies", icon: "building" },
        { label: "Users", href: "/users", icon: "user" },
        { label: "Plans", href: "/plans", icon: "oCard" },
        { label: "Integrations", href: "#", icon: "swap" },
        { label: "Webhooks", href: "#", icon: "mail" },
      ],
    },
    {
      items: [SETTINGS_ITEM],
    },
  ],
  agency_owner: [
    {
      items: [
        { label: "Dashboard", href: "/dashboard", icon: "oGrid" },
        { label: "Clients", href: "/clients", icon: "user" },
        { label: "Billing", href: "/billing", icon: "oCard" },
        SETTINGS_ITEM,
      ],
    },
  ],
  agency_staff: [
    {
      items: [
        { label: "Dashboard", href: "/dashboard", icon: "oGrid" },
        { label: "Clients", href: "/clients", icon: "user" },
        SETTINGS_ITEM,
      ],
    },
  ],
  /* Proto MODULES (SocialWorks-App/app.js): Home, Assets, Leads, Reports,
     Billing, Settings, then Onboarding pinned last. Filled proto glyphs,
     not the outline o* set. */
  client: [
    {
      items: [
        { label: "Home", href: "/dashboard", icon: "home", locked: true },
        { label: "Assets", href: "/assets", icon: "image" },
        { label: "Leads", href: "/leads", icon: "user", locked: true },
        { label: "Reports", href: "/reports", icon: "chart", locked: true },
        {
          label: "Billing",
          href: "/billing",
          icon: "receipt",
          locked: true,
        },
        { label: "Settings", href: "/settings", icon: "gear" },
        ONBOARDING_ITEM,
      ],
    },
  ],
};

export interface ResolvedNavItem extends NavItem {
  isLocked: boolean;
  lockHint?: string;
}

interface NavUser {
  role?: string;
  client_id?: number | null;
  client_phase?: string | null;
}

export function navSections(user: NavUser | null | undefined): NavSection[] {
  // Impersonating staff get a client context - surface onboarding for them too.
  const hasClientContext = user?.role === "client" || user?.client_id != null;
  // Proto keeps Onboarding pinned last even after kickoff (green check).
  const showOnboarding = hasClientContext;
  const sections =
    NAV_BY_ROLE[user?.role ?? "client"] ?? NAV_BY_ROLE.client;
  // The client list already matches the proto MODULES order: Home first,
  // Onboarding last. `locked` items unlock themselves once client_phase
  // flips to active, so no section reshuffling is needed anymore.
  return [
    ...(showOnboarding && user?.role !== "client"
      ? [{ items: [ONBOARDING_ITEM] }]
      : []),
    ...sections.map((section) => ({
      items: section.items.filter(
        (item) => item !== ONBOARDING_ITEM || showOnboarding
      ),
    })),
  ];
}

export function navItems(user: NavUser | null | undefined): ResolvedNavItem[] {
  return navSections(user).flatMap((section) =>
    section.items.map((item) => {
      const isLocked =
        (item.locked === true && user?.client_phase !== "active") ||
        item.href === "#";
      return {
        ...item,
        isLocked,
        lockHint:
          item.locked && user?.client_phase !== "active"
            ? "Unlocks after kickoff"
            : item.href === "#"
              ? "Coming soon"
              : undefined,
      };
    })
  );
}
