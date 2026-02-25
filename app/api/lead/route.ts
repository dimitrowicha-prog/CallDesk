import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL!;

    if (!APPS_SCRIPT_URL) {
      return NextResponse.json(
        { error: "Missing APPS_SCRIPT_URL" },
        { status: 500 }
      );
    }

    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "lead",
        ...body,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
