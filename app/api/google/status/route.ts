import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface OAuthData {
  calendarId: string;
  access_token?: string;
  refresh_token?: string;
  expiry_date?: number;
}

function parseGcalCookie(raw: string): OAuthData | null {
  const s = (raw || "").trim();
  if (!s) return null;

  // 1) NEW: base64url(JSON)
  try {
    const decoded = Buffer.from(s, "base64url").toString("utf8");
    const obj = JSON.parse(decoded);
    if (obj && typeof obj.calendarId === "string") return obj as OAuthData;
  } catch {}

  // 2) OLD: encodeURIComponent(JSON) or plain JSON
  try {
    const maybeDecoded = decodeURIComponent(s);
    const obj = JSON.parse(maybeDecoded);
    if (obj && typeof obj.calendarId === "string") return obj as OAuthData;
  } catch {}

  try {
    const obj = JSON.parse(s);
    if (obj && typeof obj.calendarId === "string") return obj as OAuthData;
  } catch {}

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const cookieValue = request.cookies.get("gcal_oauth")?.value;

    const oauthData = cookieValue ? parseGcalCookie(cookieValue) : null;

    if (!oauthData) {
      return NextResponse.json(
        { connected: false },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      {
        connected: true,
        calendarId: oauthData.calendarId,
        hasRefreshToken: !!oauthData.refresh_token,
        isExpired: oauthData.expiry_date ? Date.now() > oauthData.expiry_date : false,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error reading OAuth status:", error);
    return NextResponse.json(
      { connected: false },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
