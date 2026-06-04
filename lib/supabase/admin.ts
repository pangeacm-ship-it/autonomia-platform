import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseAdminConfig } from "./config";

export function createSupabaseAdminClient(): SupabaseClient<Database> | null {
  const { url, serviceRoleKey, isConfigured } = getSupabaseAdminConfig();

  if (!isConfigured || !url || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
