import Link from "next/link";
import { defaultBusinessSector } from "@/lib/business-sectors";

const connectedChannels = [
  { name: "Instagram", status: "Conectado" },
  { name: "Facebook", status: "Conectado" },
  { name: "Google Business", status: "Conectado" },
  { name: "TikTok", status: "No conectado" },
];

const tones = [
  "Cercano",
  "Profesional",
  "Divertido",
  "Familiar",
  "Premium",
  "Tradicional",
];

const aiIdeas = [
  "Publicar el plato estrella de la semana",
  "Mostrar el ambiente del negocio",
  "Promoción para reservas de fin de semana",
  "Presentar al equipo",
];

const aiResults = [
  {
    title: "Nueva propuesta destacada de la semana",
    channel: "Instagram + Facebook",
    text: "Si buscas un plato con sabor de verdad, hoy tenemos arroz meloso con carrillada preparado con mimo y producto de calidad.",
  },
  {
    title: "Menú casero para disfrutar sin prisas",
    channel: "Instagram",
    text: "Hoy cocinamos como siempre: producto fresco, sabor de casa y un menú pensado para que disfrutes cada bocado.",
  },
  {
    title: "Reserva tu mesa para hoy",
    channel: "Facebook",
    text: "Hoy tenemos una propuesta especial. Ven con quien quieras y disfruta de una experiencia cercana.",
  },
];

const scheduledPosts = [
  { title: "Menú del día", date: "Hoy · 10:00", status: "Programada" },
  { title: "Promo fin de semana", date: "Viernes · 12:00", status: "Pendiente" },
  { title: "Story ambiente", date: "Sábado · 18:00", status: "Borrador" },
];

const miniCalendar = [
  { day: "L", posts: 1 },
  { day: "M", posts: 0 },
  { day: "X", posts: 1 },
  { day: "J", posts: 0 },
  { day: "V", posts: 2 },
  { day: "S", posts: 1 },
  { day: "D", posts: 0 },
];

const postHistory = [
  { title: "Menú del día", status: "Pendiente aprobación", date: "Hoy" },
  { title: "Promoción fin de semana", status: "Programado", date: "Ayer" },
  { title: "Story de reservas", status: "Publicado", date: "Hace 3 días" },
];

const supportPostOptions = [
  {
    title: "Gestión online más sencilla",
    text: "Desde que usamos AutonomIA gestionamos mejor nuestras redes y mantenemos el negocio más activo online.",
  },
  {
    title: "Presencia digital constante",
    text: "AutonomIA nos ayuda a mantener nuestro negocio activo online con ideas, planificación y contenido más organizado.",
  },
  {
    title: "IA para pequeños negocios",
    text: "La IA también puede ayudar a pequeños negocios a crecer, comunicar mejor y estar presentes cada semana.",
  },
];

