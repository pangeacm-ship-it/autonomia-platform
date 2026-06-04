-- AutonomIA Supabase migration 007: safe company offboarding states.
-- Adds archived companies and inactive company users for reversible offboarding.

alter table public.companies
  drop constraint if exists companies_status_check;

alter table public.companies
  add constraint companies_status_check
  check (status in ('trial', 'active', 'past_due', 'suspended', 'canceled', 'demo', 'archived'));

alter table public.company_users
  drop constraint if exists company_users_status_check;

alter table public.company_users
  add constraint company_users_status_check
  check (status in ('active', 'invited', 'disabled', 'inactive'));

create index if not exists companies_archived_idx on public.companies(status) where status = 'archived';
