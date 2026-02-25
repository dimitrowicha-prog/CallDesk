import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

export async function POST(req: NextRequest) {
  const debugId = `lead_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try {
    const body = await req.json().catch(() => ({}));

    const payload = {
      action: "lead",
      debugId,
      source: "website",
      createdAt: new Date().toISOString(),
      ...body,
    };

    // ✅ IMPORTANT: винаги пращаме към Apps Script
    const url = mustEnv("APPS_SCRIPT_URL");

    // timeout 15s
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 15000);

    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(t);
    }

    const text = await res.text();

    // ✅ ВРЪЩАМЕ ТОЧНО КАКВО Е ВЪРНАЛ APPS SCRIPT
    return NextResponse.json(
      {
        ok: res.ok,
        httpStatus: res.status,
        debugId,
        appsScriptRaw: text,
      },
      { status: res.ok ? 200 : 500 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Server error", debugId },
      { status: 500 }
    );
  }
}
