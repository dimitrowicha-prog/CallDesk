'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CheckCircle, Loader2, Clock } from 'lucide-react';

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
        headers: {
          'Content-Type': 'application/json',
        },
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
      <Card className="p-8 text-center border border-green-500/50 bg-gradient-to-br from-green-500/20 to-green-600/10 shadow-xl shadow-green-500/20">
        <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
        <h3 className="text-3xl font-bold text-white mb-3">Благодарим ви!</h3>
        <p className="text-gray-300 mb-2 text-lg">
          Вашата заявка беше изпратена успешно.
        </p>
        <div className="inline-flex items-center space-x-2 text-gray-400 mb-6">
          <Clock className="h-5 w-5" />
          <p className="text-sm">
            Ще се свържем с вас до 24 часа
          </p>
        </div>
        <p className="text-sm text-gray-400 mb-6">
          Проверете имейла си за потвърждение и следващи стъпки.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline" size="lg" className="border-2 border-gray-600 text-gray-300 hover:bg-white/5 hover:border-gray-400 hover:text-white">
          Изпрати друга заявка
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-8 shadow-xl shadow-blue-500/10 border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-sm font-semibold text-gray-300">
            Име и фамилия <span className="text-red-400">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Иван Иванов"
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="email" className="text-sm font-semibold text-gray-300">
              Имейл <span className="text-red-400">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ivan@example.com"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-300">
              Телефон <span className="text-red-400">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+359 88 123 4567"
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="salon_name" className="text-sm font-semibold text-gray-300">
            Име на салон
          </Label>
          <Input
            id="salon_name"
            name="salon_name"
            value={formData.salon_name}
            onChange={handleChange}
            placeholder="Салон Елеганс"
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="city" className="text-sm font-semibold text-gray-300">
              Град
            </Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="София"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="locations_count" className="text-sm font-semibold text-gray-300">
              Брой обекти
            </Label>
            <Input
              id="locations_count"
              name="locations_count"
              type="number"
              min="1"
              value={formData.locations_count}
              onChange={handleChange}
              placeholder="1"
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="uses_booking_software" className="text-sm font-semibold text-gray-300">
              Използвате ли софтуер за записване на часове?
            </Label>
            <select
              id="uses_booking_software"
              name="uses_booking_software"
              value={formData.uses_booking_software}
              onChange={handleChange}
              className="mt-2 w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Изберете...</option>
              <option value="yes">Да</option>
              <option value="no">Не</option>
            </select>
          </div>

          <div>
            <Label htmlFor="preferred_contact_method" className="text-sm font-semibold text-gray-300">
              Предпочитан начин за контакт
            </Label>
            <select
              id="preferred_contact_method"
              name="preferred_contact_method"
              value={formData.preferred_contact_method}
              onChange={handleChange}
              className="mt-2 w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="phone">Телефон</option>
              <option value="email">Имейл</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="message" className="text-sm font-semibold text-gray-300">
            Съобщение
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Разкажете ни повече за вашия салон и нужди..."
            rows={4}
            className="mt-2"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full text-lg py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 transition-all border-0"
          disabled={isSubmitting}
        >
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
