import Link from "next/link";
import Logo from "@/components/Logo";
import { getSupabaseConfig } from "@/lib/supabase/config";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  const { isConfigured } = getSupabaseConfig();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black">
            Iniciar sesión
          </h1>

          <p className="mt-3 text-slate-400">
            Accede a tu panel de AutonomIA
          </p>
        </div>

        <LoginForm isSupabaseConfigured={isConfigured} />

        <p className="mt-6 text-center text-sm text-slate-400">
          ¿Todavía no tienes cuenta?{" "}
          <Link href="/registro" className="font-bold text-violet-300">
            Crear cuenta
          </Link>
        </p>

        <Link
          href="/onboarding"
          className="mt-4 block rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-bold text-slate-200 hover:bg-white/10"
        >
          Configurar demo
        </Link>

        <div className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4 text-center text-sm leading-6 text-violet-100">
          Si Supabase no está configurado, AutonomIA mantiene acceso demo.
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-white">
            Volver a la web
          </Link>
        </div>
      </div>
    </main>
  );
}
