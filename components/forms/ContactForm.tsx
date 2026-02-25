'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ContactFormProps {
  type?: 'contact' | 'demo' | 'pricing';
}

export function ContactForm({ type = 'contact' }: ContactFormProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ DEBUG: ако това не излиза, значи submit изобщо не се случва
    console.log('SUBMIT FIRED ✅');

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        locations_count: Number(formData.locations_count || 1),
        uses_booking_software: formData.uses_booking_software === 'yes',
        type,
        source: 'calldeskbg.com',
      };

      console.log('SENDING PAYLOAD ✅', payload);

      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      console.log('API RESPONSE ✅', response.status, data);

      if (!response.ok) {
        throw new Error(data?.error || 'Нещо се обърка при изпращането');
      }

      // ✅ директно към thanks (без demo вътрешен success екран)
      router.push('/thanks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при изпращане');
    } finally {
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
              className="w-full p-2 rounded border border-gray-300"
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
              className="w-full p-2 rounded border border-gray-300"
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

        {/* ✅ ВАЖНО: native button за 100% submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full text-lg py-6 rounded-lg bg-black text-white hover:bg-black/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Изпращане...
            </>
          ) : (
            'Изпрати заявка'
          )}
        </button>

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
