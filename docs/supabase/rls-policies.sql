-- AutonomIA initial Row Level Security policy draft.
-- Review carefully before production. Policies depend on public.profiles and public.company_users.

create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.profiles where auth_user_id = auth.uid()
$$;

create or replace function public.is_superadmin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.company_users cu
    join public.roles r on r.id = cu.role_id
    where cu.profile_id = public.current_profile_id()
      and cu.status = 'active'
      and r.key = 'superadmin'
  )
$$;

create or replace function public.user_has_company_access(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_superadmin()
    or exists (
      select 1
      from public.company_users cu
      where cu.profile_id = public.current_profile_id()
        and cu.company_id = target_company_id
        and cu.status = 'active'
    )
$$;

create or replace function public.user_company_role(target_company_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select r.key
  from public.company_users cu
  join public.roles r on r.id = cu.role_id
  where cu.profile_id = public.current_profile_id()
    and cu.company_id = target_company_id
    and cu.status = 'active'
  limit 1
$$;

create or replace function public.user_can_access_module(target_company_id uuid, target_module_key text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  role_key text;
begin
  if public.is_superadmin() then
    return true;
  end if;

  role_key := public.user_company_role(target_company_id);

  if role_key = 'company_admin' then
    return true;
  end if;

  if role_key = 'marketing' then
    return target_module_key in ('socialia', 'reviewia', 'calendario_ia', 'insightia', 'google_business');
  end if;

  if role_key = 'sales' then
    return target_module_key in ('leadia', 'whatsappia', 'reservaia');
  end if;

  if role_key = 'support' then
    return target_module_key in ('whatsappia', 'reviewia');
  end if;

  if role_key = 'readonly' then
    return true;
  end if;

  return false;
end;
$$;

create or replace function public.user_can_write_company(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_superadmin()
    or public.user_company_role(target_company_id) in ('company_admin', 'marketing', 'sales', 'support')
$$;

create or replace function public.user_is_company_admin(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_superadmin()
    or public.user_company_role(target_company_id) = 'company_admin'
$$;

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.company_users enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.modules enable row level security;
alter table public.company_modules enable row level security;
alter table public.company_ai_settings enable row level security;
alter table public.company_brand_settings enable row level security;
alter table public.company_business_hours enable row level security;
alter table public.company_connections enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.activities enable row level security;
alter table public.notifications enable row level security;
alter table public.tasks enable row level security;
alter table public.posts enable row level security;
alter table public.reviews enable row level security;
alter table public.leads enable row level security;
alter table public.reservations enable row level security;
alter table public.calendar_events enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.demo_requests enable row level security;
alter table public.support_tickets enable row level security;
alter table public.superadmin_notes enable row level security;
alter table public.usage_events enable row level security;

create policy "superadmin can manage companies" on public.companies
  for all using (public.is_superadmin())
  with check (public.is_superadmin());

create policy "company users can read own company" on public.companies
  for select using (public.user_has_company_access(id));

create policy "users can read own profile" on public.profiles
  for select using (id = public.current_profile_id() or public.is_superadmin());

create policy "users can update own profile" on public.profiles
  for update using (id = public.current_profile_id())
  with check (id = public.current_profile_id());

create policy "superadmin can manage profiles" on public.profiles
  for all using (public.is_superadmin())
  with check (public.is_superadmin());

create policy "roles visible to authenticated users" on public.roles
  for select using (auth.uid() is not null);

create policy "superadmin can manage roles" on public.roles
  for all using (public.is_superadmin())
  with check (public.is_superadmin());

create policy "company users can read memberships in own company" on public.company_users
  for select using (public.user_has_company_access(company_id));

create policy "company_admin can manage users in own company" on public.company_users
  for all using (public.user_is_company_admin(company_id))
  with check (public.user_is_company_admin(company_id));

create policy "plans readable to authenticated users" on public.plans
  for select using (auth.uid() is not null);

create policy "modules readable to authenticated users" on public.modules
  for select using (auth.uid() is not null);

create policy "superadmin can manage plans" on public.plans
  for all using (public.is_superadmin())
  with check (public.is_superadmin());

create policy "superadmin can manage modules" on public.modules
  for all using (public.is_superadmin())
  with check (public.is_superadmin());

create policy "subscriptions visible to company_admin and superadmin" on public.subscriptions
  for select using (public.user_is_company_admin(company_id));

create policy "superadmin can manage subscriptions" on public.subscriptions
  for all using (public.is_superadmin())
  with check (public.is_superadmin());

create policy "company modules visible to company users" on public.company_modules
  for select using (public.user_has_company_access(company_id));

create policy "company_admin can manage company modules" on public.company_modules
  for all using (public.user_is_company_admin(company_id))
  with check (public.user_is_company_admin(company_id));

create policy "company settings readable by company users" on public.company_ai_settings
  for select using (public.user_has_company_access(company_id));

create policy "company_admin can manage ai settings" on public.company_ai_settings
  for all using (public.user_is_company_admin(company_id))
  with check (public.user_is_company_admin(company_id));

create policy "brand settings readable by company users" on public.company_brand_settings
  for select using (public.user_has_company_access(company_id));

create policy "company_admin and marketing can manage brand settings" on public.company_brand_settings
  for all using (public.is_superadmin() or public.user_company_role(company_id) in ('company_admin', 'marketing'))
  with check (public.is_superadmin() or public.user_company_role(company_id) in ('company_admin', 'marketing'));

create policy "business hours visible by company users" on public.company_business_hours
  for select using (public.user_has_company_access(company_id));

create policy "company_admin can manage business hours" on public.company_business_hours
  for all using (public.user_is_company_admin(company_id))
  with check (public.user_is_company_admin(company_id));

create policy "connections visible by company users" on public.company_connections
  for select using (public.user_has_company_access(company_id));

create policy "company_admin can manage connections" on public.company_connections
  for all using (public.user_is_company_admin(company_id))
  with check (public.user_is_company_admin(company_id));

create policy "module scoped conversations readable" on public.ai_conversations
  for select using (public.user_can_access_module(company_id, coalesce(module_key, '')));

create policy "company users can create conversations" on public.ai_conversations
  for insert with check (public.user_can_write_company(company_id));

create policy "module scoped messages readable" on public.ai_messages
  for select using (public.user_has_company_access(company_id));

create policy "company users can create messages" on public.ai_messages
  for insert with check (public.user_can_write_company(company_id));

create policy "activities readable by company users" on public.activities
  for select using (public.user_has_company_access(company_id));

create policy "notifications readable by owner or company_admin" on public.notifications
  for select using (
    public.is_superadmin()
    or profile_id = public.current_profile_id()
    or public.user_is_company_admin(company_id)
  );

create policy "tasks readable by company users" on public.tasks
  for select using (public.user_has_company_access(company_id));

create policy "tasks writable by non-readonly users" on public.tasks
  for all using (public.user_can_write_company(company_id) and public.user_company_role(company_id) <> 'readonly')
  with check (public.user_can_write_company(company_id) and public.user_company_role(company_id) <> 'readonly');

create policy "marketing can access posts" on public.posts
  for select using (public.user_can_access_module(company_id, module_key));

create policy "marketing can manage posts" on public.posts
  for all using (public.is_superadmin() or public.user_company_role(company_id) in ('company_admin', 'marketing'))
  with check (public.is_superadmin() or public.user_company_role(company_id) in ('company_admin', 'marketing'));

create policy "review access by marketing and support" on public.reviews
  for select using (public.user_can_access_module(company_id, 'reviewia'));

create policy "review write by marketing support admin" on public.reviews
  for all using (public.is_superadmin() or public.user_company_role(company_id) in ('company_admin', 'marketing', 'support'))
  with check (public.is_superadmin() or public.user_company_role(company_id) in ('company_admin', 'marketing', 'support'));

create policy "sales can access leads" on public.leads
  for select using (public.user_can_access_module(company_id, 'leadia'));

create policy "sales can manage leads" on public.leads
  for all using (public.is_superadmin() or public.user_company_role(company_id) in ('company_admin', 'sales'))
  with check (public.is_superadmin() or public.user_company_role(company_id) in ('company_admin', 'sales'));

create policy "sales can access reservations" on public.reservations
  for select using (public.user_can_access_module(company_id, 'reservaia'));

create policy "sales can manage reservations" on public.reservations
  for all using (public.is_superadmin() or public.user_company_role(company_id) in ('company_admin', 'sales'))
  with check (public.is_superadmin() or public.user_company_role(company_id) in ('company_admin', 'sales'));

create policy "calendar visible by marketing sales admin readonly" on public.calendar_events
  for select using (public.user_has_company_access(company_id));

create policy "calendar writable by company non-readonly" on public.calendar_events
  for all using (public.user_can_write_company(company_id) and public.user_company_role(company_id) <> 'readonly')
  with check (public.user_can_write_company(company_id) and public.user_company_role(company_id) <> 'readonly');

create policy "invoices visible to company_admin and superadmin" on public.invoices
  for select using (public.user_is_company_admin(company_id));

create policy "superadmin can manage invoices" on public.invoices
  for all using (public.is_superadmin())
  with check (public.is_superadmin());

create policy "payments visible to company_admin and superadmin" on public.payments
  for select using (public.user_is_company_admin(company_id));

create policy "superadmin can manage payments" on public.payments
  for all using (public.is_superadmin())
  with check (public.is_superadmin());

create policy "demo requests visible to superadmin" on public.demo_requests
  for select using (public.is_superadmin());

create policy "superadmin can manage demo requests" on public.demo_requests
  for all using (public.is_superadmin())
  with check (public.is_superadmin());

create policy "support tickets visible to company users and superadmin" on public.support_tickets
  for select using (company_id is null and public.is_superadmin() or public.user_has_company_access(company_id));

create policy "company users can create support tickets" on public.support_tickets
  for insert with check (company_id is null or public.user_has_company_access(company_id));

create policy "superadmin can manage support tickets" on public.support_tickets
  for all using (public.is_superadmin())
  with check (public.is_superadmin());

create policy "superadmin notes visible to superadmin" on public.superadmin_notes
  for all using (public.is_superadmin())
  with check (public.is_superadmin());

create policy "usage events readable by company users" on public.usage_events
  for select using (company_id is null and public.is_superadmin() or public.user_has_company_access(company_id));

create policy "usage events insertable by company users" on public.usage_events
  for insert with check (company_id is null or public.user_has_company_access(company_id));
