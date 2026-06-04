"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Company, Module, Plan, Role } from "@/types/database";

export type OnboardingSignupInput = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  sectorKey: string;
  sectorName: string;
  objective: string;
  customObjective?: string;
  tone: string;
  recommendedModules: string[];
  password: string;
};

export type OnboardingSignupResult = {
  ok: boolean;
  message: string;
  email?: string;
};

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

function normalizeKey(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateInput(input: OnboardingSignupInput) {
  const companyName = normalizeText(input.companyName);
  const contactName = normalizeText(input.contactName);
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (!companyName) return "El nombre de empresa es obligatorio.";
  if (!contactName) return "El nombre de contacto es obligatorio.";
  if (!isValidEmail(email)) return "Introduce un email válido.";
  if (!input.sectorKey) return "Selecciona un sector.";
  if (!input.objective) return "Selecciona un objetivo principal.";
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }

  return null;
}

async function cleanupOnboardingSignup({
  companyId,
  authUserId,
}: {
  companyId: string | null;
  authUserId: string | null;
}) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) return;

  if (companyId) {
    await supabase.from("companies").delete().eq("id", companyId);
  }

  if (authUserId) {
    await supabase.auth.admin.deleteUser(authUserId);
  }
}

export async function createFreeTrialFromOnboarding(
  input: OnboardingSignupInput,
): Promise<OnboardingSignupResult> {
  const validationError = validateInput(input);

  if (validationError) {
    return { ok: false, message: validationError };
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return {
      ok: false,
      message:
        "Supabase no está configurado en el servidor. La solicitud queda solo en modo visual.",
    };
  }

  const companyName = normalizeText(input.companyName);
  const contactName = normalizeText(input.contactName);
  const email = normalizeEmail(input.email);
  const objective =
    input.objective === "Otro" && input.customObjective?.trim()
      ? input.customObjective.trim()
      : input.objective;
  let companyId: string | null = null;
  let authUserId: string | null = null;

  try {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingProfile) {
      return {
        ok: false,
        message: "Ya existe una cuenta con este email. Inicia sesión o usa otro correo.",
      };
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password: input.password,
        email_confirm: true,
        user_metadata: {
          full_name: contactName,
          company_name: companyName,
          onboarding_source: "landing",
          force_password_change: false,
        },
      });

    if (authError || !authData.user) {
      return {
        ok: false,
        message:
          authError?.message.toLowerCase().includes("already")
            ? "Ya existe una cuenta con este email. Inicia sesión o usa otro correo."
            : authError?.message ?? "No se pudo crear el usuario.",
      };
    }

    authUserId = authData.user.id;

    const [{ data: role }, { data: freePlan }, { data: sector }] =
      await Promise.all([
        supabase.from("roles").select("*").eq("key", "company_admin").maybeSingle(),
        supabase.from("plans").select("*").eq("key", "gratuito").maybeSingle(),
        supabase
          .from("business_sectors")
          .select("*")
          .eq("key", input.sectorKey)
          .maybeSingle(),
      ]);

    if (!role) {
      await cleanupOnboardingSignup({ companyId, authUserId });
      return { ok: false, message: "No existe el rol company_admin." };
    }

    if (!freePlan) {
      await cleanupOnboardingSignup({ companyId, authUserId });
      return { ok: false, message: "No existe el plan Gratuito." };
    }

    const companyAdminRole = role as Role;
    const selectedPlan = freePlan as Plan;
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + 7);

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: companyName,
        legal_name: null,
        slug: buildSlug(companyName),
        city: normalizeText(input.city) || null,
        status: "trial",
        industry: sector?.name ?? input.sectorName,
        sector_id: sector?.id ?? null,
        owner_name: contactName,
        owner_email: email,
      })
      .select("*")
      .single();

    if (companyError || !company) {
      await cleanupOnboardingSignup({ companyId, authUserId });
      return {
        ok: false,
        message: companyError?.message ?? "No se pudo crear la empresa.",
      };
    }

    const createdCompany = company as Company;
    companyId = createdCompany.id;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        auth_user_id: authUserId,
        full_name: contactName,
        email,
        phone: normalizeText(input.phone) || null,
        status: "active",
      })
      .select("*")
      .single();

    if (profileError || !profile) {
      await cleanupOnboardingSignup({ companyId, authUserId });
      return {
        ok: false,
        message: profileError?.message ?? "No se pudo crear el perfil.",
      };
    }

    const { error: membershipError } = await supabase.from("company_users").insert({
      company_id: createdCompany.id,
      profile_id: profile.id,
      role_id: companyAdminRole.id,
      status: "active",
      invited_at: now.toISOString(),
      last_access_at: now.toISOString(),
    });

    if (membershipError) {
      await cleanupOnboardingSignup({ companyId, authUserId });
      return { ok: false, message: membershipError.message };
    }

    const { error: subscriptionError } = await supabase.from("subscriptions").insert({
      company_id: createdCompany.id,
      plan_id: selectedPlan.id,
      status: "trial",
      started_at: now.toISOString(),
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: false,
      founder_price_locked: false,
      monthly_price_cents: selectedPlan.monthly_price_cents,
      currency: selectedPlan.currency,
    });

    if (subscriptionError) {
      await cleanupOnboardingSignup({ companyId, authUserId });
      return { ok: false, message: subscriptionError.message };
    }

    const { data: modules } = await supabase.from("modules").select("*");
    const moduleRows = ((modules ?? []) as Module[]).map((module) => {
      const moduleNameKey = normalizeKey(module.name);
      const moduleKey = normalizeKey(module.key);
      const recommendedKeys = input.recommendedModules.map(normalizeKey);
      const isSocialIA = module.key === "socialia" || moduleNameKey === "socialia";
      const isRecommended =
        recommendedKeys.includes(moduleNameKey) || recommendedKeys.includes(moduleKey);

      return {
        company_id: createdCompany.id,
        module_id: module.id,
        status: isSocialIA
          ? ("active" as const)
          : isRecommended
            ? ("recommended" as const)
            : ("available" as const),
        activated_at: isSocialIA ? now.toISOString() : null,
        settings: {},
      };
    });

    if (moduleRows.length) {
      const { error: modulesError } = await supabase
        .from("company_modules")
        .upsert(moduleRows, { onConflict: "company_id,module_id" });

      if (modulesError) {
        await cleanupOnboardingSignup({ companyId, authUserId });
        return { ok: false, message: modulesError.message };
      }
    }

    await supabase.from("demo_requests").insert({
      company_name: companyName,
      contact_name: contactName,
      email,
      phone: normalizeText(input.phone) || null,
      city: normalizeText(input.city) || null,
      industry: input.sectorName,
      interested_module: input.recommendedModules.join(", "),
      requested_plan_key: "gratuito",
      status: "converted",
      notes: `onboarding_source:landing; objective:${objective}; tone:${input.tone}; company_id:${createdCompany.id}`,
    });

    await supabase.from("superadmin_notes").insert({
      company_id: createdCompany.id,
      profile_id: null,
      visibility: "internal",
      note: `onboarding_created:landing:Alta autónoma desde landing. Plan Gratuito trial 7 días. Sector: ${input.sectorName}. Objetivo: ${objective}. Tono IA: ${input.tone}. Ciudad: ${normalizeText(input.city) || "No indicada"}. Elena memory pending.`,
    });

    revalidatePath("/superadmin");
    revalidatePath("/dashboard");

    return {
      ok: true,
      message: "Cuenta gratuita creada correctamente.",
      email,
    };
  } catch (error) {
    await cleanupOnboardingSignup({ companyId, authUserId });

    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo completar el alta autónoma.",
    };
  }
}
