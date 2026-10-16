import { motion } from 'framer-motion';
import type { TechnicalSpecification } from '../../types';
import { SectionWrapper } from './SectionWrapper';

export interface SpecificationPanelProps {
  specs: TechnicalSpecification[];
  title?: string;
  description?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function SpecificationPanel({
  specs = [],
  title,
  description,
}: SpecificationPanelProps) {
  if (!specs || specs.length === 0) {
    return null;
  }

  // Sort specs by sortOrder
  const sortedSpecs = [...specs].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <SectionWrapper
      id="specifications"
      title={title || 'ข้อมูลจำเพาะทางเทคนิค'}
      description={description || 'รายละเอียดคุณสมบัติและมาตรฐานทางวิศวกรรมของระบบจอแสดงผล LED'}
    >
      <div className="w-full max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        >
          {sortedSpecs.map((spec) => {
            const isEmpty = !spec.fieldValue || spec.fieldValue.trim() === '';
            const displayValue = isEmpty ? 'To Be Confirmed' : spec.fieldValue;

            return (
              <motion.div
                key={spec.id}
                variants={itemVariants}
                className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-[#1E293B]/70 backdrop-blur-md border border-white/5 hover:border-white/15 transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-2px]"
              >
                {/* Top: Field name & colored dot decoration */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-xs sm:text-sm font-medium text-[#94A3B8] tracking-wide">
                    {spec.fieldName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full transition-transform duration-200 group-hover:scale-125"
                      style={{
                        backgroundColor: 'var(--accent-color)',
                        boxShadow: '0 0 8px var(--accent-color)',
                      }}
                    />
                  </div>
                </div>

                {/* Bottom: Value & Unit */}
                <div className="flex items-baseline flex-wrap gap-2">
                  <span
                    className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors ${
                      isEmpty
                        ? 'text-[#64748B] italic font-normal text-base sm:text-lg'
                        : 'text-white group-hover:text-white'
                    }`}
                  >
                    {displayValue}
                  </span>

                  {!isEmpty && spec.unit && (
                    <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-[#94A3B8]">
                      {spec.unit}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
