'use client';

import { ContactForm } from '@/components/forms/ContactForm';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Телефон',
      content: '+359 2 123 4567',
      link: 'tel:+35921234567',
    },
    {
      icon: Mail,
      title: 'Имейл',
      content: 'contact@calldesk.bg',
      link: 'mailto:contact@calldesk.bg',
    },
    {
      icon: MapPin,
      title: 'Адрес',
      content: 'София, България',
      link: null,
    },
    {
      icon: Clock,
      title: 'Работно време',
      content: 'Пон-Пет: 9:00 - 18:00',
      link: null,
    },
  ];

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            Свържете се с нас
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Имате въпроси? Нашият екип е тук, за да ви помогне
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactForm type="contact" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Информация за контакт
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Свържете се с нас по всякакъв начин, който ви е удобен. Ще се радваме да чуем от вас и да отговорим на всички ваши въпроси.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="p-6 border border-gray-200 bg-white hover:shadow-md transition-all">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl mb-4">
                    <info.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-black mb-2">
                    {info.title}
                  </h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-gray-600">{info.content}</p>
                  )}
                </Card>
              ))}
            </div>

            <Card className="p-8 border border-gray-200 bg-gray-50">
              <h3 className="text-xl font-bold mb-4">
                Бързи въпроси?
              </h3>
              <p className="text-gray-700 mb-4">
                Проверете нашата страница с често задавани въпроси за моментални отговори на популярни въпроси.
              </p>
              <a
                href="/faq"
                className="text-black font-semibold hover:underline"
              >
                Виж FAQ →
              </a>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
