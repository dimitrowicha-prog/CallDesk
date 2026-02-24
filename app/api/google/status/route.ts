import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface OAuthData {
  calendarId: string;
  access_token?: string;
  refresh_token?: string;
  expiry_date?: number;
}

export async function GET(request: NextRequest) {
  try {
    const cookieValue = request.cookies.get('gcal_oauth')?.value;

    if (!cookieValue) {
      return NextResponse.json({
        connected: false,
      });
    }

    const oauthData: OAuthData = JSON.parse(cookieValue);

    return NextResponse.json({
      connected: true,
      calendarId: oauthData.calendarId,
      hasRefreshToken: !!oauthData.refresh_token,
    });
  } catch (error) {
    console.error('Error reading OAuth status:', error);
    return NextResponse.json({
      connected: false,
    });
  }
}
