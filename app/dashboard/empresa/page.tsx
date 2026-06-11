import { defaultBusinessSector } from "@/lib/business-sectors";
import {
  getBusinessSectorById,
  getBusinessSectors,
} from "@/lib/data/business-sectors";
import { getCurrentCompany } from "@/lib/data/companies";
import { getCompanyModules, getModules } from "@/lib/data/modules";
import { getCurrentProfileContext } from "@/lib/data/profiles";
import { EmpresaForm } from "./EmpresaForm";

const fallbackActiveModules = [
  "SocialIA",
  "Google Business",
  "ReviewIA",
  "LeadIA",
  "InsightIA",
];

const brandTones = [
  "Cercano",
  "Profesional",
  "Familiar",
  "Divertido",
  "Tradicional",
  "Premium",
];

const objectives = [
  "Aumentar reservas",
  "Conseguir más reseñas",
  "Mejorar presencia local",
  "Captar nuevos clientes",
];

const schedules = [
  { day: "Lunes a viernes", hours: "08:00 - 16:30" },
  { day: "Sábado", hours: "09:00 - 17:00" },
  { day: "Domingo", hours: "Cerrado" },
];

const connectedChannels = [
  { name: "Instagram", status: "Conectado" },
  { name: "Facebook", status: "Conectado" },
  { name: "Google Business", status: "Conectado" },
  { name: "WhatsApp", status: "Pendiente" },
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export default async function EmpresaPage() {
  const [company, businessSectors, profileContext, allModules] = await Promise.all([
    getCurrentCompany(),
    getBusinessSectors(),
    getCurrentProfileContext(),
    getModules(),
  ]);
  const [sectorById, companyModules] = await Promise.all([
    getBusinessSectorById(company.sector_id),
    getCompanyModules(company.id),
  ]);
  const currentSector = sectorById ??
    businessSectors.find(
      (sector) =>
        normalize(sector.name) === normalize(company.industry ?? ""),
    ) ?? defaultBusinessSector;
  const moduleById = new Map(allModules.map((module) => [module.id, module.name]));
  const activeModules = companyModules
    .filter((companyModule) => companyModule.status === "active")
    .map((companyModule) => moduleById.get(companyModule.module_id))
    .filter(Boolean) as string[];
  const recommendedModules = companyModules
    .filter((companyModule) => companyModule.status === "recommended")
    .map((companyModule) => moduleById.get(companyModule.module_id))
    .filter(Boolean) as string[];
  const displayedActiveModules = activeModules.length
    ? activeModules
    : fallbackActiveModules;
  const displayedRecommendedModules = recommendedModules.length
    ? recommendedModules
    : currentSector.compatibleModules;
  const companyPhone = profileContext.profile.phone ?? "";
  const hasRegisteredCompany = company.name !== "Sin empresa registrada";
  const companyAddress = company.city
    ? `Dirección pendiente, ${company.city}`
    : "";
  const companyDescription =
    company.industry || company.city
      ? `${company.name} es un negocio de ${company.industry ?? "servicios"}${company.city ? ` en ${company.city}` : ""} que usa AutonomIA para organizar presencia digital, contenidos y recomendaciones.`
      : hasRegisteredCompany
        ? `${company.name} usa AutonomIA para preparar contenido, revisar actividad y mantener su presencia digital organizada.`
        : "No hay empresa registrada todavía. Crea una empresa desde Superadmin para completar estos datos.";

  return (
    <section className="p-4 sm:p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-6 lg:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          Mi empresa
        </p>

        <div className="mt-5 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">
              {company.name}
            </h1>

            <p className="mt-4 max-w-3xl text-slate-300">
              Define los datos, el tono, los objetivos y el contexto que
              AutonomIA utilizará para personalizar publicaciones, respuestas,
              campañas y recomendaciones.
            </p>
          </div>

        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
            <h2 className="mb-6 text-2xl font-black">Información del negocio</h2>

            <EmpresaForm
              companyId={company.id}
              name={company.name}
              city={company.city ?? ""}
              ownerEmail={company.owner_email ?? ""}
              industry={company.industry ?? ""}
              sectorId={company.sector_id}
              businessSectors={businessSectors.map((s) => ({
                key: s.key,
                name: s.name,
                id: (s as { id?: string }).id,
              }))}
            />
          </div>

          <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6 lg:p-8">
            <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
                  Sector actual
                </p>
                <h2 className="mt-3 text-3xl font-black">
                  {currentSector.name}
                </h2>
                <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
                  {currentSector.description}
                </p>
              </div>

              <span className="w-fit rounded-full border border-cyan-300/20 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
                {profileContext.isFallback ? "Demo" : "Supabase"}
              </span>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              <article className="rounded-3xl border border-white/10 bg-[#0b1024] p-5">
                <h3 className="font-black text-cyan-200">
                  Módulos recomendados
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {displayedRecommendedModules.map((module) => (
                    <span
                      key={module}
                      className="rounded-full bg-cyan-500/15 px-3 py-2 text-xs font-bold text-cyan-200"
                    >
                      {module}
                    </span>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-white/10 bg-[#0b1024] p-5">
                <h3 className="font-black text-violet-200">
                  Contenido SocialIA
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {currentSector.socialContentTypes.map((type) => (
                    <span
                      key={type}
                      className="rounded-full bg-violet-500/15 px-3 py-2 text-xs font-bold text-violet-200"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-white/10 bg-[#0b1024] p-5">
                <h3 className="font-black text-emerald-200">
                  Terminología adaptada
                </h3>
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <p>
                    Reservas:{" "}
                    <span className="font-bold text-white">
                      {currentSector.bookingLabel}
                    </span>
                  </p>
                  <p>
                    Leads:{" "}
                    <span className="font-bold text-white">
                      {currentSector.leadLabel}
                    </span>
                  </p>
                  <p>
                    Servicios:{" "}
                    <span className="font-bold text-white">
                      {currentSector.terminology.servicios}
                    </span>
                  </p>
                </div>
              </article>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm leading-6 text-slate-300">
                AutonomIA adaptará ideas de contenido, etiquetas de reservas,
                módulos recomendados y lenguaje del asistente según el sector
                seleccionado. Este dato se lee desde Supabase cuando la empresa
                tiene sector asociado y cae a demo si falta sesión o datos.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
            <h2 className="text-2xl font-black">Contexto para la IA</h2>

            <div className="mt-6">
              <p className="mb-3 text-sm font-bold text-slate-300">
                Tono de marca
              </p>

              <div className="flex flex-wrap gap-3">
                {brandTones.map((tone, index) => (
                  <span
                    key={tone}
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      index === 0
                        ? "bg-violet-500/20 text-violet-200"
                        : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {tone}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-bold text-slate-300">
                Objetivos principales
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                {objectives.map((objective) => (
                  <div
                    key={objective}
                    className="rounded-2xl border border-white/10 bg-[#0b1024] p-4 text-sm font-bold text-slate-300"
                  >
                    ✓ {objective}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
            <h2 className="text-2xl font-black">Horarios</h2>

            <div className="mt-6 space-y-3">
              {schedules.map((item) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <p className="font-bold">{item.day}</p>
                  <p className="text-sm text-slate-400">{item.hours}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
            <p className="text-sm text-emerald-200">Perfil completado</p>
            <h3 className="mt-2 text-3xl font-black sm:text-4xl">84%</h3>

            <div className="mt-5 h-3 rounded-full bg-white/10">
              <div className="h-3 w-[84%] rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Falta completar WhatsApp y algunos datos fiscales para llegar al
              100%.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">Canales conectados</h3>

            <div className="mt-5 space-y-3">
              {connectedChannels.map((channel) => (
                <div
                  key={channel.name}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <p className="font-bold">{channel.name}</p>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      channel.status === "Conectado"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {channel.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-violet-400/30 bg-violet-500/10 p-6">
            <h3 className="text-xl font-black">Módulos activos</h3>

            <div className="mt-5 flex flex-wrap gap-2">
              {displayedActiveModules.map((module) => (
                <span
                  key={module}
                  className="rounded-full bg-violet-500/20 px-3 py-2 text-xs font-bold text-violet-200"
                >
                  {module}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-400/20 bg-amber-500/10 p-6">
            <h3 className="text-xl font-black">Recomendación IA</h3>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Completa la conexión de WhatsApp para que AutonomIA pueda
              gestionar consultas, reservas y leads desde el mismo centro.
            </p>

            <button className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 hover:bg-slate-200">
              Conectar WhatsApp
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
