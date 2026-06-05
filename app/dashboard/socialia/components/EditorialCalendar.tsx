"use client";

import { useMemo, useState } from "react";
import { schedulePostFormAction } from "@/lib/data/posts";
import type { Post, PostStatus } from "@/types/database";

type CalendarView = "month" | "week";

type EditorialCalendarProps = {
  posts: Post[];
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

const statusLabels: Record<PostStatus, string> = {
  draft: "Draft",
  pending_approval: "Pending",
  approved: "Approved",
  scheduled: "Scheduled",
  published_simulated: "Published simulated",
  canceled: "Canceled",
  archived: "Archived",
};

const statusStyles: Record<PostStatus, string> = {
  draft: "border-slate-200 bg-slate-50 text-slate-700",
  pending_approval: "border-amber-200 bg-amber-50 text-amber-800",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  scheduled: "border-violet-200 bg-violet-50 text-violet-800",
  published_simulated: "border-cyan-200 bg-cyan-50 text-cyan-800",
  canceled: "border-rose-200 bg-rose-50 text-rose-800",
  archived: "border-slate-200 bg-white text-slate-600",
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

function postDate(post: Post) {
  return new Date(post.scheduled_at ?? post.created_at);
}

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

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(value: string | null | undefined) {
  if (!value) return "Sin hora";

  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function buildMonthDays(date: Date) {
  const firstDay = startOfMonth(date);
  const gridStart = startOfWeek(firstDay);

  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

function CalendarPostCard({ post }: { post: Post }) {
  return (
    <article
      className={`rounded-2xl border p-3 ${statusStyles[post.status]}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-black uppercase">
          {statusLabels[post.status]}
        </span>
        {post.is_demo ? (
          <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-black uppercase text-amber-800">
            Demo
          </span>
        ) : null}
      </div>
      <h4 className="mt-2 text-sm font-black">{post.title}</h4>
      <p className="mt-1 text-xs opacity-80">
        {channelLabel(post.channels, post.channel)} · {formatTime(post.scheduled_at)}
      </p>

      <form action={schedulePostFormAction} className="mt-3 grid gap-2">
        <input type="hidden" name="postId" value={post.id} />
        <input
          type="datetime-local"
          name="scheduledAt"
          defaultValue={toDateTimeLocal(post.scheduled_at)}
          className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
        />
        <button className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-2 text-xs font-black text-white hover:opacity-90">
          Reprogramar
        </button>
      </form>
    </article>
  );
}

export function EditorialCalendar({ posts }: EditorialCalendarProps) {
  const [view, setView] = useState<CalendarView>("month");
  const [cursorDate, setCursorDate] = useState(() => new Date());

  const visibleDays = useMemo(() => {
    if (view === "week") {
      const first = startOfWeek(cursorDate);
      return Array.from({ length: 7 }, (_, index) => addDays(first, index));
    }

    return buildMonthDays(cursorDate);
  }, [cursorDate, view]);

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
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-700">
            Calendario editorial
          </p>
          <h2 className="mt-3 text-2xl font-black capitalize">
            {formatMonth(cursorDate)}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Organiza publicaciones internas antes de conectar redes reales.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex rounded-2xl border border-slate-200 bg-[#F8FAFF] p-1">
            {(["month", "week"] as CalendarView[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setView(option)}
                className={`rounded-xl px-4 py-2 text-sm font-bold ${
                  view === option
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                {option === "month" ? "Mensual" : "Semanal"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={movePrevious}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={moveNext}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {view === "month" ? (
        <div className="mt-6 grid gap-2 overflow-x-auto pb-2">
          <div className="grid min-w-[920px] grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFF] px-3 py-2 text-center text-xs font-black uppercase tracking-[0.14em] text-slate-500"
              >
                {day.slice(0, 3)}
              </div>
            ))}

            {visibleDays.map((day) => {
              const dayPosts = posts.filter((post) =>
                sameDay(postDate(post), day),
              );
              const isCurrentMonth = day.getMonth() === cursorDate.getMonth();

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[150px] rounded-2xl border border-slate-200 p-3 ${
                    isCurrentMonth ? "bg-white" : "bg-slate-50 opacity-70"
                  }`}
                >
                  <p className="text-sm font-black text-slate-900">
                    {day.getDate()}
                  </p>

                  <div className="mt-3 space-y-2">
                    {dayPosts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        className={`rounded-xl border px-2 py-2 text-xs ${statusStyles[post.status]}`}
                      >
                        <div className="flex items-center gap-1">
                          <span className="truncate font-black">
                            {post.title}
                          </span>
                          {post.is_demo ? (
                            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-black text-amber-800">
                              Demo
                            </span>
                          ) : null}
                        </div>
                        <span className="mt-1 block text-[10px] opacity-80">
                          {statusLabels[post.status]}
                        </span>
                      </div>
                    ))}

                    {dayPosts.length > 3 ? (
                      <p className="text-xs font-bold text-slate-500">
                        +{dayPosts.length - 3} más
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-7">
          {visibleDays.map((day, index) => {
            const scheduledPosts = posts.filter(
              (post) => post.status === "scheduled" && sameDay(postDate(post), day),
            );

            return (
              <div
                key={day.toISOString()}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,0.05)]"
              >
                <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-700">
                  {weekDays[index]}
                </p>
                <p className="mt-1 text-2xl font-black">{day.getDate()}</p>

                <div className="mt-4 space-y-3">
                  {scheduledPosts.length ? (
                    scheduledPosts.map((post) => (
                      <CalendarPostCard key={post.id} post={post} />
                    ))
                  ) : (
                    <p className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
                      Sin publicaciones programadas.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {(["draft", "pending_approval", "scheduled", "published_simulated"] as PostStatus[]).map(
          (status) => (
            <span
              key={status}
              className={`rounded-full border px-3 py-1 text-xs font-black ${statusStyles[status]}`}
            >
              {statusLabels[status]}
            </span>
          ),
        )}
      </div>
    </section>
  );
}
