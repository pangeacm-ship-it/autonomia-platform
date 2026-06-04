-- AutonomIA Supabase/Postgres initial schema proposal.
-- This file is not executed by the app. Review before running in Supabase.

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

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  slug text unique,
  tax_id text,
  city text,
  country text default 'ES',
  status text not null default 'active', -- active, trial, demo, suspended, churned
  industry text,
  owner_name text,
  owner_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  avatar_url text,
  phone text,
  status text not null default 'active', -- active, invited, disabled
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique, -- superadmin, company_admin, marketing, sales, support, readonly
  name text not null,
  description text,
  is_platform_role boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_users (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id),
  status text not null default 'active', -- active, invited, disabled
  invited_at timestamptz,
  last_access_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, profile_id)
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  monthly_price_cents integer,
  currency text not null default 'EUR',
  status text not null default 'active', -- active, legacy, hidden
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  status text not null default 'active', -- active, trialing, past_due, canceled
  started_at timestamptz not null default now(),
  current_period_start timestamptz,
  current_period_end timestamptz,
  founder_price_locked boolean not null default false,
  monthly_price_cents integer,
  currency text not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  status text not null default 'active', -- active, beta, hidden
  monthly_price_cents integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_modules (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  module_id uuid not null references public.modules(id),
  status text not null default 'active', -- active, recommended, available, disabled
  activated_at timestamptz,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, module_id)
);

create table if not exists public.company_ai_settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  tone text not null default 'professional',
  language text not null default 'es',
  approval_required boolean not null default true,
  automation_level text not null default 'assisted', -- assisted, semi_auto, auto
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
  provider text not null, -- google_business, instagram, facebook, whatsapp, tiktok, youtube
  status text not null default 'disconnected', -- connected, disconnected, error, pending
  external_account_id text,
  display_name text,
  metadata jsonb not null default '{}'::jsonb,
  connected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, provider)
);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  module_key text,
  channel text not null default 'dashboard', -- dashboard, whatsapp, email
  status text not null default 'open', -- open, closed, archived
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  role text not null, -- user, assistant, system, tool
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  module_key text,
  type text not null, -- post_created, review_answered, lead_detected, reservation_created
  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  type text not null, -- info, warning, action_required
  title text not null,
  body text,
  status text not null default 'unread', -- unread, read, archived
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  assigned_profile_id uuid references public.profiles(id) on delete set null,
  module_key text,
  title text not null,
  description text,
  priority text not null default 'medium', -- low, medium, high
  status text not null default 'pending', -- pending, in_progress, done, canceled
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  module_key text not null default 'socialia',
  channel text not null, -- instagram, facebook, google_business, tiktok, youtube_shorts
  title text,
  content text not null,
  media_urls text[],
  status text not null default 'draft', -- draft, pending_approval, scheduled, published, rejected
  scheduled_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  provider text not null default 'google',
  external_review_id text,
  author_name text,
  rating integer check (rating between 1 and 5),
  review_text text,
  suggested_response text,
  final_response text,
  status text not null default 'new', -- new, suggested, approved, answered, archived
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  source text not null, -- instagram, whatsapp, website, google, manual
  full_name text,
  email text,
  phone text,
  message text,
  stage text not null default 'new', -- new, contacted, qualified, won, lost
  priority text not null default 'medium',
  assigned_profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  customer_name text not null,
  customer_phone text,
  customer_email text,
  party_size integer,
  reservation_at timestamptz,
  status text not null default 'requested', -- requested, confirmed, canceled, completed, no_show
  source text not null default 'manual',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  module_key text,
  title text not null,
  description text,
  event_type text not null, -- post, reservation, task, reminder
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'scheduled',
  related_table text,
  related_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  invoice_number text unique,
  amount_cents integer not null,
  currency text not null default 'EUR',
  status text not null default 'draft', -- draft, open, paid, overdue, void
  due_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  invoice_id uuid references public.invoices(id) on delete set null,
  provider text,
  provider_payment_id text,
  amount_cents integer not null,
  currency text not null default 'EUR',
  status text not null default 'pending', -- pending, succeeded, failed, refunded
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  email text,
  phone text,
  city text,
  interested_module text,
  status text not null default 'new', -- new, pending, contacted, converted, archived
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  profile_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  priority text not null default 'medium', -- low, medium, high, urgent
  status text not null default 'open', -- open, in_progress, resolved, closed
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.superadmin_notes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  note text not null,
  visibility text not null default 'internal', -- internal, shared
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  module_key text,
  event_type text not null, -- ai_action, post_generated, review_response, lead_detected
  quantity integer not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists companies_status_idx on public.companies(status);
