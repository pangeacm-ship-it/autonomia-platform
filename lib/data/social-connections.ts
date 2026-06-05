import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SocialConnection, SocialConnectionStatus } from "@/types/database";

export type SocialPlatform = "facebook" | "instagram";

const fallbackConnections: SocialConnection[] = [
  createDemoConnectionPlaceholder("facebook"),
  createDemoConnectionPlaceholder("instagram"),
];

export function createDemoConnectionPlaceholder(
  platform: SocialPlatform = "facebook",
): SocialConnection {
  const now = new Date().toISOString();

  return {
    id: `demo-${platform}-connection`,
    company_id: "demo-company-empty",
    provider: "meta",
    platform,
    account_name: null,
    account_id: null,
    page_id: platform === "facebook" ? null : null,
    instagram_business_account_id: platform === "instagram" ? null : null,
    access_token_encrypted: null,
    refresh_token_encrypted: null,
    token_expires_at: null,
    scopes: [],
    status: "disconnected",
    last_sync_at: null,
    is_demo: true,
    archived_at: null,
    deleted_at: null,
    created_at: now,
    updated_at: now,
  };
}

export async function getCompanySocialConnections(companyId: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return fallbackConnections;
  }

  const { data, error } = await supabase
    .from("social_connections")
    .select(
      "id, company_id, provider, platform, account_name, account_id, page_id, instagram_business_account_id, token_expires_at, scopes, status, last_sync_at, is_demo, archived_at, deleted_at, created_at, updated_at",
    )
    .eq("company_id", companyId)
    .is("deleted_at", null)
    .is("archived_at", null)
    .order("platform", { ascending: true });

  if (error) {
    return companyId.startsWith("demo-") ? fallbackConnections : [];
  }

  return (data ?? []) as SocialConnection[];
}

export async function getConnectionStatus(companyId: string) {
  const connections = await getCompanySocialConnections(companyId);

  return {
    facebook: resolvePlatformStatus(connections, "facebook"),
    instagram: resolvePlatformStatus(connections, "instagram"),
  };
}

export async function disconnectSocialConnection(connectionId: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase no está configurado. Acción real no disponible.",
    };
  }

  const { error } = await supabase
    .from("social_connections")
    .update({
      status: "disconnected",
      access_token_encrypted: null,
      refresh_token_encrypted: null,
      token_expires_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", connectionId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard/socialia");
  revalidatePath("/dashboard/conexiones");
  return { ok: true, message: "Conexión marcada como desconectada." };
}

function resolvePlatformStatus(
  connections: SocialConnection[],
  platform: SocialPlatform,
): SocialConnectionStatus {
  return connections.find((connection) => connection.platform === platform)?.status ?? "disconnected";
}
