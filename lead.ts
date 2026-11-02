export type LeadStatus = "new" | "pushed" | "booked" | "failed";

export interface Lead {
  id: number;
  external_id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  platform: string;
  form_name: string;
  campaign_id: string;
  ad_id: string;
  ghl_contact_id: string;
  field_data: Record<string, string>;
  received_at: string | null;
  created_at: string;
}

export interface CalendarSummary {
  id: string;
  name: string;
}
