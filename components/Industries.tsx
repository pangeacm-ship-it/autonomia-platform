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
  belleza: "Belleza",
  salud: "Salud",
  profesionales: "Profesionales",
  comercio: "Comercio local",
  inmobiliaria: "Inmobiliaria",
  automocion: "Automoción",
  formacion: "Formación",
};

const sectorIcons: Record<string, string> = {
  hosteleria: "H",
  belleza: "B",
  salud: "S",
  profesionales: "P",
  comercio: "C",
  inmobiliaria: "I",
  automocion: "A",
  formacion: "F",
};

const prioritySectors = prioritySectorKeys
  .map((key) => businessSectors.find((sector) => sector.key === key))
  .filter((sector) => Boolean(sector));

export default function Industries() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-600">
            Sectores
          </p>

          <h2 className="text-3xl font-black text-slate-950 sm:text-4xl md:text-5xl">
            AutonomIA se adapta a cada negocio local.
          </h2>
        </div>

        <p className="text-lg leading-8 text-slate-600">
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
              className="flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(30,41,59,0.06)] transition hover:-translate-y-1 hover:border-blue-200"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-violet-100 text-xl font-black text-violet-700">
                  {sectorIcons[sector.key]}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-600">
                  {sectorDisplayNames[sector.key]}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-950">
                {sector.name}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {sector.description}
              </p>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  SocialIA
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sector.socialContentTypes.slice(0, 3).map((type) => (
                    <span
                      key={type}
                      className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-[#F8FAFF] p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                  Reservas / citas
                </p>
                <p className="mt-3 text-sm font-bold text-slate-800">
                  {sector.bookingLabel}
                </p>
              </div>

              <div className="mt-4 flex-1 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
                  Módulos recomendados
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sector.compatibleModules.slice(0, 4).map((module) => (
                    <span
                      key={module}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"
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
    </section>
  );
}
