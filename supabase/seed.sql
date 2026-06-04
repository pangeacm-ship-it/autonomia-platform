-- AutonomIA Supabase seed data for development/staging.
-- Base catalog only: no fake companies, users, subscriptions or activity.

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
