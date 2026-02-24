'use client';

import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Clock, CreditCard } from 'lucide-react';

interface TrialAgreementStepProps {
  trialAccepted: boolean;
  onTrialAcceptedChange: (accepted: boolean) => void;
}

export function TrialAgreementStep({
  trialAccepted,
  onTrialAcceptedChange,
}: TrialAgreementStepProps) {
  return (
    <div className="space-y-6 py-4">
      <div className="text-center space-y-2 mb-8">
        <h3 className="text-2xl font-bold">14 дни безплатен тест</h3>
        <p className="text-gray-600">
          Изпробвай CallDesk напълно безплатно
        </p>
      </div>

      <Card className="p-8 space-y-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
        </div>

        <div className="text-center space-y-4 mb-6">
          <h4 className="text-xl font-semibold">
            Получавате 14 дни безплатен тест на CallDesk
          </h4>
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
            След изтичането му ще трябва да изберете план и да активирате
            плащане, за да продължи услугата без прекъсване.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 my-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h5 className="font-semibold text-blue-900 mb-1">14 дни безплатно</h5>
            <p className="text-sm text-blue-700">
              Пълен достъп до всички функции
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h5 className="font-semibold text-green-900 mb-1">Без карта</h5>
            <p className="text-sm text-green-700">
              Не е необходимо плащане сега
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h5 className="font-semibold text-purple-900 mb-1">Гъвкаво</h5>
            <p className="text-sm text-purple-700">
              Можеш да откажеш по всяко време
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <Card
            className={`p-5 cursor-pointer transition-all ${
              trialAccepted
                ? 'border-2 border-black bg-gray-50'
                : 'border-2 border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => onTrialAcceptedChange(!trialAccepted)}
          >
            <div className="flex items-start gap-4">
              <Checkbox
                id="trial-agreement"
                checked={trialAccepted}
                onCheckedChange={(checked) =>
                  onTrialAcceptedChange(checked === true)
                }
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor="trial-agreement"
                  className="cursor-pointer text-base leading-relaxed"
                >
                  Съгласен/съгласна съм след тестовия период да избера план и да
                  активирам услугата.
                </Label>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>Важно:</strong> Ще получите имейл напомняне 2 дни преди края на
          тестовия период с инструкции как да изберете план и да активирате
          услугата.
        </p>
      </div>
    </div>
  );
}
