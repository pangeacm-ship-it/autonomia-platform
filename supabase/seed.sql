-- AutonomIA Supabase seed data for development/staging.
-- Does not create Supabase Auth users. Demo profiles can be linked later via auth_user_id.

insert into public.roles (key, name, description, is_platform_role) values
  ('superadmin', 'Superadmin', 'Acceso global a la plataforma AutonomIA.', true),
  ('company_admin', 'Administrador de empresa', 'Gestiona usuarios, módulos, facturación y configuración de su empresa.', false),
  ('marketing', 'Marketing', 'Acceso a SocialIA, ReviewIA, Calendario e InsightIA.', false),
  ('sales', 'Comercial', 'Acceso a LeadIA, WhatsAppIA y ReservaIA.', false),
  ('support', 'Soporte', 'Acceso a WhatsAppIA y ReviewIA.', false),
  ('readonly', 'Solo lectura', 'Acceso de lectura a informes y métricas.', false)
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description,
  is_platform_role = excluded.is_platform_role,
  updated_at = now();

insert into public.business_sectors (key, name, description) values
  ('hosteleria', 'Hostelería', 'Bares, restaurantes y cafeterías con reservas, reseñas y contenido frecuente.'),
  ('belleza_estetica', 'Belleza y estética', 'Centros de estética, peluquerías y estudios con citas y promociones.'),
  ('salud_clinicas', 'Salud y clínicas', 'Clínicas privadas y consultas con citas, reputación y captación local.'),
  ('profesionales', 'Profesionales', 'Servicios profesionales que necesitan visibilidad, leads y seguimiento.'),
  ('comercio_local', 'Comercio local', 'Tiendas y negocios de proximidad con campañas recurrentes.'),
  ('inmobiliarias', 'Inmobiliarias', 'Agencias con visitas, captación y seguimiento comercial.'),
  ('automocion', 'Automoción', 'Talleres, concesionarios y servicios con citas y reseñas.'),
  ('formacion', 'Formación', 'Academias y centros formativos con captación y comunicación recurrente.')
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description,
  updated_at = now();

insert into public.plans (key, name, monthly_price_cents, currency, description, features) values
  ('inicio', 'Inicio', 7900, 'EUR', 'Plan base para actividad constante en redes.', '["SocialIA", "Calendario IA", "Soporte básico"]'::jsonb),
  ('crecimiento', 'Crecimiento', 10000, 'EUR', 'Plan fundador recomendado para pilotos y primeros clientes.', '["SocialIA", "Google Business", "InsightIA", "Calendario IA"]'::jsonb),
  ('local_ia_360', 'Local IA 360', 15000, 'EUR', 'Plan avanzado para marketing, reputación y automatización.', '["SocialIA", "ReviewIA", "LeadIA", "ReservaIA", "InsightIA"]'::jsonb),
  ('enterprise', 'Enterprise', null, 'EUR', 'Solución personalizada para empresas con varios centros.', '["Multiempresa", "Soporte prioritario", "Módulos a medida"]'::jsonb)
on conflict (key) do update set
  name = excluded.name,
  monthly_price_cents = excluded.monthly_price_cents,
  currency = excluded.currency,
  description = excluded.description,
  features = excluded.features,
  updated_at = now();

insert into public.modules (key, name, description, monthly_price_cents) values
  ('socialia', 'SocialIA', 'Publicaciones para Instagram y Facebook desde AutonomIA.', null),
  ('reviewia', 'ReviewIA', 'Respuestas inteligentes a reseñas.', 1900),
  ('whatsappia', 'WhatsAppIA', 'Atención automática por WhatsApp Business API.', 2900),
  ('leadia', 'LeadIA', 'Captación y seguimiento de leads.', 2900),
  ('reservaia', 'ReservaIA', 'Gestión de reservas, citas y recordatorios.', 1900),
  ('insightia', 'InsightIA', 'Informes y recomendaciones automáticas.', 1500),
  ('google_business', 'Google Business', 'Publicaciones y optimización de ficha local.', 1000),
  ('calendario_ia', 'Calendario IA', 'Calendario operativo de publicaciones, reservas y tareas.', null),
  ('tiktok_shorts', 'TikTok & Shorts', 'Ideas y guiones para vídeo corto.', 2500)
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description,
  monthly_price_cents = excluded.monthly_price_cents,
  updated_at = now();

