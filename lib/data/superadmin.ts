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
  UsageEvent,
} from "@/types/database";
import {
  mockPlans,
  mockCompany,
  mockCompanyModules,
  mockModules,
  mockProfile,
  mockSubscription,
} from "./mock";
import { getCurrentProfileContext } from "./profiles";

const fallbackCompanies: Company[] = [
  mockCompany,
  {
    ...mockCompany,
    id: "demo-company-clinica-nova",
    name: "Clínica Nova",
    legal_name: "Clínica Nova S.L.",
    slug: "clinica-nova",
    city: "Málaga",
    industry: "Salud",
    owner_name: "María Nova",
    owner_email: "admin@clinicanova.com",
  },
  {
    ...mockCompany,
    id: "demo-company-beauty-studio",
    name: "Beauty Studio",
    legal_name: "Beauty Studio S.L.",
    slug: "beauty-studio",
    city: "Córdoba",
    industry: "Belleza",
    owner_name: "Laura Gómez",
    owner_email: "hola@beautystudio.com",
  },
];

const fallbackCompanyUsers: CompanyUser[] = [
  {
    id: "demo-company-user-juanma",
    company_id: mockCompany.id,
    profile_id: mockProfile.id,
    role_id: "role-company-admin",
    status: "active",
    invited_at: "2026-01-15T09:00:00.000Z",
    last_access_at: "2026-06-03T09:42:00.000Z",
    created_at: "2026-01-15T09:00:00.000Z",
    updated_at: "2026-06-03T09:42:00.000Z",
  },
  {
    id: "demo-company-user-marketing",
    company_id: mockCompany.id,
    profile_id: "demo-profile-marketing",
    role_id: "role-marketing",
    status: "active",
    invited_at: "2026-02-01T09:00:00.000Z",
    last_access_at: "2026-06-03T09:12:00.000Z",
    created_at: "2026-02-01T09:00:00.000Z",
    updated_at: "2026-06-03T09:12:00.000Z",
  },
];

const fallbackSubscriptions: Subscription[] = [
  mockSubscription,
  {
    ...mockSubscription,
    id: "subscription-demo-clinica-nova",
    company_id: "demo-company-clinica-nova",
    plan_id: "plan-local-ia-360",
    monthly_price_cents: 15000,
  },
  {
    ...mockSubscription,
    id: "subscription-demo-beauty-studio",
    company_id: "demo-company-beauty-studio",
    plan_id: "plan-inicio",
    monthly_price_cents: 7900,
  },
];

const fallbackDemoRequests: DemoRequest[] = [
  {
    id: "demo-request-centrofit",
    company_name: "Gimnasio CentroFit",
    contact_name: "Carlos",
    email: "hola@centrofit.com",
    phone: null,
    city: "Sevilla",
    industry: "Deporte",
    interested_module: "LeadIA",
    requested_plan_key: "crecimiento",
    status: "pending",
    notes: null,
    created_at: "2026-06-01T09:00:00.000Z",
    updated_at: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "demo-request-peluqueria-laura",
    company_name: "Peluquería Laura",
    contact_name: "Laura",
    email: "hola@peluquerialaura.com",
    phone: null,
    city: "Málaga",
    industry: "Belleza",
    interested_module: "SocialIA",
    requested_plan_key: "inicio",
    status: "new",
    notes: null,
    created_at: "2026-06-02T09:00:00.000Z",
    updated_at: "2026-06-02T09:00:00.000Z",
  },
];

const fallbackUsageEvents: UsageEvent[] = [
  {
    id: "usage-socialia",
    company_id: mockCompany.id,
    profile_id: mockProfile.id,
    module_key: "socialia",
    event_type: "post_generated",
    quantity: 42,
    metadata: {},
    created_at: "2026-06-03T09:00:00.000Z",
  },
  {
    id: "usage-reviewia",
    company_id: mockCompany.id,
    profile_id: mockProfile.id,
    module_key: "reviewia",
    event_type: "review_reply_generated",
    quantity: 16,
    metadata: {},
    created_at: "2026-06-03T09:00:00.000Z",
  },
];

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
    return mockPlans;
  }

  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("monthly_price_cents");

  return error || !data?.length ? mockPlans : data;
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

export async function getSuperadminCompanyModules() {
  const supabase = await getSuperadminClient();

  if (!supabase) {
    return mockCompanyModules;
  }

  const { data, error } = await supabase
    .from("company_modules")
    .select("*")
    .order("created_at", { ascending: false });

  return error || !data?.length ? mockCompanyModules : data;
}
