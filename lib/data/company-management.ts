"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSuperadmin } from "@/lib/auth/roles";
import { getCurrentProfileContext } from "@/lib/data/profiles";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Company, Plan, Profile, Role, SubscriptionStatus } from "@/types/database";

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
    const { error: membershipError } = await auth.supabase
      .from("company_users")
      .upsert(
        {
          company_id: createdCompany.id,
          profile_id: adminProfile.id,
          role_id: companyAdminRole.id,
          status: "invited",
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
      }. Administrador inicial: ${adminEmail}.`,
    );

    revalidatePath("/superadmin");

    return {
      ok: true,
      message: `Empresa ${createdCompany.name} creada correctamente.`,
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
    initialModules: formData
      .getAll("initialModules")
      .filter((value): value is string => typeof value === "string"),
  });

  redirectWithResult(result);
}
