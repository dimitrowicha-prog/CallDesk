import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

export async function POST(request: NextRequest) {
  const debugId = `lead_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      salon_name,
      city,
      locations_count,
      message,
      type,
      uses_booking_software,
      preferred_contact_method,
    } = body ?? {};

    if (!name || !email || !phone) {
      return NextResponse.json(
        { ok: false, error: "Моля, попълнете име, имейл и телефон.", debugId },
        { status: 400 }
      );
    }

    const APPS_SCRIPT_URL = mustEnv("APPS_SCRIPT_URL");

    // timeout 15s
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 15000);

    let res: Response;
    try {
      res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          action: "lead",
          name,
          email,
          phone,
          salon_name: salon_name || "",
          city: city || "",
          locations_count: locations_count || "1",
          message: message || "",
          type: type || "contact",
          uses_booking_software:
            typeof uses_booking_software === "boolean"
              ? uses_booking_software
              : uses_booking_software === "yes",
          preferred_contact_method: preferred_contact_method || "phone",
          debugId,
          source: "website",
          createdAt: new Date().toISOString(),
        }),
      });
    } finally {
      clearTimeout(t);
    }

    const text = await res.text();
    let parsed: any = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      // Apps Script понякога връща plain text
    }

    if (!res.ok || (parsed && parsed.ok === false)) {
      console.error("Lead forward failed:", {
        debugId,
        status: res.status,
        text,
      });

      return NextResponse.json(
        {
          ok: false,
          error: "Грешка при записване на заявката (Apps Script).",
          debugId,
          status: res.status,
          appsScript: parsed || text,
        },
        { status: 500 }
      );
    }

    // OK
    return NextResponse.json(
      { ok: true, success: true, message: "OK", debugId, appsScript: parsed || text },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("API /api/lead error:", debugId, e);
    return NextResponse.json(
      {
        ok: false,
        error: e?.message || "Възникна грешка при обработката на заявката",
        debugId,
      },
      { status: 500 }
    );
  }
}