insert into public.companies (name, legal_name, slug, tax_id, city, status, industry, sector_id, owner_name, owner_email)
select 'Bar La Plaza', 'Bar La Plaza S.L.', 'bar-la-plaza', 'B00000001', 'Sevilla', 'active', 'Hostelería', bs.id, 'Juanma Salado', 'juanma@barlaplaza.com'
from public.business_sectors bs where bs.key = 'hosteleria'
on conflict (slug) do update set
  name = excluded.name,
  legal_name = excluded.legal_name,
  tax_id = excluded.tax_id,
  city = excluded.city,
  status = excluded.status,
  industry = excluded.industry,
  sector_id = excluded.sector_id,
  owner_name = excluded.owner_name,
  owner_email = excluded.owner_email,
  updated_at = now();

insert into public.companies (name, legal_name, slug, tax_id, city, status, industry, sector_id, owner_name, owner_email)
select 'Clínica Nova', 'Clínica Nova S.L.P.', 'clinica-nova', 'B00000002', 'Málaga', 'active', 'Salud y clínicas', bs.id, 'María Nova', 'admin@clinicanova.com'
from public.business_sectors bs where bs.key = 'salud_clinicas'
on conflict (slug) do update set
  name = excluded.name,
  legal_name = excluded.legal_name,
  tax_id = excluded.tax_id,
  city = excluded.city,
  status = excluded.status,
  industry = excluded.industry,
  sector_id = excluded.sector_id,
  owner_name = excluded.owner_name,
  owner_email = excluded.owner_email,
  updated_at = now();

insert into public.companies (name, legal_name, slug, tax_id, city, status, industry, sector_id, owner_name, owner_email)
select 'Beauty Studio', 'Beauty Studio S.L.', 'beauty-studio', 'B00000003', 'Córdoba', 'active', 'Belleza y estética', bs.id, 'Laura Gómez', 'hola@beautystudio.com'
from public.business_sectors bs where bs.key = 'belleza_estetica'
on conflict (slug) do update set
  name = excluded.name,
  legal_name = excluded.legal_name,
  tax_id = excluded.tax_id,
  city = excluded.city,
  status = excluded.status,
  industry = excluded.industry,
  sector_id = excluded.sector_id,
  owner_name = excluded.owner_name,
  owner_email = excluded.owner_email,
  updated_at = now();

-- Demo profiles. Link auth_user_id after creating real Supabase Auth users.
insert into public.profiles (full_name, email, phone, status) values
  ('Superadmin AutonomIA', 'superadmin@autonomia.local', null, 'active'),
  ('Juanma Salado', 'juanma@barlaplaza.com', '+34 600 000 001', 'active'),
  ('María López', 'marketing@barlaplaza.com', '+34 600 000 002', 'active'),
  ('Pedro Ruiz', 'ventas@barlaplaza.com', '+34 600 000 003', 'active'),
  ('Ana Gómez', 'soporte@barlaplaza.com', '+34 600 000 004', 'invited'),
  ('María Nova', 'admin@clinicanova.com', '+34 600 000 005', 'active'),
  ('Laura Gómez', 'hola@beautystudio.com', '+34 600 000 006', 'active')
on conflict (email) do update set
  full_name = excluded.full_name,
  phone = excluded.phone,
  status = excluded.status,
  updated_at = now();

insert into public.company_users (company_id, profile_id, role_id, status, invited_at, last_access_at)
select null, p.id, r.id, 'active', now(), now()
from public.profiles p
join public.roles r on r.key = 'superadmin'
where p.email = 'superadmin@autonomia.local'
  and not exists (
    select 1 from public.company_users cu
    where cu.company_id is null and cu.profile_id = p.id and cu.role_id = r.id
  );

