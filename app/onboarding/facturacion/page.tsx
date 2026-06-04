import Link from "next/link";
import Logo from "@/components/Logo";

export default function FacturacionPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>

        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-300">
            Paso 3 de 3
          </p>

          <h1 className="text-5xl font-black">
            Datos de facturación
          </h1>

          <p className="mt-4 text-lg text-slate-400">
            Necesarios para generar las facturas y gestionar la suscripción.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold">
                Razón social
              </label>

              <input
                type="text"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                CIF / NIF
              </label>

              <input
                type="text"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Email facturación
              </label>

              <input
                type="email"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Teléfono
              </label>

              <input
                type="text"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold">
                Dirección fiscal
              </label>

              <input
                type="text"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              />
            </div>
          </div>

          <div className="mt-10 flex justify-between">
            <Link
              href="/onboarding/modulos"
              className="rounded-2xl border border-white/10 px-6 py-3 font-bold text-slate-300"
            >
              Volver
            </Link>

            <Link
              href="/dashboard"
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3 font-bold"
            >
              Finalizar
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}