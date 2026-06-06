import { NextRequest, NextResponse } from "next/server";
import {
  createMetaOAuthState,
  encodeMetaOAuthState,
  getMetaOAuthConfig,
  getMetaOAuthEnvironmentStatus,
  getMetaOAuthScopes,
  META_OAUTH_STATE_COOKIE,
  validateMetaCompanyAccess,
} from "@/lib/integrations/meta-oauth";

const metaOAuthDialogUrl = "https://www.facebook.com/v20.0/dialog/oauth";

export async function GET(request: NextRequest) {
  console.info(
    "[AutonomIA][Meta OAuth] Environment status",
    getMetaOAuthEnvironmentStatus(),
  );

  const companyId = request.nextUrl.searchParams.get("companyId");
  const platformParam = request.nextUrl.searchParams.get("platform");
  const platform =
    platformParam === "facebook" || platformParam === "instagram"
      ? platformParam
      : null;

  if (!companyId) {
    return NextResponse.json(
      { error: "Falta companyId para iniciar OAuth Meta." },
      { status: 400 },
    );
  }

  const access = await validateMetaCompanyAccess(companyId);

  if (!access.ok) {
    return NextResponse.json({ error: access.message }, { status: access.status });
  }

  const config = getMetaOAuthConfig();

  if (!config.appId || !config.redirectUri) {
    return NextResponse.json(
      {
        error:
          "Meta OAuth no está configurado. Revisa META_APP_ID o NEXT_PUBLIC_META_APP_ID, y META_REDIRECT_URI.",
      },
      { status: 503 },
    );
  }

  const state = createMetaOAuthState(companyId, platform);
  const encodedState = encodeMetaOAuthState(state);
  const url = new URL(metaOAuthDialogUrl);

  url.searchParams.set("client_id", config.appId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("state", encodedState);
  url.searchParams.set("scope", getMetaOAuthScopes().join(","));
  url.searchParams.set("response_type", "code");

  const response = NextResponse.redirect(url);

  response.cookies.set(META_OAUTH_STATE_COOKIE, encodedState, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60,
    path: "/",
  });

  return response;
}
