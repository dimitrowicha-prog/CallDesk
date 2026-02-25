import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

// allow only same-site relative paths
function safeReturnTo(input: string | null, fallback = "/demo?step=5") {
  const s = (input || "").trim();
  if (!s) return fallback;

  // forbid absolute urls
  if (s.startsWith("http://") || s.startsWith("https://")) return fallback;

  // must start with /
  if (!s.startsWith("/")) return fallback;

  // optional: block tricky stuff
  if (s.includes("\n") || s.includes("\r")) return fallback;

  return s;
}

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
};

export async function GET(req: NextRequest) {
  try {
    const clientId = mustGetEnv("GOOGLE_CLIENT_ID");
    const clientSecret = mustGetEnv("GOOGLE_CLIENT_SECRET");
    const redirectUri = mustGetEnv("GOOGLE_REDIRECT_URI"); // https://www.calldeskbg.com/api/google/callback

    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state"); // returnTo
    const error = url.searchParams.get("error");

    const returnTo = safeReturnTo(state, "/demo?step=5");

    if (error) {
      // ❌ important: go back to wizard, not /thanks
      return NextResponse.redirect(new URL(`${returnTo}${returnTo.includes("?") ? "&" : "?"}google=error`, url.origin));
    }

    if (!code) {
      return NextResponse.redirect(new URL(`${returnTo}${returnTo.includes("?") ? "&" : "?"}google=error`, url.origin));
    }

    // exchange code -> tokens
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

    const tokenText = await tokenRes.text();
    if (!tokenRes.ok) {
      // go back to wizard with error
      return NextResponse.redirect(new URL(`${returnTo}${returnTo.includes("?") ? "&" : "?"}google=error`, url.origin));
    }

    const token: TokenResponse = JSON.parse(tokenText);

    // get calendar list -> choose primary if exists
    const calRes = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });

    const calText = await calRes.text();
    if (!calRes.ok) {
      return NextResponse.redirect(new URL(`${returnTo}${returnTo.includes("?") ? "&" : "?"}google=error`, url.origin));
    }

    const calJson = JSON.parse(calText);
    const items: any[] = Array.isArray(calJson.items) ? calJson.items : [];
    const primary = items.find((x) => x && x.primary) || items[0];
    const calendarId = primary?.id || "primary";

    const payload = {
      calendarId,
      access_token: token.access_token,
      refresh_token: token.refresh_token || null,
      expiry_date: Date.now() + (token.expires_in * 1000),
    };

    // ✅ set cookie for /api/google/status to read
    const res = NextResponse.redirect(
      new URL(`${returnTo}${returnTo.includes("?") ? "&" : "?"}google=ok`, url.origin)
    );

    res.cookies.set("gcal_oauth", encodeURIComponent(JSON.stringify(payload)), {
      httpOnly: false, // needs to be readable by /api/google/status if you read client-side; ok for MVP
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30d
    });

    return res;
  } catch (e) {
    const url = new URL(req.url);
    // fallback back to wizard
    return NextResponse.redirect(new URL(`/demo?step=5&google=error`, url.origin));
  }
}
