import Link from "next/link";
import Logo from "@/components/Logo";
import { getSupabaseConfig } from "@/lib/supabase/config";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  const { isConfigured } = getSupabaseConfig();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFF] bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.12),transparent_32%)] px-6 py-10 text-slate-950">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black">
            Iniciar sesión
          </h1>

          <p className="mt-3 text-slate-600">
            Accede a tu panel de AutonomIA
          </p>
        </div>

        <LoginForm isSupabaseConfigured={isConfigured} />

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿Todavía no tienes cuenta?{" "}
          <Link href="/registro" className="font-bold text-violet-700 hover:text-blue-700">
            Crear cuenta
          </Link>
        </p>

        <Link
          href="/onboarding"
          className="mt-4 block rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 hover:bg-blue-50"
        >
          Configurar demo
        </Link>

        <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-center text-sm leading-6 text-violet-800">
          Si Supabase no está configurado, AutonomIA mantiene acceso demo.
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-950">
            Volver a la web
          </Link>
        </div>
      </div>
    </main>
  );
}
