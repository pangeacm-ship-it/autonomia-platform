import { NextRequest, NextResponse } from "next/server";
import {
  decodeMetaOAuthState,
  getMetaOAuthConfig,
  getMetaOAuthScopes,
  isMetaOAuthStateFresh,
  META_OAUTH_STATE_COOKIE,
  saveMetaConnectionConnected,
  validateMetaCompanyAccess,
} from "@/lib/integrations/meta-oauth";

type MetaTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: {
    message?: string;
    type?: string;
    code?: number;
  };
};

const tokenExchangeUrl = "https://graph.facebook.com/v20.0/oauth/access_token";

function redirectToConnections(request: NextRequest, metaStatus: string) {
  return new URL(`/dashboard/conexiones?meta=${metaStatus}`, request.url);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const stateParam = request.nextUrl.searchParams.get("state");
  const cookieState = request.cookies.get(META_OAUTH_STATE_COOKIE)?.value ?? null;
  const state = decodeMetaOAuthState(stateParam);
  const storedState = decodeMetaOAuthState(cookieState);
  const errorRedirectUrl = redirectToConnections(request, "error");
  const response = NextResponse.redirect(errorRedirectUrl);

  response.cookies.set(META_OAUTH_STATE_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  if (!code || !state || !storedState || !state.platform) {
    return response;
  }

  if (
    state.nonce !== storedState.nonce ||
    state.companyId !== storedState.companyId ||
    !isMetaOAuthStateFresh(storedState)
  ) {
    return response;
  }

  const access = await validateMetaCompanyAccess(state.companyId);

  if (!access.ok) {
    return response;
  }

  const config = getMetaOAuthConfig();

  if (!config.appId || !config.appSecret || !config.redirectUri) {
    return response;
  }

  const tokenUrl = new URL(tokenExchangeUrl);
  tokenUrl.searchParams.set("client_id", config.appId);
  tokenUrl.searchParams.set("client_secret", config.appSecret);
  tokenUrl.searchParams.set("redirect_uri", config.redirectUri);
  tokenUrl.searchParams.set("code", code);

  try {
    const tokenResponse = await fetch(tokenUrl);
    const tokenPayload = (await tokenResponse.json()) as MetaTokenResponse;

    if (!tokenResponse.ok || !tokenPayload.access_token || tokenPayload.error) {
      return response;
    }

    const tokenExpiresAt = tokenPayload.expires_in
      ? new Date(Date.now() + tokenPayload.expires_in * 1000).toISOString()
      : null;
    const saveResult = await saveMetaConnectionConnected({
      companyId: state.companyId,
      platform: state.platform,
      scopes: getMetaOAuthScopes(),
      tokenExpiresAt,
    });

    if (!saveResult.ok) {
      return response;
    }

    const successRedirectUrl = redirectToConnections(request, "connected");
    const successResponse = NextResponse.redirect(successRedirectUrl);

    successResponse.cookies.set(META_OAUTH_STATE_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    });

    return successResponse;
  } catch {
    return response;
  }
}
