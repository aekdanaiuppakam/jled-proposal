import React from 'react';
import { motion } from 'framer-motion';

export interface SectionWrapperProps {
  id?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function SectionWrapper({
  id,
  title,
  description,
  children,
  className = '',
  fullWidth = false,
}: SectionWrapperProps) {
  const hasHeader = Boolean(title || description);

  return (
    <section
      id={id}
      className={`relative w-full py-16 md:py-24 px-4 sm:px-6 md:px-8 flex flex-col items-center ${className}`}
    >
      <div className={`w-full ${fullWidth ? 'max-w-full' : 'max-w-5xl'} mx-auto flex flex-col items-center`}>
        {hasHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 md:mb-12 text-center w-full max-w-2xl mx-auto flex flex-col items-center"
          >
            {/* Accent decorative bar & dot */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <span
                className="w-6 h-1 rounded-full"
                style={{ backgroundColor: 'var(--accent-color)' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--accent-color)' }}
              />
              <span
                className="w-6 h-1 rounded-full"
                style={{ backgroundColor: 'var(--accent-color)' }}
              />
            </div>

            {title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3 leading-snug">
                {title}
              </h2>
            )}

            {description && (
              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-xl mx-auto">
                {description}
              </p>
            )}
          </motion.div>
        )}

        <div className="w-full flex flex-col items-center">
          {children}
        </div>
      </div>
    </section>
  );
}
