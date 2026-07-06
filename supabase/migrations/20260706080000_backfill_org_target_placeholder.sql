-- Backfill: replace ORG_TARGET / DECISION_MAKER_TARGET placeholders left in
-- form_invitations.access_context and draft_form_data for invitations created
-- before the 2026-06-28 de-anonymization fix (commit 85377f8).

update public.form_invitations invitation
set
  access_context = jsonb_set(
    invitation.access_context,
    '{prospectContext}',
    to_jsonb(
      regexp_replace(
        regexp_replace(
          invitation.access_context->>'prospectContext',
          'ORG_TARGET',
          coalesce(
            nullif(btrim(pack.organization_name), ''),
            nullif(btrim((select company from public.contact_requests where id = invitation.contact_request_id)), ''),
            nullif(btrim((select full_name from public.contact_requests where id = invitation.contact_request_id)), ''),
            'ce prospect'
          ),
          'g'
        ),
        'DECISION_MAKER_TARGET',
        coalesce(
          nullif(btrim((select full_name from public.contact_requests where id = invitation.contact_request_id)), ''),
          nullif(btrim(pack.organization_name), ''),
          nullif(btrim((select company from public.contact_requests where id = invitation.contact_request_id)), ''),
          'ce prospect'
        ),
        'g'
      )
    )
  ),
  draft_form_data = case
    when invitation.draft_form_data ? 'prospect_context' then
      jsonb_set(
        invitation.draft_form_data,
        '{prospect_context}',
        to_jsonb(
          regexp_replace(
            regexp_replace(
              invitation.draft_form_data->>'prospect_context',
              'ORG_TARGET',
              coalesce(
                nullif(btrim(pack.organization_name), ''),
                nullif(btrim((select company from public.contact_requests where id = invitation.contact_request_id)), ''),
                nullif(btrim((select full_name from public.contact_requests where id = invitation.contact_request_id)), ''),
                'ce prospect'
              ),
              'g'
            ),
            'DECISION_MAKER_TARGET',
            coalesce(
              nullif(btrim((select full_name from public.contact_requests where id = invitation.contact_request_id)), ''),
              nullif(btrim(pack.organization_name), ''),
              nullif(btrim((select company from public.contact_requests where id = invitation.contact_request_id)), ''),
              'ce prospect'
            ),
            'g'
          )
        )
      )
    else invitation.draft_form_data
  end
from public.ai_prospecting_packs pack
where invitation.pack_id = pack.pack_id
  and (
    invitation.access_context->>'prospectContext' ~ 'ORG_TARGET|DECISION_MAKER_TARGET'
    or invitation.draft_form_data->>'prospect_context' ~ 'ORG_TARGET|DECISION_MAKER_TARGET'
  );
