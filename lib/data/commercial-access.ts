import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Company, Plan, Subscription, SuperadminNote } from "@/types/database";

export type CommercialAccessKind =
  | "paying"
  | "vip"
  | "partner"
  | "beta"
  | "unlimited_demo"
  | "promotional"
  | "demo";

export type CommercialAccess = {
  kind: CommercialAccessKind;
  label: string;
  isGifted: boolean;
  officialPrice: string;
  planDisplayName: string;
  badge: string;
};

function noteIncludes(notes: SuperadminNote[], terms: string[]) {
  return notes.some((note) => {
    const value = note.note.toLowerCase();
    return terms.some((term) => value.includes(term));
  });
}

function getLatestCommercialKind(notes: SuperadminNote[]): CommercialAccessKind | null {
  for (const note of notes) {
    const value = note.note.toLowerCase();

    if (value.includes("commercial_status:paying")) return "paying";
    if (value.includes("company_created:partner") || value.includes("demo partner") || value.includes("partner")) {
      return "partner";
    }
    if (value.includes("company_created:vip") || value.includes("demo vip") || value.includes(" vip")) {
      return "vip";
    }
    if (value.includes("commercial_status:beta") || value.includes("beta") || value.includes("tester") || value.includes("interna")) {
      return "beta";
    }
    if (value.includes("demo_unlimited") || value.includes("unlimited") || value.includes("sin límite") || value.includes("sin limite")) {
      return "unlimited_demo";
    }
    if (
      value.includes("promo_exemption") ||
      value.includes("exento de pago") ||
      value.includes("exenta de pago") ||
      value.includes("payment_exempt") ||
      value.includes("acceso promocional") ||
      value.includes("promocional")
    ) {
      return "promotional";
    }
  }

  return null;
}

function getPlanDisplayName(plan: Plan | null | undefined, subscription: Subscription | null | undefined) {
  const key = plan?.key ?? subscription?.plan_id?.replace("plan-", "") ?? "crecimiento";

  if (key.includes("local")) return "Local IA";
  if (key.includes("crecimiento")) return "Crecimiento";
  if (key.includes("inicio")) return "Inicio";
  if (key.includes("enterprise")) return "Local IA";
  if (key.includes("gratuito")) return "Gratuito";

  return plan?.name ?? "Crecimiento";
}

function getOfficialPrice(plan: Plan | null | undefined, subscription: Subscription | null | undefined) {
  const key = plan?.key ?? subscription?.plan_id?.replace("plan-", "") ?? "crecimiento";

  if (key.includes("local")) return "300€/mes";
  if (key.includes("crecimiento")) return "150€/mes";
  if (key.includes("inicio")) return "100€/mes";
  if (key.includes("enterprise")) return "300€/mes";
  if (key.includes("gratuito")) return "0€/mes";

  return "150€/mes";
}

export function resolveCommercialAccess({
  company,
  subscription,
  plan,
  notes = [],
}: {
  company: Company;
  subscription?: Subscription | null;
  plan?: Plan | null;
  notes?: SuperadminNote[];
}): CommercialAccess {
  let kind: CommercialAccessKind = "paying";

  const latestCommercialKind = getLatestCommercialKind(notes);

  if (latestCommercialKind) {
    kind = latestCommercialKind;
  } else if (noteIncludes(notes, ["company_created:partner", "demo partner", "partner"])) {
    kind = "partner";
  } else if (noteIncludes(notes, ["company_created:vip", "demo vip", " vip"])) {
    kind = "vip";
  } else if (noteIncludes(notes, ["beta", "tester", "interna", "interno"])) {
    kind = "beta";
  } else if (noteIncludes(notes, ["demo_unlimited", "unlimited", "sin límite", "sin limite"])) {
    kind = "unlimited_demo";
  } else if (
    noteIncludes(notes, [
      "promo_exemption",
      "exento de pago",
      "exenta de pago",
      "payment_exempt",
      "acceso promocional",
      "promocional",
    ])
  ) {
    kind = "promotional";
  } else if (company.status === "demo" || company.status === "trial") {
    kind = "demo";
  }

  const labels: Record<CommercialAccessKind, string> = {
    paying: "Cliente de pago",
    vip: "Acceso VIP",
    partner: "Partner",
    beta: "Beta tester",
    unlimited_demo: "Demo ilimitada",
    promotional: "Acceso promocional",
    demo: "Demo",
  };

  const giftedKinds: CommercialAccessKind[] = [
    "vip",
    "partner",
    "beta",
    "unlimited_demo",
    "promotional",
  ];

  return {
    kind,
    label: labels[kind],
    isGifted: giftedKinds.includes(kind),
    officialPrice: getOfficialPrice(plan, subscription),
    planDisplayName: getPlanDisplayName(plan, subscription),
    badge: giftedKinds.includes(kind) ? "Acceso VIP activo" : labels[kind],
  };
}

export async function getCompanyCommercialAccess({
  company,
  subscription,
  plan,
}: {
  company: Company;
  subscription?: Subscription | null;
  plan?: Plan | null;
}) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return resolveCommercialAccess({ company, subscription, plan });
  }

  const { data } = await supabase
    .from("superadmin_notes")
    .select("*")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return resolveCommercialAccess({
    company,
    subscription,
    plan,
    notes: data ?? [],
  });
}
