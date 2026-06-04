import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CompanyUser, Profile, Role } from "@/types/database";

export type CompanyUserWithProfile = CompanyUser & {
  profile: Pick<Profile, "email" | "full_name"> | null;
  role: Pick<Role, "key" | "name"> | null;
};

type CompanyUserRow = CompanyUser & {
  profiles?: Pick<Profile, "email" | "full_name"> | Pick<Profile, "email" | "full_name">[] | null;
  roles?: Pick<Role, "key" | "name"> | Pick<Role, "key" | "name">[] | null;
};

function firstRelation<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

function normalizeCompanyUser(row: CompanyUserRow): CompanyUserWithProfile {
  return {
    id: row.id,
    company_id: row.company_id,
    profile_id: row.profile_id,
    role_id: row.role_id,
    status: row.status,
    invited_at: row.invited_at,
    last_access_at: row.last_access_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    profile: firstRelation(row.profiles),
    role: firstRelation(row.roles),
  };
}

const fallbackCompanyUsers: CompanyUserWithProfile[] = [];

export async function getCompanyUsers(
  companyId: string,
): Promise<CompanyUserWithProfile[]> {
  const supabase = await createSupabaseServerClient();
  const fallback = fallbackCompanyUsers.filter((user) => user.company_id === companyId);

  if (!supabase) {
    return fallbackCompanyUsers;
  }

  const { data, error } = await supabase
    .from("company_users")
    .select("*, profiles(email, full_name), roles(key, name)")
    .eq("company_id", companyId)
    .order("created_at");

  if (error || !data?.length) {
    return fallback;
  }

  return ((data ?? []) as CompanyUserRow[]).map(normalizeCompanyUser);
}
