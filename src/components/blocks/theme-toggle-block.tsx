'use client';

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
            <h3 className={`text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6 transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
            <p className={`text-xl leading-relaxed transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {text}
            </p>
          </div>
          
          {/* Toggle Control */}
          <div className="flex justify-start md:justify-end items-center gap-4">
            <span className={`text-sm font-medium tracking-widest uppercase transition-colors duration-300 ${!isDark ? 'text-blue-600' : 'text-gray-600'}`}>Light</span>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`w-20 h-10 rounded-full p-1 relative transition-colors duration-500 shadow-inner ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
              aria-label="Toggle Theme"
            >
              <motion.div
                initial={false}
                animate={{ x: isDark ? 40 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-8 h-8 rounded-full bg-white shadow-lg"
              />
            </button>
            <span className={`text-sm font-medium tracking-widest uppercase transition-colors duration-300 ${isDark ? 'text-blue-400' : 'text-gray-400'}`}>Dark</span>
          </div>
        </div>

        {/* Image Display */}
        <div className={`relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl transition-colors duration-500 ring-1 ring-black/5 ${isDark ? 'bg-zinc-950' : 'bg-gray-100'}`}>
            <AnimatePresence mode="wait">
                <motion.img
                    key={isDark ? 'dark' : 'light'}
                    src={isDark ? images.dark : images.light}
                    alt={isDark ? "Dark Mode UI" : "Light Mode UI"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-contain p-8 md:p-16"
                />
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
