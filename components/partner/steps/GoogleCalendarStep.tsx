'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GoogleCalendarStepProps {
  isGoogleConnected: boolean;
  onGoogleConnectionChange: (connected: boolean, calendarId?: string) => void;
  calendarId?: string;
}

export function GoogleCalendarStep({
  isGoogleConnected,
  onGoogleConnectionChange,
  calendarId,
}: GoogleCalendarStepProps) {
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleParam = urlParams.get('google');

    if (googleParam === 'ok' || googleParam === 'error') {
      checkGoogleStatus();
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      checkGoogleStatus();
    }
  }, []);

  const checkGoogleStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const response = await fetch('/api/google/status');
      const data = await response.json();

      if (data.connected) {
        onGoogleConnectionChange(true, data.calendarId);
      } else {
        onGoogleConnectionChange(false);
      }
    } catch (error) {
      console.error('Error checking Google status:', error);
      onGoogleConnectionChange(false);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleConnectGoogle = () => {
    window.location.href = '/api/google/auth?state=/demo?step=5';
  };

  const displayCalendarId =
    calendarId && calendarId.length > 30
      ? `${calendarId.slice(0, 15)}...${calendarId.slice(-10)}`
      : calendarId;

  return (
    <div className="space-y-6 py-4">
      <div className="text-center space-y-2 mb-8">
        <h3 className="text-2xl font-bold">Свържи Google Calendar</h3>
        <p className="text-gray-600">
          AI рецепционистът ще записва час директно в твоя календар
        </p>
      </div>

      <Card className="p-8 space-y-6">
        <div className="flex items-center justify-center">
          {isCheckingStatus ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          ) : isGoogleConnected ? (
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-10 h-10" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
          )}
        </div>

        {isGoogleConnected ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-900 text-lg">
                  Свързан календар ✅
                </span>
              </div>
              <p className="text-sm text-green-700 mt-3">
                Календар: <span className="font-mono">{displayCalendarId}</span>
              </p>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Вече можете да продължите към следващата стъпка
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={handleConnectGoogle}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            >
              Свържи Google Calendar
            </Button>
            <p className="text-sm text-gray-500 text-center">
              Ще бъдете пренасочени към Google за оторизация
            </p>
          </div>
        )}
      </Card>

      {!isGoogleConnected && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Забележка:</strong> CallDesk има нужда от достъп до вашия
            Google Calendar, за да може AI рецепционистът автоматично да записва
            часове за ваши клиенти.
          </p>
        </div>
      )}
    </div>
  );
}