insert into public.company_users (company_id, profile_id, role_id, status, invited_at, last_access_at)
select c.id, p.id, r.id, case when p.email = 'soporte@barlaplaza.com' then 'invited' else 'active' end, now(), now() - interval '2 days'
from public.companies c
join public.profiles p on p.email in ('juanma@barlaplaza.com', 'marketing@barlaplaza.com', 'ventas@barlaplaza.com', 'soporte@barlaplaza.com')
join public.roles r on r.key = case p.email
  when 'juanma@barlaplaza.com' then 'company_admin'
  when 'marketing@barlaplaza.com' then 'marketing'
  when 'ventas@barlaplaza.com' then 'sales'
  when 'soporte@barlaplaza.com' then 'support'
end
where c.slug = 'bar-la-plaza'
  and not exists (
    select 1 from public.company_users cu
    where cu.company_id = c.id and cu.profile_id = p.id and cu.role_id = r.id
  );

insert into public.company_users (company_id, profile_id, role_id, status, invited_at, last_access_at)
select c.id, p.id, r.id, 'active', now(), now() - interval '1 day'
from public.companies c
join public.profiles p on p.email in ('admin@clinicanova.com', 'hola@beautystudio.com')
join public.roles r on r.key = 'company_admin'
where c.slug = case p.email
  when 'admin@clinicanova.com' then 'clinica-nova'
  when 'hola@beautystudio.com' then 'beauty-studio'
end
  and not exists (
    select 1 from public.company_users cu
    where cu.company_id = c.id and cu.profile_id = p.id and cu.role_id = r.id
  );

insert into public.subscriptions (
  company_id,
  plan_id,
  status,
  current_period_start,
  current_period_end,
  founder_price_locked,
  monthly_price_cents,
  currency,
  stripe_customer_id,
  stripe_subscription_id
)
select c.id, p.id, 'active', date_trunc('month', now()), date_trunc('month', now()) + interval '1 month', true,
  case c.slug
    when 'bar-la-plaza' then 10000
    when 'clinica-nova' then 15000
    when 'beauty-studio' then 7900
  end,
  'EUR',
  'cus_demo_' || replace(c.slug, '-', '_'),
  'sub_demo_' || replace(c.slug, '-', '_')
from public.companies c
join public.plans p on p.key = case c.slug
  when 'bar-la-plaza' then 'crecimiento'
  when 'clinica-nova' then 'local_ia_360'
  when 'beauty-studio' then 'inicio'
end
where c.slug in ('bar-la-plaza', 'clinica-nova', 'beauty-studio')
  and not exists (
    select 1 from public.subscriptions s
    where s.company_id = c.id and s.stripe_subscription_id = 'sub_demo_' || replace(c.slug, '-', '_')
  );

insert into public.company_modules (company_id, module_id, status, activated_at)
select c.id, m.id, 'active', now()
from public.companies c
join public.modules m on m.key in ('socialia', 'google_business', 'insightia', 'calendario_ia')
where c.slug = 'bar-la-plaza'
on conflict (company_id, module_id) do update set status = excluded.status, activated_at = coalesce(public.company_modules.activated_at, excluded.activated_at), updated_at = now();

insert into public.company_modules (company_id, module_id, status, activated_at)
select c.id, m.id, 'active', now()
from public.companies c
join public.modules m on m.key in ('socialia', 'reviewia', 'whatsappia', 'leadia', 'reservaia')
where c.slug = 'clinica-nova'
on conflict (company_id, module_id) do update set status = excluded.status, activated_at = coalesce(public.company_modules.activated_at, excluded.activated_at), updated_at = now();

