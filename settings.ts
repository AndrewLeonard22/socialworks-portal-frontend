/** Org settings payloads, mirroring backend/settings/services.py. */

export interface SettingsOrg {
  kind: "client" | "agency";
  id: number;
  name: string;
}

export type ContactVia = "text" | "call" | "email" | "whatsapp";

export interface SettingsProfile {
  name: string;
  logo_url: string | null;
  website: string;
  legal_name: string;
  ein: string;
  phone: string;
  contact_via: ContactVia;
  whatsapp: string;
  facebook: string;
  instagram: string;
}

export interface NotificationRecipient {
  id: number;
  name: string;
  email: string;
  notify_leads: boolean;
  notify_appointments: boolean;
  status: "pending" | "confirmed";
}

export interface ConnectionStatus {
  provider: string;
  status: "connected" | "needs_reauth" | "missing";
  connected_at?: string | null;
  [key: string]: unknown;
}

export interface SettingsData {
  org: SettingsOrg | null;
  profile: SettingsProfile | null;
  people: NotificationRecipient[];
  email: string;
  connections?: ConnectionStatus[] | null;
}
