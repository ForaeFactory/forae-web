'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeToggleProps {
  title: string;
  text: string;
  images: {
    light: string;
    dark: string;
  };
}

export default function ThemeToggleBlock({ title, text, images }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`w-full py-24 transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className={`text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6 transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h2>
            <p className={`text-xl leading-relaxed transition-colors duration-500 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {text}
            </p>
          </div>

          {/* Toggle Control */}
          <div className="flex justify-start md:justify-end items-center gap-4">
            <span aria-hidden className={`text-sm font-medium tracking-widest uppercase transition-colors duration-300 ${!isDark ? 'text-gray-900' : 'text-gray-500'}`}>Light</span>
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              onClick={() => setIsDark(!isDark)}
              className={`w-20 h-10 rounded-full p-1 relative transition-colors duration-500 shadow-inner ${isDark ? 'bg-accent' : 'bg-gray-300'}`}
              aria-label="Show dark mode interface"
            >
              <motion.div
                initial={false}
                animate={{ x: isDark ? 40 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-8 h-8 rounded-full bg-white shadow-lg"
              />
            </button>
            <span aria-hidden className={`text-sm font-medium tracking-widest uppercase transition-colors duration-300 ${isDark ? 'text-accent' : 'text-gray-500'}`}>Dark</span>
          </div>
        </div>

        {/* Image Display */}
        <div className={`relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl transition-colors duration-500 ring-1 ring-black/5 ${isDark ? 'bg-zinc-950' : 'bg-gray-100'}`}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={isDark ? 'dark' : 'light'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 p-8 md:p-16"
                >
                    <div className="relative h-full w-full">
                        <Image
                            src={isDark ? images.dark : images.light}
                            alt={`${title} interface in ${isDark ? 'dark' : 'light'} mode`}
                            fill
                            sizes="(min-width: 1280px) 1150px, 90vw"
                            className="object-contain"
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
