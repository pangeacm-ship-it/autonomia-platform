import AccessDeniedCard from "@/components/AccessDeniedCard";
import ModuleStatusPanel from "@/components/ModuleStatusPanel";
import { getDashboardRouteAccess } from "@/lib/auth/access-control";
import { ReviewResponseCard } from "@/components/reviewia/ReviewResponseCard";
import { getCurrentCompany } from "@/lib/data/companies";
import { getCompanyAiSettings } from "@/lib/data/ai-settings";

const reviews = [
  {
    author: "María López",
    rating: 5,
    date: "Ayer",
    text: "Excelente atención y comida casera. Volveremos.",
    status: "Respondida",
    sentiment: "Positiva",
  },
  {
    author: "Antonio Ruiz",
    rating: 4,
    date: "Hace 2 días",
    text: "Buen servicio y ambiente agradable.",
    status: "Pendiente",
    sentiment: "Positiva",
  },
  {
    author: "Laura Sánchez",
    rating: 2,
    date: "Hace 3 días",
    text: "La espera fue demasiado larga.",
    status: "Pendiente",
    sentiment: "Negativa",
  },
];

const suggestions = [
  "Añadir más fotografías recientes del negocio.",
  "Responder las reseñas pendientes antes de 24 horas.",
  "Publicar una actualización semanal en Google Business.",
  "Actualizar horarios especiales y festivos.",
];

export default async function GoogleBusinessPage() {
  const [access, company] = await Promise.all([
    getDashboardRouteAccess("/dashboard/google-business"),
    getCurrentCompany(),
  ]);

  if (!access.allowed) {
    return (
      <AccessDeniedCard
        title="Google Business no está disponible en tu plan"
        reason={access.reason ?? "Este módulo requiere ampliar el plan."}
        planName={access.plan?.name}
      />
    );
  }

  const aiSettings = await getCompanyAiSettings(company.id);
  const companyContext = {
    name: company.name,
    sector: company.industry ?? undefined,
    tone: aiSettings?.tone ?? undefined,
    city: company.city ?? undefined,
  };

  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-500/10 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">
          Google Business
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Presencia local y reputación online
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Gestiona tu ficha de Google, supervisa reseñas y mejora tu visibilidad
          en búsquedas locales.
        </p>
      </div>

      <ModuleStatusPanel
        moduleName="Google Business"
        status="Requiere conexión"
        description="El módulo está preparado para reputación y visibilidad local. La sincronización real con Google Business se activará cuando la cuenta esté conectada."
        capabilities={[
          "Supervisar reseñas y reputación.",
          "Preparar respuestas y sugerencias de mejora.",
          "Centralizar acciones de visibilidad local.",
        ]}
        requirements={[
          "Ficha de Google Business verificada.",
          "Permisos de acceso concedidos a AutonomIA.",
          "Revisión antes de publicar cambios reales.",
        ]}
        nextSteps={[
          "Mantener la vista como panel de preparación.",
          "Revisar reseñas y mejoras sugeridas.",
          "Conectar Google Business en fase de integración.",
        ]}
      />

      <div className="grid gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Valoración media</p>
          <h3 className="mt-2 text-4xl font-black">4.6 ⭐</h3>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Reseñas totales</p>
          <h3 className="mt-2 text-4xl font-black">127</h3>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Pendientes</p>
          <h3 className="mt-2 text-4xl font-black">2</h3>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Visitas este mes</p>
          <h3 className="mt-2 text-4xl font-black">2.134</h3>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">
              Últimas reseñas
            </h2>

            <div className="mt-6 space-y-4">
              {reviews.map((review) => (
                <ReviewResponseCard
                  key={review.author}
                  review={review}
                  companyContext={companyContext}
                />
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">
              Publicaciones Google
            </h2>

            <div className="mt-5 rounded-3xl border border-dashed border-white/10 p-10 text-center">
              <p className="text-slate-400">
                Aquí aparecerán las publicaciones generadas por SocialIA para
                Google Business.
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
            <h3 className="text-xl font-black text-emerald-300">
              Estado de la ficha
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Tu perfil está activo y aparece correctamente en Google Maps.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">
              Recomendaciones IA
            </h3>

            <div className="mt-5 space-y-3">
              {suggestions.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-black/20 p-4 text-sm leading-6 text-slate-300"
                >
                  ✦ {item}
                </div>
              ))}
            </div>
          </div>

          <button className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 font-bold">
            Conectar Google Business
          </button>
        </aside>
      </div>
    </section>
  );
}
