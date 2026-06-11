import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type DashboardStats = {
  posts: { total: number; pending: number; scheduled: number };
  tasks: { pending: number; inProgress: number };
  notifications: { unread: number };
  modules: { active: string[] };
  recentActivity: { title: string; module: string | null; createdAt: string }[];
};

const fallbackStats: DashboardStats = {
  posts: { total: 0, pending: 0, scheduled: 0 },
  tasks: { pending: 0, inProgress: 0 },
  notifications: { unread: 0 },
  modules: { active: [] },
  recentActivity: [],
};

export async function getDashboardStats(companyId: string): Promise<DashboardStats> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) return fallbackStats;

  const [
    postsResult,
    tasksResult,
    notificationsResult,
    modulesResult,
    activityResult,
  ] = await Promise.all([
    supabase
      .from("posts")
      .select("status")
      .eq("company_id", companyId)
      .is("deleted_at", null)
      .is("archived_at", null),

    supabase
      .from("tasks")
      .select("status")
      .eq("company_id", companyId)
      .in("status", ["pending", "in_progress"]),

    supabase
      .from("notifications")
      .select("id")
      .eq("company_id", companyId)
      .eq("status", "unread"),

    supabase
      .from("company_modules")
      .select("modules(name)")
      .eq("company_id", companyId)
      .eq("status", "active"),

    supabase
      .from("activities")
      .select("title, module_key, created_at")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const posts = postsResult.data ?? [];
  const pendingPosts = posts.filter((p) => p.status === "pending_approval").length;
  const scheduledPosts = posts.filter((p) => p.status === "scheduled").length;

  type TaskRow = { status: string };
  const tasks = (tasksResult.data ?? []) as TaskRow[];
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;

  type ModuleRow = { modules: { name: string } | { name: string }[] | null };
  const moduleRows = (modulesResult.data ?? []) as ModuleRow[];
  const activeModuleNames = moduleRows
    .map((row) => {
      const mod = Array.isArray(row.modules) ? row.modules[0] : row.modules;

      return mod?.name ?? null;
    })
    .filter((name): name is string => name !== null);

  type ActivityRow = { title: string; module_key: string | null; created_at: string };
  const activity = ((activityResult.data ?? []) as ActivityRow[]).map((a) => ({
    title: a.title,
    module: a.module_key ?? null,
    createdAt: a.created_at,
  }));

  return {
    posts: { total: posts.length, pending: pendingPosts, scheduled: scheduledPosts },
    tasks: { pending: pendingTasks, inProgress: inProgressTasks },
    notifications: { unread: notificationsResult.data?.length ?? 0 },
    modules: { active: activeModuleNames },
    recentActivity: activity,
  };
}
