import Link from "next/link";
import Logo from "@/components/Logo";

export default function RegistroPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 py-12 text-white">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black">
            Crear cuenta
          </h1>

          <p className="mt-3 text-slate-400">
            Empieza creando tu usuario.
          </p>
        </div>

        <form className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Nombre
            </label>

            <input
              type="text"
              placeholder="Tu nombre"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Email
            </label>

            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="Crea una contraseña"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Confirmar contraseña
            </label>

            <input
              type="password"
              placeholder="Repite la contraseña"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
            />
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-violet-500"
            />

            <span>
              He leído y acepto los términos y condiciones y la política de
              privacidad de AutonomIA.
            </span>
          </label>

          <Link
            href="/onboarding"
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 text-center font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)] hover:opacity-90"
          >
            Continuar
          </Link>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-bold text-violet-300">
            Iniciar sesión
          </Link>
        </p>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-white">
            Volver a la web
          </Link>
        </div>
      </div>
    </main>
  );
}