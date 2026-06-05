import Link from "next/link";
import TrustGuarantee from "@/components/TrustGuarantee";
import { commercialPlans, founderOffer } from "@/lib/commercial-plans";

export default function Pricing() {
  return (
    <section id="precios" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-600">
          {founderOffer.isActive ? "Precios de lanzamiento" : "Planes AutonomIA"}
        </p>

        <h2 className="text-4xl font-black text-slate-950 md:text-5xl">
          Elige tu plan.
          <br />
          Crece a tu ritmo.
        </h2>

        <p className="mt-5 text-lg leading-8 text-slate-600">
          {founderOffer.isActive
            ? "Contrata durante el lanzamiento y mantén tu precio promocional mientras permanezcas en el mismo plan o subas a uno superior."
            : "Planes mensuales sin permanencia, pensados para negocios locales que quieren ordenar su marketing con IA."}
        </p>
      </div>

      {founderOffer.isActive ? (
        <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6 text-center shadow-sm">
          <h3 className="text-2xl font-black text-emerald-800">
            Oferta Fundadores
          </h3>

          <p className="mt-3 text-slate-700">
            Precios especiales de lanzamiento disponibles por tiempo limitado.
            Los clientes que entren durante la campaña conservarán sus
            condiciones mientras mantengan o mejoren su plan.
          </p>
        </div>
      ) : null}

      <TrustGuarantee />

      <div className="mt-14 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4">
        {commercialPlans.map((plan) => {
          const showLaunchPrice = founderOffer.isActive && plan.officialPrice;
          const visiblePrice = showLaunchPrice ? plan.launchPrice : plan.normalPrice;
          const isLocalIa = plan.key === "local-ia";

          return (
            <article
              key={plan.name}
              className={`relative flex h-full min-h-[760px] flex-col rounded-[2rem] border p-7 ${
                isLocalIa
                  ? "border-blue-200 bg-gradient-to-b from-blue-50 via-white to-violet-50 shadow-[0_28px_80px_rgba(37,99,235,0.14)]"
                  : plan.highlighted
                    ? "border-violet-200 bg-gradient-to-b from-violet-50 to-white shadow-[0_24px_70px_rgba(109,40,217,0.13)]"
                    : "border-slate-200 bg-white shadow-[0_18px_50px_rgba(30,41,59,0.06)]"
              }`}
            >
              <div className="mb-6 flex h-[58px] items-start">
                <div
                  className={`flex w-fit max-w-full items-center rounded-full px-4 py-2 text-xs font-black ${
                    isLocalIa
                      ? "bg-slate-950 text-white"
                      : plan.highlighted
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {plan.label}
                </div>
              </div>

              <div className="min-h-[70px]">
                <h3 className="text-3xl font-black text-slate-950">
                  {plan.name}
                </h3>
              </div>

              <p className="mt-4 min-h-[120px] text-sm leading-6 text-slate-600">
                {plan.description}
              </p>

              <div className="mt-6 flex h-[298px] flex-col rounded-2xl border border-slate-200 bg-[#F8FAFF] p-5">
                <div className="min-h-[86px]">
                  {showLaunchPrice ? (
                    <>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Precio oficial
                      </p>

                      <p className="mt-2 text-2xl font-black text-slate-400 line-through decoration-red-400 decoration-2">
                        {plan.officialPrice}/mes
                      </p>
                    </>
                  ) : (
                    <div className="invisible">
                      <p className="text-xs font-black uppercase tracking-[0.18em]">
                        Precio oficial
                      </p>
                      <p className="mt-2 text-2xl font-black">0€/mes</p>
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                    {showLaunchPrice ? "Precio lanzamiento" : "Precio mensual"}
                  </p>

                  <div className="mt-1 flex min-h-[82px] items-end gap-2">
                    <span className="text-6xl font-black text-emerald-700">
                      {visiblePrice}
                    </span>

                    <span className="pb-3 text-lg font-bold text-slate-500">
                      /mes
                    </span>
                  </div>
                </div>

                <p className="mt-auto min-h-[40px] rounded-full bg-emerald-100 px-3 py-2 text-center text-xs font-bold text-emerald-800">
                  {plan.name === "Gratuito"
                    ? "Sin pago mensual"
                    : showLaunchPrice
                      ? "Precio lanzamiento garantizado"
                      : "Suscripción mensual"}
                </p>
              </div>

              <ul className="mt-7 min-h-[190px] space-y-3 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>

              <Link
                href="/onboarding"
                className={`mt-auto block w-full rounded-2xl px-6 py-4 text-center font-bold ${
                  isLocalIa || plan.highlighted
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_18px_45px_rgba(79,70,229,0.28)]"
                    : "border border-slate-200 bg-white text-slate-900 hover:bg-blue-50"
                }`}
              >
                {plan.name === "Gratuito" ? "Empezar gratis" : "Solicitar demo"}
              </Link>
            </article>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-black text-slate-950">
          Añade módulos cuando los necesites
        </h3>

        <p className="mt-4 text-slate-600">
          ReviewIA · WhatsAppIA · ReservaIA · LeadIA · InsightIA · Google
          Business · TikTok & Shorts
        </p>
      </div>
    </section>
  );
}
