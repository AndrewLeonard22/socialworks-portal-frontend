export interface Plan {
  id: number;
  name: string;
  price_cents: number;
  currency: string;
  interval: "monthly" | "annual" | "one_time";
  features: string[];
  show_on_landing: boolean;
  stripe_price_id: string;
  archived_at: string | null;
  created_at: string;
}

export interface PlanAssignment {
  plan_id: number | null;
  plan_name?: string | null;
  price_override_cents: number | null;
}

export interface AgencySummary {
  id: number;
  name: string;
  member_count: number;
  client_count: number;
  billing_exempt: boolean;
  plan: {
    id: number | null;
    name: string | null;
    price_override_cents: number | null;
  } | null;
  created_at: string;
}

export interface AgencyMemberRow {
  id: number;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
}

export interface AgencyClientRow {
  id: number;
  name: string;
  phase: string;
  is_workspace: boolean;
  email: string;
  integrations: Record<string, string>;
  created_at: string;
}

export interface AgencyDomainRow {
  id: number;
  domain: string;
  verified_at: string | null;
}

export interface AgencyCrmStatus {
  provider: string;
  status: string;
  location_id: string;
  account: string;
}

export interface AgencyDetail {
  agency: {
    id: number;
    name: string;
    billing_exempt: boolean;
    stripe_customer_id: boolean;
    created_at: string;
    email: string | null;
    logo_url: string | null;
    website: string;
    socials: Record<string, string>;
    legal_name: string;
    ein: string;
    phone: string;
    contact_via: string;
  };
  member_count: number;
  client_count: number;
  crm: AgencyCrmStatus[];
  domains: AgencyDomainRow[];
  plan_assignment: PlanAssignment | null;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  is_staff: boolean;
  org: string;
  date_joined: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
