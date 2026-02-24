'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function DemoSection() {
  return (
    <section id="demo" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-black text-white">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Готови да трансформирате вашия салон?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Присъединете се към стотици салони, които никога не пропускат клиент
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-gray-100 text-black px-10 py-7 text-lg rounded-lg shadow-lg"
          >
            <Link href="/demo" className="flex items-center justify-center">
              Запази демо
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
