import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Plan } from "@/types/database";
import { mockPlans } from "./mock";

export async function getPlans(): Promise<Plan[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return mockPlans;
  }

  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("monthly_price_cents");

  if (error || !data?.length) {
    return mockPlans;
  }

  return data;
}
