"use client";

import { useMemo, useState } from "react";
import type { Post } from "@/types/database";

type CalendarView = "month" | "week";

type CalendarFilter =
  | "all"
  | "instagram"
  | "facebook"
  | "google_business"
  | "whatsapp"
  | "tiktok"
  | "reservations"
  | "elena"
  | "tasks"
  | "demo";

type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  date: Date;
  source: CalendarFilter;
  sourceLabel: string;
  status: string;
  isDemo?: boolean;
  kind: "post" | "recommendation" | "task" | "reservation" | "event";
};

const weekDays = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const filters: { key: CalendarFilter; label: string }[] = [
  { key: "all", label: "Todo" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "google_business", label: "Google Business" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "tiktok", label: "TikTok" },
  { key: "reservations", label: "Reservas/Citas" },
  { key: "elena", label: "Elena IA" },
  { key: "tasks", label: "Tareas" },
  { key: "demo", label: "Demo" },
];

const sourceLabels: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  google_business: "Google Business",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
};

const statusLabels: Record<string, string> = {
  pending_approval: "Pendiente",
  approved: "Aprobada",
  scheduled: "Programada",
  draft: "Borrador",
  published_simulated: "Publicada simulada",
};

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfWeek(date: Date) {
  const value = new Date(date);
  const day = value.getDay() || 7;
  value.setHours(0, 0, 0, 0);
  value.setDate(value.getDate() - day + 1);
  return value;
}

