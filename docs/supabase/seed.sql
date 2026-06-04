-- AutonomIA seed data for development/staging.
-- Do not run blindly in production.

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
  is_platform_role = excluded.is_platform_role;

insert into public.plans (key, name, monthly_price_cents, currency, description) values
  ('inicio', 'Inicio', 7900, 'EUR', 'Plan base para actividad constante en redes.'),
  ('crecimiento', 'Crecimiento', 10000, 'EUR', 'Plan recomendado para presencia local y métricas.'),
  ('local_ia_360', 'Local IA 360', 15000, 'EUR', 'Plan avanzado para marketing, reputación y automatización.'),
  ('enterprise', 'Enterprise', null, 'EUR', 'Solución personalizada para empresas con varios centros.')
on conflict (key) do update set
  name = excluded.name,
  monthly_price_cents = excluded.monthly_price_cents,
  description = excluded.description;

insert into public.modules (key, name, description, monthly_price_cents) values
  ('socialia', 'SocialIA', 'Publicaciones para Instagram y Facebook.', null),
  ('reviewia', 'ReviewIA', 'Respuestas inteligentes a reseñas.', 1900),
  ('whatsappia', 'WhatsAppIA', 'Atención automática por WhatsApp.', 2900),
  ('leadia', 'LeadIA', 'Captación y seguimiento de leads.', 2900),
  ('reservaia', 'ReservaIA', 'Gestión de reservas y recordatorios.', 1900),
  ('insightia', 'InsightIA', 'Informes y recomendaciones automáticas.', 1500),
  ('google_business', 'Google Business', 'Publicaciones y optimización de ficha local.', 1000),
  ('calendario_ia', 'Calendario IA', 'Calendario operativo de publicaciones, reservas y tareas.', null),
  ('tiktok_shorts', 'TikTok & Shorts', 'Ideas y guiones para vídeo corto.', 2500)
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description,
  monthly_price_cents = excluded.monthly_price_cents;

insert into public.companies (name, slug, city, status, industry, owner_name, owner_email) values
  ('Bar La Plaza', 'bar-la-plaza', 'Sevilla', 'active', 'Restauración', 'Juanma Salado', 'juanma@barlaplaza.com'),
  ('Clínica Nova', 'clinica-nova', 'Málaga', 'active', 'Salud', 'María Nova', 'admin@clinicanova.com'),
  ('Beauty Studio', 'beauty-studio', 'Córdoba', 'active', 'Estética', 'Laura Gómez', 'hola@beautystudio.com')
on conflict (slug) do update set
  name = excluded.name,
  city = excluded.city,
  status = excluded.status,
  industry = excluded.industry,
  owner_name = excluded.owner_name,
  owner_email = excluded.owner_email;

insert into public.subscriptions (company_id, plan_id, status, founder_price_locked, monthly_price_cents)
select c.id, p.id, 'active', true,
  case c.slug
    when 'bar-la-plaza' then 10000
    when 'clinica-nova' then 15000
    when 'beauty-studio' then 7900
  end
from public.companies c
join public.plans p on p.key = case c.slug
  when 'bar-la-plaza' then 'crecimiento'
  when 'clinica-nova' then 'local_ia_360'
  when 'beauty-studio' then 'inicio'
end
where c.slug in ('bar-la-plaza', 'clinica-nova', 'beauty-studio');

insert into public.company_modules (company_id, module_id, status, activated_at)
select c.id, m.id, 'active', now()
from public.companies c
join public.modules m on m.key in ('socialia', 'google_business', 'insightia', 'calendario_ia')
where c.slug = 'bar-la-plaza'
on conflict (company_id, module_id) do update set status = excluded.status;

insert into public.company_modules (company_id, module_id, status, activated_at)
select c.id, m.id, 'active', now()
from public.companies c
join public.modules m on m.key in ('socialia', 'reviewia', 'whatsappia', 'leadia')
where c.slug = 'clinica-nova'
on conflict (company_id, module_id) do update set status = excluded.status;

insert into public.company_modules (company_id, module_id, status, activated_at)
select c.id, m.id, 'active', now()
from public.companies c
join public.modules m on m.key in ('socialia')
where c.slug = 'beauty-studio'
on conflict (company_id, module_id) do update set status = excluded.status;

insert into public.demo_requests (company_name, contact_name, email, city, interested_module, status, notes) values
  ('Gimnasio CentroFit', 'Responsable CentroFit', 'info@centrofit.com', 'Sevilla', 'LeadIA', 'pending', 'Interesado en captación de socios.'),
  ('Peluquería Laura', 'Laura', 'hola@peluquerialaura.com', 'Málaga', 'SocialIA', 'pending', 'Quiere publicar promociones semanales.'),
  ('Clínica Dental Norte', 'Clínica Dental Norte', 'contacto@dentalnorte.com', 'Córdoba', 'ReviewIA', 'contacted', 'Contactado para demo de reputación.'),
  ('Cafetería Sol', 'Cafetería Sol', 'reservas@cafeteriasol.com', 'Granada', 'ReservaIA', 'new', 'Nueva solicitud desde landing.')
on conflict do nothing;

insert into public.support_tickets (company_id, title, description, priority, status)
select c.id, 'Error al conectar Instagram', 'El cliente no puede completar la conexión de Instagram.', 'high', 'open'
from public.companies c where c.slug = 'bar-la-plaza'
union all
select c.id, 'Duda sobre factura', 'Consulta sobre el importe mensual.', 'medium', 'open'
from public.companies c where c.slug = 'beauty-studio'
union all
select c.id, 'Solicitud módulo Enterprise', 'Quiere revisar una propuesta multiubicación.', 'high', 'in_progress'
from public.companies c where c.slug = 'clinica-nova';

insert into public.usage_events (company_id, module_key, event_type, quantity, metadata)
select c.id, 'socialia', 'post_generated', 124, '{"source":"seed"}'::jsonb
from public.companies c where c.slug = 'bar-la-plaza'
union all
select c.id, 'reviewia', 'review_response', 38, '{"source":"seed"}'::jsonb
from public.companies c where c.slug = 'clinica-nova'
union all
select c.id, 'leadia', 'lead_detected', 27, '{"source":"seed"}'::jsonb
from public.companies c where c.slug = 'clinica-nova'
union all
select c.id, 'socialia', 'post_generated', 42, '{"source":"seed"}'::jsonb
from public.companies c where c.slug = 'beauty-studio'
union all
select c.id, 'insightia', 'report_generated', 8, '{"source":"seed"}'::jsonb
from public.companies c where c.slug = 'bar-la-plaza';

insert into public.activities (company_id, module_key, type, title, description)
select c.id, 'socialia', 'post_created', 'SocialIA generó una publicación', 'Publicación preparada para aprobación.'
from public.companies c where c.slug = 'bar-la-plaza'
union all
select c.id, 'reviewia', 'review_answered', 'ReviewIA preparó una respuesta', 'Respuesta lista para revisar.'
from public.companies c where c.slug = 'clinica-nova'
union all
select c.id, 'leadia', 'lead_detected', 'LeadIA detectó un contacto', 'Nuevo lead pendiente de seguimiento.'
from public.companies c where c.slug = 'clinica-nova';
