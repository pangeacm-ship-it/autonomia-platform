import Link from "next/link";

type ModuleStatusPanelProps = {
  moduleName: string;
  status: string;
  description: string;
  capabilities: string[];
  requirements: string[];
  nextSteps: string[];
};

export default function ModuleStatusPanel({
  moduleName,
  status,
  description,
  capabilities,
  requirements,
  nextSteps,
}: ModuleStatusPanelProps) {
  return (
    <section className="mb-8 rounded-[2rem] border border-blue-100 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] lg:p-8">
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">
            Estado del módulo
          </p>
          <h2 className="mt-3 text-2xl font-black text-slate-950 md:text-3xl">
            {moduleName}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>

        <span className="w-fit rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-violet-800">
          {status}
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-[#F8FAFF] p-5">
          <h3 className="font-black text-slate-950">Qué hará este módulo</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            {capabilities.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-[#F8FAFF] p-5">
          <h3 className="font-black text-slate-950">Requisitos</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            {requirements.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-[#F8FAFF] p-5">
          <h3 className="font-black text-slate-950">Próximos pasos</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            {nextSteps.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/dashboard/modulos"
          className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-black text-white shadow-[0_12px_35px_rgba(79,70,229,0.22)] hover:opacity-90"
        >
          Ver módulos
        </Link>
        <Link
          href="/dashboard/suscripcion"
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-blue-50"
        >
          Revisar plan
        </Link>
      </div>
    </section>
  );
}
