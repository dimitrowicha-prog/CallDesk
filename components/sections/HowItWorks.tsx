'use client';

import { motion } from 'framer-motion';
import { Phone, MessageSquare, CheckCircle } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Phone,
      number: '01',
      title: 'Клиентът се обажда',
      description: 'AI асистентът отговаря веднага и поздравява клиента.',
    },
    {
      icon: MessageSquare,
      number: '02',
      title: 'AI разбира нуждите',
      description: 'Системата събира информация за услугата и желаното време.',
    },
    {
      icon: CheckCircle,
      number: '03',
      title: 'Часът е записан',
      description: 'Резервацията се добавя автоматично и се изпраща потвърждение.',
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
            Как работи?
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Прост процес в 3 стъпки
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <div className="flex flex-col items-start space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-7xl font-bold text-[#111111]">
                    {step.number}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-8 w-16 h-0.5 bg-gray-300"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
