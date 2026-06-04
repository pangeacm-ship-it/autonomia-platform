"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSuperadmin } from "@/lib/auth/roles";
import { getCurrentProfileContext } from "@/lib/data/profiles";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CompanyModule, SubscriptionStatus } from "@/types/database";

type ActionResult = {
  ok: boolean;
  message: string;
};

type ModuleStatusInput = "active" | "recommended" | "available" | "locked";

const actionRedirectBase = "/superadmin";

function redirectWithResult(result: ActionResult): never {
  const action = result.ok ? "success" : "error";
  redirect(
    `${actionRedirectBase}?action=${action}&message=${encodeURIComponent(
      result.message,
    )}`,
  );
}

async function getAuthorizedAdminClient() {
  const profileContext = await getCurrentProfileContext();

  if (!isSuperadmin(profileContext.primaryRole) || profileContext.isFallback) {
    return {
      ok: false as const,
      message: "Solo una sesión real de superadmin puede ejecutar esta acción.",
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

async function addInternalNote(
  supabase: NonNullable<ReturnType<typeof createSupabaseAdminClient>>,
  companyId: string,
  profileId: string | null,
  note: string,
) {
  await supabase.from("superadmin_notes").insert({
    company_id: companyId,
    profile_id: profileId,
    note,
    visibility: "internal",
  });
}

function isValidId(value: FormDataEntryValue | null): value is string {
  return typeof value === "string" && value.length > 0 && !value.startsWith("demo-");
}

function mapModuleStatus(status: ModuleStatusInput): CompanyModule["status"] {
  return status === "locked" ? "disabled" : status;
}

function moduleStatusLabel(status: ModuleStatusInput) {
  if (status === "active") return "activo";
  if (status === "recommended") return "recomendado";
  if (status === "available") return "disponible";
  return "bloqueado";
}

async function finishAction(result: ActionResult) {
  revalidatePath("/superadmin");
  return result;
}

export async function extendCompanyDemo(
  companyId: string,
  days: number,
): Promise<ActionResult> {
  const auth = await getAuthorizedAdminClient();

  if (!auth.ok) {
    return finishAction({ ok: false, message: auth.message });
  }

  if (!companyId || days <= 0) {
    return finishAction({ ok: false, message: "Empresa o días no válidos." });
  }

  const { error } = await auth.supabase
    .from("companies")
    .update({ status: "demo", updated_at: new Date().toISOString() })
    .eq("id", companyId);

  if (error) {
    return finishAction({ ok: false, message: error.message });
  }

  await addInternalNote(
    auth.supabase,
    companyId,
    auth.profileId,
    `demo_extended:${days}:Demo extendida ${days} días desde Superadmin.`,
  );

  return finishAction({ ok: true, message: `Demo extendida ${days} días.` });
}

export async function setCompanyDemoUnlimited(
  companyId: string,
): Promise<ActionResult> {
  const auth = await getAuthorizedAdminClient();

  if (!auth.ok) {
    return finishAction({ ok: false, message: auth.message });
  }

  const { error } = await auth.supabase
    .from("companies")
    .update({ status: "demo", updated_at: new Date().toISOString() })
    .eq("id", companyId);

  if (error) {
    return finishAction({ ok: false, message: error.message });
  }

  await addInternalNote(
    auth.supabase,
    companyId,
    auth.profileId,
    "demo_unlimited:true:Demo marcada como sin límite desde Superadmin.",
  );

  return finishAction({ ok: true, message: "Demo marcada como sin límite." });
}

export async function suspendCompanyDemo(
  companyId: string,
): Promise<ActionResult> {
  const auth = await getAuthorizedAdminClient();

  if (!auth.ok) {
    return finishAction({ ok: false, message: auth.message });
  }

  const { error } = await auth.supabase
    .from("companies")
    .update({ status: "suspended", updated_at: new Date().toISOString() })
    .eq("id", companyId);

  if (error) {
    return finishAction({ ok: false, message: error.message });
  }

  await addInternalNote(
    auth.supabase,
    companyId,
    auth.profileId,
    "demo_suspended:true:Demo suspendida desde Superadmin.",
  );

  return finishAction({ ok: true, message: "Demo suspendida correctamente." });
}

export async function convertDemoToCustomer(
  companyId: string,
  planId: string,
): Promise<ActionResult> {
  const auth = await getAuthorizedAdminClient();

  if (!auth.ok) {
    return finishAction({ ok: false, message: auth.message });
  }

  if (!planId) {
    return finishAction({
      ok: false,
      message: "No hay plan asociado para convertir esta demo.",
    });
  }

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const { error: companyError } = await auth.supabase
    .from("companies")
    .update({ status: "active", updated_at: now.toISOString() })
    .eq("id", companyId);

  if (companyError) {
    return finishAction({ ok: false, message: companyError.message });
  }

  const { data: currentSubscription } = await auth.supabase
    .from("subscriptions")
    .select("id")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const subscriptionPayload = {
    plan_id: planId,
    status: "active" as SubscriptionStatus,
    current_period_start: now.toISOString(),
    current_period_end: periodEnd.toISOString(),
    suspended_at: null,
    cancel_at_period_end: false,
    updated_at: now.toISOString(),
  };

  const subscriptionResult = currentSubscription?.id
    ? await auth.supabase
        .from("subscriptions")
        .update(subscriptionPayload)
        .eq("id", currentSubscription.id)
    : await auth.supabase.from("subscriptions").insert({
        company_id: companyId,
        started_at: now.toISOString(),
        monthly_price_cents: null,
        currency: "EUR",
        founder_price_locked: false,
        ...subscriptionPayload,
      });

  if (subscriptionResult.error) {
    return finishAction({ ok: false, message: subscriptionResult.error.message });
  }

  await addInternalNote(
    auth.supabase,
    companyId,
    auth.profileId,
    "demo_converted:true:Demo convertida en cliente desde Superadmin.",
  );

  return finishAction({ ok: true, message: "Demo convertida en cliente." });
}

export async function updateCompanyModuleStatus(
  companyId: string,
  moduleId: string,
  status: ModuleStatusInput,
): Promise<ActionResult> {
  const auth = await getAuthorizedAdminClient();

  if (!auth.ok) {
    return finishAction({ ok: false, message: auth.message });
  }

  const mappedStatus = mapModuleStatus(status);
  const now = new Date().toISOString();
  const { data: currentCompanyModule } = await auth.supabase
    .from("company_modules")
    .select("id")
    .eq("company_id", companyId)
    .eq("module_id", moduleId)
    .maybeSingle();

  const payload = {
    status: mappedStatus,
    activated_at: mappedStatus === "active" ? now : null,
    updated_at: now,
  };

  const result = currentCompanyModule?.id
    ? await auth.supabase
        .from("company_modules")
        .update(payload)
        .eq("id", currentCompanyModule.id)
    : await auth.supabase.from("company_modules").insert({
        company_id: companyId,
        module_id: moduleId,
        status: mappedStatus,
        activated_at: payload.activated_at,
        settings: {},
      });

  if (result.error) {
    return finishAction({ ok: false, message: result.error.message });
  }

  await addInternalNote(
    auth.supabase,
    companyId,
    auth.profileId,
    `module_status:${moduleId}:${status}:Módulo marcado como ${moduleStatusLabel(
      status,
    )} desde Superadmin.`,
  );

  return finishAction({
    ok: true,
    message: `Módulo marcado como ${moduleStatusLabel(status)}.`,
  });
}

export async function exemptCompanyFromPromoRequirement(
  companyId: string,
  exempt: boolean,
): Promise<ActionResult> {
  const auth = await getAuthorizedAdminClient();

  if (!auth.ok) {
    return finishAction({ ok: false, message: auth.message });
  }

  await addInternalNote(
    auth.supabase,
    companyId,
    auth.profileId,
    `promo_exemption:${exempt}:Exención promocional ${
      exempt ? "activada" : "retirada"
    } desde Superadmin.`,
  );

  return finishAction({
    ok: true,
    message: exempt
      ? "Exención promocional activada."
      : "Exención promocional retirada.",
  });
}

export async function extendCompanyDemoFormAction(formData: FormData) {
  const companyId = formData.get("companyId");
  const days = Number(formData.get("days"));

  if (!isValidId(companyId)) {
    redirectWithResult({ ok: false, message: "Empresa no válida para acción real." });
  }

  redirectWithResult(await extendCompanyDemo(companyId, days));
}

export async function setCompanyDemoUnlimitedFormAction(formData: FormData) {
  const companyId = formData.get("companyId");

  if (!isValidId(companyId)) {
    redirectWithResult({ ok: false, message: "Empresa no válida para acción real." });
  }

  redirectWithResult(await setCompanyDemoUnlimited(companyId));
}

export async function suspendCompanyDemoFormAction(formData: FormData) {
  const companyId = formData.get("companyId");

  if (!isValidId(companyId)) {
    redirectWithResult({ ok: false, message: "Empresa no válida para acción real." });
  }

  redirectWithResult(await suspendCompanyDemo(companyId));
}

export async function convertDemoToCustomerFormAction(formData: FormData) {
  const companyId = formData.get("companyId");
  const planId = formData.get("planId");

  if (!isValidId(companyId) || typeof planId !== "string") {
    redirectWithResult({ ok: false, message: "Empresa o plan no válidos." });
  }

  redirectWithResult(await convertDemoToCustomer(companyId, planId));
}

export async function updateCompanyModuleStatusFormAction(formData: FormData) {
  const companyId = formData.get("companyId");
  const moduleId = formData.get("moduleId");
  const status = formData.get("status");

  if (
    !isValidId(companyId) ||
    !isValidId(moduleId) ||
    (status !== "active" &&
      status !== "recommended" &&
      status !== "available" &&
      status !== "locked")
  ) {
    redirectWithResult({
      ok: false,
      message: "Empresa, módulo o estado no válidos.",
    });
  }

  redirectWithResult(await updateCompanyModuleStatus(companyId, moduleId, status));
}

export async function exemptCompanyFromPromoRequirementFormAction(
  formData: FormData,
) {
  const companyId = formData.get("companyId");
  const exempt = formData.get("exempt") === "true";

  if (!isValidId(companyId)) {
    redirectWithResult({ ok: false, message: "Empresa no válida para acción real." });
  }

  redirectWithResult(await exemptCompanyFromPromoRequirement(companyId, exempt));
}
