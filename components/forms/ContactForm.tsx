'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ContactFormProps {
  type?: 'contact' | 'demo' | 'pricing';
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  salon_name: string;
  city: string;
  locations_count: string; // държим като string за input
  uses_booking_software: '' | 'yes' | 'no';
  preferred_contact_method: 'phone' | 'email';
  message: string;
};

export function ContactForm({ type = 'contact' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    salon_name: '',
    city: '',
    locations_count: '1',
    uses_booking_software: '',
    preferred_contact_method: 'phone',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  function toIntSafe(v: string, fallback = 1) {
    const n = Number(String(v || '').trim());
    if (!Number.isFinite(n) || n <= 0) return fallback;
    return Math.floor(n);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        salon_name: formData.salon_name.trim(),
        city: formData.city.trim(),
        locations_count: toIntSafe(formData.locations_count, 1),
        // ако не е избрал нищо -> null (по-чисто за бекенда)
        uses_booking_software:
          formData.uses_booking_software === ''
            ? null
            : formData.uses_booking_software === 'yes',
        preferred_contact_method: formData.preferred_contact_method,
        message: formData.message.trim(),
        type,
      };

      // минимална валидация (UI required го прави, но това е backup)
      if (!payload.name || !payload.email || !payload.phone) {
        throw new Error('Моля, попълнете име, имейл и телефон.');
      }

      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        // ignore
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Грешка при изпращане.');
      }

      // ✅ УСПЕХ -> директно thank you страница
      window.location.href = '/thanks';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при изпращане');
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Име и фамилия *</Label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <Label>Имейл *</Label>
            <Input name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div>
            <Label>Телефон *</Label>
            <Input name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div>
            <Label>Име на салон</Label>
            <Input name="salon_name" value={formData.salon_name} onChange={handleChange} />
          </div>

          <div>
            <Label>Град</Label>
            <Input name="city" value={formData.city} onChange={handleChange} />
          </div>

          <div>
            <Label>Брой обекти</Label>
            <Input
              name="locations_count"
              value={formData.locations_count}
              onChange={handleChange}
              inputMode="numeric"
            />
          </div>

          <div>
            <Label>Използвате ли софтуер за записване на часове?</Label>
            <select
              name="uses_booking_software"
              value={formData.uses_booking_software}
              onChange={handleChange}
              className="w-full p-2 rounded"
            >
              <option value="">Изберете...</option>
              <option value="yes">Да</option>
              <option value="no">Не</option>
            </select>
          </div>

          <div>
            <Label>Предпочитан начин за контакт</Label>
            <select
              name="preferred_contact_method"
              value={formData.preferred_contact_method}
              onChange={handleChange}
              className="w-full p-2 rounded"
            >
              <option value="phone">Телефон</option>
              <option value="email">Имейл</option>
            </select>
          </div>

          <div>
            <Label>Съобщение</Label>
            <Textarea name="message" value={formData.message} onChange={handleChange} />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full text-lg py-6" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Изпращане...
            </>
          ) : (
            'Изпрати заявка'
          )}
        </Button>

        <p className="text-sm text-gray-500 text-center">
          Изпращайки формата, вие се съгласявате с нашите{' '}
          <a href="/privacy" className="text-blue-400 hover:text-blue-300 hover:underline">
            условия за поверителност
          </a>
        </p>
      </form>
    </Card>
  );
}
