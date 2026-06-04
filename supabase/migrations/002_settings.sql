-- AutonomIA Supabase migration 002: company settings and external connections.

create table if not exists public.company_ai_settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  tone text not null default 'professional',
  language text not null default 'es',
  approval_required boolean not null default true,
  automation_level text not null default 'assisted' check (automation_level in ('assisted', 'semi_auto', 'auto')),
  main_goal text,
  custom_instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id)
);

create table if not exists public.company_brand_settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  brand_voice text,
  colors jsonb not null default '{}'::jsonb,
  logo_url text,
  social_handles jsonb not null default '{}'::jsonb,
  forbidden_topics text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id)
);

create table if not exists public.company_business_hours (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, weekday)
);

create table if not exists public.company_connections (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  provider text not null check (provider in ('google_business', 'instagram', 'facebook', 'whatsapp', 'tiktok', 'youtube', 'stripe', 'email')),
  status text not null default 'disconnected' check (status in ('connected', 'disconnected', 'error', 'pending')),
  external_account_id text,
  display_name text,
  metadata jsonb not null default '{}'::jsonb,
  connected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, provider)
);

create index if not exists company_ai_settings_company_id_idx on public.company_ai_settings(company_id);
create index if not exists company_brand_settings_company_id_idx on public.company_brand_settings(company_id);
create index if not exists company_business_hours_company_id_idx on public.company_business_hours(company_id);
create index if not exists company_connections_company_id_idx on public.company_connections(company_id);
create index if not exists company_connections_provider_status_idx on public.company_connections(provider, status);

create trigger company_ai_settings_set_updated_at before update on public.company_ai_settings for each row execute function public.set_updated_at();
create trigger company_brand_settings_set_updated_at before update on public.company_brand_settings for each row execute function public.set_updated_at();
create trigger company_business_hours_set_updated_at before update on public.company_business_hours for each row execute function public.set_updated_at();
create trigger company_connections_set_updated_at before update on public.company_connections for each row execute function public.set_updated_at();
