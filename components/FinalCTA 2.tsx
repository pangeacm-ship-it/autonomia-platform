import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="rounded-[2rem] border border-violet-400/40 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/20 p-6 text-center shadow-[0_0_70px_rgba(124,58,237,0.18)] sm:p-10 md:p-16">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          Empieza ahora
        </p>

        <h2 className="mx-auto max-w-4xl text-3xl font-black sm:text-4xl md:text-6xl">
          Convierte tu negocio en un sistema más automático, visible y rentable.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Empieza con SocialIA y actualiza tu plan cuando tu negocio necesite
          nuevas capacidades.
        </p>

        <Link
          href="/onboarding"
          className="mt-10 inline-block w-full max-w-md rounded-2xl bg-white px-6 py-4 font-bold text-slate-950 hover:bg-slate-200 sm:w-auto sm:px-8"
        >
          Solicitar demo
        </Link>
      </div>
    </section>
  );
}
