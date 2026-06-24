import type { Json } from "@/integrations/supabase/types";

export type ProspectTargetStatus = "ready" | "active" | "paused" | "closed" | "archived";

export type PackStatus =
  | "pending_approval"
  | "approved"
  | "rejected"
  | "sent"
  | "approval_error"
  | "expired"
  | "cancelled";

export type OutreachChannel = "email" | "whatsapp" | "linkedin" | "phone" | "web";

export type DeliveryStatus = "submitted" | "queued" | "delivered" | "bounced" | "failed";

export type ResponseStatus =
  | "pending"
  | "opened"
  | "replied"
  | "interested"
  | "meeting_booked"
  | "not_interested"
  | "unsubscribed"
  | "no_response";

export type CommercialPriority = "tier1" | "tier2" | "tier3";

export type ProviderType = "zoho" | "gmail" | "outlook" | "custom";

export type ProviderTransportMode = "api" | "smtp" | "oauth_api";

export type ApprovalMode = "approve_only" | "approve_and_send";

export type PackAction =
  | "generate_pack"
  | "regenerate_pack"
  | "approve_pack"
  | "approve_and_send_pack"
  | "reject_pack"
  | "send_pack"
  | "test_provider"
  | "list_providers"
  | "health_check";

export type PackActionErrorCode =
  | "UNAUTHORIZED"
  | "INVALID_PAYLOAD"
  | "PROSPECT_NOT_FOUND"
  | "PACK_NOT_FOUND"
  | "PACK_ALREADY_SENT"
  | "PACK_NOT_SENDABLE"
  | "PACK_NOT_APPROVABLE"
  | "PROVIDER_NOT_CONFIGURED"
  | "PROVIDER_TEST_FAILED"
  | "WORKFLOW_EXECUTION_FAILED"
  | "SUPABASE_WRITE_FAILED"
  | "UNSUPPORTED_ACTION";

export type PackAttachment = {
  filename: string;
  mimeType?: string | null;
  path?: string | null;
  content?: string | null;
  sizeBytes?: number | null;
  source?: "catalogue" | "deck" | "extra" | "unknown";
};

export type CatalogueArtifact = {
  filename_pdf?: string | null;
  filename_docx?: string | null;
  pdf_url?: string | null;
  docx_url?: string | null;
};

export type DeckArtifact = {
  filename_pptx?: string | null;
  filename_pdf?: string | null;
  pptx_url?: string | null;
  pdf_url?: string | null;
};

export type ProspectPackPayload = {
  pack_id?: string;
  prospect_id?: string | null;
  organization_name?: string | null;
  decision_maker_name?: string | null;
  target_email?: string | null;
  website?: string | null;
  country?: string | null;
  organization_type?: string | null;
  sector_guess?: string | null;
  prospect_language?: string | null;
  commercial_priority_tier?: CommercialPriority | string | null;
  recommended_offer?: string | null;
  recommended_use_case?: string | null;
  best_selling_use_case?: string | null;
  audit_form_url?: string | null;
  booking_link_45min?: string | null;
  executive_letter?: string | null;
  executive_letter_html?: string | null;
  tailored_catalogue?: string | null;
  deck_brief?: Json | null;
  catalogue_artifact?: CatalogueArtifact | null;
  deck_artifact?: DeckArtifact | null;
  mail_attachments?: PackAttachment[] | null;
  llm_redaction_summary?: Json | null;
  llm_allowed_payload?: Json | null;
  llm_generation_payload?: Json | null;
  [key: string]: Json | string | number | boolean | null | undefined | PackAttachment[] | CatalogueArtifact | DeckArtifact;
};

export type ProspectTargetItem = {
  id?: string;
  prospect_id: string;
  organization_name: string;
  website: string;
  country: string;
  organization_type: string;
  sector_guess: string;
  decision_maker_name: string | null;
  target_email: string | null;
  custom_page_paths_csv: string;
  booking_link_45min: string | null;
  commercial_priority_default: CommercialPriority;
  research_scope: string;
  source_backend: string;
  source_label: string | null;
  raw_source_id: string | null;
  status: ProspectTargetStatus;
  paused: boolean;
  do_not_contact: boolean;
  outreach_attempt_count: number;
  last_response_status: string | null;
  last_sequence_result: string | null;
  stop_reason: string | null;
  niche_status: string | null;
  next_action_at: string | null;
  admin_alert_sent_at: string | null;
  social_email_1_sent_at: string | null;
  social_email_2_sent_at: string | null;
  social_email_3_sent_at: string | null;
  last_outreach_at: string | null;
  last_researched_at: string | null;
  last_pack_id: string | null;
  notes_internal: string | null;
  created_at: string;
  updated_at: string;
};

export type ProspectingPackItem = {
  id?: string;
  pack_id: string;
  prospect_id: string | null;
  organization_name: string;
  decision_maker_name: string | null;
  target_email: string | null;
  website: string | null;
  status: PackStatus;
  payload: ProspectPackPayload;
  llm_redaction_summary: Json | null;
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  sent_at: string | null;
  approval_error_at?: string | null;
  resend_message_id: string | null;
  reviewer_email: string | null;
  error_reason: string | null;
  updated_at?: string;
};

