"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseConfig } from "./config";

export function createSupabaseBrowserClient(): SupabaseClient<Database> | null {
  const { url, anonKey, isConfigured } = getSupabaseConfig();

  if (!isConfigured || !url || !anonKey) {
    console.info("[AutonomIA] Demo mode enabled");
    return null;
  }

  try {
    console.info("[AutonomIA] Supabase enabled");
    return createBrowserClient<Database>(url, anonKey);
  } catch {
    console.info("[AutonomIA] Demo mode enabled");
    return null;
  }
}
