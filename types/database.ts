export type UserRole =
  | "superadmin"
  | "company_admin"
  | "marketing"
  | "sales"
  | "support"
  | "readonly";

export type SubscriptionStatus =
  | "trial"
  | "active"
  | "past_due"
  | "suspended"
  | "canceled";

export type Company = {
  id: string;
  name: string;
  legal_name: string | null;
  slug: string;
  tax_id: string | null;
  city: string | null;
  country: string;
  status: "trial" | "active" | "past_due" | "suspended" | "canceled" | "demo" | "archived";
  industry: string | null;
  sector_id: string | null;
  owner_name: string | null;
  owner_email: string | null;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  auth_user_id: string | null;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  status: "active" | "invited" | "disabled" | "inactive";
  created_at: string;
  updated_at: string;
};

export type CompanyUser = {
  id: string;
  company_id: string | null;
  profile_id: string;
  role_id: string;
  status: "active" | "invited" | "disabled" | "inactive";
  invited_at: string | null;
  last_access_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Role = {
  id: string;
  key: UserRole;
  name: string;
  description: string | null;
  is_platform_role: boolean;
  created_at: string;
  updated_at: string;
};

export type Plan = {
  id: string;
  key: string;
  name: string;
  monthly_price_cents: number | null;
  currency: string;
  status: "active" | "legacy" | "hidden";
  description: string | null;
  features: string[];
  stripe_price_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  company_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  started_at: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  suspended_at: string | null;
  founder_price_locked: boolean;
  monthly_price_cents: number | null;
  currency: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Module = {
  id: string;
  name: string;
  key: string;
  description: string | null;
  status: "active" | "beta" | "hidden";
  monthly_price_cents: number | null;
  created_at: string;
  updated_at: string;
};

export type BusinessSectorRow = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type DemoRequest = {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  industry: string | null;
  interested_module: string | null;
  requested_plan_key: string | null;
  status: "new" | "pending" | "contacted" | "converted" | "archived";
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type UsageEvent = {
  id: string;
  company_id: string | null;
  profile_id: string | null;
  module_key: string | null;
  event_type: string;
  quantity: number;
  metadata: Record<string, unknown>;
  is_demo?: boolean | null;
  archived_at?: string | null;
  deleted_at?: string | null;
  created_at: string;
};

export type PostStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "scheduled"
  | "published_simulated"
  | "canceled"
  | "archived";

export type Post = {
  id: string;
  company_id: string;
  created_by: string | null;
  module_key: string;
  channel: string;
  channels?: string[] | null;
  title: string;
  content: string;
  media_urls: string[] | null;
  status: PostStatus;
  scheduled_at: string | null;
  published_at: string | null;
  is_demo?: boolean | null;
  archived_at?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type CompanyModule = {
  id: string;
  company_id: string;
  module_id: string;
  status: "active" | "recommended" | "available" | "disabled";
  activated_at: string | null;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type SuperadminNote = {
  id: string;
  company_id: string | null;
  profile_id: string | null;
  note: string;
  visibility: "internal" | "shared";
  created_at: string;
  updated_at: string;
};

export type BillingProtectedRow = {
  id: string;
  company_id: string | null;
};

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: Company;
        Insert: Partial<Company>;
        Update: Partial<Company>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
        Relationships: [];
      };
      company_users: {
        Row: CompanyUser;
        Insert: Partial<CompanyUser>;
        Update: Partial<CompanyUser>;
        Relationships: [];
      };
      roles: {
        Row: Role;
        Insert: Partial<Role>;
        Update: Partial<Role>;
        Relationships: [];
      };
      plans: {
        Row: Plan;
        Insert: Partial<Plan>;
        Update: Partial<Plan>;
        Relationships: [];
      };
      subscriptions: {
        Row: Subscription;
        Insert: Partial<Subscription>;
        Update: Partial<Subscription>;
        Relationships: [];
      };
      modules: {
        Row: Module;
        Insert: Partial<Module>;
        Update: Partial<Module>;
        Relationships: [];
      };
      company_modules: {
        Row: CompanyModule;
        Insert: Partial<CompanyModule>;
        Update: Partial<CompanyModule>;
        Relationships: [];
      };
      posts: {
        Row: Post;
        Insert: Partial<Post>;
        Update: Partial<Post>;
        Relationships: [];
      };
      business_sectors: {
        Row: BusinessSectorRow;
        Insert: Partial<BusinessSectorRow>;
        Update: Partial<BusinessSectorRow>;
        Relationships: [];
      };
      demo_requests: {
        Row: DemoRequest;
        Insert: Partial<DemoRequest>;
        Update: Partial<DemoRequest>;
        Relationships: [];
      };
      usage_events: {
        Row: UsageEvent;
        Insert: Partial<UsageEvent>;
        Update: Partial<UsageEvent>;
        Relationships: [];
      };
      superadmin_notes: {
        Row: SuperadminNote;
        Insert: Partial<SuperadminNote>;
        Update: Partial<SuperadminNote>;
        Relationships: [];
      };
      invoices: {
        Row: BillingProtectedRow;
        Insert: Partial<BillingProtectedRow>;
        Update: Partial<BillingProtectedRow>;
        Relationships: [];
      };
      payments: {
        Row: BillingProtectedRow;
        Insert: Partial<BillingProtectedRow>;
        Update: Partial<BillingProtectedRow>;
        Relationships: [];
      };
      billing_events: {
        Row: BillingProtectedRow;
        Insert: Partial<BillingProtectedRow>;
        Update: Partial<BillingProtectedRow>;
        Relationships: [];
      };
      fiscal_records: {
        Row: BillingProtectedRow;
        Insert: Partial<BillingProtectedRow>;
        Update: Partial<BillingProtectedRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
