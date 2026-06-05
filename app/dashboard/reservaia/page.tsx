import AccessDeniedCard from "@/components/AccessDeniedCard";
import ModuleStatusPanel from "@/components/ModuleStatusPanel";
import { getDashboardRouteAccess } from "@/lib/auth/access-control";

const stats = [
  {
    label: "Reservas",
    value: "42",
    detail: "Este mes",
    color: "text-cyan-300",
  },
  {
    label: "Confirmadas",
    value: "35",
    detail: "83% del total",
    color: "text-emerald-300",
  },
  {
    label: "Pendientes",
    value: "5",
    detail: "Requieren acción",
    color: "text-amber-300",
  },
  {
    label: "Canceladas",
    value: "2",
    detail: "Últimos 30 días",
    color: "text-red-300",
  },
];

const reservations = [
  {
    client: "Mesa 4 personas",
    date: "Hoy · 21:00",
    channel: "WhatsApp",
    status: "Confirmada",
    people: 4,
  },
  {
    client: "Cumpleaños 12 personas",
    date: "Sábado · 14:30",
    channel: "Web",
    status: "Pendiente",
    people: 12,
  },
  {
    client: "Cena empresa 18 personas",
    date: "15 Junio · 22:00",
    channel: "Instagram",
    status: "Confirmada",
    people: 18,
  },
];

const reminders = [
  "Enviar recordatorio 24h antes",
  "Confirmar asistencia automáticamente",
  "Solicitar número final de asistentes",
  "Detectar posibles cancelaciones",
];

const sectorBookingExamples = [
  { sector: "Restaurantes", label: "Reservas de mesa" },
  { sector: "Peluquerías", label: "Citas" },
  { sector: "Clínicas", label: "Consultas" },
  { sector: "Inmobiliarias", label: "Visitas" },
  { sector: "Comercio", label: "Opcional / desactivable" },
];

export default async function ReservaIAPage() {
  const access = await getDashboardRouteAccess("/dashboard/reservaia");

  if (!access.allowed) {
    return (
      <AccessDeniedCard
        title="ReservaIA no está disponible en tu plan"
        reason={access.reason ?? "Este módulo requiere ampliar el plan."}
        planName={access.plan?.name}
      />
    );
  }

  return (
    <section className="p-4 sm:p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-violet-500/10 p-6 lg:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">
          ReservaIA
        </p>

        <h1 className="mt-4 text-3xl font-black sm:text-4xl">
          Gestión inteligente de reservas
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Centraliza reservas procedentes de WhatsApp, Instagram, Google
          Business y formularios para evitar pérdidas y aumentar ocupación.
        </p>
      </div>

      <ModuleStatusPanel
        moduleName="ReservaIA"
        status="Requiere configuración"
        description="ReservaIA está diseñado para negocios con citas, mesas, visitas o reservas. Antes de automatizar necesita definir disponibilidad, reglas y canales de entrada."
        capabilities={[
          "Organizar reservas y citas por estado.",
          "Preparar recordatorios y confirmaciones.",
          "Adaptar el lenguaje al sector de la empresa.",
        ]}
        requirements={[
          "Horario de negocio configurado.",
          "Tipo de reserva definido por sector.",
          "Canal de recepción conectado en una fase posterior.",
        ]}
        nextSteps={[
          "Revisar ejemplos por sector.",
          "Configurar empresa y horario.",
          "Activar conexión real cuando esté lista.",
        ]}
      />

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
          >
            <p className="text-sm text-slate-400">
              {stat.label}
            </p>

            <p className="mt-2 text-3xl font-black sm:text-4xl">
              {stat.value}
            </p>

            <p className={`mt-3 text-sm ${stat.color}`}>
              {stat.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-[2rem] border border-violet-400/20 bg-violet-500/10 p-6">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-200">
              ReservaIA se adapta al tipo de negocio
            </p>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
              La misma base de reservas puede hablar de mesas, citas,
              consultas, visitas o desactivarse según el sector configurado en
              la empresa.
            </p>
          </div>

          <span className="w-fit rounded-full border border-violet-300/20 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-violet-200">
            Simulado
          </span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {sectorBookingExamples.map((item) => (
            <article
              key={item.sector}
              className="rounded-2xl border border-white/10 bg-[#0b1024] p-4"
            >
              <p className="text-sm font-bold text-slate-400">{item.sector}</p>
              <p className="mt-2 font-black text-violet-100">{item.label}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
                    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black">
                  Próximas reservas
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Reservas detectadas y organizadas por AutonomIA.
                </p>
              </div>

              <span className="rounded-full bg-cyan-500/20 px-4 py-2 text-sm font-bold text-cyan-300">
                {reservations.length} próximas
              </span>
            </div>

            <div className="space-y-4">
              {reservations.map((reservation) => (
                <article
                  key={`${reservation.client}-${reservation.date}`}
                  className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <h3 className="text-xl font-black">
                        {reservation.client}
                      </h3>

                      <p className="mt-2 text-slate-300">
                        {reservation.date}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300">
                          {reservation.channel}
                        </span>

                        <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
                          {reservation.people} personas
                        </span>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        reservation.status === "Confirmada"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
                    <p className="text-sm font-black text-cyan-300">
                      Acción sugerida por IA
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Confirmar la reserva, enviar recordatorio automático y
                      solicitar cualquier detalle pendiente antes de la fecha.
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-500/30">
                      Confirmar
                    </button>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                      Modificar
                    </button>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                      Enviar recordatorio
                    </button>

                    <button className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-500/20">
                      Cancelar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
                    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">
              Disponibilidad de la semana
            </h2>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              {["Hoy", "Viernes", "Sábado", "Domingo"].map((day, index) => (
                <div
                  key={day}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <p className="font-bold">{day}</p>
                  <p
                    className={`mt-2 text-sm ${
                      index === 2 ? "text-amber-300" : "text-emerald-300"
                    }`}
                  >
                    {index === 2 ? "Alta demanda" : "Disponible"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-cyan-500/20 bg-cyan-500/10 p-6">
            <h3 className="text-xl font-black text-cyan-300">
              Automatizaciones
            </h3>

            <div className="mt-5 space-y-3">
              {reminders.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-black/20 p-4 text-sm font-bold text-slate-300"
                >
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">
              Canales de entrada
            </h3>

            <div className="mt-5 space-y-3">
              {["WhatsApp", "Instagram", "Google Business", "Web"].map(
                (channel) => (
                  <div
                    key={channel}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                  >
                    <p className="font-bold">{channel}</p>
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                      Activo
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-400/20 bg-amber-500/10 p-6">
            <h3 className="text-xl font-black">
              Recomendación IA
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Los sábados concentran mayor demanda. Activa recordatorios
              automáticos y confirmación previa para reducir cancelaciones de
              última hora.
            </p>
          </div>

          <button className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 font-bold shadow-[0_0_35px_rgba(14,165,233,0.25)]">
            Configurar reservas
          </button>
        </aside>
      </div>
    </section>
  );
}
