"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveProfileFormAction(
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const profileId = formData.get("profileId") as string;
  const fullName = (formData.get("fullName") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;

  if (!profileId) return { ok: false, error: "Perfil no identificado." };

  const supabase = await createSupabaseServerClient();

  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/cuenta");

  return { ok: true };
}
