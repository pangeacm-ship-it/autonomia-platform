"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";
import { isUserRole } from "@/lib/auth/roles";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Role } from "@/types/database";

type MembershipRoleRow = {
  role?: string | null;
  roles?: Pick<Role, "key"> | Pick<Role, "key">[] | null;
};

function firstRole(row: MembershipRoleRow) {
  if (isUserRole(row.role)) {
    return row.role;
  }

  const roleData = Array.isArray(row.roles) ? row.roles[0] : row.roles;

  return isUserRole(roleData?.key) ? roleData.key : null;
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function resolveNextPath(profileId: string) {
    if (!supabase) {
      return "/dashboard";
    }

    const roles = [];
    const { data: memberships } = await supabase
      .from("company_users")
      .select("role, roles(key)")
      .eq("profile_id", profileId)
      .eq("status", "active");

    roles.push(
      ...((memberships ?? []) as MembershipRoleRow[])
        .map(firstRole)
        .filter(isUserRole),
    );

    return roles.includes("superadmin") ? "/superadmin" : "/dashboard";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!supabase) {
      setError("Supabase no está configurado en este entorno.");
      return;
    }

    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    setIsLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      setIsLoading(false);
      setError("No hay una sesión activa. Vuelve a iniciar sesión.");
      router.push("/login");
      return;
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (verifyError) {
      setIsLoading(false);
      setError("La contraseña actual no es correcta.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
      data: { force_password_change: false },
    });

    if (updateError) {
      setIsLoading(false);
      setError("No se pudo actualizar la contraseña. Inténtalo de nuevo.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    const nextPath = profile ? await resolveNextPath(profile.id) : "/dashboard";

    setMessage("Contraseña actualizada correctamente.");
    setIsLoading(false);
    router.push(nextPath);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#050817] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_60px_rgba(124,58,237,0.18)] sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">
            Primer acceso
          </p>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">
            Cambia tu contraseña
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Por seguridad, cambia la contraseña temporal antes de acceder al
            panel de AutonomIA.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-300">
                Contraseña actual
              </label>
              <PasswordInput
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-300">
                Nueva contraseña
              </label>
              <PasswordInput
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                minLength={8}
                className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-300">
                Confirmar nueva contraseña
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
                className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-100">
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Actualizando..." : "Guardar nueva contraseña"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
