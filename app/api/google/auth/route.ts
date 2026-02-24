import { NextRequest, NextResponse } from "next/server";

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

function getBaseUrl(req: NextRequest) {
  // 1) Prefer env (Production)
  const envBase = process.env.APP_BASE_URL?.trim();
  if (envBase) return envBase.replace(/\/$/, "");

  // 2) Fallback to current request origin (Preview/Dev)
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (!host) throw new Error("Missing host headers");
  return `${proto}://${host}`.replace(/\/$/, "");
}

export async function GET(req: NextRequest) {
  try {
    const clientId = mustGetEnv("GOOGLE_CLIENT_ID");
    const clientSecret = mustGetEnv("GOOGLE_CLIENT_SECRET");

    const BASE_URL = getBaseUrl(req);
    const redirectUri = `${BASE_URL}/api/google/callback`;

    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const oauthStateCookie = req.cookies.get("oauth_state")?.value;

    // 1) Basic validation
    if (!code) {
      return NextResponse.redirect(
        `${BASE_URL}/demo?step=5&google=error&reason=no_code`
      );
    }
    if (!state) {
      return NextResponse.redirect(
        `${BASE_URL}/demo?step=5&google=error&reason=no_state`
      );
    }
    if (!oauthStateCookie || state !== oauthStateCookie) {
      return NextResponse.redirect(
        `${BASE_URL}/demo?step=5&google=error&reason=bad_state`
      );
    }

    // 2) tenantId from state: base64url("tenantId.nonce")
    let tenantId = "demo";
    try {
      const decoded = Buffer.from(state, "base64url").toString("utf8");
      tenantId = decoded.split(".")[0] || "demo";
    } catch {
      tenantId = "demo";
    }

    // 3) Exchange code -> tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenJson: any = await tokenRes.json().catch(() => ({}));

    if (!tokenRes.ok) {
      const reason = tokenJson?.error || "token_exchange_failed";
      return NextResponse.redirect(
        `${BASE_URL}/demo?step=5&google=error&reason=${encodeURIComponent(reason)}`
      );
    }

    const accessToken = tokenJson.access_token as string | undefined;
    const refreshToken = tokenJson.refresh_token as string | undefined;
    const expiresIn = tokenJson.expires_in as number | undefined;

    if (!accessToken) {
      return NextResponse.redirect(
        `${BASE_URL}/demo?step=5&google=error&reason=no_access_token`
      );
    }

    // 4) MVP calendarId
    const calendarId = "primary";
    const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : null;

    // 5) Success redirect + cleanup cookie
    const res = NextResponse.redirect(
      `${BASE_URL}/demo?step=5&google=success&tenantId=${encodeURIComponent(
        tenantId
      )}`
    );
    res.cookies.set("oauth_state", "", { path: "/", maxAge: 0 });

    // helpful debug headers (optional)
    res.headers.set("x-tenant-id", tenantId);
    res.headers.set("x-has-refresh", refreshToken ? "1" : "0");
    res.headers.set("x-calendar-id", calendarId);

    return res;
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        where: "google_callback_exception",
        error: e?.message || String(e),
        env: {
          hasClientId: !!process.env.GOOGLE_CLIENT_ID,
          hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
          appsScriptUrl: process.env.APPS_SCRIPT_URL ? "set" : "missing",
          appBaseUrl: process.env.APP_BASE_URL ? "set" : "missing",
        },
      },
      { status: 500 }
    );
  }
}
