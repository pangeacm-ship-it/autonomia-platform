import { getCurrentCompany } from "@/lib/data/companies";
import { getCompanyAiSettings } from "@/lib/data/ai-settings";
import { ConfiguracionIAForm } from "./ConfiguracionIAForm";

export default async function ConfiguracionIAPage() {
  const company = await getCurrentCompany();
  const settings = await getCompanyAiSettings(company.id);

  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-violet-600/20 via-blue-600/20 to-cyan-500/10 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          Configuración IA
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Personaliza cómo trabaja AutonomIA
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Define el estilo, objetivos y automatizaciones para que todos los
          módulos trabajen de acuerdo con las necesidades de tu negocio.
        </p>
      </div>

      <ConfiguracionIAForm companyId={company.id} settings={settings} />
    </section>
  );
}
