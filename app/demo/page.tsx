'use client';

import { ContactForm } from '@/components/forms/ContactForm';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Video, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function DemoPage() {
  const benefits = [
    'Персонализирана демонстрация за вашия салон',
    'Отговори на всички ваши въпроси',
    'Вижте реални разговори и резервации',
    'Разберете как се настройва и управлява',
    'Без ангажимент',
  ];

  const steps = [
    {
      icon: Calendar,
      title: 'Запазете час',
      description: 'Попълнете формата и ще се свържем с вас за уточняване на удобно време',
    },
    {
      icon: Video,
      title: 'Демонстрация',
      description: 'Ще ви покажем как работи CallDesk специално за вашия салон',
    },
    {
      icon: CheckCircle,
      title: 'Решете',
      description: 'След демото вие решавате дали CallDesk е подходящ за вас',
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
          <div className="inline-flex items-center space-x-2 bg-gray-100 text-black px-4 py-2 rounded-full mb-6">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Демото отнема около 30 минути</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            Вижте CallDesk в действие
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Запазете безплатна демонстрация и разберете как CallDesk може да трансформира управлението на резервациите
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactForm type="demo" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Какво включва демото?
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-black mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="p-8 bg-black text-white">
              <h3 className="text-2xl font-bold mb-4">
                14 дни безплатен пробен период
              </h3>
              <p className="text-gray-300 mb-6">
                След демото, ако решите да продължите, получавате пълен достъп до всички функции за 14 дни. Няма нужда от кредитна карта.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-2" />
                  <span className="text-gray-300">Достъп до всички функции</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-2" />
                  <span className="text-gray-300">Пълна поддръжка</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-2" />
                  <span className="text-gray-300">Без ангажимент</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            Как работи процесът?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="p-8 text-center border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-6">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-5xl font-bold text-[#111111] mb-4">
                  0{index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
