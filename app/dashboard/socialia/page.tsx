import Link from "next/link";
import { defaultBusinessSector } from "@/lib/business-sectors";
import { getCurrentDashboardAccess } from "@/lib/auth/access-control";
import { getCurrentCompany } from "@/lib/data/companies";
import { filterRealOperationalRecords } from "@/lib/data/demo-data";
import {
  approvePostFormAction,
  archivePostFormAction,
  cancelPostFormAction,
  getCompanyPosts,
  schedulePostFormAction,
  updatePostFormAction,
} from "@/lib/data/posts";
import { getCurrentProfileContext } from "@/lib/data/profiles";
import type { Post, PostStatus } from "@/types/database";
import { EditorialCalendar } from "./components/EditorialCalendar";
import { SocialIAComposer } from "./SocialIAComposer";

const connectedChannels = [
  { name: "Instagram", status: "Preparado" },
  { name: "Facebook", status: "Preparado" },
  { name: "Google Business", status: "Pendiente" },
  { name: "TikTok", status: "No conectado" },
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

const statusSections: {
  title: string;
  status: PostStatus;
  empty: string;
}[] = [
  { title: "Borradores", status: "draft", empty: "No hay borradores." },
  {
    title: "Pendientes",
    status: "pending_approval",
    empty: "No hay publicaciones pendientes.",
  },
  { title: "Programadas", status: "scheduled", empty: "No hay programadas." },
  {
    title: "Publicadas",
    status: "published_simulated",
    empty: "No hay publicaciones simuladas.",
  },
  { title: "Canceladas", status: "canceled", empty: "No hay canceladas." },
];

function channelLabel(channels: string[] | null | undefined, channel: string) {
  const values = channels?.length ? channels : [channel];
  const labels: Record<string, string> = {
    instagram: "Instagram",
    facebook: "Facebook",
    google_business: "Google Business",
    tiktok: "TikTok",
    youtube_shorts: "YouTube Shorts",
  };

  return values.map((value) => labels[value] ?? value).join(" + ");
}

function channelValue(channels: string[] | null | undefined, channel: string) {
  const values = channels?.length ? channels : [channel];

  if (values.includes("instagram") && values.includes("facebook")) {
    return "both";
  }

  return values[0] ?? "instagram";
}

function statusClass(status: PostStatus) {
  if (status === "draft") return "bg-slate-500/20 text-slate-300";
  if (status === "pending_approval") return "bg-amber-500/20 text-amber-300";
  if (status === "approved") return "bg-emerald-500/20 text-emerald-300";
  if (status === "scheduled") return "bg-violet-500/20 text-violet-300";
  if (status === "published_simulated") return "bg-cyan-500/20 text-cyan-300";
  if (status === "canceled") return "bg-rose-500/20 text-rose-300";
  return "bg-white/10 text-slate-300";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function startOfWeek(date: Date) {
  const value = new Date(date);
  const day = value.getDay() || 7;
  value.setHours(0, 0, 0, 0);
  value.setDate(value.getDate() - day + 1);
  return value;
}

function endOfWeek(date: Date) {
  const value = startOfWeek(date);
  value.setDate(value.getDate() + 6);
  value.setHours(23, 59, 59, 999);
  return value;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getPostsByStatus(posts: Post[], status: PostStatus) {
  return posts.filter(
    (post) => post.status === status && !post.archived_at && !post.deleted_at,
  );
}

function UpcomingPostsPanel({ posts }: { posts: Post[] }) {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekEnd = endOfWeek(now);
  const scheduledPosts = posts
    .filter((post) => post.scheduled_at)
    .sort(
      (a, b) =>
        new Date(a.scheduled_at ?? a.created_at).getTime() -
        new Date(b.scheduled_at ?? b.created_at).getTime(),
    );
  const groups = [
    {
      title: "Hoy",
      posts: scheduledPosts.filter((post) =>
        sameDay(new Date(post.scheduled_at ?? post.created_at), now),
      ),
    },
    {
      title: "Mañana",
      posts: scheduledPosts.filter((post) =>
        sameDay(new Date(post.scheduled_at ?? post.created_at), tomorrow),
      ),
    },
    {
      title: "Esta semana",
      posts: scheduledPosts.filter((post) => {
        const date = new Date(post.scheduled_at ?? post.created_at);
        return date > now && date <= weekEnd;
      }),
    },
  ];

  return (
    <section className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
            Próximas publicaciones
          </p>
          <h2 className="mt-3 text-2xl font-black">
            Agenda editorial inmediata
          </h2>
        </div>
        <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-black text-slate-300">
          {scheduledPosts.length} con fecha
        </span>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {groups.map((group) => (
          <article
            key={group.title}
            className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
          >
            <h3 className="text-lg font-black">{group.title}</h3>
            <div className="mt-4 space-y-3">
              {group.posts.length ? (
                group.posts.slice(0, 4).map((post) => (
                  <div
                    key={`${group.title}-${post.id}`}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black">{post.title}</p>
                      {post.is_demo ? (
                        <span className="rounded-full bg-amber-500/20 px-2 py-1 text-[10px] font-black uppercase text-amber-200">
                          Demo
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      {channelLabel(post.channels, post.channel)} · {post.status} ·{" "}
                      {formatDate(post.scheduled_at)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
                  Sin publicaciones programadas.
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PostCard({ post, canMarkDemo }: { post: Post; canMarkDemo: boolean }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#0b1024] p-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-black">{post.title}</h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                post.status,
              )}`}
            >
              {post.status}
            </span>
            {post.is_demo ? (
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
                Demo
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-slate-400">
            {channelLabel(post.channels, post.channel)} ·{" "}
            {post.scheduled_at ? formatDate(post.scheduled_at) : "Sin programar"}
          </p>
        </div>
      </div>

      <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">
        {post.content}
      </p>

      <details className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <summary className="cursor-pointer text-sm font-black text-violet-100">
          Editar
        </summary>

        <form action={updatePostFormAction} className="mt-4 grid gap-4">
          <input type="hidden" name="postId" value={post.id} />

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Título
            </label>
            <input
              name="title"
              defaultValue={post.title}
              required
              className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Contenido
            </label>
            <textarea
              name="content"
              defaultValue={post.content}
              rows={4}
              required
              className="w-full resize-none rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Canal
              </label>
              <select
                name="channel"
                defaultValue={channelValue(post.channels, post.channel)}
                className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="both">Ambos</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Fecha programada
              </label>
              <input
                type="datetime-local"
                name="scheduledAt"
                defaultValue={toDateTimeLocal(post.scheduled_at)}
                className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
              />
            </div>
          </div>

          {canMarkDemo ? (
            <label className="flex items-center gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3 text-sm font-bold text-amber-100">
              <input
                type="checkbox"
                name="isDemo"
                defaultChecked={Boolean(post.is_demo)}
                className="h-4 w-4"
              />
              Publicación de prueba/demo
            </label>
          ) : null}

          <button className="w-fit rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950 hover:bg-slate-200">
            Guardar cambios
          </button>
        </form>
      </details>

      <div className="mt-5 flex flex-wrap gap-3">
        {post.status === "pending_approval" || post.status === "draft" ? (
          <form action={approvePostFormAction}>
            <input type="hidden" name="postId" value={post.id} />
            <button className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-500/30">
              Aprobar
            </button>
          </form>
        ) : null}

        {post.status !== "scheduled" && post.status !== "archived" ? (
          <form action={schedulePostFormAction} className="flex flex-wrap gap-2">
            <input type="hidden" name="postId" value={post.id} />
            <input
              type="datetime-local"
              name="scheduledAt"
              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
            />
            <button className="rounded-xl bg-violet-500/20 px-4 py-2 text-sm font-bold text-violet-300 hover:bg-violet-500/30">
              Programar
            </button>
          </form>
        ) : null}

        {post.status !== "canceled" && post.status !== "archived" ? (
          <form action={cancelPostFormAction}>
            <input type="hidden" name="postId" value={post.id} />
            <button className="rounded-xl bg-rose-500/10 px-4 py-2 text-sm font-bold text-rose-300 hover:bg-rose-500/20">
              Cancelar
            </button>
          </form>
        ) : null}

        <form action={archivePostFormAction}>
          <input type="hidden" name="postId" value={post.id} />
          <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
            Archivar
          </button>
        </form>
      </div>
    </article>
  );
}

export default async function SocialIAPage() {
  const [company, access, profileContext] = await Promise.all([
    getCurrentCompany(),
    getCurrentDashboardAccess(),
    getCurrentProfileContext(),
  ]);
  const posts = await getCompanyPosts(company.id);
  const realPosts = filterRealOperationalRecords(posts);
  const weekStart = startOfWeek(new Date());
  const weeklyRealPosts = realPosts.filter(
    (post) => new Date(post.created_at) >= weekStart,
  );
  const isFreePlan = access.planKey === "gratuito";
  const remainingFreePosts = Math.max(2 - weeklyRealPosts.length, 0);
  const freeLimitReached = isFreePlan && remainingFreePosts <= 0;
  const calendarPosts = posts.filter((post) => !post.archived_at && !post.deleted_at);
  const canMarkDemo =
    profileContext.isFallback || profileContext.primaryRole === "superadmin";
  const sector = defaultBusinessSector;

  const summaryItems = [
    { label: "Publicaciones creadas", value: realPosts.length },
    { label: "Programadas", value: getPostsByStatus(realPosts, "scheduled").length },
    {
      label: "Pendientes",
      value: getPostsByStatus(realPosts, "pending_approval").length,
    },
    {
      label: "Publicadas",
      value: getPostsByStatus(realPosts, "published_simulated").length,
    },
  ];

  return (
    <section className="p-4 sm:p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-6 lg:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          SocialIA
        </p>

        <div className="mt-5 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">
              Publicaciones internas de AutonomIA
            </h1>

            <p className="mt-4 max-w-3xl text-slate-300">
              Crea, guarda, edita, aprueba y programa publicaciones dentro de
              AutonomIA. Todavía no se publica en Instagram, Facebook ni Meta.
            </p>
          </div>

          <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-300">
            Fase 1A interna
          </span>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
          >
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-2 text-3xl font-black">{item.value}</p>
          </div>
        ))}
      </div>

      <UpcomingPostsPanel posts={calendarPosts} />

      <div className="mb-8">
        <EditorialCalendar posts={calendarPosts} />
      </div>

      <div className="mb-8 rounded-[2rem] border border-blue-100 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">
              Calendario Inteligente
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">
              SocialIA crea contenido, Calendario organiza todo
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Usa esta pantalla para crear y aprobar publicaciones. Para ver la
              planificación completa del negocio, revisa publicaciones,
              recomendaciones, tareas y reservas en el calendario central.
            </p>
          </div>

          <Link
            href="/dashboard/calendario"
            className="w-fit rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-black text-white shadow-[0_12px_35px_rgba(79,70,229,0.22)] hover:opacity-90"
          >
            Ver planificación completa
          </Link>
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
                channel.status === "Preparado"
                  ? "text-emerald-300"
                  : "text-amber-300"
              }`}
            >
              {channel.status}
            </p>
          </div>
        ))}
      </div>

      {isFreePlan ? (
        <div className="mb-8 grid gap-6 xl:grid-cols-[360px_1fr]">
          <section className="rounded-[2rem] border border-emerald-400/20 bg-emerald-500/10 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
              Modo Gratuito
            </p>
            <h2 className="mt-4 text-4xl font-black">
              2 publicaciones disponibles esta semana
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Has usado {weeklyRealPosts.length} de 2 publicaciones reales. Las
              publicaciones demo, archivadas o eliminadas no cuentan en consumo
              ni métricas reales.
            </p>
            {freeLimitReached ? (
              <p className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm font-bold text-amber-100">
                Has alcanzado el límite semanal del plan Gratuito.
              </p>
            ) : (
              <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-bold text-emerald-100">
                Te quedan {remainingFreePosts} publicaciones reales esta semana.
              </p>
            )}
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
                  semana. Este bloque sigue siendo visual hasta conectar redes.
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
      ) : null}

      <div className="mb-8 rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
          Contenido adaptado al sector: {sector.name}
        </p>
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
          <SocialIAComposer
            companyId={company.id}
            canCreate={!freeLimitReached}
            canMarkDemo={canMarkDemo}
          />

          {statusSections.map((section) => {
            const sectionPosts = getPostsByStatus(posts, section.status);

            return (
              <section
                key={section.status}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <h2 className="text-2xl font-black">{section.title}</h2>
                  <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-black text-slate-300">
                    {sectionPosts.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {sectionPosts.length ? (
                    sectionPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        canMarkDemo={canMarkDemo}
                      />
                    ))
                  ) : (
                    <div className="rounded-3xl border border-white/10 bg-[#0b1024] p-5 text-sm text-slate-300">
                      {section.empty}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Métricas internas</h2>
            <div className="mt-5 grid gap-3">
              {[
                { label: "Reales operativas", value: realPosts.length },
                {
                  label: "Demo/prueba",
                  value: posts.filter((post) => post.is_demo).length,
                },
                {
                  label: "Archivadas",
                  value: posts.filter((post) => post.archived_at).length,
                },
                { label: "Esta semana", value: weeklyRealPosts.length },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className="font-black">{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-amber-400/20 bg-amber-500/10 p-6">
            <h2 className="text-xl font-black">Sin publicación externa</h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Las publicaciones se guardan, aprueban y programan dentro de
              AutonomIA. Meta, Instagram, Facebook y OpenAI siguen sin conexión
              en esta fase.
            </p>
          </section>
        </aside>
      </div>
    </section>
  );
}
