import type { AgencyBrand } from "./agency";

export type Role = "superadmin" | "agency_owner" | "agency_staff" | "client";

export interface AuthUser {
  id: number;
  email: string;
  email_verified: boolean;
  name: string;
  company: string;
  job_role: string;
  needs_onboarding: boolean;
  agency_id: number | null;
  client_id: number | null;
  role: Role;
  client_phase?: "onboarding" | "active" | null;
  via_staff?: boolean;
  client_name?: string;
  acting_user?: { id: number; name: string; email: string };
  brand?: AgencyBrand;
}

export interface AuthSessionData {
  access: string;
  user: AuthUser;
}

export interface LoginData {
  requires_2fa?: boolean;
  pending_token?: string;
  access?: string;
  user?: AuthUser;
}
