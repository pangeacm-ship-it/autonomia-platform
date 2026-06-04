import Link from "next/link";
import Logo from "@/components/Logo";

export default function BillingRequiredPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 py-12 text-white">
      <section className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-200">
            Suscripción
          </p>

          <h1 className="mt-4 text-3xl font-black md:text-4xl">
            Tu suscripción no está activa
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Para recuperar el acceso operativo a AutonomIA, actualiza tu método
            de pago o contacta con soporte. Esta pantalla quedará conectada a
            Stripe cuando activemos los cobros reales.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            "Actualizar método de pago",
            "Revisar último cobro",
            "Contactar soporte",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-[#0b1024] p-4 text-center text-sm font-bold">
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard/facturacion"
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)] hover:opacity-90"
          >
            Volver a facturación
          </Link>

          <Link
            href="/"
            className="rounded-2xl border border-white/10 px-6 py-3 font-bold text-slate-300 hover:bg-white/10 hover:text-white"
          >
            Volver a la web
          </Link>
        </div>
      </section>
    </main>
  );
}