function addDays(date: Date, days: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

function addMonths(date: Date, months: number) {
  const value = new Date(date);
  value.setMonth(value.getMonth() + months);
  return value;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildMonthDays(date: Date) {
  const firstDay = startOfMonth(date);
  const gridStart = startOfWeek(firstDay);

  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

function postToEvents(post: Post): CalendarEvent[] {
  if (!post.scheduled_at) return [];

  const date = new Date(post.scheduled_at);
  const channels = post.channels?.length ? post.channels : [post.channel];

  return channels.map((channel) => ({
    id: `${post.id}-${channel}`,
    title: post.title,
    time: formatTime(date),
    date,
    source: normalizeChannel(channel),
    sourceLabel: sourceLabels[channel] ?? channel,
    status: statusLabels[post.status] ?? post.status,
    isDemo: Boolean(post.is_demo),
    kind: "post",
  }));
}

function normalizeChannel(channel: string): CalendarFilter {
  if (channel === "google_business") return "google_business";
  if (channel === "facebook") return "facebook";
  if (channel === "tiktok" || channel === "youtube_shorts") return "tiktok";
  return "instagram";
}

function simulatedEvents(today: Date): CalendarEvent[] {
  const weekStart = startOfWeek(today);
  const values = [
    {
      id: "elena-weekly",
      title: "Recomendación de Elena IA",
      offset: 1,
      hour: 11,
      minute: 30,
      source: "elena" as const,
      sourceLabel: "Elena IA",
      status: "Sugerencia",
      kind: "recommendation" as const,
    },
    {
      id: "task-review",
      title: "Revisar contenidos pendientes",
      offset: 2,
      hour: 10,
      minute: 0,
      source: "tasks" as const,
      sourceLabel: "Tareas",
      status: "Pendiente",
      kind: "task" as const,
    },
    {
      id: "reservation-demo",
      title: "Reserva/cita futura",
      offset: 4,
      hour: 18,
      minute: 15,
      source: "reservations" as const,
      sourceLabel: "Reservas/Citas",
      status: "Simulada",
      kind: "reservation" as const,
    },
    {
      id: "whatsapp-followup",
      title: "Seguimiento WhatsApp",
      offset: 5,
      hour: 12,
      minute: 45,
      source: "whatsapp" as const,
      sourceLabel: "WhatsApp",
      status: "Visual",
      kind: "event" as const,
    },
  ];

  return values.map((event) => {
    const date = addDays(weekStart, event.offset);
    date.setHours(event.hour, event.minute, 0, 0);

    return {
      id: event.id,
      title: event.title,
      time: formatTime(date),
      date,
      source: event.source,
      sourceLabel: event.sourceLabel,
      status: event.status,
      kind: event.kind,
    };
  });
}

function eventStyle(event: CalendarEvent) {
  const styles: Record<CalendarFilter, string> = {
    all: "border-slate-200 bg-slate-50 text-slate-700",
    instagram: "border-violet-200 bg-violet-50 text-violet-800",
    facebook: "border-blue-200 bg-blue-50 text-blue-800",
    google_business: "border-emerald-200 bg-emerald-50 text-emerald-800",
    whatsapp: "border-green-200 bg-green-50 text-green-800",
    tiktok: "border-pink-200 bg-pink-50 text-pink-800",
    reservations: "border-amber-200 bg-amber-50 text-amber-800",
    elena: "border-cyan-200 bg-cyan-50 text-cyan-800",
    tasks: "border-slate-200 bg-white text-slate-700",
    demo: "border-amber-200 bg-amber-50 text-amber-800",
  };

  return event.isDemo ? styles.demo : styles[event.source];
}

function EventCard({ event, compact = false }: { event: CalendarEvent; compact?: boolean }) {
  return (
    <article className={`rounded-2xl border p-3 ${eventStyle(event)}`}>
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase">
        <span>{event.time}</span>
        <span>{event.sourceLabel}</span>
        {event.isDemo ? (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-800">
            Demo
          </span>
        ) : null}
      </div>
      <h3 className={`${compact ? "mt-1 text-xs" : "mt-2 text-sm"} font-black`}>
        {event.title}
      </h3>
      <p className="mt-1 text-[11px] font-bold opacity-80">{event.status}</p>
    </article>
  );
}

export function SmartCalendar({ posts }: { posts: Post[] }) {
  const [view, setView] = useState<CalendarView>("month");
  const [activeFilter, setActiveFilter] = useState<CalendarFilter>("all");
  const [cursorDate, setCursorDate] = useState(() => new Date());

  const allEvents = useMemo(() => {
    const postEvents = posts.flatMap(postToEvents);
    return [...postEvents, ...simulatedEvents(new Date())].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
  }, [posts]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return allEvents;
    if (activeFilter === "demo") return allEvents.filter((event) => event.isDemo);
    return allEvents.filter((event) => event.source === activeFilter);
  }, [activeFilter, allEvents]);

  const visibleDays = useMemo(() => {
    if (view === "week") {
      const first = startOfWeek(cursorDate);
      return Array.from({ length: 7 }, (_, index) => addDays(first, index));
    }

    return buildMonthDays(cursorDate);
  }, [cursorDate, view]);

  const summary = [
    { label: "Publicaciones", value: allEvents.filter((event) => event.kind === "post").length },
    { label: "Elena IA", value: allEvents.filter((event) => event.source === "elena").length },
    { label: "Reservas/Citas", value: allEvents.filter((event) => event.source === "reservations").length },
    { label: "Tareas", value: allEvents.filter((event) => event.source === "tasks").length },
  ];

  function movePrevious() {
    setCursorDate((current) =>
      view === "week" ? addDays(current, -7) : addMonths(current, -1),
    );
  }

  function moveNext() {
    setCursorDate((current) =>
      view === "week" ? addDays(current, 7) : addMonths(current, 1),
    );
  }

  return (
    <section className="p-4 sm:p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-blue-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-8">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">
          Calendario Inteligente
        </p>
        <div className="mt-4 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
              Centro único de planificación
            </h1>
            <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-600 sm:text-base">
              Centraliza publicaciones SocialIA, recomendaciones Elena IA,
              tareas, reservas/citas y eventos importantes en una única agenda.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setView("month")}
              className={`rounded-2xl px-5 py-3 text-sm font-black ${
                view === "month"
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_12px_35px_rgba(79,70,229,0.22)]"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              }`}
            >
              Mes
            </button>
            <button
              type="button"
              onClick={() => setView("week")}
              className={`rounded-2xl px-5 py-3 text-sm font-black ${
                view === "week"
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_12px_35px_rgba(79,70,229,0.22)]"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              }`}
            >
              Semana
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)]"
          >
            <p className="text-sm font-bold text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`rounded-full px-4 py-2 text-xs font-black transition ${
                activeFilter === filter.key
                  ? "bg-slate-950 text-white"
                  : "border border-slate-200 bg-[#F8FAFF] text-slate-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 bg-[#F8FAFF] p-5 xl:flex-row xl:items-center">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={movePrevious}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-blue-50"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setCursorDate(new Date())}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-blue-50"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={moveNext}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-blue-50"
              >
                Siguiente
              </button>
            </div>

            <h2 className="text-2xl font-black capitalize text-slate-950">
              {view === "month"
                ? formatMonth(cursorDate)
                : `Semana del ${visibleDays[0]?.getDate()} al ${visibleDays[6]?.getDate()} de ${formatMonth(cursorDate)}`}
            </h2>
          </div>

          {view === "month" ? (
            <div className="overflow-x-auto">
              <div className="grid min-w-[980px] grid-cols-7 border-b border-slate-200">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="border-r border-slate-200 bg-white px-4 py-3 text-center text-xs font-black uppercase tracking-[0.14em] text-slate-500 last:border-r-0"
                  >
                    {day.slice(0, 3)}
                  </div>
                ))}
              </div>

              <div className="grid min-w-[980px] grid-cols-7">
                {visibleDays.map((day) => {
                  const dayEvents = filteredEvents.filter((event) =>
                    sameDay(event.date, day),
                  );
                  const isCurrentMonth = day.getMonth() === cursorDate.getMonth();

                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-[178px] border-b border-r border-slate-200 p-3 ${
                        isCurrentMonth ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      <p className="text-sm font-black text-slate-950">
                        {day.getDate()}
                      </p>
                      <div className="mt-3 space-y-2">
                        {dayEvents.length ? (
                          dayEvents.slice(0, 4).map((event) => (
                            <EventCard key={event.id} event={event} compact />
                          ))
                        ) : (
                          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 text-center text-xs font-bold text-slate-400">
                            Sin acciones
                          </p>
                        )}
                        {dayEvents.length > 4 ? (
                          <p className="text-xs font-bold text-slate-500">
                            +{dayEvents.length - 4} más
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 p-5 lg:grid-cols-7">
              {visibleDays.map((day, index) => {
                const dayEvents = filteredEvents.filter((event) =>
                  sameDay(event.date, day),
                );

                return (
                  <article
                    key={day.toISOString()}
                    className="flex max-h-[620px] min-h-[320px] flex-col rounded-3xl border border-slate-200 bg-[#F8FAFF] p-4"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                      {weekDays[index]}
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-950">
                      {day.getDate()}
                    </p>

                    <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
                      {dayEvents.length ? (
                        dayEvents.map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))
                      ) : (
                        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-center text-xs font-bold text-slate-400">
                          Sin eventos planificados.
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <h2 className="text-xl font-black text-slate-950">
              Próximas acciones
            </h2>
            <div className="mt-5 space-y-3">
              {filteredEvents.slice(0, 6).map((event) => (
                <EventCard key={`queue-${event.id}`} event={event} />
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-cyan-200 bg-cyan-50 p-6">
            <h2 className="text-xl font-black text-cyan-900">
              Elena IA
            </h2>
            <p className="mt-3 text-sm leading-6 text-cyan-900/80">
              Las recomendaciones son simuladas por ahora. Cuando Elena IA esté
              conectada, aparecerán sugerencias reales según objetivos, sector y
              actividad de la empresa.
            </p>
          </section>
        </aside>
      </div>
    </section>
  );
}
