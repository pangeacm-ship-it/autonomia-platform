import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CompanyModule, Module } from "@/types/database";
import { mockCompanyModules, mockModules } from "./mock";

export async function getModules(): Promise<Module[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return mockModules;
  }

  const { data, error } = await supabase.from("modules").select("*").order("name");

  if (error || !data?.length) {
    return mockModules;
  }

  return data;
}

export async function getCompanyModules(companyId: string): Promise<CompanyModule[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return mockCompanyModules.filter((companyModule) => companyModule.company_id === companyId);
  }

  const fallbackModules = mockCompanyModules.filter(
    (companyModule) => companyModule.company_id === companyId,
  );

  const { data, error } = await supabase
    .from("company_modules")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at");

  if (error || !data?.length) {
    return fallbackModules;
  }

  return data;
}
