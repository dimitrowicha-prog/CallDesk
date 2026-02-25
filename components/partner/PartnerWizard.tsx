'use client';

import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

import { ContactStep } from './steps/ContactStep';
import { SalonBasicsStep } from './steps/SalonBasicsStep';
import { WorkingHoursStep } from './steps/WorkingHoursStep';
import { ServicesStep } from './steps/ServicesStep';
import { GoogleCalendarStep } from './steps/GoogleCalendarStep';
import { TrialAgreementStep } from './steps/TrialAgreementStep';
import { FinalSubmitStep } from './steps/FinalSubmitStep';
import { FinishStep } from './steps/FinishStep';

import { generateSlug } from '@/lib/slug-utils';

export interface ContactData {
  fullName: string;
  phone: string;
  email: string;
}

export interface SalonBasicsData {
  salonName: string;
  timezone: string;
  slotStepMin: number;
}

export interface WorkingHoursData {
  [key: string]: { start: string; end: string } | null;
}

export interface Service {
  serviceId: string;
  serviceName: string;
  durationMin: number;
}

interface PartnerWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type WizardState = {
  step: number;
  tenantSlug: string;
  contactData: ContactData;
  salonBasicsData: SalonBasicsData;
  workingHoursData: WorkingHoursData;
  services: Service[];
  isGoogleConnected: boolean;
  calendarId: string;
  trialAccepted: boolean;
};

const LS_KEY = 'partner_wizard_v1';

function safeJsonParse<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

// gcal_oauth cookie parser (в твоя случай cookie НЕ е httpOnly, виждаш го в Network)
function readGcalOauthCookie(): { calendarId?: string } | null {
  if (typeof document === 'undefined') return null;
  const all = document.cookie || '';
  const m = all.match(/(?:^|;\s*)gcal_oauth=([^;]+)/);
  if (!m) return null;

  try {
    const decoded = decodeURIComponent(m[1]);
    const obj = JSON.parse(decoded);
    return obj && typeof obj === 'object' ? obj : null;
  } catch {
    return null;
  }
}

