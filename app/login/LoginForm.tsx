"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isUserRole } from "@/lib/auth/roles";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Role } from "@/types/database";

type MembershipRoleRow = {
  role?: string | null;
  role_id?: string | null;
  roles?: Pick<Role, "key"> | Pick<Role, "key">[] | null;
};

function getRoleKey(row: MembershipRoleRow) {
  if (isUserRole(row.role)) {
    return row.role;
  }

  const roleData = Array.isArray(row.roles) ? row.roles[0] : row.roles;

  return isUserRole(roleData?.key) ? roleData.key : null;
}

function logLoginDebug(message: string, details?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.debug(`[AutonomIA login] ${message}`, details ?? {});
}

type LoginFormProps = {
  isSupabaseConfigured: boolean;
};

export default function LoginForm({ isSupabaseConfigured }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const isDemoMode = !isSupabaseConfigured;

  useEffect(() => {
    if (isDemoMode) {
      console.info("[AutonomIA] Demo mode enabled");
      return;
    }

    console.info("[AutonomIA] Supabase enabled");
  }, [isDemoMode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (isDemoMode) {
      console.info("[AutonomIA] Demo mode enabled");
      router.push("/dashboard");
      return;
    }

    if (!supabase) {
      console.info("[AutonomIA] Supabase enabled");
      setError(
        "Supabase está configurado, pero el cliente no se pudo iniciar. Reinicia el servidor local y revisa las variables públicas.",
      );
      return;
    }

    setIsLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setIsLoading(false);
      setError("No se pudo iniciar sesión. Revisa el email y la contraseña.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    let nextPath = "/dashboard";

    if (user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();
      const profile = profileData as { id: string; email?: string | null; role?: string | null } | null;

      if (!profile) {
        logLoginDebug("Profile not found after successful auth.", {
          email: user.email,
          userId: user.id,
        });
        await supabase.auth.signOut();
        setIsLoading(false);
        setError(
          "Login correcto, pero falta el perfil en Supabase. Revisa public.profiles y enlaza auth_user_id con este usuario.",
        );
        return;
      }

      if (profile) {
        const profileRole = isUserRole(profile.role) ? profile.role : null;
        const { data: memberships, error: membershipsError } = await supabase
          .from("company_users")
          .select("*, roles(key)")
          .eq("profile_id", profile.id)
          .eq("status", "active");

        if (membershipsError) {
          logLoginDebug("Membership query failed after successful auth.", {
            email: user.email,
            profileId: profile.id,
            error: membershipsError.message,
          });
          await supabase.auth.signOut();
          setIsLoading(false);
          setError(
            "Login correcto, pero no se pudieron leer los roles. Revisa RLS en company_users y roles.",
          );
          return;
        }

        const membershipRows = (memberships ?? []) as MembershipRoleRow[];
        const roles = [
          profileRole,
          ...membershipRows.map(getRoleKey),
        ].filter(Boolean);

        logLoginDebug("Resolved login roles.", {
          email: user.email,
          profileId: profile.id,
          profileRole,
          membershipCount: membershipRows.length,
          roles,
        });

        const unresolvedRoleIds = membershipRows
          .filter((membership) => !getRoleKey(membership))
          .map((membership) => membership.role_id)
          .filter(Boolean);

        if (!roles.length && unresolvedRoleIds.length) {
          const { data: roleRows } = await supabase
            .from("roles")
            .select("key")
            .in("id", unresolvedRoleIds as string[]);
          const fallbackRoles = ((roleRows ?? []) as Pick<Role, "key">[])
            .map((role) => role.key)
            .filter(isUserRole);

          roles.push(...fallbackRoles);
          logLoginDebug("Resolved roles by role_id fallback.", {
            email: user.email,
            roles,
          });
        }

        const validRoles = roles.filter(isUserRole);

        if (!validRoles.length) {
          logLoginDebug("No valid role found after successful auth.", {
            email: user.email,
            profileId: profile.id,
            membershipCount: membershipRows.length,
          });
          await supabase.auth.signOut();
          setIsLoading(false);
          setError(
            "Login correcto, pero falta una relación activa en company_users con un rol válido.",
          );
          return;
        }

        if (validRoles.includes("superadmin")) {
          nextPath = "/superadmin";
        }
      }
    }

    setIsLoading(false);
    router.push(nextPath);
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div
        className={`rounded-2xl border px-4 py-3 text-center text-xs font-bold ${
          isDemoMode
            ? "border-amber-400/20 bg-amber-500/10 text-amber-100"
            : "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
        }`}
      >
        {isDemoMode ? "Modo demo activo" : "Modo real Supabase activo"}
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-slate-300">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@email.com"
          required={!isDemoMode}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-slate-300">
          Contraseña
        </label>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          required={!isDemoMode}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 text-center font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Entrando..." : isDemoMode ? "Entrar en modo demo" : "Entrar"}
      </button>

      {isDemoMode ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
          Modo demo activo: faltan las variables públicas de Supabase en el
          entorno local o el servidor no se reinició después de configurarlas.
        </div>
      ) : null}

      {isDemoMode ? (
        <Link
          href="/dashboard"
          className="block rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-bold text-slate-200 hover:bg-white/10"
        >
          Abrir dashboard demo
        </Link>
      ) : null}
    </form>
  );
}
