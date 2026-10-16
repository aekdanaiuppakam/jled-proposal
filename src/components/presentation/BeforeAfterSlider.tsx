import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsLeftRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import type { BeforeAfterSet } from '../../types';
import { SectionWrapper } from './SectionWrapper';

export interface BeforeAfterSliderProps {
  sets: BeforeAfterSet[];
  title?: string;
  description?: string;
}

export function BeforeAfterSlider({ sets = [], title, description }: BeforeAfterSliderProps) {
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100 percent
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafId = useRef<number | null>(null);

  const activeSet = sets[activeSetIndex] || sets[0];

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      setSliderPos(percentage);
    });
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    updateSliderPosition(e.clientX);
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        containerRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture may have already been released
      }
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPos((prev) => Math.min(100, prev + 5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPos(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPos(100);
    }
  };

  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  if (!sets || sets.length === 0) {
    return null;
  }

  return (
    <SectionWrapper
      id="before-after"
      title={title || 'ก่อน & หลังการติดตั้ง'}
      description={description || 'เลื่อนแถบเพื่อเปรียบเทียบภาพสถานที่จริงก่อนและหลังการติดตั้งจอ LED'}
    >
      <div className="flex flex-col items-center w-full">
        {/* Set selector tabs if multiple sets */}
        {sets.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 p-1.5 rounded-2xl bg-[#111827] border border-white/10 max-w-full overflow-x-auto">
            {sets.map((set, idx) => (
              <button
                key={set.id || idx}
                type="button"
                onClick={() => {
                  setActiveSetIndex(idx);
                  setSliderPos(50);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeSetIndex === idx
                    ? 'bg-white/10 text-white shadow-md border border-white/20'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                }`}
                style={
                  activeSetIndex === idx
                    ? { borderBottom: '2px solid var(--accent-color)' }
                    : undefined
                }
              >
                <span>{set.title || `มุมมองที่ ${idx + 1}`}</span>
              </button>
            ))}
          </div>
        )}

        {/* Main Slider Container */}
        <div className="w-full max-w-5xl mx-auto">
          <div
            ref={containerRef}
            tabIndex={0}
            role="slider"
            aria-label="แถบเลื่อนเปรียบเทียบก่อนและหลังติดตั้ง"
            aria-valuenow={Math.round(sliderPos)}
            aria-valuemin={0}
            aria-valuemax={100}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleKeyDown}
            className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl border border-white/10 bg-[#111827] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSet.id || activeSetIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 w-full h-full"
              >
                {/* 1. BEFORE Image (Underneath, full container) */}
                <img
                  src={activeSet.beforeImage}
                  alt={`${activeSet.title || 'สถานที่ก่อนติดตั้ง'}`}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                  loading="lazy"
                />

                {/* 2. AFTER Image (Clipped overlay) */}
                {/* Right side is AFTER (LED Mockup), clipped from sliderPos to 100% */}
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none select-none"
                  style={{
                    clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`,
                  }}
                >
                  <img
                    src={activeSet.afterImage}
                    alt={`${activeSet.title || 'ภาพจำลอง LED หลังติดตั้ง'}`}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Labels: "ก่อน (Before)" on left, "หลัง (After)" on right */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-semibold text-white shadow-lg">
                <ImageIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span>ก่อน (สถานที่เดิม)</span>
              </div>
            </div>

            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-semibold text-white shadow-lg"
                style={{
                  borderLeftColor: 'var(--accent-color)',
                  borderLeftWidth: '3px',
                }}
              >
                <Sparkles
                  className="w-3.5 h-3.5"
                  style={{ color: 'var(--accent-color)' }}
                />
                <span>หลัง (ติดตั้ง LED)</span>
              </div>
            </div>

            {/* Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Vertical line */}
              <div className="absolute top-0 bottom-0 -left-px w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)]" />

              {/* Circular draggable handle */}
              <div
                className={`absolute top-1/2 -left-5 sm:-left-6 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#0B1120] shadow-[0_4px_24px_rgba(0,0,0,0.5)] border-2 flex items-center justify-center transition-transform duration-150 ${
                  isDragging ? 'scale-115' : 'group-hover:scale-105'
                }`}
                style={{
                  borderColor: 'var(--accent-color)',
                }}
              >
                <ChevronsLeftRight className="w-5 h-5 text-gray-900" />
              </div>
            </div>

            {/* Subtle help overlay at bottom center */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-[#94A3B8]">
                ลากเพื่อเปรียบเทียบมุมมอง
              </div>
            </div>
          </div>

          {/* Quick preset control buttons */}
          <div className="flex items-center justify-between mt-4 px-2 text-xs text-[#94A3B8]">
            <button
              type="button"
              onClick={() => setSliderPos(100)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              ← ดูภาพก่อนติดตั้งทั้งหมด
            </button>
            <button
              type="button"
              onClick={() => setSliderPos(50)}
              className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              กึ่งกลาง (50:50)
            </button>
            <button
              type="button"
              onClick={() => setSliderPos(0)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              ดูภาพจำลอง LED ทั้งหมด →
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
