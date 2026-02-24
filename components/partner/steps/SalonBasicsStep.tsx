'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SalonBasicsData } from '../PartnerWizard';

interface SalonBasicsStepProps {
  data: SalonBasicsData;
  onChange: (data: SalonBasicsData) => void;
}

export function SalonBasicsStep({ data, onChange }: SalonBasicsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Основна информация за салона</h3>
        <p className="text-gray-600">
          Настройки за работа на AI рецепциониста
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="salonName">
            Име на салона <span className="text-red-500">*</span>
          </Label>
          <Input
            id="salonName"
            type="text"
            placeholder="Салон Красота"
            value={data.salonName}
            onChange={(e) => onChange({ ...data, salonName: e.target.value })}
            className="border-2 border-gray-200 focus:border-black"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Часова зона</Label>
          <Input
            id="timezone"
            type="text"
            value={data.timezone}
            disabled
            className="border-2 border-gray-200 bg-gray-50"
          />
          <p className="text-sm text-gray-500">
            Автоматично настроено на Europe/Sofia
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slotStepMin">Продължителност на слот (минути)</Label>
          <Input
            id="slotStepMin"
            type="number"
            value={data.slotStepMin}
            disabled
            className="border-2 border-gray-200 bg-gray-50"
          />
          <p className="text-sm text-gray-500">
            Фиксирано на 15 минути
          </p>
        </div>
      </div>
    </div>
  );
}
