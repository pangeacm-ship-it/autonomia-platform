import "server-only";

import { randomBytes } from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isCompanyAdmin, isSuperadmin, isUserRole } from "@/lib/auth/roles";
import { getCurrentProfileContext } from "@/lib/data/profiles";
import type { SocialConnection, UserRole } from "@/types/database";

export const META_OAUTH_STATE_COOKIE = "autonomia_meta_oauth_state";

export type MetaOAuthState = {
  companyId: string;
  platform: SocialConnection["platform"] | null;
  nonce: string;
  createdAt: number;
};

type MetaOAuthConfig = {
  appId: string | null;
  appSecret: string | null;
  redirectUri: string | null;
};

// Permisos básicos para validar OAuth. Pages/Instagram se añadirán después con configuración Meta adecuada.
const metaScopes = [
  "public_profile",
];

function readEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();

  return value || null;
}

export function getMetaOAuthConfig(): MetaOAuthConfig {
  const serverAppId = readEnvironmentVariable("META_APP_ID");
  const publicAppId = readEnvironmentVariable("NEXT_PUBLIC_META_APP_ID");

  return {
    appId: serverAppId ?? publicAppId,
    appSecret: readEnvironmentVariable("META_APP_SECRET"),
    redirectUri: readEnvironmentVariable("META_REDIRECT_URI"),
  };
}

export function getMetaOAuthEnvironmentStatus() {
  const metaAppId = Boolean(readEnvironmentVariable("META_APP_ID"));
  const nextPublicMetaAppId = Boolean(
    readEnvironmentVariable("NEXT_PUBLIC_META_APP_ID"),
  );
  const metaAppSecret = Boolean(readEnvironmentVariable("META_APP_SECRET"));
  const metaRedirectUri = Boolean(readEnvironmentVariable("META_REDIRECT_URI"));

  return {
    META_APP_ID: metaAppId ? "present" : "missing",
    NEXT_PUBLIC_META_APP_ID: nextPublicMetaAppId ? "present" : "missing",
    META_APP_SECRET: metaAppSecret ? "present" : "missing",
    META_REDIRECT_URI: metaRedirectUri ? "present" : "missing",
    resolvedAppIdSource: metaAppId
      ? "META_APP_ID"
      : nextPublicMetaAppId
        ? "NEXT_PUBLIC_META_APP_ID"
        : "missing",
  };
}

export function getMetaOAuthScopes() {
  return metaScopes;
}

export function createMetaOAuthState(
  companyId: string,
  platform: SocialConnection["platform"] | null = null,
): MetaOAuthState {
  return {
    companyId,
    platform,
    nonce: randomBytes(24).toString("hex"),
    createdAt: Date.now(),
  };
}

export function encodeMetaOAuthState(state: MetaOAuthState) {
  return Buffer.from(JSON.stringify(state), "utf8").toString("base64url");
}

export function decodeMetaOAuthState(value: string | null): MetaOAuthState | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as Partial<MetaOAuthState>;

    if (
      typeof parsed.companyId !== "string" ||
      typeof parsed.nonce !== "string" ||
      typeof parsed.createdAt !== "number"
    ) {
      return null;
    }

    return {
      companyId: parsed.companyId,
      platform:
        parsed.platform === "facebook" || parsed.platform === "instagram"
          ? parsed.platform
          : null,
      nonce: parsed.nonce,
      createdAt: parsed.createdAt,
    };
  } catch {
    return null;
  }
}

export function isMetaOAuthStateFresh(state: MetaOAuthState) {
  return Date.now() - state.createdAt <= 10 * 60 * 1000;
}

type MetaAccessMembershipRow = {
  company_id: string | null;
  status: string;
  roles:
    | { key: string | null }
    | Array<{ key: string | null }>
    | null;
};

function getMembershipRole(row: MetaAccessMembershipRow): UserRole | null {
  const role = Array.isArray(row.roles) ? row.roles[0]?.key : row.roles?.key;

  return isUserRole(role) ? role : null;
}