export type OutreachAttemptItem = {
  id?: string;
  prospect_id: string | null;
  pack_id: string | null;
  organization_id?: string | null;
  person_id?: string | null;
  organization_name: string | null;
  target_email: string | null;
  channel: OutreachChannel;
  message_variant: string | null;
  sent_at: string;
  delivery_status: DeliveryStatus;
  response_status: ResponseStatus;
  response_date?: string | null;
  follow_up_due_at?: string | null;
  stop_reason: string | null;
  metadata?: Json | null;
  created_at?: string;
};

export type PackDiagnostics = {
  pack_id: string;
  target_email: string | null;
  attachments: PackAttachment[];
  attachments_count: number;
  has_pdf: boolean;
  has_pptx: boolean;
  has_executive_letter: boolean;
  can_send: boolean;
  send_failure_reason: string | null;
  provider_key?: string | null;
};

export type PackTimeline = {
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  sent_at: string | null;
  approval_error_at?: string | null;
};

export type PackDetailViewModel = {
  pack: ProspectingPackItem;
  prospect: ProspectTargetItem | null;
  diagnostics: PackDiagnostics;
  attachments: PackAttachment[];
  timeline: PackTimeline;
  outreach_attempts: OutreachAttemptItem[];
};

export type ProviderConfigSummary = {
  provider_key: string;
  provider_type: ProviderType;
  transport_mode: ProviderTransportMode;
  from_email: string;
  sender_name: string;
  reply_to_email?: string | null;
  is_active: boolean;
  supports_attachments: boolean;
  daily_send_limit?: number | null;
  per_minute_limit?: number | null;
};

export type ProspectionOverview = {
  totalProspects: number;
  prospectsReady: number;
  prospectsPaused: number;
  totalPacks: number;
  pendingApprovalPacks: number;
  sentPacks: number;
  approvalErrors: number;
  outreachAttempts: number;
};

export type ProspectionSnapshot = {
  overview: ProspectionOverview;
  prospects: ProspectTargetItem[];
  packs: ProspectingPackItem[];
  outreach_attempts: OutreachAttemptItem[];
  providers?: ProviderConfigSummary[];
};

export type GeneratePackRequest = {
  prospect_id: string;
  triggered_by: string;
  source: "backoffice";
  force?: boolean;
  provider_key?: string;
};

export type RegeneratePackRequest = {
  pack_id: string;
  prospect_id?: string;
  triggered_by: string;
  reason: string;
  force?: boolean;
};

export type ApprovePackRequest = {
  pack_id: string;
  reviewer_email: string;
  mode: ApprovalMode;
  notes?: string;
  provider_key?: string;
};

export type RejectPackRequest = {
  pack_id: string;
  reviewer_email: string;
  reason: string;
  reset_prospect_to_ready?: boolean;
};

export type SendPackRequest = {
  pack_id: string;
  reviewer_email: string;
  provider_key: string;
  force?: boolean;
};

export type TestProviderRequest = {
  provider_key: string;
  test_to_email: string;
  triggered_by: string;
};

export type AdminActionResponse<TData = Record<string, unknown>> = {
  ok: boolean;
  action: PackAction;
  status: string;
  message: string;
  data?: TData;
  error?: {
    code: PackActionErrorCode;
    details?: Record<string, unknown>;
  };
  meta: {
    request_id: string;
    timestamp: string;
  };
};

export type GeneratePackResponse = AdminActionResponse<{
  prospect_id: string;
  workflow_key: string;
  poll_after_ms: number;
}>;

export type RegeneratePackResponse = AdminActionResponse<{
  pack_id: string;
  prospect_id?: string;
  poll_after_ms: number;
}>;

export type ApprovePackResponse = AdminActionResponse<{
  pack_id: string;
  reviewer_email: string;
  provider_key?: string;
  provider_message_id?: string;
}>;

export type RejectPackResponse = AdminActionResponse<{
  pack_id: string;
  prospect_status: ProspectTargetStatus;
}>;

export type SendPackResponse = AdminActionResponse<{
  pack_id: string;
  provider_key: string;
  provider_message_id?: string;
  sent_at?: string;
}>;

export type TestProviderResponse = AdminActionResponse<{
  provider_key: string;
  provider_message_id?: string;
}>;

export type ListProvidersResponse = AdminActionResponse<{
  providers: ProviderConfigSummary[];
}>;

export type HealthCheckResponse = AdminActionResponse<{
  supabase: "ok" | "error";
  n8n: "ok" | "error";
  providers_active: number;
}>;

export type ProspectingAdminFilters = {
  search?: string;
  packStatus?: PackStatus | "all";
  prospectStatus?: ProspectTargetStatus | "all";
  priority?: CommercialPriority | "all";
  providerKey?: string | "all";
  canSend?: boolean | "all";
};
