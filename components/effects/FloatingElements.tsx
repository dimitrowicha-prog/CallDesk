'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';

export function FloatingElements() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  if (windowSize.width === 0) return null;

  const icons = [
    { Icon: Sparkles, delay: 0, duration: 20 },
    { Icon: Zap, delay: 5, duration: 25 },
    { Icon: Shield, delay: 10, duration: 22 },
    { Icon: TrendingUp, delay: 15, duration: 18 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {icons.map(({ Icon, delay, duration }, index) => (
        <motion.div
          key={index}
          className="absolute opacity-10"
          initial={{
            x: Math.random() * windowSize.width,
            y: -50,
          }}
          animate={{
            y: windowSize.height + 50,
            x: Math.random() * windowSize.width,
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Icon className="h-8 w-8 text-blue-400" />
        </motion.div>
      ))}

      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute w-2 h-2 rounded-full bg-blue-400"
          initial={{
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
            opacity: 0,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
