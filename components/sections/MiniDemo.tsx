'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { CheckCircle, Phone } from 'lucide-react';

export function MiniDemo() {
  const conversation = [
    {
      speaker: 'Клиент',
      message: 'Здравейте, бих искал да запиша час за подстригване утре в 18:00.',
      isAI: false,
    },
    {
      speaker: 'AI',
      message: 'Здравейте! Благодаря за обаждането. Проверявам свободните часове за утре...',
      isAI: true,
    },
    {
      speaker: 'AI',
      message: 'За съжаление 18:00 е заето. Мога да предложа 17:00, 18:30 или 19:00. Кой час ви устройва?',
      isAI: true,
    },
    {
      speaker: 'Клиент',
      message: 'Добре, 18:30 ще е перфектно.',
      isAI: false,
    },
    {
      speaker: 'AI',
      message: 'Отлично! Записах ви за подстригване утре в 18:30. Ще получите SMS потвърждение. Мога ли да ви помогна с нещо друго?',
      isAI: true,
      isConfirmation: true,
    },
  ];

  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-6">
            <Phone className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Вижте как работи в реално време
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Пример за разговор между AI асистента и клиент
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8 md:p-10 bg-gray-50 border border-gray-200 shadow-lg">
            <div className="space-y-4">
              {conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.isAI ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                  className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                      message.isAI
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-900'
                    } ${message.isConfirmation ? 'ring-2 ring-black' : ''}`}
                  >
                    <div className="text-xs font-semibold mb-1 opacity-70">
                      {message.speaker}
                    </div>
                    <p className="text-sm leading-relaxed">{message.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-center space-x-2 text-black"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Часът е записан успешно и потвърден</span>
            </motion.div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          Разговорът продължава под 30 секунди • Клиентът получава SMS потвърждение • Вие виждате новата резервация веднага
        </motion.div>
      </div>
    </section>
  );
}
