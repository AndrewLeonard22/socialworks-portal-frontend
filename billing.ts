export interface BillingPlan {
  id: number;
  name: string;
  price_cents: number;
  currency: string;
  interval: "monthly" | "annual" | "one_time";
  features: string[];
  show_on_landing: boolean;
}

export interface ClientPlanAssignment {
  plan_id: number;
  price_override_cents: number | null;
  effective_price_cents: number;
}

export interface ClientPlanRow {
  client_id: number;
  name: string;
  paid_at: string | null;
  assignment: {
    plan_id: number;
    plan_name: string;
    price_cents: number;
    currency: string;
    interval: BillingPlan["interval"];
    price_override_cents: number | null;
    effective_price_cents: number;
  } | null;
}

export interface PaymentMethodSummary {
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}

export interface AdBudgetState {
  tier: number;
  daily_cents: number;
  budget_cents: number;
  spent_cents: number;
  spend_source: "meta" | "estimate";
  period: "d" | "m";
  charged_at: string | null;
}

export interface ClientPlanOffer {
  ad_budget: AdBudgetState | null;
  plans: BillingPlan[];
  assignment: ClientPlanAssignment | null;
  plan: {
    name: string;
    price_cents: number;
    currency: string;
    interval: BillingPlan["interval"];
    features: string[];
  } | null;
  payment_method: PaymentMethodSummary | null;
  subscription: {
    status: string;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
  } | null;
  paid: boolean;
  paid_at: string | null;
  /* true once the user has a Stripe customer, even before first payment */
  has_billing_account: boolean;
}

export interface BillingPackage {
  id: number;
  name: string;
  price_cents: number;
  currency: string;
  description: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
}

export interface BillingSubscription {
  stripe_subscription_id: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export interface SubscriptionState {
  billing_exempt: boolean;
  assignment: {
    plan_id: number | null;
    plan_name: string | null;
    price_override_cents: number | null;
  } | null;
  plan: {
    name: string;
    price_cents: number;
    currency: string;
    interval: BillingPlan["interval"];
    features: string[];
  } | null;
  payment_method: PaymentMethodSummary | null;
  subscription: {
    id: string;
    status: string;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
  } | null;
}

export interface Invoice {
  id: number;
  stripe_invoice_id: string;
  billed_email: string;
  number: string;
  amount_due_cents: number;
  amount_paid_cents: number;
  status: string;
  hosted_url: string;
  pdf_url: string;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
}
