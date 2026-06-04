import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isUserRole, pickPrimaryRole } from "@/lib/auth/roles";
import type { CompanyUser, Profile, Role, UserRole } from "@/types/database";
import { mockCompany, mockProfile } from "./mock";

export type CurrentMembership = CompanyUser & {
  role: Pick<Role, "key" | "name"> | null;
};

export type CurrentProfileContext = {
  profile: Profile;
  memberships: CurrentMembership[];
  primaryCompanyId: string | null;
  primaryRole: UserRole | null;
  isFallback: boolean;
};

type MembershipRow = CompanyUser & {
  role?: string | null;
  roles?: Pick<Role, "key" | "name"> | Pick<Role, "key" | "name">[] | null;
};

function normalizeMembership(row: MembershipRow): CurrentMembership {
  const roleData = Array.isArray(row.roles) ? row.roles[0] : row.roles;
  const directRole = isUserRole(row.role) ? row.role : null;

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
    role: directRole
      ? {
          key: directRole,
          name: directRole,
        }
      : roleData && isUserRole(roleData.key)
        ? {
            key: roleData.key,
            name: roleData.name,
          }
        : null,
  };
}

function getFallbackContext(profile: Profile = mockProfile): CurrentProfileContext {
  return {
    profile,
    memberships: [],
    primaryCompanyId: mockCompany.id,
    primaryRole: "company_admin",
    isFallback: true,
  };
}

export async function getCurrentProfile(): Promise<Profile> {
  const context = await getCurrentProfileContext();

  return context.profile;
}

export async function getCurrentProfileContext(): Promise<CurrentProfileContext> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return getFallbackContext();
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return getFallbackContext();
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  const profile = profileData as Profile | null;

  if (profileError || !profile) {
    return getFallbackContext({
      ...mockProfile,
      auth_user_id: user.id,
      email: user.email ?? mockProfile.email,
    });
  }

  const { data: membershipData, error: membershipError } = await supabase
    .from("company_users")
    .select("*, roles(key, name)")
    .eq("profile_id", profile.id)
    .eq("status", "active");

  if (membershipError) {
    return {
      profile,
      memberships: [],
      primaryCompanyId: null,
      primaryRole: null,
      isFallback: false,
    };
  }

  const memberships = ((membershipData ?? []) as MembershipRow[]).map(
    normalizeMembership,
  );
  const profileWithRole = profile as Profile & { role?: string | null };
  const profileRole = isUserRole(profileWithRole.role)
    ? profileWithRole.role
    : null;
  const primaryRole = pickPrimaryRole(
    [profileRole, ...memberships.map((membership) => membership.role?.key ?? null)],
  );

  return {
    profile,
    memberships,
    primaryCompanyId:
      memberships.find((membership) => membership.company_id)?.company_id ?? null,
    primaryRole,
    isFallback: false,
  };
}
