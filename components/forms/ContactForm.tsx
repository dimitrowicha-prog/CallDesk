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

export function ContactForm({ type = 'contact' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          uses_booking_software: formData.uses_booking_software === 'yes',
          type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Нещо се обърка');
      }

      setIsSuccess(true);
      setFormData({
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при изпращане');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="p-8 space-y-6">
        <h3 className="text-2xl font-semibold">Благодарим ви!</h3>
        <p>Вашата заявка беше изпратена успешно.</p>
        <p>Ще се свържем с вас до 24 часа.</p>
        <p>Проверете имейла си за потвърждение и следващи стъпки.</p>

        <Button
          onClick={() => setIsSuccess(false)}
          variant="outline"
          size="lg"
          className="border-2 border-gray-600 text-gray-300 hover:bg-white/5 hover:border-gray-400 hover:text-white"
        >
          Изпрати друга заявка
        </Button>
      </Card>
    );
  }

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
            <Input name="locations_count" value={formData.locations_count} onChange={handleChange} />
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
