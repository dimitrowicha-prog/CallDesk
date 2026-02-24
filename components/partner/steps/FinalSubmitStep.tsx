'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { AlertCircle, Building2, Calendar, CheckCircle2, Clock, Scissors } from 'lucide-react';
import { ContactData, SalonBasicsData, Service, WorkingHoursData } from '../PartnerWizard';

interface FinalSubmitStepProps {
  contactData: ContactData;
  salonBasicsData: SalonBasicsData;
  workingHoursData: WorkingHoursData;
  services: Service[];
  calendarId?: string;
  error?: string | null;
}

export function FinalSubmitStep({
  contactData,
  salonBasicsData,
  workingHoursData,
  services,
  calendarId,
  error,
}: FinalSubmitStepProps) {
  const dayLabels: { [key: string]: string } = {
    mon: 'Понеделник',
    tue: 'Вторник',
    wed: 'Сряда',
    thu: 'Четвъртък',
    fri: 'Петък',
    sat: 'Събота',
    sun: 'Неделя',
  };

  const displayCalendarId =
    calendarId && calendarId.length > 30
      ? `${calendarId.slice(0, 20)}...${calendarId.slice(-15)}`
      : calendarId;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <div className="text-center space-y-4 mt-8">
          <p className="text-gray-600">
            Моля опитайте отново като натиснете бутона Завърши.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <div className="text-center space-y-2 mb-8">
        <h3 className="text-2xl font-bold">Преглед и завършване</h3>
        <p className="text-gray-600">
          Моля прегледайте информацията преди да завършите
        </p>
      </div>

      <div className="space-y-4">
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <Building2 className="h-5 w-5 text-gray-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-3">Информация за салона</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Име на салона:</span>
                  <span className="font-medium">{salonBasicsData.salonName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Часова зона:</span>
                  <span className="font-medium">{salonBasicsData.timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Стъпка на слот:</span>
                  <span className="font-medium">{salonBasicsData.slotStepMin} мин</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <Clock className="h-5 w-5 text-gray-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-3">Работно време</h4>
              <div className="space-y-2 text-sm">
                {Object.entries(workingHoursData).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-600">{dayLabels[day]}:</span>
                    <span className="font-medium">
                      {hours ? `${hours.start} - ${hours.end}` : 'Затворено'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <Scissors className="h-5 w-5 text-gray-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-3">Услуги</h4>
              <div className="space-y-2">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 rounded-lg p-3"
                  >
                    <span className="font-medium">{service.serviceName}</span>
                    <span className="text-sm text-gray-600">
                      {service.durationMin} мин
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <Calendar className="h-5 w-5 text-gray-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-3">Google Calendar</h4>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Свързан ✅</span>
                </div>
                <p className="text-sm text-green-700">
                  <span className="font-mono text-xs break-all">
                    {displayCalendarId}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-6 mt-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-lg text-blue-900 mb-2">
                Готови сте да стартирате!
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                След натискане на бутона "Завърши", вашият AI рецепционист ще бъде
                активиран в рамките на 8 часа. Ще получите имейл с подробности и
                инструкции за следващите стъпки.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
