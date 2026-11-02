export interface AdInsights {
  impressions?: string;
  reach?: string;
  clicks?: string;
  spend?: string;
  ctr?: string;
  cpc?: string;
  cpm?: string;
  frequency?: string;
  date_start?: string;
  date_stop?: string;
}

export interface MetaCampaign {
  id: number;
  external_id: string;
  ad_account_id: string;
  name: string;
  status: string;
  objective: string;
  buying_type: string;
  daily_budget: string;
  lifetime_budget: string;
  currency: string;
  insights: AdInsights;
  insights_updated_at: string | null;
  start_time: string | null;
  stop_time: string | null;
  created_at: string;
}

export interface MetaAdSet {
  id: number;
  external_id: string;
  ad_account_id: string;
  campaign_id: string;
  name: string;
  status: string;
  daily_budget: string;
  lifetime_budget: string;
  currency: string;
  targeting: Record<string, unknown>;
  insights: AdInsights;
  insights_updated_at: string | null;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
}

export interface MetaAd {
  id: number;
  external_id: string;
  ad_account_id: string;
  campaign_id: string;
  adset_id: string;
  name: string;
  status: string;
  effective_status: string;
  creative_name: string;
  thumbnail_url: string;
  platforms?: string[];
  currency: string;
  insights: AdInsights;
  insights_updated_at: string | null;
  created_at: string;
}

export interface GoogleAdAccount {
  id: string;
  name: string;
  /** true for MCC manager accounts. */
  manager: boolean;
  currency?: string;
}

export interface GoogleCampaign {
  external_id: string;
  customer_id: string;
  name: string;
  status: string;
  channel: string;
  /** Daily budget in currency units. */
  budget: string;
  insights: AdInsights;
}

export interface GoogleAdGroup {
  external_id: string;
  customer_id: string;
  campaign_id: string;
  campaign_name: string;
  name: string;
  status: string;
  cpc_bid: string;
  insights: AdInsights;
}

export interface GoogleAd {
  external_id: string;
  customer_id: string;
  campaign_id: string;
  campaign_name: string;
  ad_group_id: string;
  ad_group_name: string;
  name: string;
  status: string;
  ad_type: string;
  insights: AdInsights;
}
