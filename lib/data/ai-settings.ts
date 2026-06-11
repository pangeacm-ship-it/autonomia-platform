import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CompanyAiSettings } from "@/types/database";

export async function getCompanyAiSettings(companyId: string): Promise<CompanyAiSettings | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) return null;

  const { data } = await supabase
    .from("company_ai_settings")
    .select("*")
    .eq("company_id", companyId)
    .maybeSingle();

  return data ?? null;
}

export async function upsertCompanyAiSettings(
  companyId: string,
  settings: Pick<CompanyAiSettings, "tone" | "main_goal" | "custom_instructions" | "automation_level" | "approval_required">
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const now = new Date().toISOString();

  const { error } = await supabase
    .from("company_ai_settings")
    .upsert(
      {
        company_id: companyId,
        ...settings,
        language: "es",
        updated_at: now,
      },
      { onConflict: "company_id" }
    );

  if (error) return { ok: false, error: error.message };

  return { ok: true };
}
