-- Demo/test data safety for operational tables.
-- Adds soft deletion and demo flags without touching fiscal/billing records.

do $$
declare
  target_table text;
  tables text[] := array[
    'posts',
    'ai_conversations',
    'ai_messages',
    'tasks',
    'notifications',
    'leads',
    'reservations',
    'reviews',
    'calendar_events',
    'usage_events'
  ];
begin
  foreach target_table in array tables loop
    if to_regclass(format('public.%I', target_table)) is not null then
      execute format('alter table public.%I add column if not exists is_demo boolean not null default false', target_table);
      execute format('alter table public.%I add column if not exists archived_at timestamptz null', target_table);
      execute format('alter table public.%I add column if not exists deleted_at timestamptz null', target_table);

      if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = target_table
          and column_name = 'company_id'
      ) then
        execute format(
          'create index if not exists %I on public.%I(company_id, is_demo, deleted_at)',
          target_table || '_company_demo_deleted_idx',
          target_table
        );
      end if;

      if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = target_table
          and column_name = 'status'
      ) then
        execute format(
          'create index if not exists %I on public.%I(status, is_demo)',
          target_table || '_status_demo_idx',
          target_table
        );
      end if;
    end if;
  end loop;
end $$;
