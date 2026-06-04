import Link from "next/link";

export default function SavingsCalculator() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-300">
          Ahorro real
        </p>

        <h2 className="text-4xl font-black md:text-5xl">
          ¿Cuánto te cuesta no usar AutonomIA?
        </h2>

        <p className="mt-5 text-lg leading-8 text-slate-400">
          Muchos negocios pagan cientos de euros al mes o simplemente no hacen
          marketing porque no tienen tiempo. AutonomIA te ayuda a mantener una
          presencia digital constante por una fracción del coste.
        </p>
      </div>

      <div className="mt-16 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
        <div className="grid grid-cols-2 border-b border-white/10 bg-white/[0.03]">
          <div className="p-5 font-black">Opción</div>
          <div className="p-5 font-black text-right">Coste mensual</div>
        </div>

        <div className="grid grid-cols-2 border-b border-white/10">
          <div className="p-5 text-slate-300">Community Manager freelance</div>
          <div className="p-5 text-right font-bold">250€ - 500€</div>
        </div>

        <div className="grid grid-cols-2 border-b border-white/10">
          <div className="p-5 text-slate-300">Agencia de marketing</div>
          <div className="p-5 text-right font-bold">500€ - 1.500€</div>
        </div>

        <div className="grid grid-cols-2 border-b border-white/10">
          <div className="p-5 text-slate-300">
            No hacer marketing digital
          </div>
          <div className="p-5 text-right font-bold text-red-400">
            Coste invisible
          </div>
        </div>

        <div className="grid grid-cols-2 bg-emerald-500/10">
          <div className="p-5 font-black text-emerald-300">
            AutonomIA Inicio
          </div>

          <div className="p-5 text-right text-2xl font-black text-emerald-300">
            79€
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-8 text-center">
        <p className="text-5xl font-black text-emerald-300">
          Menos de 3€ al día
        </p>

        <p className="mt-4 text-lg text-slate-300">
          Mantén activas tus redes sociales, mejora tu presencia online y recibe
          recomendaciones inteligentes para tu negocio.
        </p>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/onboarding"
          className="inline-block rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)]"
        >
          Quiero ver una demo
        </Link>
      </div>
    </section>
  );
}
