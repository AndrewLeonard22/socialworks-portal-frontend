export type ProviderKey = "ghl" | "meta" | "google";

export type IntegrationStatus = "missing" | "connected" | "needs_reauth";

export interface ProviderStatus {
  provider: ProviderKey;
  status: IntegrationStatus;
  connected_at?: string;
  location_id?: string;
  meta_user_id?: string;
  ad_account_ids?: string[];
  selected_ad_account_id?: string;
  page_ids?: string[];
  email?: string;
  scope?: string;
  customer_ids?: string[];
  selected_customer_id?: string;
}
