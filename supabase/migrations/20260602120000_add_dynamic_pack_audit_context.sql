alter table public.form_invitations
  add column if not exists contact_request_id uuid references public.contact_requests(id) on delete set null,
  add column if not exists pack_id text references public.ai_prospecting_packs(pack_id) on delete set null,
  add column if not exists sector_context text,
  add column if not exists access_context jsonb not null default '{}'::jsonb;

alter table public.form_responses
  add column if not exists contact_request_id uuid references public.contact_requests(id) on delete set null,
  add column if not exists pack_id text references public.ai_prospecting_packs(pack_id) on delete set null,
  add column if not exists sector_context text,
  add column if not exists context_snapshot jsonb not null default '{}'::jsonb;

create index if not exists idx_form_invitations_contact_request_id
  on public.form_invitations (contact_request_id, created_at desc);

create index if not exists idx_form_invitations_pack_id
  on public.form_invitations (pack_id, created_at desc);

create index if not exists idx_form_responses_contact_request_id
  on public.form_responses (contact_request_id, submitted_at desc);

create index if not exists idx_form_responses_pack_id
  on public.form_responses (pack_id, submitted_at desc);

update public.form_invitations invitation
set
  contact_request_id = request.id,
  sector_context = coalesce(invitation.sector_context, request.sector)
from public.contact_requests request
where request.audit_invite_token = invitation.invite_token
  and (invitation.contact_request_id is null or invitation.sector_context is null);

update public.form_responses response
set
  contact_request_id = coalesce(response.contact_request_id, invitation.contact_request_id),
  pack_id = coalesce(response.pack_id, invitation.pack_id),
  sector_context = coalesce(response.sector_context, invitation.sector_context),
  context_snapshot = case
    when response.context_snapshot = '{}'::jsonb and invitation.access_context is not null
      then invitation.access_context
    else response.context_snapshot
  end
from public.form_invitations invitation
where invitation.response_id = response.id
  and (
    response.contact_request_id is null
    or response.pack_id is null
    or response.sector_context is null
    or response.context_snapshot = '{}'::jsonb
  );
