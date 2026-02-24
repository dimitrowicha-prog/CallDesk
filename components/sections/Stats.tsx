'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Stats() {
  const stats = [
    { value: 10000, suffix: '+', label: 'Обработени обаждания' },
    { value: 99.9, suffix: '%', label: 'Uptime гаранция' },
    { value: 500, suffix: '+', label: 'Доволни салони' },
    { value: 24, suffix: '/7', label: 'Поддръжка' },
  ];

  return (
    <section className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mb-3">
                <span className="text-6xl md:text-7xl font-bold text-black tracking-tight">
                  <AnimatedNumber value={stat.value} duration={2} />
                  {stat.suffix}
                </span>
              </div>
              <p className="text-base md:text-lg text-gray-600">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedNumber({ value, duration }: { value: number; duration: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(value * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return <>{value >= 1000 ? count.toLocaleString() : count}</>;
}
