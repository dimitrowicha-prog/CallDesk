import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

function safeInt(v: any, fallback = 1) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export async function POST(request: NextRequest) {
  const debugId = `lead_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON body", debugId },
        { status: 400 }
      );
    }

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
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { ok: false, error: "Моля, попълнете име, имейл и телефон.", debugId },
        { status: 400 }
      );
    }

    // ✅ Supabase server client (service role) – bypass RLS
    const SUPABASE_URL = mustGetEnv("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = mustGetEnv("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const payload = {
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      salon_name: salon_name ? String(salon_name).trim() : null,
      city: city ? String(city).trim() : null,
      locations_count: safeInt(locations_count, 1),
      message: message ? String(message).trim() : null,
      type: type ? String(type).trim() : "contact",
      status: "new",
      uses_booking_software:
        typeof uses_booking_software === "boolean"
          ? uses_booking_software
          : uses_booking_software === "yes"
          ? true
          : uses_booking_software === "no"
          ? false
          : null,
      preferred_contact_method: preferred_contact_method
        ? String(preferred_contact_method).trim()
        : null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("leads")
      .insert([payload])
      .select()
      .maybeSingle();

    if (error) {
      console.error("[/api/lead] Supabase error", { debugId, error, payload });
      return NextResponse.json(
        { ok: false, error: "Грешка при записване на заявката.", debugId },
        { status: 500 }
      );
    }

    // ✅ Forward към Apps Script (non-blocking, timeout)
    const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL?.trim();
    if (APPS_SCRIPT_URL) {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 4500);

      fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lead", ...payload }),
        signal: controller.signal,
      })
        .catch((e) =>
          console.error("[/api/lead] AppsScript forward failed", { debugId, e })
        )
        .finally(() => clearTimeout(t));
    } else {
      console.warn("[/api/lead] Missing APPS_SCRIPT_URL (skip forward)", {
        debugId,
      });
    }

    return NextResponse.json(
      { ok: true, success: true, message: "Заявката е изпратена успешно!", data, debugId },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("[/api/lead] Unhandled error", { debugId, e });
    return NextResponse.json(
      { ok: false, error: "Възникна грешка при обработката.", debugId },
      { status: 500 }
    );
  }
}
