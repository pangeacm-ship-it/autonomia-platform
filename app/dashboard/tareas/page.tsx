import Link from "next/link";
import { getCurrentCompany } from "@/lib/data/companies";
import {
  getCompanyTasks,
  createTaskFormAction,
  updateTaskStatusFormAction,
} from "@/lib/data/tasks";
import type { Task } from "@/types/database";

const priorityConfig = {
  urgent: { label: "Urgente", color: "bg-red-500/20 text-red-300" },
  high: { label: "Alta", color: "bg-orange-500/20 text-orange-300" },
  medium: { label: "Media", color: "bg-amber-500/20 text-amber-300" },
  low: { label: "Baja", color: "bg-slate-500/20 text-slate-300" },
};

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-amber-500/20 text-amber-300" },
  in_progress: { label: "En curso", color: "bg-sky-500/20 text-sky-300" },
  done: { label: "Completada", color: "bg-emerald-500/20 text-emerald-300" },
  canceled: { label: "Cancelada", color: "bg-slate-500/20 text-slate-400" },
};

function formatDue(dueAt: string | null) {
  if (!dueAt) return null;

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dueAt));
}

function isOverdue(task: Task) {
  if (!task.due_at || task.status === "done" || task.status === "canceled") return false;

  return new Date(task.due_at) < new Date();
}

export default async function TareasPage() {
  const company = await getCurrentCompany();
  const tasks = await getCompanyTasks(company.id);

  const pending = tasks.filter((t) => t.status === "pending");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const done = tasks.filter((t) => t.status === "done");
  const highPriority = tasks.filter(
    (t) => (t.priority === "high" || t.priority === "urgent") && t.status !== "done"
  );

  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-amber-600/20 via-violet-600/20 to-blue-500/10 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-200">
          Tareas
        </p>

        <h1 className="mt-4 text-4xl font-black">Centro de trabajo diario</h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Gestiona todas las acciones pendientes desde un único lugar.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
          <p className="text-sm text-amber-200">Pendientes</p>
          <h3 className="mt-2 text-4xl font-black">{pending.length}</h3>
        </div>

        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
          <p className="text-sm text-red-200">Alta prioridad</p>
          <h3 className="mt-2 text-4xl font-black">{highPriority.length}</h3>
        </div>

        <div className="rounded-3xl border border-sky-500/20 bg-sky-500/10 p-6">
          <p className="text-sm text-sky-200">En curso</p>
          <h3 className="mt-2 text-4xl font-black">{inProgress.length}</h3>
        </div>

        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
          <p className="text-sm text-emerald-200">Completadas</p>
          <h3 className="mt-2 text-4xl font-black">{done.length}</h3>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Task list */}
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <h2 className="text-2xl font-black">Tareas activas</h2>

              <span className="w-fit rounded-full bg-amber-500/20 px-4 py-2 text-sm font-bold text-amber-300">
                {pending.length + inProgress.length} activas
              </span>
            </div>

            {tasks.filter((t) => t.status !== "done" && t.status !== "canceled").length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-[#0b1024] p-5 text-sm text-slate-400">
                No hay tareas activas. ¡Todo al día!
              </p>
            ) : (
              <div className="space-y-4">
                {tasks
                  .filter((t) => t.status !== "done" && t.status !== "canceled")
                  .map((task) => (
                    <article
                      key={task.id}
                      className={`rounded-3xl border bg-[#0b1024] p-5 ${
                        isOverdue(task) ? "border-red-500/30" : "border-white/10"
                      }`}
                    >
                      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-black">{task.title}</h3>

                            {task.module_key ? (
                              <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
                                {task.module_key}
                              </span>
                            ) : null}

                            {isOverdue(task) ? (
                              <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-300">
                                Vencida
                              </span>
                            ) : null}
                          </div>

                          {task.description ? (
                            <p className="mt-2 text-sm text-slate-400">{task.description}</p>
                          ) : null}

                          {task.due_at ? (
                            <p className="mt-2 text-xs text-slate-500">
                              Vencimiento: {formatDue(task.due_at)}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityConfig[task.priority].color}`}>
                            {priorityConfig[task.priority].label}
                          </span>

                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusConfig[task.status].color}`}>
                            {statusConfig[task.status].label}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        {task.status === "pending" ? (
                          <form action={updateTaskStatusFormAction}>
                            <input type="hidden" name="taskId" value={task.id} />
                            <input type="hidden" name="status" value="in_progress" />
                            <button
                              type="submit"
                              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10"
                            >
                              Iniciar
                            </button>
                          </form>
                        ) : null}

                        <form action={updateTaskStatusFormAction}>
                          <input type="hidden" name="taskId" value={task.id} />
                          <input type="hidden" name="status" value="done" />
                          <button
                            type="submit"
                            className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-500/30"
                          >
                            Marcar completada
                          </button>
                        </form>

                        <form action={updateTaskStatusFormAction}>
                          <input type="hidden" name="taskId" value={task.id} />
                          <input type="hidden" name="status" value="canceled" />
                          <button
                            type="submit"
                            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-400 hover:bg-white/10"
                          >
                            Cancelar
                          </button>
                        </form>
                      </div>
                    </article>
                  ))}
              </div>
            )}
          </div>

          {/* Completed tasks */}
          {done.length > 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="mb-4 text-xl font-black text-slate-400">
                Completadas ({done.length})
              </h2>

              <div className="space-y-3">
                {done.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0b1024] p-4">
                    <p className="text-sm text-slate-400 line-through">{task.title}</p>
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                      ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Sidebar: crear tarea */}
        <aside>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="mb-5 text-xl font-black">Nueva tarea</h3>

            <form action={createTaskFormAction} className="space-y-4">
              <input type="hidden" name="companyId" value={company.id} />

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">Título</label>
                <input
                  name="title"
                  required
                  placeholder="Ej: Revisar publicaciones de esta semana"
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">Descripción (opcional)</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Detalles adicionales..."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">Prioridad</label>
                <select
                  name="priority"
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
                >
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                  <option value="low">Baja</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">Módulo (opcional)</label>
                <select
                  name="moduleKey"
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
                >
                  <option value="">Sin módulo</option>
                  <option value="SocialIA">SocialIA</option>
                  <option value="ReviewIA">ReviewIA</option>
                  <option value="LeadIA">LeadIA</option>
                  <option value="ReservaIA">ReservaIA</option>
                  <option value="Centro IA">Centro IA</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">Fecha límite (opcional)</label>
                <input
                  type="datetime-local"
                  name="dueAt"
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 font-bold hover:opacity-90"
              >
                Crear tarea
              </button>
            </form>
          </div>

          <div className="mt-6 rounded-[2rem] border border-violet-400/20 bg-violet-500/10 p-6">
            <h3 className="text-lg font-black text-violet-200">Accesos rápidos</h3>

            <div className="mt-4 space-y-2">
              {[
                { label: "Ir a SocialIA", href: "/dashboard/socialia" },
                { label: "Ir a Centro IA", href: "/dashboard/centro-ia" },
                { label: "Ver notificaciones", href: "/dashboard/notificaciones" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl border border-white/10 px-4 py-3 text-sm font-bold hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