export default function SocialIAPage() {
  // TODO: Load the selected sector from business-sectors.ts through the company profile in Supabase.
  const sector = defaultBusinessSector;

  return (
    <section className="p-4 sm:p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-6 lg:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          SocialIA
        </p>

        <div className="mt-5 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">
              Centro de publicaciones inteligentes
            </h1>

            <p className="mt-4 max-w-3xl text-slate-300">
              Crea, revisa, programa y gestiona contenido para Instagram,
              Facebook, Google Business y vídeo corto desde un único lugar.
            </p>
          </div>

          <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-300">
            Módulo activo
          </span>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {connectedChannels.map((channel) => (
          <div
            key={channel.name}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
          >
            <p className="text-sm text-slate-400">{channel.name}</p>

            <p
              className={`mt-2 font-bold ${
                channel.status === "Conectado"
                  ? "text-emerald-300"
                  : "text-amber-300"
              }`}
            >
              {channel.status}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-[360px_1fr]">
        <section className="rounded-[2rem] border border-emerald-400/20 bg-emerald-500/10 p-6">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
            Modo Gratuito
          </p>

          <h2 className="mt-4 text-4xl font-black">
            2 publicaciones disponibles esta semana
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-300">
            Incluye Instagram + Facebook, 1 usuario y Centro IA limitado. No
            incluye ReviewIA, WhatsAppIA, LeadIA, ReservaIA ni InsightIA
            avanzado.
          </p>
        </section>

        <section className="rounded-[2rem] border border-violet-400/25 bg-violet-500/10 p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-200">
                Publicación de apoyo semanal
              </p>
              <h2 className="mt-3 text-2xl font-black">
                Elige una publicación para activar la próxima semana
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Al publicarla se desbloquean las publicaciones de la próxima
                semana. El mensaje se plantea como apoyo positivo a AutonomIA,
                sin mencionar condiciones internas del plan.
              </p>
            </div>

            <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-black text-violet-100">
              Próxima semana pendiente
            </span>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {supportPostOptions.map((option) => (
              <article
                key={option.title}
                className="flex h-full flex-col rounded-3xl border border-white/10 bg-[#0b1024] p-5"
              >
                <h3 className="font-black text-violet-100">{option.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">
                  {option.text}
                </p>
                <button className="mt-5 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 hover:bg-slate-200">
                  Elegir esta publicación
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="mb-8 rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
              Contenido adaptado al sector: {sector.name}
            </p>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
              AutonomIA prioriza ideas, tono y formatos pensados para negocios
              de hostelería. En el futuro estos tipos se cargarán desde el
              sector configurado en la empresa.
            </p>
          </div>

          <span className="w-fit rounded-full border border-cyan-300/20 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
            Preparado para sectores
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {sector.socialContentTypes.map((type) => (
            <span
              key={type}
              className="rounded-full bg-cyan-500/15 px-4 py-2 text-sm font-bold text-cyan-100"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Nueva publicación</h2>

            <p className="mt-2 text-sm text-slate-400">
              Describe lo que quieres comunicar y AutonomIA preparará varias
              opciones listas para aprobar o programar.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">
                  Tipo de contenido
                </label>

                <select className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none focus:border-violet-400">
                  <option>Menú del día</option>
                  <option>Promoción</option>
                  <option>Evento</option>
                  <option>Nuevo producto</option>
                  <option>Oferta limitada</option>
                  <option>Story rápida</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">
                  Canal principal
                </label>

                <select className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none focus:border-violet-400">
                  <option>Instagram + Facebook</option>
                  <option>Instagram</option>
                  <option>Facebook</option>
                  <option>Google Business</option>
                  <option>Story</option>
                  <option>TikTok & Shorts</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-slate-300">
                  ¿Qué quieres publicar?
                </label>

                <textarea
                  rows={5}
                  placeholder="Ej: Hoy tenemos arroz meloso con carrillada, promoción especial para el fin de semana..."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-3 block text-sm font-bold text-slate-300">
                  Tono de comunicación
                </label>

                <div className="flex flex-wrap gap-3">
                  {tones.map((tone, index) => (
                    <label
                      key={tone}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-bold ${
                        index === 0
                          ? "border-violet-400 bg-violet-500/20 text-violet-200"
                          : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tone"
                        defaultChecked={index === 0}
                        className="hidden"
                      />
                      {tone}
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center">
                <p className="font-bold">Subir imagen o vídeo</p>

                <p className="mt-2 text-sm text-slate-400">
                  Próximamente podrás subir una foto del plato, producto o
                  evento.
                </p>
              </div>
            </div>

            <button className="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)] hover:opacity-90">
              Generar 3 propuestas
            </button>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Propuestas IA</h2>

            <p className="mt-2 text-sm text-slate-400">
              Elige la versión que mejor encaje, edítala o prográmala en el
              calendario.
            </p>

            <div className="mt-6 grid gap-4">
              {aiResults.map((result) => (
                <article
                  key={result.title}
                  className="rounded-3xl border border-white/10 bg-[#0b1024] p-6"
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
                      Borrador
                    </span>

                    <span className="text-xs text-slate-500">
                      {result.channel}
                    </span>
                  </div>

                  <h3 className="text-xl font-black">{result.title}</h3>

                  <p className="mt-4 leading-7 text-slate-300">
                    {result.text}
                  </p>

                  <p className="mt-4 text-sm text-violet-300">
                    #BarLaPlaza #TapasSevilla #ComerEnSevilla #MenuDelDia
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-500/30">
                      Aprobar
                    </button>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                      Editar
                    </button>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                      Programar
                    </button>

                    <button className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-500/20">
                      Rechazar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black">
                  Cola de publicaciones
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Próximas publicaciones preparadas por AutonomIA.
                </p>
              </div>

              <Link
                href="/dashboard/calendario"
                className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold hover:bg-white/10"
              >
                Ver calendario completo
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {scheduledPosts.map((post) => (
                <div
                  key={post.title}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-[#0b1024] p-4 md:flex-row md:items-center"
                >
                  <div>
                    <p className="font-bold">{post.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{post.date}</p>
                  </div>

                  <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">Rendimiento SocialIA</h3>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#0b1024] p-4">
                <p className="text-sm text-slate-400">Publicadas</p>
                <p className="mt-1 text-3xl font-black">18</p>
              </div>

              <div className="rounded-2xl bg-[#0b1024] p-4">
                <p className="text-sm text-slate-400">Pendientes</p>
                <p className="mt-1 text-3xl font-black">6</p>
              </div>

              <div className="rounded-2xl bg-[#0b1024] p-4">
                <p className="text-sm text-slate-400">Programadas</p>
                <p className="mt-1 text-3xl font-black">5</p>
              </div>

              <div className="rounded-2xl bg-[#0b1024] p-4">
                <p className="text-sm text-slate-400">Ideas IA</p>
                <p className="mt-1 text-3xl font-black">12</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6">
            <h3 className="text-xl font-black text-cyan-300">
              Mini calendario editorial
            </h3>

            <div className="mt-5 grid grid-cols-7 gap-2">
              {miniCalendar.map((day) => (
                <div
                  key={day.day}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] p-3 text-center"
                >
                  <p className="text-xs font-bold text-slate-400">{day.day}</p>

                  <p
                    className={`mt-2 text-lg font-black ${
                      day.posts > 0 ? "text-emerald-300" : "text-slate-600"
                    }`}
                  >
                    {day.posts}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard/calendario"
              className="mt-5 block rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-slate-950 hover:bg-slate-200"
            >
              Abrir calendario
            </Link>
          </div>

          <div className="rounded-[2rem] border border-violet-400/30 bg-violet-500/10 p-6">
            <h3 className="text-xl font-black">
              Ideas sugeridas por IA
            </h3>

            <div className="mt-5 space-y-3">
              {aiIdeas.map((idea) => (
                <div
                  key={idea}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <p className="text-sm font-bold text-slate-300">{idea}</p>

                  <button className="mt-3 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold hover:bg-white/10">
                    Generar desde esta idea
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">Historial</h3>

            <div className="mt-5 space-y-3">
              {postHistory.map((post) => (
                <div
                  key={post.title}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold">{post.title}</p>
                    <span className="text-xs text-slate-500">{post.date}</span>
                  </div>

                  <p className="mt-2 text-sm text-slate-400">{post.status}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
