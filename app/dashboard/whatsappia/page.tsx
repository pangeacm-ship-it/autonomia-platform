import AccessDeniedCard from "@/components/AccessDeniedCard";
import ModuleStatusPanel from "@/components/ModuleStatusPanel";
import { getDashboardRouteAccess } from "@/lib/auth/access-control";

const stats = [
  { label: "Conversaciones", value: "38", detail: "Últimos 30 días", color: "text-emerald-300" },
  { label: "Pendientes", value: "5", detail: "Necesitan respuesta", color: "text-amber-300" },
  { label: "Respuestas IA", value: "26", detail: "Preparadas", color: "text-violet-300" },
  { label: "Leads captados", value: "9", detail: "Desde WhatsApp", color: "text-sky-300" },
];

const conversations = [
  {
    name: "María López",
    message: "¿Tenéis mesa para 4 personas mañana?",
    status: "Pendiente",
    time: "Hace 5 min",
    intent: "Reserva",
  },
  {
    name: "Carlos Ruiz",
    message: "¿Cuál es vuestro horario hoy?",
    status: "Respondida",
    time: "Hace 20 min",
    intent: "Información",
  },
  {
    name: "Ana Gómez",
    message: "¿Podéis enviarme información sobre vuestros servicios?",
    status: "IA preparada",
    time: "Hace 1 hora",
    intent: "Lead",
  },
];

const automations = [
  "Responder horarios y ubicación",
  "Detectar solicitudes de reserva",
  "Capturar leads interesados",
  "Derivar conversaciones complejas",
];

const quickReplies = [
  "Confirmar disponibilidad",
  "Enviar horarios",
  "Solicitar número de personas",
  "Derivar a atención humana",
];

export default async function WhatsAppIAPage() {
  const access = await getDashboardRouteAccess("/dashboard/whatsappia");

  if (!access.allowed) {
    return (
      <AccessDeniedCard
        title="WhatsAppIA no está disponible en tu plan"
        reason={access.reason ?? "Este módulo requiere ampliar el plan."}
        planName={access.plan?.name}
      />
    );
  }

  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-500/10 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">
          WhatsAppIA
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Atención automática por WhatsApp
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Centraliza conversaciones, prepara respuestas con IA, detecta reservas
          y convierte consultas en oportunidades comerciales.
        </p>
      </div>

      <ModuleStatusPanel
        moduleName="WhatsAppIA"
        status="Requiere conexión"
        description="WhatsAppIA está preparado como módulo profesional, pero las respuestas reales necesitan conectar WhatsApp Business API antes de activar automatizaciones externas."
        capabilities={[
          "Centralizar conversaciones de clientes.",
          "Preparar respuestas con IA antes de enviarlas.",
          "Detectar reservas, leads y consultas habituales.",
        ]}
        requirements={[
          "Cuenta de WhatsApp Business API.",
          "Plantillas y permisos de mensajería aprobados.",
          "Revisión humana antes de activar automatizaciones reales.",
        ]}
        nextSteps={[
          "Revisar el plan y las herramientas incluidas.",
          "Conectar WhatsApp cuando la integración esté activa.",
          "Mantener por ahora la bandeja como vista simulada interna.",
        ]}
      />

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-4xl font-black">{stat.value}</p>
            <p className={`mt-3 text-sm ${stat.color}`}>{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black">Bandeja de conversaciones</h2>
                <p className="mt-2 text-sm text-slate-400">
                  WhatsAppIA clasifica cada conversación y sugiere la mejor respuesta.
                </p>
              </div>

              <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300">
                IA preparada
              </span>
            </div>

            <div className="space-y-4">
              {conversations.map((chat) => (
                <article
                  key={chat.name}
                  className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black">{chat.name}</h3>

                        <span className="text-xs text-slate-500">{chat.time}</span>

                        <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-300">
                          {chat.intent}
                        </span>
                      </div>

                      <p className="mt-4 text-slate-300">{chat.message}</p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        chat.status === "Respondida"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : chat.status === "IA preparada"
                            ? "bg-violet-500/20 text-violet-300"
                            : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {chat.status}
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                    <p className="text-sm font-black text-emerald-300">
                      Respuesta sugerida por IA
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Hola {chat.name.split(" ")[0]}, gracias por contactar con
                      nuestro negocio. Podemos ayudarte con disponibilidad,
                      horarios o reservas. ¿Para qué día y cuántas personas
                      necesitas?
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-500/30">
                      Enviar respuesta
                    </button>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                      Editar
                    </button>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                      Crear lead
                    </button>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                      Crear reserva
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Respuestas rápidas</h2>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] p-4 text-left text-sm font-bold text-slate-300 hover:bg-white/10"
                >
                  ✦ {reply}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-amber-400/20 bg-amber-500/10 p-6">
            <p className="text-sm text-amber-200">Estado conexión</p>

            <h3 className="mt-2 text-3xl font-black">Pendiente</h3>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Requiere conectar WhatsApp Business API para activar respuestas
              automáticas reales.
            </p>

            <button className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 hover:bg-slate-200">
              Conectar WhatsApp
            </button>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
            <h3 className="text-xl font-black text-emerald-300">
              Automatizaciones
            </h3>

            <div className="mt-5 space-y-3">
              {automations.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-black/20 p-4 text-sm font-bold text-slate-300"
                >
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6">
            <h3 className="text-xl font-black text-cyan-300">
              Horario de atención
            </h3>

            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p>✓ Lunes a viernes · 08:00 - 16:30</p>
              <p>✓ Sábado · 09:00 - 17:00</p>
              <p>✓ Fuera de horario: respuesta automática</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-violet-400/30 bg-violet-500/10 p-6">
            <h3 className="text-xl font-black">Recomendación IA</h3>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Activa respuestas automáticas para horarios, ubicación y reservas.
              Son las consultas más frecuentes y pueden resolverse sin
              intervención humana.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
