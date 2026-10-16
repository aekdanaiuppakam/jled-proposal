import { useState, useEffect } from 'react';

export interface PresentationNavProps {
  clientName: string;
  clientLogo?: string;
  projectId?: string;
}

export function PresentationNav({ clientName, clientLogo, projectId }: PresentationNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initialize on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-[#0B1120]/80 backdrop-blur-md border-b border-white/10 shadow-xl py-3.5 px-4 sm:px-8'
          : 'bg-gradient-to-b from-[#0B1120]/90 via-[#0B1120]/50 to-transparent py-5 px-4 sm:px-8'
      }`}
    >
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Left: JLED Brand */}
        <a href="/admin" className="flex items-center gap-2.5 group cursor-pointer" title="ไปยังระบบจัดการ JLED">
          <div className="flex items-center font-extrabold tracking-wider text-white text-lg sm:text-xl">
            <span>J</span>
            <span style={{ color: 'var(--accent-color)' }}>LED</span>
          </div>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/30" />
          <span className="text-[11px] sm:text-xs font-medium uppercase tracking-widest text-[#94A3B8] group-hover:text-white transition-colors">
            Interactive Proposal
          </span>
        </a>

        {/* Right: Client info & edit shortcut */}
        <div className="flex items-center gap-3">
          {clientLogo ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-xs text-[#94A3B8]">สำหรับ</span>
              <img
                src={clientLogo}
                alt={clientName}
                className="h-6 sm:h-8 max-w-[120px] sm:max-w-[160px] object-contain filter brightness-110"
              />
            </div>
          ) : clientName ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-color)' }} />
              <span className="text-xs sm:text-sm font-medium text-white truncate max-w-[180px] sm:max-w-[260px]">
                {clientName}
              </span>
            </div>
          ) : null}

          {projectId && (
            <a
              href={`/admin/edit/${projectId}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-[#94A3B8] hover:text-white transition-all"
              title="แก้ไขโปรเจกต์นี้"
            >
              <span>แก้ไขข้อเสนอ</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
