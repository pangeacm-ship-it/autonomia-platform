"use client";

import { useState } from "react";

const days = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

const weeks = [
  [27, 28, 29, 30, 1, 2, 3],
  [4, 5, 6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30, 31],
];

const events: Record<
  number,
  { title: string; time: string; module: string; color: string }[]
> = {
  4: [{ title: "Menú del día", time: "10:00", module: "SocialIA", color: "violet" }],
  5: [{ title: "Responder reseña", time: "12:30", module: "ReviewIA", color: "emerald" }],
  7: [{ title: "Seguimiento lead", time: "17:00", module: "LeadIA", color: "sky" }],
  9: [{ title: "Promo fin de semana", time: "12:00", module: "SocialIA", color: "violet" }],
  12: [{ title: "Reserva grupo", time: "20:30", module: "ReservaIA", color: "amber" }],
  15: [
    { title: "Story ambiente", time: "18:00", module: "SocialIA", color: "violet" },
    { title: "Revisión reputación", time: "19:00", module: "InsightIA", color: "cyan" },
  ],
  22: [{ title: "Vídeo corto", time: "13:00", module: "TikTok", color: "pink" }],
};

const queue = [
  { title: "Publicación Instagram", module: "SocialIA", date: "Hoy · 10:00" },
  { title: "Respuesta a reseña Google", module: "ReviewIA", date: "Hoy · 12:30" },
  { title: "Seguimiento cliente interesado", module: "LeadIA", date: "Mañana · 17:00" },
  { title: "Reserva pendiente", module: "ReservaIA", date: "Viernes · 20:30" },
];

export default function CalendarioPage() {
  const [view, setView] = useState<"week" | "month">("month");
  const visibleWeeks = view === "month" ? weeks : [weeks[1]];

  return (
    <section className="p-6 lg:p-8">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          Calendario Pro
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Planificación inteligente de AutonomIA
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Organiza publicaciones, reseñas, leads, reservas y acciones IA desde un único calendario.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="calendar-shell">
          <div className="calendar-topbar">
            <div className="calendar-controls">
              <button onClick={() => setView("week")} className={view === "week" ? "active" : ""}>
                Semana
              </button>

              <button onClick={() => setView("month")} className={view === "month" ? "active" : ""}>
                Mes
              </button>

              <button className="nav">‹</button>
              <button className="today">Hoy</button>
              <button className="nav">›</button>
            </div>

            <h2>{view === "month" ? "mayo 2026" : "semana del 4 al 10 de mayo"}</h2>

            <div className="calendar-filters">
              <button>Tipo: todo ▾</button>
              <button>Módulo: todos ▾</button>
            </div>
          </div>

          <div className="calendar-main">
            <div className="calendar-weekdays">
              {days.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="calendar-grid">
              {visibleWeeks.map((week, weekIndex) =>
                week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`calendar-day ${
                      weekIndex === 0 && day > 20 ? "muted" : ""
                    } ${dayIndex === 0 ? "highlight" : ""}`}
                  >
                    <div className="day-number">{day}</div>

                    <div className="events">
                      {(events[day] || []).map((event, index) => (
                        <div key={`${day}-${index}`} className={`event ${event.color}`}>
                          <div className="event-time">{event.time}</div>
                          <div>{event.title}</div>
                          <span>{event.module}</span>
                        </div>
                      ))}

                      {(!events[day] || events[day].length === 0) && (
                        <div className="empty-day">Sin acciones</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">Cola de acciones IA</h3>

            <div className="mt-5 space-y-3">
              {queue.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-[#0b1024] p-4">
                  <p className="font-bold">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.date}</p>
                  <p className="mt-2 text-xs font-bold text-violet-300">{item.module}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6">
            <h3 className="text-xl font-black text-cyan-300">Leyenda</h3>

            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p>🟣 SocialIA</p>
              <p>🟢 ReviewIA</p>
              <p>🔵 LeadIA</p>
              <p>🟡 ReservaIA</p>
              <p>🩷 TikTok & Shorts</p>
              <p>🔷 InsightIA</p>
            </div>
          </div>

          <button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)]">
            Crear nueva acción
          </button>
        </aside>
      </div>

      <style>{`
        .calendar-shell {
          overflow: hidden;
          border-radius: 24px;
          background: #050816;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .calendar-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(90deg, rgba(37, 99, 235, 0.22), rgba(124, 58, 237, 0.18), rgba(14, 165, 233, 0.12));
        }

        .calendar-topbar h2 {
          font-size: 26px;
          font-weight: 900;
        }

        .calendar-controls,
        .calendar-filters {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .calendar-controls button,
        .calendar-filters button {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          color: #dbeafe;
          border-radius: 12px;
          padding: 10px 14px;
          font-weight: 800;
        }

        .calendar-controls .active {
          background: linear-gradient(90deg, #2563eb, #7c3aed);
          color: #ffffff;
          border-color: transparent;
        }

        .calendar-controls .nav {
          border: none;
          font-size: 28px;
          padding: 4px 10px;
          background: transparent;
        }

        .calendar-main {
          overflow-x: auto;
        }

        .calendar-weekdays,
        .calendar-grid {
          min-width: 1120px;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }

        .calendar-weekdays div {
          padding: 16px;
          text-align: center;
          font-weight: 900;
          color: #93c5fd;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.14em;
        }

        .calendar-day {
          min-height: ${view === "week" ? "620px" : "175px"};
          padding: 14px;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.035);
        }

        .calendar-day:nth-child(7n) {
          border-right: none;
        }

        .calendar-day.highlight {
          background: rgba(59, 130, 246, 0.08);
        }

        .calendar-day.muted {
          background: rgba(255, 255, 255, 0.015);
          color: #64748b;
        }

        .day-number {
          margin-bottom: 12px;
          font-size: 18px;
          font-weight: 900;
        }

        .events {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .event {
          border-radius: 12px;
          padding: 10px;
          font-size: 12px;
          font-weight: 800;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .event-time {
          font-size: 11px;
          opacity: 0.8;
          margin-bottom: 3px;
        }

        .event span {
          display: inline-block;
          margin-top: 6px;
          font-size: 10px;
          opacity: 0.8;
        }

        .event.violet { background: rgba(124, 58, 237, 0.2); color: #ede9fe; }
        .event.emerald { background: rgba(16, 185, 129, 0.18); color: #bbf7d0; }
        .event.sky { background: rgba(14, 165, 233, 0.18); color: #bae6fd; }
        .event.amber { background: rgba(245, 158, 11, 0.18); color: #fde68a; }
        .event.pink { background: rgba(236, 72, 153, 0.18); color: #fbcfe8; }
        .event.cyan { background: rgba(6, 182, 212, 0.18); color: #a5f3fc; }

        .empty-day {
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          border: 1px dashed rgba(255, 255, 255, 0.12);
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          text-align: center;
        }

        @media (max-width: 1100px) {
          .calendar-topbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .calendar-weekdays,
          .calendar-grid {
            min-width: 980px;
          }
        }
      `}</style>
    </section>
  );
}