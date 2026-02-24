'use client';

import { motion } from 'framer-motion';
import { Clock, Zap, Building2, Shield } from 'lucide-react';

export function SocialProof() {
  const trustBadges = [
    { icon: Clock, label: '24/7 прием на обаждания' },
    { icon: Zap, label: 'Настройка за минути' },
    { icon: Building2, label: 'Подходящо за 1+ обекта' },
    { icon: Shield, label: 'GDPR-ready' },
  ];

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-y border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trustBadges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl mb-3">
                <badge.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm md:text-base font-medium text-gray-700">{badge.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
