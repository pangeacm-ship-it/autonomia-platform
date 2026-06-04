-- Elena IA foundation for AutonomIA.
-- Prepared for future OpenAI integration. No secrets or runtime connection.

create table if not exists public.elena_conversations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  type text not null default 'client',
  status text not null default 'open',
  title text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint elena_conversations_type_check check (
    type in ('commercial', 'client', 'proactive', 'coach', 'support')
  ),
  constraint elena_conversations_status_check check (
    status in ('open', 'pending', 'resolved', 'archived')
  )
);

create table if not exists public.elena_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.elena_conversations(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  type text not null default 'assistant',
  status text not null default 'sent',
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint elena_messages_type_check check (
    type in ('user', 'assistant', 'system', 'notification')
  ),
  constraint elena_messages_status_check check (
    status in ('draft', 'sent', 'failed', 'archived')
  )
);

create table if not exists public.elena_memory (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.elena_conversations(id) on delete set null,
  company_id uuid references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  type text not null,
  status text not null default 'active',
  key text not null,
  value jsonb not null default '{}'::jsonb,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint elena_memory_type_check check (
    type in (
      'goal',
      'preference',
      'tone',
      'publication',
      'frequent_problem',
      'recommended_action',
      'sector_context'
    )
  ),
  constraint elena_memory_status_check check (
    status in ('active', 'archived', 'disabled')
  )
);

create table if not exists public.elena_notifications (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.elena_conversations(id) on delete set null,
  company_id uuid references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  type text not null,
  status text not null default 'pending',
  title text not null,
  body text,
  action_url text,
  scheduled_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint elena_notifications_type_check check (
    type in (
      'publication_reminder',
      'review_reminder',
      'reservation_reminder',
      'lead_followup',
      'campaign_reminder',
      'billing_reminder',
      'seasonal_suggestion'
    )
  ),
  constraint elena_notifications_status_check check (
    status in ('pending', 'sent', 'read', 'dismissed', 'failed')
  )
);

create table if not exists public.elena_recommendations (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.elena_conversations(id) on delete set null,
  company_id uuid references public.companies(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  type text not null default 'business',
  status text not null default 'suggested',
  title text not null,
  description text,
  module_key text,
  priority text not null default 'medium',
  action_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint elena_recommendations_type_check check (
    type in ('commercial', 'business', 'module', 'campaign', 'billing', 'coach')
  ),
  constraint elena_recommendations_status_check check (
    status in ('suggested', 'accepted', 'dismissed', 'completed', 'archived')
  ),
  constraint elena_recommendations_priority_check check (
    priority in ('low', 'medium', 'high', 'urgent')
  )
);

create index if not exists idx_elena_conversations_company_id
  on public.elena_conversations(company_id);

create index if not exists idx_elena_conversations_profile_id
  on public.elena_conversations(profile_id);

create index if not exists idx_elena_messages_conversation_id
  on public.elena_messages(conversation_id);

create index if not exists idx_elena_messages_company_id
  on public.elena_messages(company_id);

create index if not exists idx_elena_memory_company_key
  on public.elena_memory(company_id, key);

create index if not exists idx_elena_notifications_company_status
  on public.elena_notifications(company_id, status);

create index if not exists idx_elena_recommendations_company_status
  on public.elena_recommendations(company_id, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists elena_conversations_set_updated_at on public.elena_conversations;
create trigger elena_conversations_set_updated_at
before update on public.elena_conversations
for each row execute function public.set_updated_at();

drop trigger if exists elena_messages_set_updated_at on public.elena_messages;
create trigger elena_messages_set_updated_at
before update on public.elena_messages
for each row execute function public.set_updated_at();

drop trigger if exists elena_memory_set_updated_at on public.elena_memory;
create trigger elena_memory_set_updated_at
before update on public.elena_memory
for each row execute function public.set_updated_at();

drop trigger if exists elena_notifications_set_updated_at on public.elena_notifications;
create trigger elena_notifications_set_updated_at
before update on public.elena_notifications
for each row execute function public.set_updated_at();

drop trigger if exists elena_recommendations_set_updated_at on public.elena_recommendations;
create trigger elena_recommendations_set_updated_at
before update on public.elena_recommendations
for each row execute function public.set_updated_at();