insert into public.company_modules (company_id, module_id, status, activated_at)
select c.id, m.id, 'active', now()
from public.companies c
join public.modules m on m.key in ('socialia')
where c.slug = 'beauty-studio'
on conflict (company_id, module_id) do update set status = excluded.status, activated_at = coalesce(public.company_modules.activated_at, excluded.activated_at), updated_at = now();

insert into public.company_modules (company_id, module_id, status)
select c.id, m.id, 'recommended'
from public.companies c
join public.modules m on m.key in ('reviewia', 'leadia', 'reservaia')
where c.slug = 'bar-la-plaza'
on conflict (company_id, module_id) do update set status = excluded.status, updated_at = now();

insert into public.company_ai_settings (company_id, tone, language, approval_required, automation_level, main_goal, custom_instructions)
select c.id, 'cercano_profesional', 'es', true, 'assisted', 'Aumentar reservas y presencia local', 'Mantener el tono cercano, claro y útil.'
from public.companies c
where c.slug = 'bar-la-plaza'
on conflict (company_id) do update set
  tone = excluded.tone,
  language = excluded.language,
  approval_required = excluded.approval_required,
  automation_level = excluded.automation_level,
  main_goal = excluded.main_goal,
  custom_instructions = excluded.custom_instructions,
  updated_at = now();

insert into public.demo_requests (company_name, contact_name, email, phone, city, industry, interested_module, requested_plan_key, status, notes) values
  ('Gimnasio CentroFit', 'Responsable CentroFit', 'info@centrofit.com', '+34 600 000 101', 'Sevilla', 'Profesionales', 'LeadIA', 'crecimiento', 'pending', 'Interesado en captación de socios.'),
  ('Peluquería Laura', 'Laura', 'hola@peluquerialaura.com', '+34 600 000 102', 'Málaga', 'Belleza y estética', 'SocialIA', 'inicio', 'pending', 'Quiere publicar promociones semanales.'),
  ('Clínica Dental Norte', 'Clínica Dental Norte', 'contacto@dentalnorte.com', '+34 600 000 103', 'Córdoba', 'Salud y clínicas', 'ReviewIA', 'local_ia_360', 'contacted', 'Contactado para demo de reputación.'),
  ('Cafetería Sol', 'Cafetería Sol', 'reservas@cafeteriasol.com', '+34 600 000 104', 'Granada', 'Hostelería', 'ReservaIA', 'crecimiento', 'new', 'Nueva solicitud desde landing.')
on conflict do nothing;

insert into public.usage_events (company_id, module_key, event_type, quantity, metadata)
select c.id, 'socialia', 'post_generated', 124, '{"source":"seed","period":"last_30_days"}'::jsonb
from public.companies c where c.slug = 'bar-la-plaza'
union all
select c.id, 'insightia', 'report_generated', 8, '{"source":"seed","period":"last_30_days"}'::jsonb
from public.companies c where c.slug = 'bar-la-plaza'
union all
select c.id, 'reviewia', 'review_response', 38, '{"source":"seed","period":"last_30_days"}'::jsonb
from public.companies c where c.slug = 'clinica-nova'
union all
select c.id, 'leadia', 'lead_detected', 27, '{"source":"seed","period":"last_30_days"}'::jsonb
from public.companies c where c.slug = 'clinica-nova'
union all
select c.id, 'socialia', 'post_generated', 42, '{"source":"seed","period":"last_30_days"}'::jsonb
from public.companies c where c.slug = 'beauty-studio';

insert into public.support_tickets (company_id, title, description, priority, status)
select c.id, 'Error al conectar Instagram', 'El cliente no puede completar la conexión de Instagram.', 'high', 'open'
from public.companies c where c.slug = 'bar-la-plaza'
union all
select c.id, 'Duda sobre factura emitida', 'Consulta sobre el importe mensual y el PDF de factura.', 'medium', 'open'
from public.companies c where c.slug = 'beauty-studio'
union all
select c.id, 'Solicitud módulo Enterprise', 'Quiere revisar una propuesta multiubicación.', 'high', 'in_progress'
from public.companies c where c.slug = 'clinica-nova';