export async function validateMetaCompanyAccess(companyId: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      status: 503,
      message: "Supabase no está configurado.",
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false,
      status: 401,
      message: "Inicia sesión para conectar Meta.",
    };
  }

  const admin = createSupabaseAdminClient();

  if (admin) {
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id, status")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (profileError) {
      return {
        ok: false,
        status: 503,
        message: "No se pudo comprobar tu perfil para conectar Meta.",
      };
    }

    if (!profile || profile.status !== "active") {
      return {
        ok: false,
        status: 403,
        message:
          "Tu cuenta no tiene un perfil activo vinculado. Revisa el alta del usuario antes de conectar Meta.",
      };
    }

    const { data: membershipData, error: membershipError } = await admin
      .from("company_users")
      .select("company_id, status, roles(key)")
      .eq("profile_id", profile.id)
      .eq("status", "active");

    if (membershipError) {
      return {
        ok: false,
        status: 503,
        message: "No se pudieron comprobar tus permisos para conectar Meta.",
      };
    }

    const memberships = (membershipData ?? []) as MetaAccessMembershipRow[];
    const superadminMembership = memberships.find(
      (membership) => getMembershipRole(membership) === "superadmin",
    );
    const matchingMembership = memberships.find(
      (membership) => membership.company_id === companyId,
    );
    const role = superadminMembership
      ? "superadmin"
      : matchingMembership
        ? getMembershipRole(matchingMembership)
        : null;
    const allowed =
      Boolean(superadminMembership) ||
      Boolean(
        matchingMembership &&
          (isCompanyAdmin(role) || role === "marketing"),
      );

    if (allowed) {
      return { ok: true, status: 200, message: "OK" };
    }

    return {
      ok: false,
      status: 403,
      message: matchingMembership
        ? "Tu rol no permite conectar Meta en esta empresa."
        : "Tu usuario no está vinculado activamente a esta empresa.",
    };
  }

  const context = await getCurrentProfileContext();

  if (isSuperadmin(context.primaryRole)) {
    return { ok: true, status: 200, message: "OK" };
  }

  const membership = context.memberships.find(
    (item) => item.company_id === companyId,
  );
  const role = membership?.role?.key ?? context.primaryRole;
  const allowed = Boolean(
    membership && (isCompanyAdmin(role) || role === "marketing"),
  );

  if (allowed) {
    return { ok: true, status: 200, message: "OK" };
  }

  return {
    ok: false,
    status: 403,
    message: "No tienes permisos para conectar Meta en esta empresa.",
  };
}

export async function saveMetaConnectionConnected({
  companyId,
  platform,
  scopes,
  tokenExpiresAt,
}: {
  companyId: string;
  platform: SocialConnection["platform"];
  scopes: string[];
  tokenExpiresAt: string | null;
}) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { ok: false, message: "Supabase no está configurado." };
  }

  const now = new Date().toISOString();
  const { data: existingRows, error: selectError } = await supabase
    .from("social_connections")
    .select("id")
    .eq("company_id", companyId)
    .eq("provider", "meta")
    .eq("platform", platform)
    .is("deleted_at", null)
    .limit(1);

  if (selectError) {
    return { ok: false, message: selectError.message };
  }

  const payload = {
    company_id: companyId,
    provider: "meta" as const,
    platform,
    account_name: "OAuth básico Meta conectado",
    account_id: null,
    page_id: null,
    instagram_business_account_id: null,
    access_token_encrypted: null,
    refresh_token_encrypted: null,
    token_expires_at: tokenExpiresAt,
    scopes,
    status: "connected" as const,
    last_sync_at: now,
    is_demo: false,
    archived_at: null,
    deleted_at: null,
    updated_at: now,
  };

  const existingId = existingRows?.[0]?.id;
  const mutation = existingId
    ? supabase.from("social_connections").update(payload).eq("id", existingId)
    : supabase.from("social_connections").insert({
        ...payload,
        created_at: now,
      });

  const { error } = await mutation;

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "OAuth básico Meta conectado." };
}
