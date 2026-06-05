import Link from "next/link";

type AccessDeniedCardProps = {
  title?: string;
  reason: string;
  planName?: string | null;
};

export default function AccessDeniedCard({
  title = "Módulo o página no disponible",
  reason,
  planName,
}: AccessDeniedCardProps) {
  return (
    <section className="p-6 lg:p-10">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-800">
          Acceso limitado
        </p>
        <h1 className="mt-4 text-3xl font-black md:text-4xl">{title}</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">{reason}</p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Plan actual
          </p>
          <p className="mt-2 font-bold text-slate-800">
            {planName ?? "Plan no disponible"}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard/suscripcion"
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-black text-white shadow-[0_12px_35px_rgba(79,70,229,0.22)] hover:opacity-90"
          >
            Ver planes
          </Link>
          <Link
            href="/dashboard/modulos"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-blue-50"
          >
            Solicitar ampliación
          </Link>
        </div>
      </div>
    </section>
  );
}
