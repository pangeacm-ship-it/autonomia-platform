import { NextRequest, NextResponse } from "next/server";
import {
  decodeMetaOAuthState,
  exchangeForLongLivedToken,
  getMetaOAuthConfig,
  getMetaOAuthScopes,
  getMetaPages,
  isMetaOAuthStateFresh,
  META_OAUTH_STATE_COOKIE,
  saveMetaConnectionConnected,
  saveMetaPageSelection,
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

function clearStateCookie(response: NextResponse) {
  response.cookies.set(META_OAUTH_STATE_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

function errorRedirect(request: NextRequest) {
  const url = new URL(`/dashboard/conexiones?meta=error`, request.url);
  const res = NextResponse.redirect(url);
  clearStateCookie(res);
  return res;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const stateParam = request.nextUrl.searchParams.get("state");
  const cookieState = request.cookies.get(META_OAUTH_STATE_COOKIE)?.value ?? null;
  const state = decodeMetaOAuthState(stateParam);
  const storedState = decodeMetaOAuthState(cookieState);

  if (!code || !state || !storedState || !state.platform) {
    return errorRedirect(request);
  }

  if (
    state.nonce !== storedState.nonce ||
    state.companyId !== storedState.companyId ||
    !isMetaOAuthStateFresh(storedState)
  ) {
    return errorRedirect(request);
  }

  const access = await validateMetaCompanyAccess(state.companyId);
  if (!access.ok) return errorRedirect(request);

  const config = getMetaOAuthConfig();
  if (!config.appId || !config.appSecret || !config.redirectUri) {
    return errorRedirect(request);
  }

  // 1. Exchange code → short-lived token
  const tokenUrl = new URL(tokenExchangeUrl);
  tokenUrl.searchParams.set("client_id", config.appId);
  tokenUrl.searchParams.set("client_secret", config.appSecret);
  tokenUrl.searchParams.set("redirect_uri", config.redirectUri);
  tokenUrl.searchParams.set("code", code);

  let shortLivedToken: string;
  let shortLivedExpiresAt: string | null = null;

  try {
    const tokenRes = await fetch(tokenUrl.toString());
    const tokenPayload = (await tokenRes.json()) as MetaTokenResponse;

    if (!tokenRes.ok || !tokenPayload.access_token || tokenPayload.error) {
      return errorRedirect(request);
    }

    shortLivedToken = tokenPayload.access_token;
    shortLivedExpiresAt = tokenPayload.expires_in
      ? new Date(Date.now() + tokenPayload.expires_in * 1000).toISOString()
      : null;
  } catch {
    return errorRedirect(request);
  }

  // 2. Exchange for long-lived token (60 days)
  const longLived = await exchangeForLongLivedToken(shortLivedToken);
  const userAccessToken = longLived.ok ? longLived.accessToken : shortLivedToken;
  const tokenExpiresAt = longLived.ok ? longLived.expiresAt : shortLivedExpiresAt;
  const scopes = getMetaOAuthScopes();

  // 3. Get Facebook pages the user manages
  const pagesResult = await getMetaPages(userAccessToken);

  if (!pagesResult.ok || pagesResult.pages.length === 0) {
    // No pages found — save basic connection and redirect
    await saveMetaConnectionConnected({
      companyId: state.companyId,
      platform: state.platform,
      scopes,
      tokenExpiresAt,
    });

    const url = new URL(`/dashboard/conexiones?meta=connected_no_pages`, request.url);
    const res = NextResponse.redirect(url);
    clearStateCookie(res);
    return res;
  }

  if (pagesResult.pages.length === 1) {
    // Only one page — auto-select it
    const page = pagesResult.pages[0];
    await saveMetaPageSelection({
      companyId: state.companyId,
      platform: state.platform,
      page,
      userAccessToken,
      tokenExpiresAt,
      scopes,
    });

    const url = new URL(`/dashboard/conexiones?meta=connected`, request.url);
    const res = NextResponse.redirect(url);
    clearStateCookie(res);
    return res;
  }

  // 4. Multiple pages — redirect to page picker with pages encoded in a temp cookie
  const pickerData = {
    companyId: state.companyId,
    platform: state.platform,
    userAccessToken,
    tokenExpiresAt,
    scopes,
    pages: pagesResult.pages.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      access_token: p.access_token,
      instagram_business_account: p.instagram_business_account ?? null,
    })),
  };

  const encoded = Buffer.from(JSON.stringify(pickerData), "utf8").toString("base64url");
  const pickerUrl = new URL(`/dashboard/conexiones/meta-pages`, request.url);
  const res = NextResponse.redirect(pickerUrl);

  clearStateCookie(res);
  res.cookies.set("autonomia_meta_pages", encoded, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 5 * 60, // 5 minutes
    path: "/",
  });

  return res;
}
