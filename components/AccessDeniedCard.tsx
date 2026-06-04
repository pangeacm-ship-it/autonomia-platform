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
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-amber-400/20 bg-amber-500/10 p-8 text-white">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-200">
          Acceso limitado
        </p>
        <h1 className="mt-4 text-3xl font-black md:text-4xl">{title}</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">{reason}</p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Plan actual
          </p>
          <p className="mt-2 font-bold text-slate-200">
            {planName ?? "Plan no disponible"}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard/suscripcion"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 hover:bg-slate-200"
          >
            Ver planes
          </Link>
          <Link
            href="/dashboard/modulos"
            className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-slate-200 hover:bg-white/10"
          >
            Solicitar ampliación
          </Link>
        </div>
      </div>
    </section>
  );
}
