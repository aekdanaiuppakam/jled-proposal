import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface ImageModalProps {
  imageUrl: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ imageUrl, alt, isOpen, onClose }: ImageModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt || 'ขยายรูปภาพ'}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 select-none"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out"
          />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดรูปภาพขยาย"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Image Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-full max-h-full flex items-center justify-center z-[1]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl}
              alt={alt}
              className="max-w-[95vw] max-h-[88vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
            {alt && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-xs sm:text-sm text-[#94A3B8] border border-white/10 pointer-events-none text-center max-w-[85%] truncate">
                {alt}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
