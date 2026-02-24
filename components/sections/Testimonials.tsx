'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Мария Иванова',
      role: 'Собственик, Салон "Елеганс"',
      location: 'София',
      content: 'CallDesk промени начина, по който управляваме обажданията. Вече не пропускаме клиенти, защото екипът е зает.',
      rating: 5,
    },
    {
      name: 'Петър Георгиев',
      role: 'Мениджър, "Beauty Studio"',
      location: 'Пловдив',
      content: 'Настройката беше невероятно лесна и след седмица вече виждаме резултати. Клиентите са доволни от бързото обслужване.',
      rating: 5,
    },
    {
      name: 'Елена Димитрова',
      role: 'Собственик, "Стил и Грация"',
      location: 'Варна',
      content: 'Имаме три обекта и CallDesk ни помогна да централизираме резервациите. Системата работи безпроблемно 24/7.',
      rating: 5,
    },
  ];

  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Какво казват клиентите
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Истории на салони, които трансформираха обслужването си
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="p-8 h-full border border-gray-200 bg-white hover:shadow-lg transition-all">
                <div className="flex items-center space-x-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-black text-black" />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  "{testimonial.content}"
                </p>

                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-black">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
