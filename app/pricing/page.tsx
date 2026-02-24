'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '14.99',
      currency: '€',
      period: 'месец',
      description: 'За стартиращи салони',
      features: [
        'До 50 обаждания на месец',
        'AI отговаря на входящи обаждания',
        'Записване на часове',
        'Подходящо за малък салон',
      ],
      popular: false,
    },
    {
      name: 'Pro',
      price: '29.99',
      currency: '€',
      period: 'месец',
      description: 'Най-добър избор за повечето салони',
      features: [
        'До 150 обаждания на месец',
        'Всички функции от Starter',
        'По-бърза реакция',
        'Приоритетна поддръжка',
        'Подходящо за натоварени салони',
      ],
      popular: true,
    },
    {
      name: 'Business',
      price: '49.99',
      currency: '€',
      period: 'месец',
      description: 'За много натоварени салони',
      features: [
        'До 300 обаждания на месец',
        'Всички функции',
        'Подходящо за много натоварени салони',
        'По-стабилна обработка на разговори',
      ],
      popular: false,
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
            Прости и ясни цени
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-6">
            Изберете плана, който отговаря на нуждите на вашия салон
          </p>
          <p className="text-lg text-gray-500">
            14-дневен безплатен пробен период за всички планове
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className={`p-8 md:p-10 h-full flex flex-col relative transition-all duration-300 ${
                  plan.popular
                    ? 'border-2 border-black shadow-xl scale-105'
                    : 'border border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
                    Препоръчан
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl md:text-6xl font-bold">
                      {plan.price}
                    </span>
                    <span className="text-xl text-gray-600 ml-2">
                      {plan.currency}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">/ {plan.period}</p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-black flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full py-6 text-lg transition-all ${
                    plan.popular
                      ? 'bg-black hover:bg-gray-800 text-white'
                      : 'border-2 border-black bg-white hover:bg-gray-50 text-black'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Link href="/demo">
                    Започни
                  </Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-50 rounded-3xl p-12 md:p-16 border border-gray-200 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Enterprise
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Персонална оферта за вериги и големи салони с неограничени обаждания и директна поддръжка
          </p>
          <Button
            asChild
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg"
          >
            <Link href="/contact">Свържи се с нас</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 text-center bg-black text-white rounded-3xl p-12 md:p-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Все още не сте сигурни?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Запазете безплатно демо и открийте как CallDesk може да трансформира вашия салон
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-gray-100 text-black px-8 py-6 text-lg"
          >
            <Link href="/demo">Запази демо</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
