import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isSuperadminRoute = pathname.startsWith("/superadmin");

  if (!isDashboardRoute && !isSuperadminRoute) {
    return NextResponse.next();
  }

  if (!hasSupabaseConfig) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-autonomia-pathname", pathname);

  // TODO: Read Supabase session from cookies.
  // TODO: Redirect unauthenticated users to /login.
  // TODO: Check company role before allowing /dashboard.
  // TODO: Check superadmin role before allowing /superadmin.
  // Subscription and plan blocking are enforced in dashboard server components.
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/dashboard/:path*", "/superadmin/:path*"],
};
