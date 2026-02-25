import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // 1) Запис в Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name,
          email,
          phone,
          salon_name: salon_name || null,
          city: city || null,
          locations_count: locations_count || 1,
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

    // 2) Forward към Apps Script (не чупим success-а ако Apps Script падне)
    const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL?.trim();

    if (APPS_SCRIPT_URL) {
      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'lead',
          ...body,
        }),
      }).catch((e) => console.error('AppsScript forward failed:', e));
    } else {
      console.warn('Missing APPS_SCRIPT_URL, skipping Apps Script forward');
    }

    return NextResponse.json(
      { success: true, message: 'Заявката е изпратена успешно!', data },
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
