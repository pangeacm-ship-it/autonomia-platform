-- AutonomIA Supabase migration 004: SaaS billing and fiscal readiness.
-- No Stripe connection is created here; provider references are future placeholders.

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  invoice_number text unique,
  invoice_series text not null default 'AUTO',
  issued_at timestamptz,
  operation_date date,
  seller_name text,
  seller_tax_id text,
  buyer_name text,
  buyer_tax_id text,
  billing_period_start date,
  billing_period_end date,
  plan_name text,
  taxable_base_cents integer not null default 0,
  tax_rate numeric(5,2) not null default 21.00,
  tax_amount_cents integer not null default 0,
  total_cents integer not null default 0,
  currency text not null default 'EUR',
  status text not null default 'draft' check (status in ('draft', 'issued', 'paid', 'void', 'rectified')),
  payment_method text,
  pdf_url text,
  stripe_invoice_id text unique,
  fiscal_status text not null default 'pending' check (fiscal_status in ('pending', 'ready', 'submitted', 'accepted', 'rejected', 'not_required')),
  fiscal_hash text,
  fiscal_qr_url text,
  fiscal_provider_reference text,
  rectifies_invoice_id uuid references public.invoices(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  invoice_id uuid references public.invoices(id) on delete set null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  provider text not null default 'stripe',
  provider_customer_id text,
  provider_payment_id text,
  provider_payment_intent_id text,
  amount_cents integer not null,
  currency text not null default 'EUR',
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed', 'refunded', 'canceled')),
  failure_reason text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  payment_id uuid references public.payments(id) on delete set null,
  provider text not null default 'stripe',
  event_type text not null,
  provider_event_id text unique,
  status text not null default 'received' check (status in ('received', 'processed', 'failed', 'ignored')),
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fiscal_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete restrict,
  record_type text not null default 'invoice' check (record_type in ('invoice', 'rectification', 'cancellation')),
  status text not null default 'pending' check (status in ('pending', 'ready', 'submitted', 'accepted', 'rejected', 'archived')),
  fiscal_hash text,
  previous_fiscal_hash text,
  qr_payload text,
  qr_url text,
  provider text,
  provider_reference text,
  submitted_at timestamptz,
  accepted_at timestamptz,
  rejection_reason text,
  immutable_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (invoice_id)
);

create index if not exists invoices_company_id_status_idx on public.invoices(company_id, status);
create index if not exists invoices_subscription_id_idx on public.invoices(subscription_id);
create index if not exists invoices_stripe_invoice_id_idx on public.invoices(stripe_invoice_id);
create index if not exists invoices_fiscal_status_idx on public.invoices(fiscal_status);
create index if not exists payments_company_id_status_idx on public.payments(company_id, status);
create index if not exists payments_invoice_id_idx on public.payments(invoice_id);
create index if not exists payments_provider_payment_intent_id_idx on public.payments(provider_payment_intent_id);
create index if not exists billing_events_company_id_created_at_idx on public.billing_events(company_id, created_at desc);
create index if not exists billing_events_event_type_idx on public.billing_events(event_type);
create index if not exists fiscal_records_company_id_status_idx on public.fiscal_records(company_id, status);
create index if not exists fiscal_records_invoice_id_idx on public.fiscal_records(invoice_id);

create trigger invoices_set_updated_at before update on public.invoices for each row execute function public.set_updated_at();
create trigger payments_set_updated_at before update on public.payments for each row execute function public.set_updated_at();
create trigger billing_events_set_updated_at before update on public.billing_events for each row execute function public.set_updated_at();
create trigger fiscal_records_set_updated_at before update on public.fiscal_records for each row execute function public.set_updated_at();
