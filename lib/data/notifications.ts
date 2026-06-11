import "server-only";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Notification } from "@/types/database";

export async function getCompanyNotifications(companyId: string): Promise<Notification[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("company_id", companyId)
    .neq("status", "archived")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return [];

  return (data ?? []) as Notification[];
}

export async function markNotificationReadFormAction(formData: FormData) {
  "use server";

  const notificationId = formData.get("notificationId") as string;

  if (!notificationId) return;

  const supabase = await createSupabaseServerClient();

  if (!supabase) return;

  await supabase
    .from("notifications")
    .update({ status: "read", updated_at: new Date().toISOString() })
    .eq("id", notificationId);

  revalidatePath("/dashboard/notificaciones");
  revalidatePath("/dashboard");
}

export async function markAllNotificationsReadFormAction(formData: FormData) {
  "use server";

  const companyId = formData.get("companyId") as string;

  if (!companyId) return;

  const supabase = await createSupabaseServerClient();

  if (!supabase) return;

  await supabase
    .from("notifications")
    .update({ status: "read", updated_at: new Date().toISOString() })
    .eq("company_id", companyId)
    .eq("status", "unread");

  revalidatePath("/dashboard/notificaciones");
  revalidatePath("/dashboard");
}
