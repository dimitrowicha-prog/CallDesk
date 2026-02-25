import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

function safePath(input: string | null, fallback = "/demo?step=5") {
  const s = (input || "").trim();
  if (!s) return fallback;
  if (!s.startsWith("/")) return fallback;
  if (s.startsWith("//")) return fallback;
  if (s.includes("://")) return fallback;
  return s;
}

function appendParam(path: string, key: string, value: string) {
  return path.includes("?") ? `${path}&${key}=${encodeURIComponent(value)}` : `${path}?${key}=${encodeURIComponent(value)}`;
}

async function fetchPrimaryCalendarId(accessToken: string): Promise<string> {
  const r = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`calendarList error: ${r.status} ${JSON.stringify(j)}`);

  const items: any[] = Array.isArray(j.items) ? j.items : [];
  const primary = items.find((x) => x && x.primary);
  return (primary?.id || "primary") as string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // 1) извадете state -> върнете към него (НЕ към /thanks)
  const stateB64 = searchParams.get("state");
  let returnTo = "/demo?step=5";

  try {
    if (stateB64) {
      const decoded = Buffer.from(stateB64, "base64url").toString("utf8");
      const [rawPath] = decoded.split("||");
      returnTo = safePath(rawPath, "/demo?step=5");
    }

    const error = searchParams.get("error");
    if (error) {
      console.error("GOOGLE CALLBACK ERROR:", error);
      return NextResponse.redirect(appendParam(returnTo, "google", "error"));
    }

    const code = searchParams.get("code");
    if (!code) {
      console.error("GOOGLE CALLBACK: missing code");
      return NextResponse.redirect(appendParam(returnTo, "google", "error"));
    }

    const clientId = mustGetEnv("GOOGLE_CLIENT_ID");
    const clientSecret = mustGetEnv("GOOGLE_CLIENT_SECRET");
    const redirectUri = mustGetEnv("GOOGLE_REDIRECT_URI");

    // 2) размяна code -> token
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

    const tokenJson: any = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error("TOKEN EXCHANGE FAILED:", tokenRes.status, tokenJson);
      return NextResponse.redirect(appendParam(returnTo, "google", "error"));
    }

    const access_token = tokenJson.access_token as string;
    const refresh_token = tokenJson.refresh_token as string | undefined;
    const expires_in = tokenJson.expires_in as number;

    // 3) взимаме calendarId (primary)
    const calendarId = await fetchPrimaryCalendarId(access_token);

    // 4) сетваме cookie
    const expiry_date = Date.now() + (expires_in ?? 3600) * 1000;

    const cookiePayload = {
      calendarId,
      access_token,
      refresh_token,
      expiry_date,
    };

    const res = NextResponse.redirect(appendParam(returnTo, "google", "ok"));
    res.cookies.set("gcal_oauth", encodeURIComponent(JSON.stringify(cookiePayload)), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 дни
    });

    return res;
  } catch (e: any) {
    console.error("GOOGLE CALLBACK FATAL:", e?.message || e);
    return NextResponse.redirect(appendParam(returnTo, "google", "error"));
  }
}
