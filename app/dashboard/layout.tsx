import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import {
  canAccessDashboardRoute,
  getCurrentDashboardAccess,
  isSubscriptionOperational,
} from "@/lib/auth/access-control";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-autonomia-pathname") ?? "/dashboard";
  const access = await getCurrentDashboardAccess();

  if (
    !access.isFallback &&
    !isSubscriptionOperational(access.subscriptionStatus) &&
    !canAccessDashboardRoute(pathname, access.planKey, access.subscriptionStatus)
  ) {
    redirect("/billing-required");
  }

  return (
    <main className="h-dvh overflow-hidden bg-[#050816] text-white">
      <div className="flex h-dvh min-w-0 flex-col lg:flex-row">
        <DashboardSidebar />

        <section className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          {children}
        </section>
      </div>
    </main>
  );
}
