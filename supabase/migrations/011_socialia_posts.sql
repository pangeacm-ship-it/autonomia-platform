-- SocialIA Fase 1A: internal posts lifecycle.
-- No Meta, Facebook, Instagram or OpenAI integrations are enabled here.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  created_by uuid null references public.profiles(id) on delete set null,
  module_key text not null default 'socialia',
  channel text not null default 'instagram',
  title text not null,
  content text not null,
  channels jsonb not null default '[]'::jsonb,
  media_urls text[] null,
  status text not null default 'draft',
  scheduled_at timestamptz null,
  published_at timestamptz null,
  is_demo boolean not null default false,
  archived_at timestamptz null,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.posts
  add column if not exists created_by uuid null references public.profiles(id) on delete set null,
  add column if not exists module_key text not null default 'socialia',
  add column if not exists channel text not null default 'instagram',
  add column if not exists media_urls text[] null,
  add column if not exists scheduled_at timestamptz null,
  add column if not exists published_at timestamptz null,
  add column if not exists is_demo boolean not null default false,
  add column if not exists archived_at timestamptz null,
  add column if not exists deleted_at timestamptz null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if to_regclass('public.posts') is not null then
    if not exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'posts'
        and column_name = 'channels'
    ) then
      alter table public.posts
        add column channels jsonb not null default '[]'::jsonb;
    elsif exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'posts'
        and column_name = 'channels'
        and data_type = 'ARRAY'
    ) then
      alter table public.posts
        alter column channels drop default,
        alter column channels type jsonb using to_jsonb(channels),
        alter column channels set default '[]'::jsonb,
        alter column channels set not null;
    else
      alter table public.posts
        alter column channels set default '[]'::jsonb,
        alter column channels set not null;
    end if;
  end if;
end $$;

update public.posts
set title = 'Publicación sin título'
where title is null;

alter table if exists public.posts
  alter column company_id set not null,
  alter column title set not null,
  alter column content set not null,
  alter column status set not null,
  alter column status set default 'draft',
  alter column is_demo set not null,
  alter column is_demo set default false;

update public.posts
set status = case
  when status = 'published' then 'published_simulated'
  when status = 'rejected' then 'canceled'
  when status in (
    'draft',
    'pending_approval',
    'approved',
    'scheduled',
    'published_simulated',
    'canceled',
    'archived'
  ) then status
  else 'draft'
end;

do $$
declare
  constraint_record record;
begin
  if to_regclass('public.posts') is not null then
    for constraint_record in
      select conname
      from pg_constraint
      where conrelid = 'public.posts'::regclass
        and contype = 'c'
        and pg_get_constraintdef(oid) ilike '%status%'
    loop
      execute format('alter table public.posts drop constraint if exists %I', constraint_record.conname);
    end loop;

    alter table public.posts
      add constraint posts_status_check
      check (status in (
        'draft',
        'pending_approval',
        'approved',
        'scheduled',
        'published_simulated',
        'canceled',
        'archived'
      ));
  end if;
end $$;

do $$
begin
  if to_regclass('public.posts') is not null then
    update public.posts
    set channels = case
      when jsonb_array_length(coalesce(channels, '[]'::jsonb)) > 0 then channels
      when channel = 'instagram' then '["instagram"]'::jsonb
      when channel = 'facebook' then '["facebook"]'::jsonb
      when channel = 'google_business' then '["google_business"]'::jsonb
      when channel = 'tiktok' then '["tiktok"]'::jsonb
      when channel = 'youtube_shorts' then '["youtube_shorts"]'::jsonb
      else '["instagram"]'::jsonb
    end
    where channels is null or jsonb_array_length(channels) = 0;
  end if;
end $$;

create index if not exists posts_company_id_idx on public.posts(company_id);
create index if not exists posts_status_idx on public.posts(status);
create index if not exists posts_scheduled_at_idx on public.posts(scheduled_at);
create index if not exists posts_is_demo_idx on public.posts(is_demo);

create index if not exists posts_company_status_demo_idx
  on public.posts(company_id, status, is_demo, deleted_at);

create index if not exists posts_company_scheduled_demo_idx
  on public.posts(company_id, scheduled_at, is_demo, deleted_at);
