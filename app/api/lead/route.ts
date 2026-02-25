import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
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
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Моля, попълнете всички задължителни полета' },
        { status: 400 }
      );
    }

    // 1) Supabase insert
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name,
          email,
          phone,
          salon_name: salon_name || null,
          city: city || null,
          locations_count: Number(locations_count || 1),
          message: message || null,
          type: type || 'contact',
          status: 'new',
          uses_booking_software:
            uses_booking_software !== undefined ? uses_booking_software : null,
          preferred_contact_method: preferred_contact_method || null,
        },
      ])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Грешка при записване на заявката' },
        { status: 500 }
      );
    }

    // 2) Apps Script forward (await + debug)
    let appsScript = { attempted: false, ok: false, status: 0, body: '' as string };

    const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL?.trim();
    if (!APPS_SCRIPT_URL) {
      console.warn('Missing APPS_SCRIPT_URL, skipping Apps Script forward');
    } else {
      appsScript.attempted = true;
      try {
        const r = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'lead', ...body }),
        });

        const text = await r.text();
        appsScript.status = r.status;
        appsScript.body = text;
        appsScript.ok = r.ok;

        if (!r.ok) console.error('AppsScript non-200:', r.status, text);
        else console.log('AppsScript OK:', r.status, text);
      } catch (e) {
        console.error('AppsScript forward failed:', e);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Заявката е изпратена успешно!', data, appsScript },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Възникна грешка при обработката на заявката' },
      { status: 500 }
    );
  }
}
