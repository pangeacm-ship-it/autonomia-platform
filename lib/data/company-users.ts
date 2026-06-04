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

const fallbackCompanyUsers: CompanyUserWithProfile[] = [
  {
    id: "demo-company-user-juanma",
    company_id: "demo-company-bar-la-plaza",
    profile_id: "demo-profile-juanma",
    role_id: "role-company-admin",
    status: "active",
    invited_at: "2026-01-15T09:00:00.000Z",
    last_access_at: "2026-06-03T09:42:00.000Z",
    created_at: "2026-01-15T09:00:00.000Z",
    updated_at: "2026-06-03T09:42:00.000Z",
    profile: {
      full_name: "Juanma Salado",
      email: "juanma@barlaplaza.com",
    },
    role: {
      key: "company_admin",
      name: "Admin",
    },
  },
  {
    id: "demo-company-user-marketing",
    company_id: "demo-company-bar-la-plaza",
    profile_id: "demo-profile-marketing",
    role_id: "role-marketing",
    status: "active",
    invited_at: "2026-02-01T09:00:00.000Z",
    last_access_at: "2026-06-02T18:15:00.000Z",
    created_at: "2026-02-01T09:00:00.000Z",
    updated_at: "2026-06-02T18:15:00.000Z",
    profile: {
      full_name: "María López",
      email: "marketing@barlaplaza.com",
    },
    role: {
      key: "marketing",
      name: "Marketing",
    },
  },
  {
    id: "demo-company-user-sales",
    company_id: "demo-company-bar-la-plaza",
    profile_id: "demo-profile-sales",
    role_id: "role-sales",
    status: "invited",
    invited_at: "2026-05-28T09:00:00.000Z",
    last_access_at: null,
    created_at: "2026-05-28T09:00:00.000Z",
    updated_at: "2026-05-28T09:00:00.000Z",
    profile: {
      full_name: "Pedro Ruiz",
      email: "ventas@barlaplaza.com",
    },
    role: {
      key: "sales",
      name: "Comercial",
    },
  },
];

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
    return fallback.length ? fallback : fallbackCompanyUsers;
  }

  return ((data ?? []) as CompanyUserRow[]).map(normalizeCompanyUser);
}
