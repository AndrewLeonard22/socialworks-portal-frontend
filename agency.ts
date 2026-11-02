import type { InvitationStatus } from "./invitation";

export interface AgencyBrandColors {
  accent?: string;
  navy?: string;
}

export interface AgencyBrand {
  name: string;
  logo_url: string | null;
  colors: AgencyBrandColors;
}

export interface ResolvedBrand extends AgencyBrand {
  branded: boolean;
}

export interface AgencyDomain {
  id: number;
  domain: string;
  verified: boolean;
  created_at: string;
}

export type ClientLifecycle = "invited" | "onboarding" | "active";
export type ProviderKey = "ghl" | "google" | "meta" | "host_domain";
export type ProviderHealth = "connected" | "missing" | "needs_reauth";

export interface ClientProgress {
  done: number;
  skipped?: number;
  total: number;
}

export interface ClientSummary {
  id: number;
  name: string;
  is_workspace: boolean;
  archived_at: string | null;
  lifecycle: ClientLifecycle;
  health: Record<ProviderKey, ProviderHealth>;
  member_count: number;
  progress: ClientProgress | null;
  created_at: string;
}

export interface ClientDetail extends ClientSummary {
  members: { id: number; name: string; email: string }[];
  invitations: {
    id: number;
    email: string;
    status: InvitationStatus;
    expires_at: string;
  }[];
}
