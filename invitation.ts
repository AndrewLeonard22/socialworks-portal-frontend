export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired";

export interface ClientInvitation {
  id: number;
  email: string;
  status: InvitationStatus;
  client: { id: number; name: string };
  invited_by_name: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}

export interface InvitationPreview {
  email: string;
  client_name: string;
  agency_name: string;
  brand_config: {
    logo: string | null;
    colors: Record<string, string>;
  };
}

export interface PaginatedInvitations {
  count: number;
  next: string | null;
  previous: string | null;
  results: ClientInvitation[];
}
