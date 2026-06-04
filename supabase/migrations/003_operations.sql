-- AutonomIA Supabase migration 003: customer operations and AI activity.

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  module_key text,
  channel text not null default 'dashboard' check (channel in ('dashboard', 'whatsapp', 'email', 'instagram', 'facebook', 'google_business')),
  status text not null default 'open' check (status in ('open', 'closed', 'archived')),
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  role text not null check (role in ('user', 'assistant', 'system', 'tool')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  module_key text,
  type text not null,
  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  type text not null default 'info' check (type in ('info', 'warning', 'action_required', 'billing', 'system')),
  title text not null,
  body text,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
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
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'done', 'canceled')),
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  module_key text not null default 'socialia',
  channel text not null check (channel in ('instagram', 'facebook', 'google_business', 'tiktok', 'youtube_shorts')),
  title text,
  content text not null,
  media_urls text[],
  status text not null default 'draft' check (status in ('draft', 'pending_approval', 'scheduled', 'published', 'rejected')),
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
  status text not null default 'new' check (status in ('new', 'suggested', 'approved', 'answered', 'archived')),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  source text not null check (source in ('instagram', 'whatsapp', 'website', 'google', 'manual', 'facebook')),
  full_name text,
  email text,
  phone text,
  message text,
  stage text not null default 'new' check (stage in ('new', 'contacted', 'qualified', 'won', 'lost')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
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
  status text not null default 'requested' check (status in ('requested', 'confirmed', 'canceled', 'completed', 'no_show')),
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
  event_type text not null check (event_type in ('post', 'reservation', 'task', 'reminder', 'meeting')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled', 'done', 'canceled')),
  related_table text,
  related_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_conversations_company_id_idx on public.ai_conversations(company_id);
create index if not exists ai_conversations_module_key_idx on public.ai_conversations(module_key);
create index if not exists ai_messages_company_id_idx on public.ai_messages(company_id);
create index if not exists ai_messages_conversation_id_idx on public.ai_messages(conversation_id);
create index if not exists activities_company_id_created_at_idx on public.activities(company_id, created_at desc);
create index if not exists notifications_company_id_status_idx on public.notifications(company_id, status);
create index if not exists tasks_company_id_status_idx on public.tasks(company_id, status);
create index if not exists posts_company_id_status_idx on public.posts(company_id, status);
create index if not exists posts_company_id_scheduled_at_idx on public.posts(company_id, scheduled_at);
create index if not exists reviews_company_id_status_idx on public.reviews(company_id, status);
create index if not exists leads_company_id_stage_idx on public.leads(company_id, stage);
create index if not exists reservations_company_id_status_idx on public.reservations(company_id, status);
create index if not exists calendar_events_company_id_starts_at_idx on public.calendar_events(company_id, starts_at);

create trigger ai_conversations_set_updated_at before update on public.ai_conversations for each row execute function public.set_updated_at();
create trigger notifications_set_updated_at before update on public.notifications for each row execute function public.set_updated_at();
create trigger tasks_set_updated_at before update on public.tasks for each row execute function public.set_updated_at();
create trigger posts_set_updated_at before update on public.posts for each row execute function public.set_updated_at();
create trigger reviews_set_updated_at before update on public.reviews for each row execute function public.set_updated_at();
create trigger leads_set_updated_at before update on public.leads for each row execute function public.set_updated_at();
create trigger reservations_set_updated_at before update on public.reservations for each row execute function public.set_updated_at();
create trigger calendar_events_set_updated_at before update on public.calendar_events for each row execute function public.set_updated_at();
