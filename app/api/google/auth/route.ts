import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

// позволяваме САМО относителен path, за да няма open redirect
function safePath(input: string | null, fallback = "/demo?step=5") {
  const s = (input || "").trim();
  if (!s) return fallback;
  if (!s.startsWith("/")) return fallback;
  if (s.startsWith("//")) return fallback;
  if (s.includes("://")) return fallback;
  return s;
}

export async function GET(req: NextRequest) {
  try {
    const clientId = mustGetEnv("GOOGLE_CLIENT_ID");
    const redirectUri = mustGetEnv("GOOGLE_REDIRECT_URI"); // https://www.calldeskbg.com/api/google/callback

    const { searchParams } = new URL(req.url);
    const stateRaw = safePath(searchParams.get("state"), "/demo?step=5");

    const nonce = crypto.randomBytes(16).toString("hex");
    const state = Buffer.from(`${stateRaw}||${nonce}`).toString("base64url");

    const scope = [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ].join(" ");

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
    authUrl.searchParams.set("scope", scope);
    authUrl.searchParams.set("state", state);

    return NextResponse.redirect(authUrl.toString());
  } catch (e: any) {
    console.error("GOOGLE AUTH ERROR:", e?.message || e);
    // ако auth route гръмне, върни към demo със error
    return NextResponse.redirect("/demo?step=5&google=error");
  }
}
