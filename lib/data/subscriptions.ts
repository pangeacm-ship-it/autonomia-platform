import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Subscription } from "@/types/database";
import { mockSubscription } from "./mock";

export async function getCurrentSubscription(companyId: string): Promise<Subscription | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return companyId === mockSubscription.company_id ? mockSubscription : null;
  }

  const fallbackSubscription =
    companyId === mockSubscription.company_id ? mockSubscription : null;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return fallbackSubscription;
  }

  return data;
}
