export type ToastKind = "success" | "error" | "info";

export interface QueuedToast {
  id: string;
  kind: ToastKind;
  message: string;
}

/** Persisted row shape from GET /api/v1/notifications/. */
export interface ServerNotification {
  id: number;
  event_type: string;
  title: string;
  body: string;
  priority: "normal" | "high";
  count: number;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListData {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServerNotification[];
  unread_count: number;
}

export interface NotificationPreferences {
  email_enabled: boolean;
  quiet_start: string | null;
  quiet_end: string | null;
  timezone: string;
}

/** In-store notification. Optimistic ws inserts have no serverId until
 *  the bell reload reconciles them via setItems. */
export interface AppNotification {
  id: string;
  serverId?: number;
  type: string;
  title: string;
  body?: string;
  count: number;
  priority: "normal" | "high";
  read: boolean;
  createdAt: string;
  dedupeKey?: string;
}
