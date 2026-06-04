-- AutonomIA seed de referencia.
-- Catálogo base sin empresas, usuarios ni actividad ficticia.

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

insert into public.business_sectors (key, name, description) values
  ('hosteleria', 'Hostelería', 'Bares, restaurantes y cafeterías.'),
  ('belleza_estetica', 'Belleza y estética', 'Centros de estética, peluquerías y estudios.'),
  ('salud_clinicas', 'Salud y clínicas', 'Clínicas privadas y consultas.'),
  ('profesionales', 'Profesionales', 'Servicios profesionales.'),
  ('comercio_local', 'Comercio local', 'Tiendas y negocios de proximidad.'),
  ('inmobiliarias', 'Inmobiliarias', 'Agencias inmobiliarias.'),
  ('automocion', 'Automoción', 'Talleres, concesionarios y servicios.'),
  ('formacion', 'Formación', 'Academias y centros formativos.')
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description;

insert into public.plans (key, name, monthly_price_cents, currency, status, description, features) values
  ('gratuito', 'Gratuito', 0, 'EUR', 'active', 'SocialIA limitado con publicación de apoyo semanal.', '["1 usuario", "2 publicaciones semanales", "Instagram + Facebook", "Centro IA limitado"]'::jsonb),
  ('inicio', 'Inicio', 9000, 'EUR', 'active', 'SocialIA completo.', '["1 usuario", "SocialIA completo"]'::jsonb),
  ('crecimiento', 'Crecimiento', 12000, 'EUR', 'active', 'Plan recomendado para negocios locales.', '["2 usuarios", "SocialIA", "Google Business", "ReviewIA básico", "InsightIA básico"]'::jsonb),
  ('local_ia_360', 'Local IA', 25000, 'EUR', 'active', 'Módulos principales.', '["Hasta 5 usuarios", "Módulos principales"]'::jsonb),
  ('enterprise', 'Enterprise', null, 'EUR', 'hidden', 'Plan interno futuro no visible comercialmente.', '["Uso interno futuro"]'::jsonb)
on conflict (key) do update set
  name = excluded.name,
  monthly_price_cents = excluded.monthly_price_cents,
  status = excluded.status,
  description = excluded.description,
  features = excluded.features;

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
