import type { UserRole } from "@/types/database";

const userRoles = [
  "superadmin",
  "company_admin",
  "marketing",
  "sales",
  "support",
  "readonly",
] as const satisfies readonly UserRole[];

const moduleAccessByRole: Record<Exclude<UserRole, "superadmin" | "company_admin">, string[]> = {
  marketing: ["socialia", "reviewia", "calendario", "insightia"],
  sales: ["leadia", "whatsappia", "reservaia"],
  support: ["whatsappia", "reviewia"],
  readonly: ["dashboard", "insightia", "facturacion", "suscripcion"],
};

export function isUserRole(role: string | null | undefined): role is UserRole {
  return userRoles.includes(role as UserRole);
}

export function pickPrimaryRole(roles: Array<UserRole | null | undefined>): UserRole | null {
  const priority: UserRole[] = [
    "superadmin",
    "company_admin",
    "marketing",
    "sales",
    "support",
    "readonly",
  ];

  return priority.find((role) => roles.includes(role)) ?? null;
}

export function isSuperadmin(role: UserRole | null | undefined) {
  return role === "superadmin";
}

export function isCompanyAdmin(role: UserRole | null | undefined) {
  return role === "company_admin";
}

export function canAccessModule(role: UserRole | null | undefined, moduleKey: string) {
  if (!role) {
    return false;
  }

  if (isSuperadmin(role) || isCompanyAdmin(role)) {
    return true;
  }

  return moduleAccessByRole[role].includes(moduleKey);
}

export function canManageUsers(role: UserRole | null | undefined) {
  return isSuperadmin(role) || isCompanyAdmin(role);
}

export function canViewBilling(role: UserRole | null | undefined) {
  return isSuperadmin(role) || isCompanyAdmin(role) || role === "readonly";
}

export function canUseSuperadmin(role: UserRole | null | undefined) {
  return isSuperadmin(role);
}