export function PartnerWizard({ open, onOpenChange }: PartnerWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenantSlug, setTenantSlug] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [contactData, setContactData] = useState<ContactData>({
    fullName: '',
    phone: '',
    email: '',
  });

  const [salonBasicsData, setSalonBasicsData] = useState<SalonBasicsData>({
    salonName: '',
    timezone: 'Europe/Sofia',
    slotStepMin: 15,
  });

  const [workingHoursData, setWorkingHoursData] = useState<WorkingHoursData>({
    mon: { start: '10:00', end: '19:00' },
    tue: { start: '10:00', end: '19:00' },
    wed: { start: '10:00', end: '19:00' },
    thu: { start: '10:00', end: '19:00' },
    fri: { start: '10:00', end: '19:00' },
    sat: { start: '10:00', end: '16:00' },
    sun: null,
  });

  const [services, setServices] = useState<Service[]>([]);

  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [calendarId, setCalendarId] = useState<string>('');
  const [trialAccepted, setTrialAccepted] = useState(false);

  const steps = useMemo(
    () => [
      { number: 1, title: 'Контакт' },
      { number: 2, title: 'Салон' },
      { number: 3, title: 'Работно време' },
      { number: 4, title: 'Услуги' },
      { number: 5, title: 'Google' },
      { number: 6, title: 'Тест' },
      { number: 7, title: 'Завършване' },
    ],
    []
  );

  // ✅ Restore wizard state when opened
  useEffect(() => {
    if (!open) return;

    const saved = safeJsonParse<WizardState>(localStorage.getItem(LS_KEY));
    if (saved) {
      setStep(saved.step || 1);
      setTenantSlug(saved.tenantSlug || '');
      setContactData(saved.contactData || { fullName: '', phone: '', email: '' });
      setSalonBasicsData(
        saved.salonBasicsData || { salonName: '', timezone: 'Europe/Sofia', slotStepMin: 15 }
      );
      setWorkingHoursData(saved.workingHoursData || workingHoursData);
      setServices(saved.services || []);
      setIsGoogleConnected(Boolean(saved.isGoogleConnected));
      setCalendarId(saved.calendarId || '');
      setTrialAccepted(Boolean(saved.trialAccepted));
    }

    // ✅ Ако вече имаш gcal_oauth cookie (след redirect) – маркирай connected
    const cookie = readGcalOauthCookie();
    if (cookie?.calendarId) {
      setIsGoogleConnected(true);
      setCalendarId(cookie.calendarId);
      // ако си бил на step 5 – остани там
      setStep((s) => (s < 5 ? 5 : s));
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ Persist wizard state on every change (за да не се губи след Google auth)
  useEffect(() => {
    if (!open) return;

    const state: WizardState = {
      step,
      tenantSlug,
      contactData,
      salonBasicsData,
      workingHoursData,
      services,
      isGoogleConnected,
      calendarId,
      trialAccepted,
    };
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [
    open,
    step,
    tenantSlug,
    contactData,
    salonBasicsData,
    workingHoursData,
    services,
    isGoogleConnected,
    calendarId,
    trialAccepted,
  ]);

  const handleNext = () => {
    setSubmitError(null);

    // Генерирай slug, когато минаваш от step 2 към 3
    if (step === 2) {
      const slug = generateSlug(salonBasicsData.salonName);
      setTenantSlug(slug);
    }

    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setSubmitError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return Boolean(contactData.fullName && contactData.phone && contactData.email);
      case 2:
        return Boolean(salonBasicsData.salonName);
      case 3:
        return true;
      case 4:
        return services.length > 0;
      case 5:
        // ✅ изисквай и calendarId реално да е наличен
        return Boolean(isGoogleConnected && calendarId);
      case 6:
        return trialAccepted;
      case 7:
        return Boolean(isGoogleConnected && calendarId && trialAccepted && services.length > 0);
      default:
        return false;
    }
  };

  const handleGoogleConnectionChange = (connected: boolean, calId?: string) => {
    setIsGoogleConnected(connected);
    if (calId) setCalendarId(calId);

    // fallback: ако step 5 каже connected без calId, пробвай да го дръпнеш от cookie
    if (connected && !calId) {
      const cookie = readGcalOauthCookie();
      if (cookie?.calendarId) setCalendarId(cookie.calendarId);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // ✅ гарантирай slug
      const slug = tenantSlug || generateSlug(salonBasicsData.salonName);
      if (!slug) throw new Error('Моля въведи валидно име на салон (латиница/цифри).');
      setTenantSlug(slug);

      // ✅ гарантирай calendarId (ако cookie го има)
      const cookie = readGcalOauthCookie();
      const calIdFinal = calendarId || cookie?.calendarId || '';
      if (!calIdFinal) throw new Error('Не е свързан Google Calendar (липсва calendarId).');

      const trialDays = 14;
      const trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toISOString();
      const createdAt = new Date().toISOString();

      // ✅ правилен sipUser формат (с /inbc@)
      const sipUser = `sip:${slug}/inbc@calldeskbg.sip.twilio.com`;

      const payload = {
        action: 'onboard',
        // можем да пращаме sipUser, Apps Script вече може и да го генерира, но така е детерминирано
        sipUser,
        calendarId: calIdFinal,
        name: salonBasicsData.salonName,
        timezone: salonBasicsData.timezone,
        slotStepMin: salonBasicsData.slotStepMin,

        // ✅ пращаме object; Apps Script normalizeWorkHours_ ще го stringify-не
        workHoursJson: workingHoursData,

        services,
        contact: contactData,

        isTrial: true,
        trialDays,
        trialEndsAt,
        trialAccepted,
        createdAt,

        source: 'partner-wizard',
      };

      const response = await fetch('/api/partner/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const raw = await response.text();
      let result: any = null;
      try {
        result = raw ? JSON.parse(raw) : null;
      } catch {}

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || raw || `HTTP ${response.status}`);
      }

      // ✅ success: чистим state, затваряме modal и пращаме на thanks
      localStorage.removeItem(LS_KEY);
      onOpenChange(false);

      // ако искаш да остане вътре в modal на step 8 вместо /thanks – кажи и ще го променя
      window.location.href = '/thanks';
    } catch (error) {
      console.error('Error submitting partner data:', error);
      const message =
        error instanceof Error ? error.message : 'Грешка при изпращане. Моля опитайте отново.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ако затвориш modal-а – не ресетвам автоматично, за да можеш да се върнеш
  // ако искаш reset при close, кажи и ще го направя.

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Стани наш партньор</DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s.number ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s.number}
                </div>
                <span className="text-xs mt-2 text-gray-600 hidden sm:block">{s.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 transition-colors ${step > s.number ? 'bg-black' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[400px]">
          {step === 1 && <ContactStep data={contactData} onChange={setContactData} />}

          {step === 2 && <SalonBasicsStep data={salonBasicsData} onChange={setSalonBasicsData} />}

          {step === 3 && <WorkingHoursStep data={workingHoursData} onChange={setWorkingHoursData} />}

          {step === 4 && <ServicesStep services={services} onChange={setServices} />}

          {step === 5 && (
            <GoogleCalendarStep
              isGoogleConnected={isGoogleConnected}
              onGoogleConnectionChange={handleGoogleConnectionChange}
              calendarId={calendarId}
            />
          )}

          {step === 6 && <TrialAgreementStep trialAccepted={trialAccepted} onTrialAcceptedChange={setTrialAccepted} />}

          {step === 7 && (
            <FinalSubmitStep
              contactData={contactData}
              salonBasicsData={salonBasicsData}
              workingHoursData={workingHoursData}
              services={services}
              calendarId={calendarId}
              error={submitError}
            />
          )}

          {step === 8 && <FinishStep tenantSlug={tenantSlug} error={submitError} />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          {step > 1 && step < 8 ? (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              className="border-2 border-gray-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
          ) : (
            <div />
          )}

          {step < 7 && (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-black text-white hover:bg-gray-800 ml-auto"
            >
              Напред
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {step === 7 && (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="bg-black text-white hover:bg-gray-800 ml-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Изпращане...
                </>
              ) : (
                'Завърши'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
