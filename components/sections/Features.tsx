'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Calendar, Users, FileText, Bell, BarChart, PhoneForwarded } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Calendar,
      title: 'Интелигентно записване на часове',
      description: 'AI системата проверява свободните часове в реално време, предлага подходящи опции и записва резервациите автоматично във вашия календар.',
    },
    {
      icon: PhoneForwarded,
      title: 'Прехвърляне към екип',
      description: 'При необходимост или по желание на клиента, разговорът може да се прехвърли към член на вашия екип за по-сложни въпроси.',
    },
    {
      icon: Users,
      title: 'Управление на специалисти',
      description: 'Добавете вашите специалисти с техните услуги и работно време. Клиентите могат да избират конкретен майстор.',
    },
    {
      icon: FileText,
      title: 'Информация за услуги и цени',
      description: 'AI отговаря на въпроси за вашите услуги, цени, продължителност и специални оферти според зададената от вас информация.',
    },
    {
      icon: Bell,
      title: 'Автоматични известия',
      description: 'Клиентите получават SMS и имейл потвърждения, а вие получавате моментално уведомление за всяка нова резервация.',
    },
    {
      icon: BarChart,
      title: 'Отчети и анализи',
      description: 'Преглеждайте статистики за обажданията, резервациите и най-търсените услуги. Оптимизирайте работата на базата на данни.',
    },
  ];

  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Пълен набор от функции
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Всичко, от което се нуждаете за професионално управление на резервациите
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
