import { planComparisonRows, planGuide } from "@/lib/commercial-plans";

const planColumns: {
  key: "gratuito" | "inicio" | "crecimiento" | "localIa";
  label: string;
  featured?: boolean;
}[] = [
  { key: "gratuito", label: "Gratuito" },
  { key: "inicio", label: "Inicio" },
  { key: "crecimiento", label: "Crecimiento" },
  { key: "localIa", label: "Local IA", featured: true },
] as const;

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-lg font-black text-emerald-700">
        ✓
      </span>
    );
  }

  if (value === false) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-lg font-black text-slate-400">
        x
      </span>
    );
  }

  return (
    <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">
      {value}
    </span>
  );
}

export default function PlanComparison() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
          Comparativa de planes
        </p>
        <h2 className="text-4xl font-black text-slate-950 md:text-5xl">
          Compara antes de elegir
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Una vista clara de qué incluye cada plan para empezar con el nivel
          adecuado de automatización.
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(30,41,59,0.08)]">
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[920px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F8FAFF]">
                <th className="px-5 py-5 text-left text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Función
                </th>
                {planColumns.map((plan) => (
                  <th
                    key={plan.key}
                    className={`px-5 py-5 text-center text-sm font-black uppercase tracking-[0.16em] ${
                      plan.featured ? "text-violet-700" : "text-slate-900"
                    }`}
                  >
                    {plan.label}
                    {plan.featured ? (
                      <span className="ml-2 rounded-full bg-violet-100 px-2 py-1 text-[10px] text-violet-700">
                        🏆 Completa
                      </span>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planComparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-5 py-4 text-sm font-bold text-slate-700">
                    {row.feature}
                  </td>
                  {planColumns.map((plan) => (
                    <td key={plan.key} className="px-5 py-4 text-center">
                      <FeatureValue value={row[plan.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 p-4 lg:hidden">
          {planColumns.map((plan) => (
            <article
              key={plan.key}
              className={`rounded-3xl border p-5 ${
                plan.featured
                  ? "border-violet-200 bg-violet-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h3 className="text-2xl font-black text-slate-950">
                {plan.label}
              </h3>
              {plan.featured ? (
                <p className="mt-2 text-sm font-bold text-violet-700">
                  🏆 Experiencia AutonomIA Completa
                </p>
              ) : null}
              <div className="mt-5 space-y-3">
                {planComparisonRows.map((row) => (
                  <div
                    key={`${plan.key}-${row.feature}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-3"
                  >
                    <span className="text-sm font-bold text-slate-700">
                      {row.feature}
                    </span>
                    <FeatureValue value={row[plan.key]} />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <div className="text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-600">
            ¿Qué plan es para mí?
          </p>
          <h2 className="text-3xl font-black text-slate-950 md:text-4xl">
            Elige según el momento de tu negocio
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {planGuide.map((item) => (
            <article
              key={item.plan}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(30,41,59,0.06)]"
            >
              <span className="rounded-full bg-violet-100 px-4 py-2 text-xs font-black text-violet-700">
                {item.plan}
              </span>
              <h3 className="mt-5 text-xl font-black text-slate-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
