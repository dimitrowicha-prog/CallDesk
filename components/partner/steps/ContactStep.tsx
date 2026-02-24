'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContactData } from '../PartnerWizard';

interface ContactStepProps {
  data: ContactData;
  onChange: (data: ContactData) => void;
}

export function ContactStep({ data, onChange }: ContactStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Вашите контактни данни</h3>
        <p className="text-gray-600">
          Ще се свържем с вас за активиране на услугата
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Вашето име <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Иван Петров"
            value={data.fullName}
            onChange={(e) => onChange({ ...data, fullName: e.target.value })}
            className="border-2 border-gray-200 focus:border-black"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Телефон <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+359 88 123 4567"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            className="border-2 border-gray-200 focus:border-black"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Имейл <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="ivan@salon.bg"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            className="border-2 border-gray-200 focus:border-black"
            required
          />
        </div>
      </div>
    </div>
  );
}
