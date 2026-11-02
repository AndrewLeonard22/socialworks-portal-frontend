export type TaskActionType =
  | "esign"
  | "form"
  | "oauth"
  | "manual_share"
  | "upload"
  | "book_call";

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "submitted"
  | "done"
  | "skipped";

export interface TaskField {
  key: string;
  label: string;
  kind: "text" | "textarea";
  required: boolean;
}

export interface OnboardingTask {
  id: number;
  key: string;
  title: string;
  body: string;
  minutes: number;
  action_type: TaskActionType;
  required: boolean;
  status: TaskStatus;
  action_ready: boolean;
  skippable: boolean;
  config: {
    fields?: TaskField[];
    instructions?: string;
    provider?: string;
    form_url?: string;
    booking_url?: string;
  };
  result: Record<string, unknown>;
  completed_at: string | null;
}

export interface OnboardingProfile {
  logo_url: string | null;
  asset_urls: string[];
  website_url: string;
  social_urls: Record<string, string>;
  is_complete: boolean;
}

export interface OnboardingProgress {
  done: number;
  total: number;
  required_done: number;
  required_total: number;
}

export type ClientPhase = "onboarding" | "active";

export interface OnboardingState {
  tasks: OnboardingTask[];
  profile: OnboardingProfile | null;
  progress: OnboardingProgress;
  can_proceed_to_payment: boolean;
  phase: ClientPhase;
}

export interface TaskAction {
  kind: "external_url" | "internal_route" | "embedded";
  url: string;
}
