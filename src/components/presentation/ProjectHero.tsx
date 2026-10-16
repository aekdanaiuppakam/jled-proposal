import { motion } from 'framer-motion';
import { ChevronDown, MapPin, Monitor } from 'lucide-react';
import type { Project } from '../../types';

export interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const heroImage = project.branding.heroImage || project.coverImage;
  const headline = project.branding.heroHeadline || project.name;
  const subheadline = project.branding.heroSubheadline || project.description;
  const clientLogo = project.branding.clientLogo;
  const clientName = project.clientName;

  const handleScrollToNext = () => {
    // Find the next section after hero or scroll down one viewport
    const sections = document.querySelectorAll('section');
    if (sections.length > 1) {
      sections[1].scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight - 40,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#0B1120]">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        {heroImage && (
          <motion.img
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            src={heroImage}
            alt={headline}
            className="w-full h-full object-cover object-center"
          />
        )}

        {/* Cinematic dark navy overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/75 to-[#0B1120]/40" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0B1120]/30 to-[#0B1120]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-24 md:py-32 flex flex-col items-center text-center">
        {/* Client badge or logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 flex flex-col items-center gap-3"
        >
          {clientLogo ? (
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl max-w-[200px]">
              <img
                src={clientLogo}
                alt={clientName || 'Client Logo'}
                className="max-h-12 w-auto object-contain filter brightness-110"
              />
            </div>
          ) : null}

          {clientName && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs sm:text-sm font-medium text-white shadow-lg">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--accent-color)' }}
              />
              <span>ข้อเสนอการติดตั้งสำหรับ</span>
              <span className="font-semibold text-white">{clientName}</span>
            </div>
          )}
        </motion.div>

        {/* Project Title / Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12] mb-6 max-w-4xl"
        >
          {headline}
        </motion.h1>

        {/* Hero Subheadline */}
        {subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg md:text-xl text-[#94A3B8] max-w-2xl leading-relaxed mb-8"
          >
            {subheadline}
          </motion.p>
        )}

        {/* Metadata pills (Location & Installation Type) */}
        {(project.location || project.installationType) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 text-xs sm:text-sm text-[#94A3B8]"
          >
            {project.installationType && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1E293B]/70 border border-white/10 backdrop-blur-sm">
                <Monitor className="w-4 h-4 text-white/70" />
                <span>{project.installationType}</span>
              </div>
            )}
            {project.location && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1E293B]/70 border border-white/10 backdrop-blur-sm">
                <MapPin className="w-4 h-4 text-white/70" />
                <span>{project.location}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Explore Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <button
            type="button"
            onClick={handleScrollToNext}
            className="group relative inline-flex items-center gap-3 px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl text-white font-semibold text-base sm:text-lg shadow-xl cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B1120]"
            style={{
              backgroundColor: 'var(--accent-color)',
            }}
          >
            <span>สำรวจโปรเจกต์</span>
            <ChevronDown className="w-5 h-5 transition-transform duration-200 group-hover:translate-y-1" />
          </button>
        </motion.div>
      </div>

      {/* Subtle bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10 text-[#94A3B8] hover:text-white transition-colors"
        onClick={handleScrollToNext}
      >
        <span className="text-[11px] uppercase tracking-widest font-medium">เลื่อนลงเพื่อดูเพิ่มเติม</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
