import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

async function postWithTimeout(url: string, payload: any, ms = 6000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const text = await r.text().catch(() => "");
    return { ok: r.ok, status: r.status, body: text };
  } finally {
    clearTimeout(t);
  }
}

export async function POST(request: NextRequest) {
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
    } = body || {};

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Моля, попълнете всички задължителни полета" },
        { status: 400 }
      );
    }

    // 1) Запис в Supabase
    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          name,
          email,
          phone,
          salon_name: salon_name || null,
          city: city || null,
          locations_count: locations_count || 1,
          message: message || null,
          type: type || "contact",
          status: "new",
          uses_booking_software:
            uses_booking_software !== undefined ? uses_booking_software : null,
          preferred_contact_method: preferred_contact_method || null,
        },
      ])
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Грешка при записване на заявката" },
        { status: 500 }
      );
    }

    // 2) Forward към Apps Script (Sheets + Email)
    // IMPORTANT: APPS_SCRIPT_URL трябва да е setнат във Vercel (Production) и да е /exec
    const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL?.trim() || "";

    let appsScriptOk: boolean | null = null;
    let appsScriptStatus: number | null = null;
    let appsScriptBody: string | null = null;

    if (APPS_SCRIPT_URL) {
      try {
        const payload = {
          action: "lead",
          source: "calldeskbg.com",
          name,
          email,
          phone,
          salon_name: salon_name || "",
          city: city || "",
          locations_count: locations_count || 1,
          message: message || "",
          type: type || "contact",
          uses_booking_software:
            uses_booking_software !== undefined ? uses_booking_software : null,
          preferred_contact_method: preferred_contact_method || "",
        };

        const r = await postWithTimeout(APPS_SCRIPT_URL, payload, 6000);
        appsScriptOk = r.ok;
        appsScriptStatus = r.status;
        appsScriptBody = r.body;

        if (!r.ok) {
          console.error("AppsScript non-200:", r.status, r.body);
        }
      } catch (e) {
        console.error("AppsScript forward failed:", e);
        appsScriptOk = false;
      }
    } else {
      console.warn("Missing APPS_SCRIPT_URL, skipping Apps Script forward");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Заявката е изпратена успешно!",
        data,
        appsScriptOk,
        appsScriptStatus,
        // за debug; ако не искаш да го връща на клиента, махни след като тръгне
        appsScriptBody,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Възникна грешка при обработката на заявката" },
      { status: 500 }
    );
  }
}
