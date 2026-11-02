import type { ProviderHealth, ProviderKey } from "./agency";

/** Keys providers register via dashboard.services.register_dashboard_widget. */
export type WidgetKey =
  | "appointments"
  | "metrics"
  | "health"
  | "insights"
  | "notifications_unread";

export interface DashboardProgress {
  done: number;
  total: number;
  required_done: number;
  required_total: number;
}

export interface AppointmentWidgetItem {
  id: string;
  title: string;
  starts_at: string;
  icon?: string;
}

export interface MetricsWidgetSection {
  [key: string]: number | string | null;
}

export interface InsightWarnItem {
  id: string;
  title: string;
  detail: string;
  icon: string;
  tone?: string;
  /** Hover CTA label (proto `ic-do`) */
  act?: string;
  /** Route key: billing | assets | leads | reviews */
  go?: string;
  /** Drawer tab category (Ads / Leads / … or Urgent / Waiting On You) */
  category?: string;
}

export interface InsightGoodItem {
  id: string;
  title: string;
  value: string;
  detail: string;
  trend: string;
  spark: number[];
  icon: string;
  brand?: boolean;
  category?: string;
}

export interface InsightsWidget {
  warn: InsightWarnItem[];
  good: InsightGoodItem[];
}

export interface DashboardWidgets {
  appointments: AppointmentWidgetItem[] | null;
  metrics: MetricsWidgetSection | null;
  health: Partial<Record<ProviderKey, ProviderHealth>> | null;
  insights: InsightsWidget | null;
  notifications_unread: number;
  [key: string]: unknown;
}

export interface DashboardState {
  phase: "onboarding" | "active";
  paid: boolean;
  progress: DashboardProgress | null;
  widgets: DashboardWidgets;
}
