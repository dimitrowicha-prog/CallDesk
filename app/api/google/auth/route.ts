import { NextRequest, NextResponse } from "next/server";

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

export async function GET(req: NextRequest) {
  const BASE_URL = "https://calldeskbg.com"; // 🔒 lock
  const redirectUri = "https://calldeskbg.com/api/google/callback"; // 🔒 lock

  try {
    const clientId = mustGetEnv("GOOGLE_CLIENT_ID");
    const clientSecret = mustGetEnv("GOOGLE_CLIENT_SECRET");

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
      // ако decode се счупи, пак продължаваме с demo
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
      // Debug-friendly redirect (виж reason)
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

    // 4) MVP calendarId (после ще го правим selectable)
    const calendarId = "primary";
    const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : null;

    // 5) TODO: Save per-tenant (DB/Sheets)
    // Ако искаш веднага към Apps Script:
    // const appsUrl = process.env.APPS_SCRIPT_URL;
    // if (appsUrl) {
    //   await fetch(appsUrl, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       action: "saveGoogleTokens",
    //       tenantId,
    //       calendarId,
    //       accessToken,
    //       refreshToken: refreshToken || null,
    //       expiresAt,
    //     }),
    //   });
    // }

    // 6) Success redirect + cleanup cookie
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
    // 🔥 вместо да пращаме "exception" без инфо — връщаме точната грешка като JSON
    return NextResponse.json(
      {
        ok: false,
        where: "google_callback_exception",
        error: e?.message || String(e),
        env: {
          hasClientId: !!process.env.GOOGLE_CLIENT_ID,
          hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
          appsScriptUrl: process.env.APPS_SCRIPT_URL ? "set" : "missing",
        },
      },
      { status: 500 }
    );
  }
}