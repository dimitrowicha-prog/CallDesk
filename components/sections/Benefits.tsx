'use client';

import { motion } from 'framer-motion';
import { Clock, Shield, Zap, HeadphonesIcon, TrendingUp } from 'lucide-react';

export function Benefits() {
  const benefits = [
    {
      icon: Clock,
      title: 'Работи 24/7',
      description: 'Приема обаждания по всяко време, дори когато салонът е затворен.',
    },
    {
      icon: TrendingUp,
      title: 'Повече резервации',
      description: 'Намалява пропуснатите обаждания и улеснява клиентите.',
    },
    {
      icon: Zap,
      title: 'Моментална настройка',
      description: 'Системата се активира за минути. Просто добавите услугите.',
    },
    {
      icon: Shield,
      title: 'Качествено обслужване',
      description: 'Всеки клиент получава еднакво професионален подход.',
    },
    {
      icon: HeadphonesIcon,
      title: 'Разтоварва екипа',
      description: 'Освобождава персонала от телефонни обаждания.',
    },
  ];

  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Защо CallDesk?
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Предимства, които ще трансформират начина, по който управлявате резервациите
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {benefits.slice(0, 3).map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl">
                <benefit.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mt-12 lg:mt-16 max-w-4xl mx-auto">
          {benefits.slice(3).map((benefit, index) => (
            <motion.div
              key={index + 3}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl">
                <benefit.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
