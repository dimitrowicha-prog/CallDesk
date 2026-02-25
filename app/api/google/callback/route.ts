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
  return path.includes("?")
    ? `${path}&${key}=${encodeURIComponent(value)}`
    : `${path}?${key}=${encodeURIComponent(value)}`;
}

function abs(req: NextRequest, path: string) {
  const u = new URL(req.url);
  u.pathname = path.split("?")[0];
  u.search = path.includes("?") ? "?" + path.split("?")[1] : "";
  u.hash = "";
  return u;
}

/**
 * Accepts state as:
 * 1) base64url("/demo?step=5||...")  (old format)
 * 2) base64url(JSON: { returnTo: "/demo?step=5" })
 * 3) plain "/demo?step=5"
 */
function parseReturnTo(state: string | null, fallback = "/demo?step=5") {
  if (!state) return fallback;

  const raw = state.trim();
  if (!raw) return fallback;

  // case 3: already a safe path
  if (raw.startsWith("/")) return safePath(raw, fallback);

  // try base64url decode
  try {
    const decoded = Buffer.from(raw, "base64url").toString("utf8").trim();

    // case 1: "/path||..."
    if (decoded.startsWith("/")) {
      const [rawPath] = decoded.split("||");
      return safePath(rawPath, fallback);
    }

    // case 2: JSON
    if (decoded.startsWith("{")) {
      const obj = JSON.parse(decoded);
      if (typeof obj?.returnTo === "string") {
        return safePath(obj.returnTo, fallback);
      }
    }
  } catch {
    // ignore
  }

  return fallback;
}

async function fetchPrimaryCalendarId(accessToken: string): Promise<string> {
  const r = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`calendarList error: ${r.status} ${JSON.stringify(j)}`);

  const items: any[] = Array.isArray((j as any).items) ? (j as any).items : [];
  const primary = items.find((x) => x && x.primary);
  return (primary?.id || "primary") as string;
}

function toB64UrlJson(obj: any) {
  const json = JSON.stringify(obj);
  return Buffer.from(json, "utf8").toString("base64url");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const state = searchParams.get("state");
  const returnTo = parseReturnTo(state, "/demo?step=5");

  try {
    const error = searchParams.get("error");
    if (error) {
      console.error("GOOGLE CALLBACK ERROR:", error);
      const target = abs(req, appendParam(returnTo, "google", "error"));
      return NextResponse.redirect(target);
    }

    const code = searchParams.get("code");
    if (!code) {
      console.error("GOOGLE CALLBACK: missing code");
      const target = abs(req, appendParam(returnTo, "google", "error"));
      return NextResponse.redirect(target);
    }

    const clientId = mustGetEnv("GOOGLE_CLIENT_ID");
    const clientSecret = mustGetEnv("GOOGLE_CLIENT_SECRET");
    const redirectUri = mustGetEnv("GOOGLE_REDIRECT_URI");

    // exchange code -> token
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
      console.error("TOKEN EXCHANGE FAILED:", tokenRes.status, tokenJson);
      const target = abs(req, appendParam(returnTo, "google", "error"));
      return NextResponse.redirect(target);
    }

    const access_token = tokenJson.access_token as string;
    const refresh_token = tokenJson.refresh_token as string | undefined;
    const expires_in = (tokenJson.expires_in as number) ?? 3600;

    const calendarId = await fetchPrimaryCalendarId(access_token);

    const cookiePayload = {
      calendarId,
      access_token,
      refresh_token,
      expiry_date: Date.now() + expires_in * 1000,
    };

    const res = NextResponse.redirect(abs(req, appendParam(returnTo, "google", "ok")));

    // ✅ no double-encoding; safe cookie value
    res.cookies.set("gcal_oauth", toB64UrlJson(cookiePayload), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (e: any) {
    console.error("GOOGLE CALLBACK FATAL:", e?.message || e);
    const target = abs(req, appendParam(returnTo, "google", "error"));
    return NextResponse.redirect(target);
  }
}
