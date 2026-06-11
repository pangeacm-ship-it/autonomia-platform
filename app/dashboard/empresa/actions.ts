"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveCompanyFormAction(
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const companyId = formData.get("companyId") as string;
  const name = (formData.get("name") as string)?.trim();
  const city = (formData.get("city") as string)?.trim() || null;
  const ownerEmail = (formData.get("ownerEmail") as string)?.trim() || null;
  const industry = (formData.get("industry") as string)?.trim() || null;
  const sectorId = (formData.get("sectorId") as string) || null;

  if (!companyId || !name) {
    return { ok: false, error: "Nombre de empresa requerido." };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { ok: false, error: "Supabase no está configurado." };
  }

  const { error } = await supabase
    .from("companies")
    .update({
      name,
      city,
      owner_email: ownerEmail,
      industry,
      sector_id: sectorId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", companyId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/empresa");
  revalidatePath("/dashboard");

  return { ok: true };
}
