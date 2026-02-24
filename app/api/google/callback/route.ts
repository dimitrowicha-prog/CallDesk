import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface CalendarListItem {
  id: string;
  primary?: boolean;
}

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

// Взима base URL според текущия request (работи и за vercel.app и за custom domain)
function getBaseUrl(req: NextRequest) {
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (!host) throw new Error("Missing host");
  return `${proto}://${host}`;
}

// state идва от query. Държим го само като относителен path, за да не може да редиректва към чужд домейн.
function safePath(input: string | null, fallback = "/demo") {
  const s = (input || "").trim();
  if (!s) return fallback;
  if (!s.startsWith("/")) return fallback;
  if (s.startsWith("//")) return fallback;
  return s;
}

export async function GET(request: NextRequest) {
  const BASE_URL = getBaseUrl(request); // ✅ вместо hard lock
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // state ще е например "/demo?step=5"
    const stateRaw = searchParams.get("state");
    const statePath = safePath(stateRaw, "/demo?step=5");
    const redirectUrl = new URL(statePath, BASE_URL);

    if (error) {
      redirectUrl.searchParams.set("google", "error");
      redirectUrl.searchParams.set("reason", "google_returned_error");
      return NextResponse.redirect(redirectUrl);
    }

    if (!code) {
      redirectUrl.searchParams.set("google", "error");
      redirectUrl.searchParams.set("reason", "no_code");
      return NextResponse.redirect(redirectUrl);
    }

    const GOOGLE_CLIENT_ID = mustGetEnv("GOOGLE_CLIENT_ID");
    const GOOGLE_CLIENT_SECRET = mustGetEnv("GOOGLE_CLIENT_SECRET");

    // ✅ redirect_uri винаги е текущия домейн
    const GOOGLE_REDIRECT_URI = `${BASE_URL}/api/google/callback`;

    // Exchange code -> tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenJson: any = await tokenResponse.json().catch(() => ({}));
    if (!tokenResponse.ok) {
      redirectUrl.searchParams.set("google", "error");
      redirectUrl.searchParams.set(
        "reason",
        tokenJson?.error || "token_exchange_failed"
      );
      return NextResponse.redirect(redirectUrl);
    }

    const tokens: TokenResponse = tokenJson;

    // calendarId
    let calendarId = "primary";
    try {
      const calendarListResponse = await fetch(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
      );

      if (calendarListResponse.ok) {
        const calendarList = await calendarListResponse.json();
        const primaryCalendar = calendarList.items?.find(
          (cal: CalendarListItem) => cal.primary
        );
        if (primaryCalendar?.id) calendarId = primaryCalendar.id;
      }
    } catch (err) {
      console.error("Error fetching calendar list:", err);
    }

    const expiryDate = Date.now() + tokens.expires_in * 1000;

    const oauthData = {
      calendarId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || null,
      expiry_date: expiryDate,
    };

    redirectUrl.searchParams.set("google", "ok");

    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set("gcal_oauth", JSON.stringify(oauthData), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return response;
  } catch (err: any) {
    const msg = encodeURIComponent(err?.message || "unknown");
    return NextResponse.redirect(
      new URL(`/demo?step=5&google=error&reason=${msg}`, BASE_URL)
    );
  }
}
