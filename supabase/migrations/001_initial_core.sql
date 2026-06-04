-- AutonomIA Supabase migration 001: core multi-company schema.
-- Safe to review before executing in a real Supabase project.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.business_sectors (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  slug text not null unique,
  tax_id text,
  city text,
  country text not null default 'ES',
  status text not null default 'trial' check (status in ('trial', 'active', 'past_due', 'suspended', 'canceled', 'demo')),
  industry text,
  sector_id uuid references public.business_sectors(id) on delete set null,
  owner_name text,
  owner_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  avatar_url text,
  phone text,
  status text not null default 'invited' check (status in ('active', 'invited', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key in ('superadmin', 'company_admin', 'marketing', 'sales', 'support', 'readonly')),
  name text not null,
  description text,
  is_platform_role boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_users (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id),
  status text not null default 'invited' check (status in ('active', 'invited', 'disabled')),
  invited_at timestamptz,
  last_access_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, profile_id, role_id)
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  monthly_price_cents integer,
  currency text not null default 'EUR',
  status text not null default 'active' check (status in ('active', 'legacy', 'hidden')),
  description text,
  features jsonb not null default '[]'::jsonb,
  stripe_price_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  status text not null default 'trial' check (status in ('trial', 'active', 'past_due', 'suspended', 'canceled')),
  started_at timestamptz not null default now(),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  suspended_at timestamptz,
  founder_price_locked boolean not null default false,
  monthly_price_cents integer,
  currency text not null default 'EUR',
  stripe_customer_id text,
  stripe_subscription_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'beta', 'hidden')),
  monthly_price_cents integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_modules (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  module_id uuid not null references public.modules(id),
  status text not null default 'available' check (status in ('active', 'recommended', 'available', 'disabled')),
  activated_at timestamptz,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, module_id)
);

create index if not exists business_sectors_key_idx on public.business_sectors(key);
create index if not exists companies_status_idx on public.companies(status);
create index if not exists companies_sector_id_idx on public.companies(sector_id);
create index if not exists profiles_auth_user_id_idx on public.profiles(auth_user_id);
create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists company_users_company_id_idx on public.company_users(company_id);
create index if not exists company_users_profile_id_idx on public.company_users(profile_id);
create index if not exists company_users_role_id_idx on public.company_users(role_id);
create index if not exists subscriptions_company_id_idx on public.subscriptions(company_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);
create index if not exists subscriptions_company_active_idx on public.subscriptions(company_id) where status in ('trial', 'active', 'past_due', 'suspended');
create index if not exists subscriptions_stripe_customer_id_idx on public.subscriptions(stripe_customer_id);
create index if not exists company_modules_company_id_idx on public.company_modules(company_id);
create index if not exists company_modules_module_id_idx on public.company_modules(module_id);

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'business_sectors_set_updated_at'
      and tgrelid = 'public.business_sectors'::regclass
  ) then
    create trigger business_sectors_set_updated_at
      before update on public.business_sectors
      for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'companies_set_updated_at'
      and tgrelid = 'public.companies'::regclass
  ) then
    create trigger companies_set_updated_at
      before update on public.companies
      for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'profiles_set_updated_at'
      and tgrelid = 'public.profiles'::regclass
  ) then
    create trigger profiles_set_updated_at
      before update on public.profiles
      for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'roles_set_updated_at'
      and tgrelid = 'public.roles'::regclass
  ) then
    create trigger roles_set_updated_at
      before update on public.roles
      for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'company_users_set_updated_at'
      and tgrelid = 'public.company_users'::regclass
  ) then
    create trigger company_users_set_updated_at
      before update on public.company_users
      for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'plans_set_updated_at'
      and tgrelid = 'public.plans'::regclass
  ) then
    create trigger plans_set_updated_at
      before update on public.plans
      for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'subscriptions_set_updated_at'
      and tgrelid = 'public.subscriptions'::regclass
  ) then
    create trigger subscriptions_set_updated_at
      before update on public.subscriptions
      for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'modules_set_updated_at'
      and tgrelid = 'public.modules'::regclass
  ) then
    create trigger modules_set_updated_at
      before update on public.modules
      for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'company_modules_set_updated_at'
      and tgrelid = 'public.company_modules'::regclass
  ) then
    create trigger company_modules_set_updated_at
      before update on public.company_modules
      for each row execute function public.set_updated_at();
  end if;
end;
$$;
