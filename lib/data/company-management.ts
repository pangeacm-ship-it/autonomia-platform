"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSuperadmin } from "@/lib/auth/roles";
import { getCurrentProfileContext } from "@/lib/data/profiles";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  BusinessSectorRow,
  Company,
  CompanyModule,
  CompanyUser,
  Module,
  Plan,
  Profile,
  Role,
  Subscription,
  SubscriptionStatus,
  SuperadminNote,
} from "@/types/database";

type DemoType = "normal" | "comercial" | "vip" | "partner";

type CreateCompanyInput = {
  companyName: string;
  sectorId?: string | null;
  planId: string;
  adminName: string;
  adminEmail: string;
  demoType: DemoType;
  demoDays?: number | null;
  initialModules: string[];
  temporaryPassword?: string | null;
  forcePasswordChange?: boolean;
  sendInvitation?: boolean;
};

type ActionResult = {
  ok: boolean;
  message: string;
};

const redirectBase = "/superadmin";

function normalizeText(value: string) {
  return value.trim();
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function buildSlug(value: string) {
  const base = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${base || "empresa"}-${Date.now().toString(36)}`;
}

function demoStatus(demoType: DemoType): Company["status"] {
  return demoType === "vip" || demoType === "partner" ? "demo" : "trial";
}

function isUnlimitedDemo(demoType: DemoType, demoDays?: number | null) {
  return demoType === "vip" || demoType === "partner" || !demoDays;
}

function redirectWithResult(result: ActionResult): never {
  redirect(
    `${redirectBase}?action=${result.ok ? "success" : "error"}&message=${encodeURIComponent(
      result.message,
    )}`,
  );
}

function redirectWithResultTo(path: string, result: ActionResult): never {
  redirect(
    `${path}?action=${result.ok ? "success" : "error"}&message=${encodeURIComponent(
      result.message,
    )}`,
  );
}

async function getAuthorizedAdminClient() {
  const profileContext = await getCurrentProfileContext();

  if (!isSuperadmin(profileContext.primaryRole) || profileContext.isFallback) {
    return {
      ok: false as const,
      message: "Solo una sesión real de superadmin puede crear empresas.",
    };
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return {
      ok: false as const,
      message: "Supabase admin no está configurado en el servidor.",
    };
  }

  return {
    ok: true as const,
    supabase,
    profileId: profileContext.profile.id,
  };
}

async function addCreationNote(
  supabase: NonNullable<ReturnType<typeof createSupabaseAdminClient>>,
  companyId: string,
  profileId: string,
  note: string,
) {
  await supabase.from("superadmin_notes").insert({
    company_id: companyId,
    profile_id: profileId,
    note,
    visibility: "internal",
  });
}

async function addNote(
  supabase: NonNullable<ReturnType<typeof createSupabaseAdminClient>>,
  companyId: string,
  profileId: string,
  note: string,
) {
  await addCreationNote(supabase, companyId, profileId, note);
}

async function cleanupCreatedCompany(companyId: string | null) {
  if (!companyId) {
    return;
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return;
  }

  await supabase.from("companies").delete().eq("id", companyId);
}

export async function createCompanyWithAdmin(
  input: CreateCompanyInput,
): Promise<ActionResult> {
  return createCompanyWithAdminAuth(input);
}

export async function createOrInviteCompanyAdmin(input: {
  profileId: string;
  adminEmail: string;
  adminName: string;
  temporaryPassword?: string | null;
  sendInvitation?: boolean;
  forcePasswordChange?: boolean;
}): Promise<ActionResult & { authUserId?: string | null }> {
  const auth = await getAuthorizedAdminClient();

  if (!auth.ok) {
    return { ok: false, message: auth.message, authUserId: null };
  }

  const adminEmail = normalizeEmail(input.adminEmail);
  const adminName = normalizeText(input.adminName);
  const temporaryPassword = input.temporaryPassword?.trim();

  if (!adminEmail || !adminName) {
    return {
      ok: false,
      message: "Faltan datos del administrador.",
      authUserId: null,
    };
  }

  if (temporaryPassword) {
    const { data, error } = await auth.supabase.auth.admin.createUser({
      email: adminEmail,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: adminName,
        force_password_change: Boolean(input.forcePasswordChange),
      },
    });

    if (error && !error.message.toLowerCase().includes("already")) {
      return { ok: false, message: error.message, authUserId: null };
    }

    if (data.user?.id) {
      await auth.supabase
        .from("profiles")
        .update({
          auth_user_id: data.user.id,
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.profileId);

      return {
        ok: true,
        message: "Usuario Auth creado con contraseña temporal.",
        authUserId: data.user.id,
      };
    }
  }

  if (input.sendInvitation) {
    const { data, error } = await auth.supabase.auth.admin.inviteUserByEmail(
      adminEmail,
      {
        data: {
          full_name: adminName,
        },
      },
    );

    if (error) {
      return {
        ok: false,
        message: `Empresa creada, pero no se pudo enviar invitación: ${error.message}`,
        authUserId: null,
      };
    }

    if (data.user?.id) {
      await auth.supabase
        .from("profiles")
        .update({
          auth_user_id: data.user.id,
          status: "invited",
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.profileId);
    }

    return {
      ok: true,
      message: "Invitación enviada al administrador.",
      authUserId: data.user?.id ?? null,
    };
  }

  return {
    ok: true,
    message: "Perfil administrador preparado sin usuario Auth.",
    authUserId: null,
  };
}

export async function createCompanyWithAdminAuth(
  input: CreateCompanyInput,
): Promise<ActionResult> {
  const auth = await getAuthorizedAdminClient();

  if (!auth.ok) {
    return { ok: false, message: auth.message };
  }

  const companyName = normalizeText(input.companyName);
  const adminName = normalizeText(input.adminName);
  const adminEmail = normalizeEmail(input.adminEmail);
  const sectorId =
    input.sectorId && !input.sectorId.startsWith("demo-") ? input.sectorId : null;
  const initialModules = input.initialModules.filter(
    (moduleId) => moduleId && !moduleId.startsWith("demo-"),
  );

  if (!companyName || !input.planId || !adminName || !adminEmail) {
    return {
      ok: false,
      message: "Faltan datos obligatorios para crear la empresa.",
    };
  }

  let createdCompanyId: string | null = null;

  try {
    const now = new Date();
    const demoDays = input.demoDays ?? null;
    const periodEnd = demoDays ? new Date(now) : null;
    if (periodEnd && demoDays) {
      periodEnd.setDate(periodEnd.getDate() + demoDays);
    }

    const { data: plan, error: planError } = await auth.supabase
      .from("plans")
      .select("*")
      .eq("id", input.planId)
      .maybeSingle();

    if (planError || !plan) {
      return { ok: false, message: "El plan seleccionado no existe." };
    }

    const selectedPlan = plan as Plan;
    const { data: role, error: roleError } = await auth.supabase
      .from("roles")
      .select("*")
      .eq("key", "company_admin")
      .maybeSingle();

    if (roleError || !role) {
      return { ok: false, message: "No existe el rol company_admin." };
    }

    const companyAdminRole = role as Role;
    const { data: sector } = sectorId
      ? await auth.supabase
          .from("business_sectors")
          .select("name")
          .eq("id", sectorId)
          .maybeSingle()
      : { data: null };

    const { data: company, error: companyError } = await auth.supabase
      .from("companies")
      .insert({
        name: companyName,
        legal_name: null,
        slug: buildSlug(companyName),
        status: demoStatus(input.demoType),
        industry: sector?.name ?? null,
        sector_id: sectorId,
        owner_name: adminName,
        owner_email: adminEmail,
      })
      .select("*")
      .single();

    if (companyError || !company) {
      return {
        ok: false,
        message: companyError?.message ?? "No se pudo crear la empresa.",
      };
    }

    const createdCompany = company as Company;
    createdCompanyId = createdCompany.id;

    const { data: existingProfile } = await auth.supabase
      .from("profiles")
      .select("*")
      .eq("email", adminEmail)
      .maybeSingle();

    const profileResult = existingProfile
      ? { data: existingProfile, error: null }
      : await auth.supabase
          .from("profiles")
          .insert({
            full_name: adminName,
            email: adminEmail,
            status: "invited",
          })
          .select("*")
          .single();

    if (profileResult.error || !profileResult.data) {
      await cleanupCreatedCompany(createdCompanyId);

      return {
        ok: false,
        message:
          profileResult.error?.message ?? "No se pudo crear el administrador.",
      };
    }

    const adminProfile = profileResult.data as Profile;
    const accessResult = await createOrInviteCompanyAdmin({
      profileId: adminProfile.id,
      adminEmail,
      adminName,
      temporaryPassword: input.temporaryPassword,
      sendInvitation: input.sendInvitation,
      forcePasswordChange: input.forcePasswordChange,
    });

    if (!accessResult.ok && input.temporaryPassword) {
      await cleanupCreatedCompany(createdCompanyId);
      return {
        ok: false,
        message: accessResult.message,
      };
    }

    const { error: membershipError } = await auth.supabase
      .from("company_users")
      .upsert(
        {
          company_id: createdCompany.id,
          profile_id: adminProfile.id,
          role_id: companyAdminRole.id,
          status: input.temporaryPassword ? "active" : "invited",
          invited_at: now.toISOString(),
        },
        { onConflict: "company_id,profile_id,role_id" },
      );

    if (membershipError) {
      await cleanupCreatedCompany(createdCompanyId);
      return { ok: false, message: membershipError.message };
    }

    const subscriptionStatus: SubscriptionStatus = "trial";
    const { error: subscriptionError } = await auth.supabase
      .from("subscriptions")
      .insert({
        company_id: createdCompany.id,
        plan_id: selectedPlan.id,
        status: subscriptionStatus,
        started_at: now.toISOString(),
        current_period_start: now.toISOString(),
        current_period_end: isUnlimitedDemo(input.demoType, input.demoDays)
          ? null
          : periodEnd?.toISOString() ?? null,
        cancel_at_period_end: false,
        founder_price_locked: false,
        monthly_price_cents: selectedPlan.monthly_price_cents,
        currency: selectedPlan.currency,
      });

    if (subscriptionError) {
      await cleanupCreatedCompany(createdCompanyId);
      return { ok: false, message: subscriptionError.message };
    }

    if (initialModules.length) {
      const { error: modulesError } = await auth.supabase
        .from("company_modules")
        .upsert(
          initialModules.map((moduleId) => ({
            company_id: createdCompany.id,
            module_id: moduleId,
            status: "active" as const,
            activated_at: now.toISOString(),
            settings: {},
          })),
          { onConflict: "company_id,module_id" },
        );

      if (modulesError) {
        await cleanupCreatedCompany(createdCompanyId);
        return { ok: false, message: modulesError.message };
      }
    }

    await addCreationNote(
      auth.supabase,
      createdCompany.id,
      auth.profileId,
      `company_created:${input.demoType}:Empresa creada desde Superadmin. Demo ${
        isUnlimitedDemo(input.demoType, input.demoDays)
          ? "sin límite"
          : `${input.demoDays} días`
      }. Administrador inicial: ${adminEmail}. Acceso: ${accessResult.message}`,
    );

    revalidatePath("/superadmin");

    return {
      ok: true,
      message: input.temporaryPassword
        ? `Empresa ${createdCompany.name} creada. Comunica la contraseña temporal al cliente.`
        : `Empresa ${createdCompany.name} creada correctamente. ${accessResult.message}`,
    };
  } catch (error) {
    await cleanupCreatedCompany(createdCompanyId);

    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo completar el alta de empresa.",
    };
  }
}

export async function createCompanyWithAdminFormAction(formData: FormData) {
  const demoDuration = String(formData.get("demoDays") ?? "14");
  const result = await createCompanyWithAdmin({
    companyName: String(formData.get("companyName") ?? ""),
    sectorId: String(formData.get("sectorId") ?? ""),
    planId: String(formData.get("planId") ?? ""),
    adminName: String(formData.get("adminName") ?? ""),
    adminEmail: String(formData.get("adminEmail") ?? ""),
    demoType: String(formData.get("demoType") ?? "normal") as DemoType,
    demoDays: demoDuration === "unlimited" ? null : Number(demoDuration),
    temporaryPassword: String(formData.get("temporaryPassword") ?? "") || null,
    forcePasswordChange: formData.get("forcePasswordChange") === "on",
    sendInvitation: formData.get("sendInvitation") === "on",
    initialModules: formData
      .getAll("initialModules")
      .filter((value): value is string => typeof value === "string"),
  });

  redirectWithResult(result);
}

export type CompanyManagementDetail = {
  company: Company;
  adminProfile: Profile | null;
  adminMembership: CompanyUser | null;
  subscription: Subscription | null;
  companyModules: CompanyModule[];
  modules: Module[];
  plans: Plan[];
  sectors: BusinessSectorRow[];
  notes: SuperadminNote[];
};

export async function getCompanyManagementDetail(
  companyId: string,
): Promise<CompanyManagementDetail | null> {
  const auth = await getAuthorizedAdminClient();

  if (!auth.ok || !companyId || companyId.startsWith("demo-")) {
    return null;
  }

  const { data: company } = await auth.supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .maybeSingle();

  if (!company) {
    return null;
  }

  const [
    { data: memberships },
    { data: subscriptions },
    { data: companyModules },
    { data: modules },
    { data: plans },
    { data: sectors },
    { data: notes },
  ] = await Promise.all([
    auth.supabase
      .from("company_users")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at"),
    auth.supabase
      .from("subscriptions")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false }),
    auth.supabase
      .from("company_modules")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at"),
    auth.supabase.from("modules").select("*").order("name"),
    auth.supabase.from("plans").select("*").order("monthly_price_cents"),
    auth.supabase.from("business_sectors").select("*").order("name"),
    auth.supabase
      .from("superadmin_notes")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const adminMembership =
    memberships?.find((membership) => membership.company_id === companyId) ?? null;
  const { data: adminProfile } = adminMembership
    ? await auth.supabase
        .from("profiles")
        .select("*")
        .eq("id", adminMembership.profile_id)
        .maybeSingle()
    : { data: null };

  return {
    company,
    adminProfile: adminProfile ?? null,
    adminMembership,
    subscription: subscriptions?.[0] ?? null,
    companyModules: companyModules ?? [],
    modules: modules ?? [],
    plans: plans ?? [],
    sectors: sectors ?? [],
    notes: notes ?? [],
  };
}

export async function updateCompany(input: {
  companyId: string;
  name: string;
  sectorId?: string | null;
  city?: string | null;
  ownerName?: string | null;
  ownerEmail?: string | null;
  adminProfileId?: string | null;
  adminPhone?: string | null;
}): Promise<ActionResult> {
  const auth = await getAuthorizedAdminClient();

  if (!auth.ok) return { ok: false, message: auth.message };

  const sectorId =
    input.sectorId && !input.sectorId.startsWith("demo-") ? input.sectorId : null;
  const { data: sector } = sectorId
    ? await auth.supabase
        .from("business_sectors")
        .select("name")
        .eq("id", sectorId)
        .maybeSingle()
    : { data: null };

  const { error } = await auth.supabase
    .from("companies")
    .update({
      name: normalizeText(input.name),
      sector_id: sectorId,
      industry: sector?.name ?? null,
      city: input.city?.trim() || null,
      owner_name: input.ownerName?.trim() || null,
      owner_email: input.ownerEmail ? normalizeEmail(input.ownerEmail) : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.companyId);

  if (error) return { ok: false, message: error.message };

  if (input.adminProfileId) {
    await auth.supabase
      .from("profiles")
      .update({
        full_name: input.ownerName?.trim() || null,
        email: input.ownerEmail ? normalizeEmail(input.ownerEmail) : undefined,
        phone: input.adminPhone?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.adminProfileId);
  }

  await addNote(auth.supabase, input.companyId, auth.profileId, "company_updated:Empresa editada desde Superadmin.");
  revalidatePath("/superadmin");
  revalidatePath(`/superadmin/empresas/${input.companyId}`);

  return { ok: true, message: "Empresa actualizada correctamente." };
}

export async function updateCompanyPlan(input: {
  companyId: string;
  planId: string;
}): Promise<ActionResult> {
  const auth = await getAuthorizedAdminClient();

  if (!auth.ok) return { ok: false, message: auth.message };

  const { data: plan } = await auth.supabase
    .from("plans")
    .select("*")
    .eq("id", input.planId)
    .maybeSingle();

  if (!plan) return { ok: false, message: "Plan no encontrado." };

  const { data: subscription } = await auth.supabase
    .from("subscriptions")
    .select("id")
    .eq("company_id", input.companyId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const now = new Date().toISOString();
  const result = subscription?.id
    ? await auth.supabase
        .from("subscriptions")
        .update({
          plan_id: input.planId,
          monthly_price_cents: plan.monthly_price_cents,
          currency: plan.currency,
          updated_at: now,
        })
        .eq("id", subscription.id)
    : await auth.supabase.from("subscriptions").insert({
        company_id: input.companyId,
        plan_id: input.planId,
        status: "trial",
        started_at: now,
        current_period_start: now,
        monthly_price_cents: plan.monthly_price_cents,
        currency: plan.currency,
      });

  if (result.error) return { ok: false, message: result.error.message };

  await addNote(auth.supabase, input.companyId, auth.profileId, `plan_updated:${input.planId}:Plan actualizado desde Superadmin.`);
  revalidatePath("/superadmin");
  revalidatePath(`/superadmin/empresas/${input.companyId}`);

  return { ok: true, message: "Plan actualizado correctamente." };
}

export async function updateCompanyStatus(input: {
  companyId: string;
  status: Company["status"];
}): Promise<ActionResult> {
  const auth = await getAuthorizedAdminClient();

  if (!auth.ok) return { ok: false, message: auth.message };

  const { error } = await auth.supabase
    .from("companies")
    .update({ status: input.status, updated_at: new Date().toISOString() })
    .eq("id", input.companyId);

  if (error) return { ok: false, message: error.message };

  await addNote(auth.supabase, input.companyId, auth.profileId, `status_updated:${input.status}:Estado actualizado desde Superadmin.`);
  revalidatePath("/superadmin");
  revalidatePath(`/superadmin/empresas/${input.companyId}`);

  return { ok: true, message: "Estado actualizado correctamente." };
}

export async function updateCompanyModules(input: {
  companyId: string;
  moduleIds: string[];
}): Promise<ActionResult> {
  const auth = await getAuthorizedAdminClient();

  if (!auth.ok) return { ok: false, message: auth.message };

  const { data: modules } = await auth.supabase.from("modules").select("id");
  const validModuleIds = new Set((modules ?? []).map((module) => module.id));
  const selectedIds = input.moduleIds.filter((moduleId) => validModuleIds.has(moduleId));
  const now = new Date().toISOString();

  await auth.supabase
    .from("company_modules")
    .update({ status: "available", activated_at: null, updated_at: now })
    .eq("company_id", input.companyId);

  if (selectedIds.length) {
    const { error } = await auth.supabase
      .from("company_modules")
      .upsert(
        selectedIds.map((moduleId) => ({
          company_id: input.companyId,
          module_id: moduleId,
          status: "active" as const,
          activated_at: now,
          settings: {},
        })),
        { onConflict: "company_id,module_id" },
      );

    if (error) return { ok: false, message: error.message };
  }

  await addNote(auth.supabase, input.companyId, auth.profileId, "modules_updated:Módulos actualizados desde Superadmin.");
  revalidatePath("/superadmin");
  revalidatePath(`/superadmin/empresas/${input.companyId}`);

  return { ok: true, message: "Módulos actualizados correctamente." };
}

export async function resetCompanyAdminAccess(input: {
  companyId: string;
  profileId: string;
  adminEmail: string;
  adminName: string;
  temporaryPassword?: string | null;
  sendInvitation?: boolean;
}): Promise<ActionResult> {
  const auth = await getAuthorizedAdminClient();

  if (!auth.ok) return { ok: false, message: auth.message };

  const result = await createOrInviteCompanyAdmin({
    profileId: input.profileId,
    adminEmail: input.adminEmail,
    adminName: input.adminName,
    temporaryPassword: input.temporaryPassword,
    sendInvitation: input.sendInvitation,
    forcePasswordChange: Boolean(input.temporaryPassword),
  });

  await addNote(auth.supabase, input.companyId, auth.profileId, `admin_access_reset:${input.adminEmail}:${result.message}`);
  revalidatePath(`/superadmin/empresas/${input.companyId}`);

  return { ok: result.ok, message: result.message };
}

export async function updateCompanyFormAction(formData: FormData) {
  const companyId = String(formData.get("companyId") ?? "");
  const result = await updateCompany({
    companyId,
    name: String(formData.get("name") ?? ""),
    sectorId: String(formData.get("sectorId") ?? ""),
    city: String(formData.get("city") ?? ""),
    ownerName: String(formData.get("ownerName") ?? ""),
    ownerEmail: String(formData.get("ownerEmail") ?? ""),
    adminProfileId: String(formData.get("adminProfileId") ?? ""),
    adminPhone: String(formData.get("adminPhone") ?? ""),
  });

  redirectWithResultTo(`/superadmin/empresas/${companyId}`, result);
}

export async function updateCompanyPlanFormAction(formData: FormData) {
  const companyId = String(formData.get("companyId") ?? "");
  const result = await updateCompanyPlan({
    companyId,
    planId: String(formData.get("planId") ?? ""),
  });

  redirectWithResultTo(`/superadmin/empresas/${companyId}`, result);
}

export async function updateCompanyStatusFormAction(formData: FormData) {
  const companyId = String(formData.get("companyId") ?? "");
  const result = await updateCompanyStatus({
    companyId,
    status: String(formData.get("status") ?? "trial") as Company["status"],
  });

  redirectWithResultTo(`/superadmin/empresas/${companyId}`, result);
}

export async function updateCompanyModulesFormAction(formData: FormData) {
  const companyId = String(formData.get("companyId") ?? "");
  const result = await updateCompanyModules({
    companyId,
    moduleIds: formData
      .getAll("moduleIds")
      .filter((value): value is string => typeof value === "string"),
  });

  redirectWithResultTo(`/superadmin/empresas/${companyId}`, result);
}

export async function resetCompanyAdminAccessFormAction(formData: FormData) {
  const companyId = String(formData.get("companyId") ?? "");
  const result = await resetCompanyAdminAccess({
    companyId,
    profileId: String(formData.get("profileId") ?? ""),
    adminEmail: String(formData.get("adminEmail") ?? ""),
    adminName: String(formData.get("adminName") ?? ""),
    temporaryPassword: String(formData.get("temporaryPassword") ?? "") || null,
    sendInvitation: formData.get("sendInvitation") === "on",
  });

  redirectWithResultTo(`/superadmin/empresas/${companyId}`, result);
}
