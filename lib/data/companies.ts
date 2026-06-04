import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Company } from "@/types/database";
import { mockCompany } from "./mock";
import { getCurrentProfileContext } from "./profiles";

export async function getCurrentCompany(): Promise<Company> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return mockCompany;
  }

  const profileContext = await getCurrentProfileContext();

  if (!profileContext.primaryCompanyId) {
    return mockCompany;
  }

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", profileContext.primaryCompanyId)
    .maybeSingle();

  if (error || !data) {
    return mockCompany;
  }

  return data;
}

export async function getCompanyById(companyId: string): Promise<Company | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return companyId === mockCompany.id ? mockCompany : null;
  }

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .maybeSingle();

  if (error) {
    return companyId === mockCompany.id ? mockCompany : null;
  }

  return data ?? (companyId === mockCompany.id ? mockCompany : null);
}
