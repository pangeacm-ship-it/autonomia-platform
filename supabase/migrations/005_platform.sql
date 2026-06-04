-- AutonomIA Supabase migration 005: platform owner data.

create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  email text not null,
  phone text,
  city text,
  industry text,
  interested_module text,
  requested_plan_key text,
  status text not null default 'new' check (status in ('new', 'pending', 'contacted', 'converted', 'archived')),
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
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.superadmin_notes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  note text not null,
  visibility text not null default 'internal' check (visibility in ('internal', 'shared')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  module_key text,
  event_type text not null,
  quantity integer not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists demo_requests_status_idx on public.demo_requests(status);
create index if not exists demo_requests_email_idx on public.demo_requests(email);
create index if not exists support_tickets_company_id_status_idx on public.support_tickets(company_id, status);
create index if not exists superadmin_notes_company_id_idx on public.superadmin_notes(company_id);
create index if not exists usage_events_company_id_created_at_idx on public.usage_events(company_id, created_at desc);
create index if not exists usage_events_module_key_idx on public.usage_events(module_key);
create index if not exists usage_events_event_type_idx on public.usage_events(event_type);

create trigger demo_requests_set_updated_at before update on public.demo_requests for each row execute function public.set_updated_at();
create trigger support_tickets_set_updated_at before update on public.support_tickets for each row execute function public.set_updated_at();
create trigger superadmin_notes_set_updated_at before update on public.superadmin_notes for each row execute function public.set_updated_at();