create index if not exists profiles_auth_user_id_idx on public.profiles(auth_user_id);
create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists company_users_company_id_idx on public.company_users(company_id);
create index if not exists company_users_profile_id_idx on public.company_users(profile_id);
create index if not exists subscriptions_company_id_idx on public.subscriptions(company_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);
create index if not exists company_modules_company_id_idx on public.company_modules(company_id);
create index if not exists company_connections_company_id_idx on public.company_connections(company_id);
create index if not exists ai_conversations_company_id_idx on public.ai_conversations(company_id);
create index if not exists ai_messages_conversation_id_idx on public.ai_messages(conversation_id);
create index if not exists activities_company_id_created_at_idx on public.activities(company_id, created_at desc);
create index if not exists notifications_company_id_status_idx on public.notifications(company_id, status);
create index if not exists tasks_company_id_status_idx on public.tasks(company_id, status);
create index if not exists posts_company_id_status_idx on public.posts(company_id, status);
create index if not exists reviews_company_id_status_idx on public.reviews(company_id, status);
create index if not exists leads_company_id_stage_idx on public.leads(company_id, stage);
create index if not exists reservations_company_id_status_idx on public.reservations(company_id, status);
create index if not exists calendar_events_company_id_starts_at_idx on public.calendar_events(company_id, starts_at);
create index if not exists invoices_company_id_status_idx on public.invoices(company_id, status);
create index if not exists payments_company_id_status_idx on public.payments(company_id, status);
create index if not exists demo_requests_status_idx on public.demo_requests(status);
create index if not exists support_tickets_company_id_status_idx on public.support_tickets(company_id, status);
create index if not exists usage_events_company_id_created_at_idx on public.usage_events(company_id, created_at desc);
create index if not exists usage_events_module_key_idx on public.usage_events(module_key);

create trigger companies_set_updated_at before update on public.companies for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger roles_set_updated_at before update on public.roles for each row execute function public.set_updated_at();
create trigger company_users_set_updated_at before update on public.company_users for each row execute function public.set_updated_at();
create trigger plans_set_updated_at before update on public.plans for each row execute function public.set_updated_at();
create trigger subscriptions_set_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
create trigger modules_set_updated_at before update on public.modules for each row execute function public.set_updated_at();
create trigger company_modules_set_updated_at before update on public.company_modules for each row execute function public.set_updated_at();
create trigger company_ai_settings_set_updated_at before update on public.company_ai_settings for each row execute function public.set_updated_at();
create trigger company_brand_settings_set_updated_at before update on public.company_brand_settings for each row execute function public.set_updated_at();
create trigger company_business_hours_set_updated_at before update on public.company_business_hours for each row execute function public.set_updated_at();
create trigger company_connections_set_updated_at before update on public.company_connections for each row execute function public.set_updated_at();
create trigger ai_conversations_set_updated_at before update on public.ai_conversations for each row execute function public.set_updated_at();
create trigger notifications_set_updated_at before update on public.notifications for each row execute function public.set_updated_at();
create trigger tasks_set_updated_at before update on public.tasks for each row execute function public.set_updated_at();
create trigger posts_set_updated_at before update on public.posts for each row execute function public.set_updated_at();
create trigger reviews_set_updated_at before update on public.reviews for each row execute function public.set_updated_at();
create trigger leads_set_updated_at before update on public.leads for each row execute function public.set_updated_at();
create trigger reservations_set_updated_at before update on public.reservations for each row execute function public.set_updated_at();
create trigger calendar_events_set_updated_at before update on public.calendar_events for each row execute function public.set_updated_at();
create trigger invoices_set_updated_at before update on public.invoices for each row execute function public.set_updated_at();
create trigger payments_set_updated_at before update on public.payments for each row execute function public.set_updated_at();
create trigger demo_requests_set_updated_at before update on public.demo_requests for each row execute function public.set_updated_at();
create trigger support_tickets_set_updated_at before update on public.support_tickets for each row execute function public.set_updated_at();
create trigger superadmin_notes_set_updated_at before update on public.superadmin_notes for each row execute function public.set_updated_at();
