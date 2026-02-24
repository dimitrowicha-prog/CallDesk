import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

    if (!APPS_SCRIPT_URL) {
      return NextResponse.json(
        { ok: false, error: 'Missing APPS_SCRIPT_URL' },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response;
    try {
      response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        redirect: 'follow',
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { ok: false, error: 'Request timeout after 15 seconds' },
          { status: 500 }
        );
      }
      throw fetchError;
    }

    clearTimeout(timeoutId);

    const text = await response.text();

    if (!response.ok) {
      console.error(`Apps Script HTTP ${response.status}:`, text.slice(0, 400));
      return NextResponse.json(
        {
          ok: false,
          error: `Apps Script HTTP ${response.status}`,
          raw: text.slice(0, 400),
        },
        { status: 500 }
      );
    }

    let result;
    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.warn('Apps Script returned non-JSON response:', text.slice(0, 200));
      return NextResponse.json({
        ok: true,
        warning: 'non-json',
        raw: text.slice(0, 200),
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error submitting partner data:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to submit partner data' },
      { status: 500 }
    );
  }
}
