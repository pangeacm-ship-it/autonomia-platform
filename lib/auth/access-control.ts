import { getCurrentCompany } from "@/lib/data/companies";
import { getPlans } from "@/lib/data/plans";
import { getCurrentSubscription } from "@/lib/data/subscriptions";
import type { Plan, Subscription, SubscriptionStatus } from "@/types/database";

export type DashboardAccessContext = {
  plan: Plan | null;
  planKey: string;
  subscription: Subscription | null;
  subscriptionStatus: SubscriptionStatus;
  isFallback: boolean;
};

const routeModuleMap: Record<string, string> = {
  "/dashboard/socialia": "socialia",
  "/dashboard/reviewia": "reviewia",
  "/dashboard/whatsappia": "whatsappia",
  "/dashboard/leadia": "leadia",
  "/dashboard/reservaia": "reservaia",
  "/dashboard/insightia": "insightia",
  "/dashboard/google-business": "google_business",
  "/dashboard/tiktok-shorts": "tiktok_shorts",
};

const allowedRoutesByPlan: Record<string, string[]> = {
  gratuito: [
    "/dashboard",
    "/dashboard/socialia",
    "/dashboard/empresa",
    "/dashboard/suscripcion",
    "/dashboard/facturacion",
  ],
  inicio: [
    "/dashboard",
    "/dashboard/socialia",
    "/dashboard/empresa",
    "/dashboard/suscripcion",
    "/dashboard/facturacion",
    "/dashboard/modulos",
  ],
  crecimiento: [
    "/dashboard",
    "/dashboard/socialia",
    "/dashboard/calendario",
    "/dashboard/google-business",
    "/dashboard/reviewia",
    "/dashboard/insightia",
    "/dashboard/usuarios",
    "/dashboard/empresa",
    "/dashboard/suscripcion",
    "/dashboard/facturacion",
    "/dashboard/modulos",
  ],
  local_ia_360: ["*"],
  enterprise: ["*"],
};

const allowedModulesByPlan: Record<string, string[]> = {
  gratuito: ["socialia"],
  inicio: ["socialia"],
  crecimiento: ["socialia", "calendario_ia", "google_business", "reviewia", "insightia"],
  local_ia_360: [
    "socialia",
    "calendario_ia",
    "google_business",
    "reviewia",
    "insightia",
    "leadia",
    "whatsappia",
    "reservaia",
  ],
  enterprise: ["*"],
};

export function getPlanUserLimit(planKey: string | null | undefined) {
  if (planKey === "gratuito") return 1;
  if (planKey === "inicio") return 1;
  if (planKey === "crecimiento") return 2;
  if (planKey === "local_ia_360") return 5;
  if (planKey === "enterprise") return null;
  return 1;
}

export function isSubscriptionOperational(status: SubscriptionStatus | null | undefined) {
  return status === "trial" || status === "active" || status === "past_due";
}

export function shouldShowSubscriptionWarning(
  status: SubscriptionStatus | null | undefined,
) {
  return status === "past_due";
}

function normalizeRoute(route: string) {
  return route.replace(/\/$/, "") || "/dashboard";
}

export function canAccessDashboardRoute(
  route: string,
  planKey: string | null | undefined,
  subscriptionStatus: SubscriptionStatus | null | undefined,
) {
  const normalizedRoute = normalizeRoute(route);

  if (subscriptionStatus === "suspended" || subscriptionStatus === "canceled") {
    return [
      "/dashboard/facturacion",
      "/dashboard/suscripcion",
      "/billing-required",
    ].includes(normalizedRoute);
  }

  if (!isSubscriptionOperational(subscriptionStatus)) {
    return false;
  }

  const key = planKey ?? "gratuito";
  const allowedRoutes = allowedRoutesByPlan[key] ?? allowedRoutesByPlan.gratuito;

  return allowedRoutes.includes("*") || allowedRoutes.includes(normalizedRoute);
}

export function canAccessModuleKey(
  moduleKey: string,
  planKey: string | null | undefined,
  subscriptionStatus: SubscriptionStatus | null | undefined,
) {
  if (!isSubscriptionOperational(subscriptionStatus)) {
    return false;
  }

  const key = planKey ?? "gratuito";
  const allowedModules = allowedModulesByPlan[key] ?? allowedModulesByPlan.gratuito;

  return allowedModules.includes("*") || allowedModules.includes(moduleKey);
}

export function getAccessDeniedReason(
  routeOrModule: string,
  planKey: string | null | undefined,
  subscriptionStatus: SubscriptionStatus | null | undefined,
) {
  if (subscriptionStatus === "suspended") {
    return "La suscripción está suspendida. Regulariza la facturación para recuperar el acceso operativo.";
  }

  if (subscriptionStatus === "canceled") {
    return "La suscripción está cancelada. Reactiva el plan para recuperar este acceso.";
  }

  if (subscriptionStatus === "past_due") {
    return "Hay un problema con la renovación. Puedes seguir accediendo, pero conviene actualizar el método de pago.";
  }

  return `El plan ${planKey ?? "actual"} no incluye ${routeOrModule}.`;
}

export function getModuleKeyForRoute(route: string) {
  return routeModuleMap[normalizeRoute(route)] ?? null;
}

export async function getCurrentDashboardAccess(): Promise<DashboardAccessContext> {
  const company = await getCurrentCompany();
  const subscription = await getCurrentSubscription(company.id);
  const plans = await getPlans();
  const plan = plans.find((item) => item.id === subscription?.plan_id) ?? null;

  return {
    plan,
    planKey: plan?.key ?? "gratuito",
    subscription,
    subscriptionStatus: subscription?.status ?? "trial",
    isFallback: company.id.startsWith("demo-") || !subscription,
  };
}

export async function getDashboardRouteAccess(route: string) {
  const context = await getCurrentDashboardAccess();
  const moduleKey = getModuleKeyForRoute(route);
  const allowed = moduleKey
    ? canAccessModuleKey(moduleKey, context.planKey, context.subscriptionStatus)
    : canAccessDashboardRoute(route, context.planKey, context.subscriptionStatus);

  return {
    ...context,
    allowed,
    moduleKey,
    reason: allowed
      ? null
      : getAccessDeniedReason(
          moduleKey ?? route,
          context.planKey,
          context.subscriptionStatus,
        ),
  };
}
