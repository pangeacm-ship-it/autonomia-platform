-- AutonomIA migration 012: Meta/Facebook/Instagram connection foundation.
-- This prepares storage and RLS only. It does not publish to external networks.

create table if not exists public.social_connections (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  provider text not null default 'meta',
  platform text not null,
  account_name text null,
  account_id text null,
  page_id text null,
  instagram_business_account_id text null,
  access_token_encrypted text null,
  refresh_token_encrypted text null,
  token_expires_at timestamptz null,
  scopes jsonb not null default '[]'::jsonb,
  status text not null default 'disconnected',
  last_sync_at timestamptz null,
  is_demo boolean not null default false,
  archived_at timestamptz null,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint social_connections_provider_check check (provider in ('meta')),
  constraint social_connections_platform_check check (platform in ('facebook', 'instagram')),
  constraint social_connections_status_check check (status in ('connected', 'disconnected', 'expired', 'needs_review'))
);

create index if not exists social_connections_company_id_idx
  on public.social_connections(company_id);

create index if not exists social_connections_company_platform_idx
  on public.social_connections(company_id, platform);

create index if not exists social_connections_status_idx
  on public.social_connections(status);

create index if not exists social_connections_demo_deleted_idx
  on public.social_connections(company_id, is_demo, deleted_at);

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'social_connections_set_updated_at'
      and tgrelid = 'public.social_connections'::regclass
  ) then
    create trigger social_connections_set_updated_at
    before update on public.social_connections
    for each row
    execute function public.set_updated_at();
  end if;
end $$;

alter table public.social_connections enable row level security;

drop policy if exists "superadmin can manage social connections" on public.social_connections;
create policy "superadmin can manage social connections" on public.social_connections
  for all using (public.is_superadmin())
  with check (public.is_superadmin());

drop policy if exists "company users can read own social connections" on public.social_connections;
create policy "company users can read own social connections" on public.social_connections
  for select using (public.user_has_company_access(company_id));

drop policy if exists "company admins and marketing can manage social connections" on public.social_connections;
create policy "company admins and marketing can manage social connections" on public.social_connections
  for all using (
    public.is_superadmin()
    or public.user_company_role(company_id) in ('company_admin', 'marketing')
  )
  with check (
    public.is_superadmin()
    or public.user_company_role(company_id) in ('company_admin', 'marketing')
  );
