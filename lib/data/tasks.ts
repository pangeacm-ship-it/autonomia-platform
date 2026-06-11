import "server-only";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Task, TaskPriority, TaskStatus } from "@/types/database";

export async function getCompanyTasks(companyId: string): Promise<Task[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) return [];

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("company_id", companyId)
    .neq("status", "canceled")
    .order("due_at", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) return [];

  return (data ?? []) as Task[];
}

export async function createTaskFormAction(formData: FormData) {
  "use server";

  const companyId = formData.get("companyId") as string;
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string | null)?.trim() || null;
  const priority = (formData.get("priority") as TaskPriority) ?? "medium";
  const dueAt = (formData.get("dueAt") as string | null) || null;
  const moduleKey = (formData.get("moduleKey") as string | null) || null;

  if (!companyId || !title) return;

  const supabase = await createSupabaseServerClient();

  if (!supabase) return;

  await supabase.from("tasks").insert({
    company_id: companyId,
    title,
    description,
    priority,
    due_at: dueAt,
    module_key: moduleKey,
    status: "pending",
  });

  revalidatePath("/dashboard/tareas");
  revalidatePath("/dashboard");
}

export async function updateTaskStatusFormAction(formData: FormData) {
  "use server";

  const taskId = formData.get("taskId") as string;
  const status = formData.get("status") as TaskStatus;

  if (!taskId || !status) return;

  const supabase = await createSupabaseServerClient();

  if (!supabase) return;

  await supabase
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", taskId);

  revalidatePath("/dashboard/tareas");
  revalidatePath("/dashboard");
}
