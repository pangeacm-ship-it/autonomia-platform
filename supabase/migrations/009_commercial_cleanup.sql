-- Commercial cleanup before onboarding real customers.
-- Keeps Enterprise hidden for internal compatibility and removes old visible demo companies safely.

insert into public.plans (key, name, monthly_price_cents, currency, status, description, features) values
  ('gratuito', 'Gratuito', 0, 'EUR', 'active', 'Plan de entrada con SocialIA limitado y publicación de apoyo semanal.', '["1 usuario", "2 publicaciones semanales", "Instagram + Facebook", "Centro IA limitado", "Publicación de apoyo semanal"]'::jsonb),
  ('inicio', 'Inicio', 9000, 'EUR', 'active', 'Plan de lanzamiento para SocialIA completo.', '["1 usuario", "SocialIA completo"]'::jsonb),
  ('crecimiento', 'Crecimiento', 12000, 'EUR', 'active', 'Plan recomendado para negocios locales.', '["2 usuarios", "SocialIA", "Google Business", "ReviewIA básico", "InsightIA básico"]'::jsonb),
  ('local_ia_360', 'Local IA', 25000, 'EUR', 'active', 'Plan profesional con módulos principales.', '["Hasta 5 usuarios", "Módulos principales", "SocialIA", "Google Business", "ReviewIA", "InsightIA"]'::jsonb),
  ('enterprise', 'Enterprise', null, 'EUR', 'hidden', 'Plan interno futuro no visible comercialmente.', '["Uso interno futuro"]'::jsonb)
on conflict (key) do update set
  name = excluded.name,
  monthly_price_cents = excluded.monthly_price_cents,
  currency = excluded.currency,
  status = excluded.status,
  description = excluded.description,
  features = excluded.features,
  updated_at = now();

update public.companies
set status = 'archived',
    updated_at = now()
where slug in ('bar-la-plaza', 'clinica-nova', 'beauty-studio', 'dental-sur')
  and not exists (
    select 1 from public.invoices i where i.company_id = companies.id
  )
  and not exists (
    select 1 from public.payments p where p.company_id = companies.id
  )
  and not exists (
    select 1 from public.billing_events be where be.company_id = companies.id
  )
  and not exists (
    select 1 from public.fiscal_records fr where fr.company_id = companies.id
  );
