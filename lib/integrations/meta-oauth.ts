import "server-only";

import { randomBytes } from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isCompanyAdmin, isSuperadmin } from "@/lib/auth/roles";
import { getCurrentProfileContext } from "@/lib/data/profiles";
import type { SocialConnection } from "@/types/database";

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

const metaScopes = [
  "pages_show_list",
  "pages_read_engagement",
  "instagram_basic",
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

  const context = await getCurrentProfileContext();

  if (isSuperadmin(context.primaryRole)) {
    return { ok: true, status: 200, message: "OK" };
  }

  const membership = context.memberships.find(
    (item) => item.company_id === companyId,
  );
  const role = membership?.role?.key ?? context.primaryRole;

  if (membership && (isCompanyAdmin(role) || role === "marketing")) {
    return { ok: true, status: 200, message: "OK" };
  }

  return {
    ok: false,
    status: 403,
    message: "No tienes permisos para conectar Meta en esta empresa.",
  };
}

export async function saveMetaConnectionNeedsReview({
  companyId,
  scopes,
  tokenExpiresAt,
}: {
  companyId: string;
  scopes: string[];
  tokenExpiresAt: string | null;
}) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { ok: false, message: "Supabase no está configurado." };
  }

  const now = new Date().toISOString();
  const platforms: Array<SocialConnection["platform"]> = [
    "facebook",
    "instagram",
  ];

  for (const platform of platforms) {
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
      account_name: "Meta OAuth iniciado",
      account_id: null,
      page_id: null,
      instagram_business_account_id: null,
      access_token_encrypted: null,
      refresh_token_encrypted: null,
      token_expires_at: tokenExpiresAt,
      scopes,
      status: "needs_review" as const,
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
  }

  return { ok: true, message: "Conexión Meta registrada en revisión." };
}
