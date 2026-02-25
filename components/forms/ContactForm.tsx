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
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  async function postLead(payload: any) {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // важно: без keepalive, без магии — чист POST
      body: JSON.stringify(payload),
    });

    const raw = await res.text();
    let data: any = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      // може да е plain text
    }

    return { res, raw, data };
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    const payload = {
      action: 'lead', // ✅ важно за Apps Script
      type,
      source: 'calldeskbg.com',

      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      salon_name: (formData.salon_name || '').trim(),
      city: (formData.city || '').trim(),
      locations_count: Number(formData.locations_count || 1),

      uses_booking_software: formData.uses_booking_software === 'yes',
      preferred_contact_method: formData.preferred_contact_method || 'phone',
      message: (formData.message || '').trim(),
    };

    console.log('SUBMIT FIRED ✅', payload);

    try {
      // basic validation (за да не пращаме празно)
      if (!payload.name || !payload.email || !payload.phone) {
        throw new Error('Моля попълни име, имейл и телефон.');
      }

      const { res, raw, data } = await postLead(payload);

      console.log('API /api/lead STATUS ✅', res.status);
      console.log('API /api/lead RAW ✅', raw);
      console.log('API /api/lead JSON ✅', data);

      if (!res.ok) {
        const msg = data?.error || data?.message || raw || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      // ✅ success → redirect
      router.push('/thanks');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Грешка при изпращане';
      console.error('SUBMIT ERROR ❌', msg);
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-8">
      {/* ✅ NO action attr, no native navigation */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
