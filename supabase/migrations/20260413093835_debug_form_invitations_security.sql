create or replace function public.debug_form_invitations_security()
returns jsonb
language sql
security definer
set search_path = public, pg_catalog
as $$
  select jsonb_build_object(
    'rls', (
      select jsonb_build_object(
        'rowsecurity', c.relrowsecurity,
        'forcerowsecurity', c.relforcerowsecurity
      )
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname = 'form_invitations'
    ),
    'policies', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'policyname', p.policyname,
          'cmd', p.cmd,
          'roles', p.roles,
          'qual', p.qual,
          'with_check', p.with_check
        )
        order by p.policyname
      )
      from pg_policies p
      where p.schemaname = 'public'
        and p.tablename = 'form_invitations'
    ), '[]'::jsonb),
    'grants', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'grantee', g.grantee,
          'privilege_type', g.privilege_type
        )
        order by g.grantee, g.privilege_type
      )
      from information_schema.role_table_grants g
      where g.table_schema = 'public'
        and g.table_name = 'form_invitations'
        and g.grantee in ('anon', 'authenticated')
    ), '[]'::jsonb)
  );
$$;

grant execute on function public.debug_form_invitations_security() to anon, authenticated;
