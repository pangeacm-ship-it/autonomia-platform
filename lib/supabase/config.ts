export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
  };
}

export function getSupabaseAdminConfig() {
  const { url } = getSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return {
    url,
    serviceRoleKey,
    isConfigured: Boolean(url && serviceRoleKey),
  };
}
