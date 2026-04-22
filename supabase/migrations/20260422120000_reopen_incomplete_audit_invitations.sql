update public.form_invitations invitation
set status = 'pending'
from public.form_responses response
where invitation.response_id = response.id
  and invitation.status = 'completed'
  and coalesce(response.is_completed, false) = false;
