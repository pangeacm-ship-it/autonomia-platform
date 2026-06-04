import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Plan } from "@/types/database";
import { mockPlans } from "./mock";

function visiblePlans(plans: Plan[]) {
  return plans.filter((plan) => plan.status !== "hidden");
}

export async function getPlans(): Promise<Plan[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return visiblePlans(mockPlans);
  }

  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("monthly_price_cents");

  if (error || !data?.length) {
    return visiblePlans(mockPlans);
  }

  return visiblePlans(data);
}
