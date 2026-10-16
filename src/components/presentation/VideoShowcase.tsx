import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Film } from 'lucide-react';
import type { ProjectVideo } from '../../types';
import { SectionWrapper } from './SectionWrapper';

export interface VideoShowcaseProps {
  videos: ProjectVideo[];
  title?: string;
  description?: string;
}

export function VideoShowcase({
  videos = [],
  title,
  description,
}: VideoShowcaseProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeVideo = videos[activeVideoIndex] || videos[0];

  const handleSelectVideo = (idx: number) => {
    setActiveVideoIndex(idx);
    setIsPlaying(false);
  };

  const handleStartPlay = () => {
    setIsPlaying(true);
    // Use timeout to ensure the video element is mounted before calling play
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          // Fallback if browser blocks unmuted playback
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
          }
        });
      }
    }, 50);
  };

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <SectionWrapper
      id="video-showcase"
      title={title || 'ตัวอย่างวิดีโอบนจอ LED'}
      description={description || 'สัมผัสประสบการณ์เนื้อหาเคลื่อนไหวและภาพจำลองการแสดงผลบนจอ LED เสมือนจริง'}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
        {/* Main Video Display Player */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#111827] border border-white/10 shadow-2xl">
          <AnimatePresence mode="wait">
            {!isPlaying ? (
              /* Video Poster with Custom Play Button Overlay */
              <motion.div
                key={`poster-${activeVideo.id || activeVideoIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="group relative w-full h-full cursor-pointer"
                onClick={handleStartPlay}
              >
                {/* Poster Image (Absolute background) */}
                {activeVideo.thumbnailUrl ? (
                  <img
                    src={activeVideo.thumbnailUrl}
                    alt={activeVideo.title}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-[#111827] flex items-center justify-center">
                    <Film className="w-16 h-16 text-white/20" />
                  </div>
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-black/40 to-black/20 group-hover:via-black/30 transition-all duration-300" />

                {/* Perfectly Centered Play Button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 pointer-events-none">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-transform duration-300 group-hover:scale-110 active:scale-95"
                    style={{
                      backgroundColor: 'var(--accent-color)',
                      boxShadow: '0 0 30px var(--accent-color-muted)',
                    }}
                  >
                    <Play className="w-7 h-7 sm:w-9 sm:h-9 translate-x-0.5 fill-current" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide text-white drop-shadow-md">
                    กดเพื่อรับชมวิดีโอ
                  </span>
                </div>

                {/* Bottom Video Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10 pointer-events-none">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow">
                    {activeVideo.title}
                  </h3>
                </div>
              </motion.div>
            ) : (
              /* Active HTML5 Video Player */
              <motion.div
                key={`video-${activeVideo.id || activeVideoIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <video
                  ref={videoRef}
                  src={activeVideo.videoUrl}
                  poster={activeVideo.thumbnailUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain bg-black"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Video selector cards if multiple videos */}
        {videos.length > 1 && (
          <div className="w-full">
            <h4 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider mb-4">
              วิดีโอทั้งหมด ({videos.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((vid, idx) => {
                const isActive = activeVideoIndex === idx;
                return (
                  <button
                    key={vid.id || idx}
                    type="button"
                    onClick={() => handleSelectVideo(idx)}
                    className={`group relative flex flex-col text-left rounded-xl overflow-hidden bg-[#1E293B]/60 backdrop-blur-sm border transition-all duration-200 cursor-pointer p-2.5 focus:outline-none ${
                      isActive
                        ? 'border-2 ring-1 shadow-lg'
                        : 'border-white/10 hover:border-white/25 hover:bg-[#1E293B]'
                    }`}
                    style={
                      isActive
                        ? {
                            borderColor: 'var(--accent-color)',
                            boxShadow: '0 0 16px var(--accent-color-muted)',
                          }
                        : undefined
                    }
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/40 mb-2.5">
                      {vid.thumbnailUrl ? (
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-8 h-8 text-white/30" />
                        </div>
                      )}
                      {/* Play badge */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-110"
                          style={{
                            backgroundColor: isActive ? 'var(--accent-color)' : 'rgba(0,0,0,0.6)',
                          }}
                        >
                          <Play className="w-4 h-4 translate-x-0.5 fill-current" />
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h5
                      className={`text-sm font-semibold truncate transition-colors ${
                        isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-white'
                      }`}
                    >
                      {vid.title}
                    </h5>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
