import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Eye } from 'lucide-react';
import type { InstallationView } from '../../types';
import { SectionWrapper } from './SectionWrapper';
import { ImageModal } from './ImageModal';

export interface PerspectiveGalleryProps {
  views: InstallationView[];
  title?: string;
  description?: string;
}

export function PerspectiveGallery({
  views = [],
  title,
  description,
}: PerspectiveGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const currentView = views[selectedIndex] || views[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : views.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < views.length - 1 ? prev + 1 : 0));
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[selectedIndex] as HTMLElement | undefined;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex]);

  if (!views || views.length === 0) {
    return null;
  }

  return (
    <SectionWrapper
      id="perspectives"
      title={title || 'มุมมองการติดตั้ง'}
      description={description || 'ชมภาพจำลองการติดตั้งจอ LED จากหลากหลายมุมมอง เพื่อเห็นภาพรวมที่สมบูรณ์'}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        {/* Main Display Area */}
        <div
          className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#111827] select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Animated Image with Crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView.id || selectedIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={currentView.imageUrl}
                alt={currentView.viewName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>

          {/* Bottom Gradient Overlay for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/75 to-transparent pointer-events-none" />

          {/* Top action buttons (Fullscreen) */}
          <div className="absolute top-4 right-4 z-10">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              aria-label="ดูภาพขนาดเต็ม"
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/15 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Navigation Arrows */}
          {views.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="มุมมองก่อนหน้า"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 shadow-lg transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer opacity-80 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="มุมมองถัดไป"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 shadow-lg transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer opacity-80 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* View Information Overlay (Bottom Left) */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pointer-events-none">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-white mb-2">
                <Eye className="w-3.5 h-3.5" style={{ color: 'var(--accent-color)' }} />
                <span>มุมมองที่ {selectedIndex + 1} / {views.length}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md">
                {currentView.viewName}
              </h3>
              {currentView.description && (
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 line-clamp-2 drop-shadow">
                  {currentView.description}
                </p>
              )}
            </div>

            {/* Click to expand hint on desktop */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/10 text-xs text-[#94A3B8] hover:text-white transition-colors cursor-pointer pointer-events-auto"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>คลิกเพื่อขยายเต็มจอ</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Strip at bottom */}
        {views.length > 1 && (
          <div
            ref={thumbnailsRef}
            className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 px-1 no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none' }}
          >
            {views.map((view, idx) => {
              const isActive = selectedIndex === idx;
              return (
                <button
                  key={view.id || idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`group relative flex-shrink-0 w-24 sm:w-28 aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 focus:outline-none ${
                    isActive
                      ? 'ring-2 shadow-lg scale-105'
                      : 'opacity-60 hover:opacity-100 hover:scale-100'
                  }`}
                  style={
                    isActive
                      ? {
                          boxShadow: '0 0 15px var(--accent-color-muted)',
                        }
                      : undefined
                  }
                >
                  <img
                    src={view.imageUrl}
                    alt={view.viewName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Active highlight border */}
                  <div
                    className={`absolute inset-0 rounded-xl transition-all ${
                      isActive
                        ? 'border-2 border-[var(--accent-color)] bg-transparent'
                        : 'border border-white/10 group-hover:border-white/30'
                    }`}
                  />
                  {/* Thumbnail label */}
                  <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-[10px] text-white font-medium truncate text-center">
                      {view.viewName}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={currentView.imageUrl}
        alt={currentView.viewName}
      />
    </SectionWrapper>
  );
}
