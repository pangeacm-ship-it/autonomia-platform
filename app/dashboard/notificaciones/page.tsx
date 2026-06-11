import { getCurrentCompany } from "@/lib/data/companies";
import {
  getCompanyNotifications,
  markAllNotificationsReadFormAction,
  markNotificationReadFormAction,
} from "@/lib/data/notifications";

const typeConfig: Record<string, { label: string; color: string }> = {
  info: { label: "Info", color: "bg-sky-500/20 text-sky-300" },
  warning: { label: "Aviso", color: "bg-amber-500/20 text-amber-300" },
  action_required: { label: "Acción", color: "bg-violet-500/20 text-violet-300" },
  billing: { label: "Facturación", color: "bg-orange-500/20 text-orange-300" },
  system: { label: "Sistema", color: "bg-slate-500/20 text-slate-300" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes}m`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `Hace ${hours}h`;

  const days = Math.floor(hours / 24);

  return days === 1 ? "Ayer" : `Hace ${days}d`;
}

export default async function NotificacionesPage() {
  const company = await getCurrentCompany();
  const notifications = await getCompanyNotifications(company.id);

  const unread = notifications.filter((n) => n.status === "unread");
  const today = notifications.filter((n) => {
    const date = new Date(n.created_at);
    const now = new Date();

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-violet-600/20 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">
          Centro de Notificaciones
        </p>

        <h1 className="mt-4 text-4xl font-black">Todo lo que ocurre en AutonomIA</h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Consulta acciones generadas por la IA, alertas importantes y actividad de los módulos.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3 mb-8">
        <div className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-6">
          <p className="text-sm text-violet-200">Sin leer</p>
          <h3 className="mt-2 text-4xl font-black">{unread.length}</h3>
        </div>

        <div className="rounded-3xl border border-sky-500/20 bg-sky-500/10 p-6">
          <p className="text-sm text-sky-200">Nuevas hoy</p>
          <h3 className="mt-2 text-4xl font-black">{today.length}</h3>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Total</p>
          <h3 className="mt-2 text-4xl font-black">{notifications.length}</h3>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h2 className="text-2xl font-black">Actividad reciente</h2>

          {unread.length > 0 ? (
            <form action={markAllNotificationsReadFormAction}>
              <input type="hidden" name="companyId" value={company.id} />
              <button
                type="submit"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10"
              >
                Marcar todo como leído
              </button>
            </form>
          ) : null}
        </div>

        {notifications.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-[#0b1024] p-5 text-sm text-slate-400">
            No hay notificaciones. La actividad aparecerá aquí cuando los módulos generen eventos.
          </p>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => {
              const config = typeConfig[item.type] ?? typeConfig.info;

              return (
                <article
                  key={item.id}
                  className={`rounded-3xl border bg-[#0b1024] p-5 transition ${
                    item.status === "unread"
                      ? "border-violet-400/20"
                      : "border-white/10 opacity-70"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${config.color}`}>
                          {config.label}
                        </span>

                        {item.status === "unread" ? (
                          <span className="h-2 w-2 rounded-full bg-violet-400" />
                        ) : null}

                        <h3 className="font-black">{item.title}</h3>
                      </div>

                      {item.body ? (
                        <p className="mt-3 text-sm leading-6 text-slate-300">{item.body}</p>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-3">
                      <span className="text-xs text-slate-500">{timeAgo(item.created_at)}</span>

                      {item.status === "unread" ? (
                        <form action={markNotificationReadFormAction}>
                          <input type="hidden" name="notificationId" value={item.id} />
                          <button
                            type="submit"
                            className="rounded-xl border border-white/10 px-3 py-1 text-xs font-bold hover:bg-white/10"
                          >
                            Marcar leída
                          </button>
                        </form>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
