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

// state идва от query. Държим го само като относителен path, за да не може да редиректва към чужд домейн.
function safePath(input: string | null, fallback = "/demo") {
  const s = (input || "").trim();
  if (!s) return fallback;
  // позволяваме само относителни пътища започващи с /
  if (!s.startsWith("/")) return fallback;
  // блокирай опити за //evil.com
  if (s.startsWith("//")) return fallback;
  return s;
}

export async function GET(request: NextRequest) {
  const BASE_URL = "https://calldeskbg.com"; // 🔒 hard lock
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // state ще е например "/demo?step=5" или "/onboarding?..."
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

    // 🔒 Вземаме env. Ако липсва — ще хвърли ясно.
    const GOOGLE_CLIENT_ID = mustGetEnv("GOOGLE_CLIENT_ID");
    const GOOGLE_CLIENT_SECRET = mustGetEnv("GOOGLE_CLIENT_SECRET");
    // Дори да имаш secret, пак го lock-ваме за да не изтече bolt/netlify
    const GOOGLE_REDIRECT_URI =
      process.env.GOOGLE_REDIRECT_URI?.trim() ||
      "https://calldeskbg.com/api/google/callback";

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
        {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }
      );

      if (calendarListResponse.ok) {
        const calendarList = await calendarListResponse.json();
        const primaryCalendar = calendarList.items?.find(
          (cal: CalendarListItem) => cal.primary
        );
        if (primaryCalendar?.id) calendarId = primaryCalendar.id;
      }
    } catch (err) {
      // не блокирай flow-а ако това падне
      console.error("Error fetching calendar list:", err);
    }

    const expiryDate = Date.now() + tokens.expires_in * 1000;

    const oauthData = {
      calendarId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || null,
      expiry_date: expiryDate,
    };

    // success
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
    // 🔥 показваме истинската причина
    const msg = encodeURIComponent(err?.message || "unknown");
    return NextResponse.redirect(
      new URL(`/demo?step=5&google=error&reason=${msg}`, BASE_URL)
    );
  }
}

