'use client';

import { useState } from 'react';
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

  const handleNext = () => {
    if (step === 2) {
      // Generate tenant slug when moving from step 2 to 3
      const slug = generateSlug(salonBasicsData.salonName);
      setTenantSlug(slug);
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const trialDays = 14;
      const trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toISOString();
      const createdAt = new Date().toISOString();

      const payload = {
        action: 'onboard',
        sipUser: `sip:${tenantSlug}@calldeskbg.sip.twilio.com`,
        calendarId: calendarId,
        name: salonBasicsData.salonName,
        timezone: salonBasicsData.timezone,
        slotStepMin: salonBasicsData.slotStepMin,
        workHoursJson: JSON.stringify(workingHoursData),
        services: services,
        contact: contactData,
        isTrial: true,
        trialDays: trialDays,
        trialEndsAt: trialEndsAt,
        trialAccepted: trialAccepted,
        createdAt: createdAt,
      };

      const response = await fetch('/api/partner/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || 'Failed to submit');
      }

      handleNext();
    } catch (error) {
      console.error('Error submitting partner data:', error);
      const message = error instanceof Error ? error.message : 'Грешка при изпращане. Моля опитайте отново.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return contactData.fullName && contactData.phone && contactData.email;
      case 2:
        return salonBasicsData.salonName;
      case 3:
        return true;
      case 4:
        return services.length > 0;
      case 5:
        return isGoogleConnected;
      case 6:
        return trialAccepted;
      case 7:
        return isGoogleConnected && trialAccepted;
      default:
        return false;
    }
  };

  const handleGoogleConnectionChange = (connected: boolean, calId?: string) => {
    setIsGoogleConnected(connected);
    if (calId) {
      setCalendarId(calId);
    }
  };

  const steps = [
    { number: 1, title: 'Контакт' },
    { number: 2, title: 'Салон' },
    { number: 3, title: 'Работно време' },
    { number: 4, title: 'Услуги' },
    { number: 5, title: 'Google' },
    { number: 6, title: 'Тест' },
    { number: 7, title: 'Завършване' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Стани наш партньор
          </DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s.number
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s.number}
                </div>
                <span className="text-xs mt-2 text-gray-600 hidden sm:block">
                  {s.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 transition-colors ${
                    step > s.number ? 'bg-black' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[400px]">
          {step === 1 && (
            <ContactStep data={contactData} onChange={setContactData} />
          )}
          {step === 2 && (
            <SalonBasicsStep data={salonBasicsData} onChange={setSalonBasicsData} />
          )}
          {step === 3 && (
            <WorkingHoursStep data={workingHoursData} onChange={setWorkingHoursData} />
          )}
          {step === 4 && (
            <ServicesStep services={services} onChange={setServices} />
          )}
          {step === 5 && (
            <GoogleCalendarStep
              isGoogleConnected={isGoogleConnected}
              onGoogleConnectionChange={handleGoogleConnectionChange}
              calendarId={calendarId}
            />
          )}
          {step === 6 && (
            <TrialAgreementStep
              trialAccepted={trialAccepted}
              onTrialAcceptedChange={setTrialAccepted}
            />
          )}
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
          {step === 8 && (
            <FinishStep tenantSlug={tenantSlug} error={submitError} />
          )}
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

          {step === 7 && step < 8 && (
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
