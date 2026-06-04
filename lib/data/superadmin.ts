import { isSuperadmin } from "@/lib/auth/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  BusinessSectorRow,
  Company,
  CompanyUser,
  DemoRequest,
  Module,
  Plan,
  Subscription,
  SuperadminNote,
  UsageEvent,
} from "@/types/database";
import {
  mockPlans,
  mockModules,
} from "./mock";
import { getCurrentProfileContext } from "./profiles";

const fallbackCompanies: Company[] = [];

const fallbackCompanyUsers: CompanyUser[] = [];

const fallbackSubscriptions: Subscription[] = [];

const fallbackDemoRequests: DemoRequest[] = [];

const fallbackUsageEvents: UsageEvent[] = [];

const fallbackSuperadminNotes: SuperadminNote[] = [];

const fallbackBusinessSectors: BusinessSectorRow[] = [
  {
    id: "demo-sector-hosteleria",
    key: "hosteleria",
    name: "Hostelería",
    description: "Bares, restaurantes y cafeterías.",
    created_at: "2026-01-01T09:00:00.000Z",
    updated_at: "2026-01-01T09:00:00.000Z",
  },
  {
    id: "demo-sector-belleza",
    key: "belleza_estetica",
    name: "Belleza y estética",
    description: "Centros de estética, peluquerías y estudios.",
    created_at: "2026-01-01T09:00:00.000Z",
    updated_at: "2026-01-01T09:00:00.000Z",
  },
  {
    id: "demo-sector-salud",
    key: "salud_clinicas",
    name: "Salud y clínicas",
    description: "Clínicas privadas y consultas.",
    created_at: "2026-01-01T09:00:00.000Z",
    updated_at: "2026-01-01T09:00:00.000Z",
  },
];

async function getSuperadminClient() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const profileContext = await getCurrentProfileContext();

  if (!isSuperadmin(profileContext.primaryRole)) {
    return null;
  }

  return supabase;
}

export async function getSuperadminCompanies(): Promise<Company[]> {
  const supabase = await getSuperadminClient();

  if (!supabase) {
    return fallbackCompanies;
  }

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false });

  return error || !data?.length ? fallbackCompanies : data;
}

export async function getSuperadminCompanyUsers(): Promise<CompanyUser[]> {
  const supabase = await getSuperadminClient();

  if (!supabase) {
    return fallbackCompanyUsers;
  }

  const { data, error } = await supabase
    .from("company_users")
    .select("*")
    .order("last_access_at", { ascending: false });

  return error || !data?.length ? fallbackCompanyUsers : data;
}

export async function getSuperadminSubscriptions(): Promise<Subscription[]> {
  const supabase = await getSuperadminClient();

  if (!supabase) {
    return fallbackSubscriptions;
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false });

  return error || !data?.length ? fallbackSubscriptions : data;
}

export async function getSuperadminModules(): Promise<Module[]> {
  const supabase = await getSuperadminClient();

  if (!supabase) {
    return mockModules;
  }

  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .order("name");

  return error || !data?.length ? mockModules : data;
}

export async function getSuperadminPlans(): Promise<Plan[]> {
  const supabase = await getSuperadminClient();

  if (!supabase) {
    return mockPlans.filter((plan) => plan.status !== "hidden");
  }

  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("monthly_price_cents");

  return error || !data?.length
    ? mockPlans.filter((plan) => plan.status !== "hidden")
    : data.filter((plan) => plan.status !== "hidden");
}

export async function getSuperadminBusinessSectors(): Promise<BusinessSectorRow[]> {
  const supabase = await getSuperadminClient();

  if (!supabase) {
    return fallbackBusinessSectors;
  }

  const { data, error } = await supabase
    .from("business_sectors")
    .select("*")
    .order("name");

  return error || !data?.length ? fallbackBusinessSectors : data;
}

export async function getSuperadminDemoRequests(): Promise<DemoRequest[]> {
  const supabase = await getSuperadminClient();

  if (!supabase) {
    return fallbackDemoRequests;
  }

  const { data, error } = await supabase
    .from("demo_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return error || !data?.length ? fallbackDemoRequests : data;
}

export async function getSuperadminUsageEvents(): Promise<UsageEvent[]> {
  const supabase = await getSuperadminClient();

  if (!supabase) {
    return fallbackUsageEvents;
  }

  const { data, error } = await supabase
    .from("usage_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  return error || !data?.length ? fallbackUsageEvents : data;
}

export async function getSuperadminNotes(): Promise<SuperadminNote[]> {
  const supabase = await getSuperadminClient();

  if (!supabase) {
    return fallbackSuperadminNotes;
  }

  const { data, error } = await supabase
    .from("superadmin_notes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);

  return error ? fallbackSuperadminNotes : data ?? [];
}

export async function getSuperadminCompanyModules() {
  const supabase = await getSuperadminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("company_modules")
    .select("*")
    .order("created_at", { ascending: false });

  return error || !data?.length ? [] : data;
}

function hasRevenueExclusionNote(notes: SuperadminNote[] = []) {
  for (const note of notes) {
    const value = note.note.toLowerCase();

    if (value.includes("commercial_status:paying")) {
      return false;
    }

    if ([
      "demo_unlimited",
      "sin límite",
      "sin limite",
      "unlimited",
      "company_created:vip",
      "company_created:partner",
      "demo vip",
      "demo partner",
      "partner",
      "vip",
      "beta",
      "tester",
      "interna",
      "interno",
      "exenta de pago",
      "exento de pago",
      "payment_exempt",
    ].some((term) => value.includes(term))) {
      return true;
    }
  }

  return false;
}

export function isRevenueEligibleCompany(
  company: Company | null | undefined,
  notes: SuperadminNote[] = [],
) {
  if (!company) {
    return false;
  }

  if (company.status !== "active" && company.status !== "past_due") {
    return false;
  }

  return !hasRevenueExclusionNote(notes);
}

export function shouldCountTowardsMRR(
  subscription: Subscription,
  company: Company | null | undefined,
  notes: SuperadminNote[] = [],
) {
  if (!isRevenueEligibleCompany(company, notes)) {
    return false;
  }

  if (subscription.status !== "active" && subscription.status !== "past_due") {
    return false;
  }

  return (subscription.monthly_price_cents ?? 0) > 0;
}

export function shouldCountTowardsARR(
  subscription: Subscription,
  company: Company | null | undefined,
  notes: SuperadminNote[] = [],
) {
  return shouldCountTowardsMRR(subscription, company, notes);
}
