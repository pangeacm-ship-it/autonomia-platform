import { businessSectors } from "@/lib/business-sectors";

const prioritySectorKeys = [
  "hosteleria",
  "belleza",
  "salud",
  "profesionales",
  "comercio",
  "inmobiliaria",
  "automocion",
  "formacion",
];

const sectorDisplayNames: Record<string, string> = {
  hosteleria: "Hostelería",
  belleza: "Belleza y estética",
  salud: "Salud y clínicas",
  profesionales: "Profesionales",
  comercio: "Comercio local",
  inmobiliaria: "Inmobiliarias",
  automocion: "Automoción",
  formacion: "Formación",
};

const prioritySectors = prioritySectorKeys
  .map((key) => businessSectors.find((sector) => sector.key === key))
  .filter((sector) => Boolean(sector));

export default function Industries() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-300">
            Sectores
          </p>

          <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">
            AutonomIA se adapta a cada negocio local.
          </h2>
        </div>

        <p className="text-lg leading-8 text-slate-400">
          La misma plataforma cambia ejemplos, lenguaje y módulos recomendados
          según el sector: contenido para redes, reservas, citas, visitas,
          reseñas y seguimiento comercial.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {prioritySectors.map((sector) => {
          if (!sector) {
            return null;
          }

          return (
            <article
              key={sector.key}
              className="flex h-full flex-col rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.07]"
            >
              <div className="mb-5">
                <span className="rounded-full bg-violet-500/20 px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-violet-200">
                  {sectorDisplayNames[sector.key]}
                </span>
              </div>

              <h3 className="text-2xl font-black">{sector.name}</h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {sector.description}
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b1024] p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  SocialIA
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sector.socialContentTypes.slice(0, 4).map((type) => (
                    <span
                      key={type}
                      className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-100"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Reservas / citas
                </p>
                <p className="mt-3 text-sm font-bold text-slate-200">
                  {sector.bookingLabel}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  También prepara seguimiento para {sector.leadLabel.toLowerCase()}.
                </p>
              </div>

              <div className="mt-4 flex-1 rounded-2xl border border-white/10 bg-[#0b1024] p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
                  Módulos recomendados
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sector.compatibleModules.slice(0, 5).map((module) => (
                    <span
                      key={module}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300"
                    >
                      {module}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 rounded-[2rem] border border-violet-400/20 bg-gradient-to-r from-blue-600/15 via-violet-600/15 to-cyan-500/10 p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-2xl font-black">
              Primero sectores con dolor diario.
            </h3>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
              Hostelería, belleza, salud e inmobiliarias son los primeros
              sectores recomendados para vender AutonomIA porque combinan
              contenido frecuente, reseñas, reservas o leads.
            </p>
          </div>

          <span className="w-fit rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-950">
            MVP comercial
          </span>
        </div>
      </div>
    </section>
  );
}
