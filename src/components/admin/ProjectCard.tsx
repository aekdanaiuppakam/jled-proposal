import { useState, useRef, useEffect, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  Edit3,
  Copy,
  Check,
  MoreVertical,
  Archive,
  Trash2,
  Calendar,
  Building2,
  Tv,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProjectSummary } from '../../types';
import { formatDateShort, getProjectUrl, copyToClipboard } from '../../lib/utils';

export interface ProjectCardProps {
  project: ProjectSummary;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

export function ProjectCard({ project, onDuplicate, onDelete, onArchive }: ProjectCardProps) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Card click navigates to editor
  const handleCardClick = () => {
    navigate(`/admin/edit/${project.id}`);
  };

  const handleCopyLink = async (e: MouseEvent) => {
    e.stopPropagation();
    try {
      await copyToClipboard(getProjectUrl(project.slug));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard fails
    }
  };

  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/admin/edit/${project.id}`);
  };

  const handlePreview = (e: MouseEvent) => {
    e.stopPropagation();
    const query = project.status === 'draft' ? '?preview=true' : '';
    window.open(`/p/${project.slug}${query}`, '_blank', 'noopener,noreferrer');
  };

  const handleToggleMenu = (e: MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleDuplicate = (e: MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDuplicate(project.id);
  };

  const handleArchive = (e: MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onArchive(project.id);
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete(project.id);
  };

  // Status configuration
  const statusConfig = {
    published: {
      label: 'เผยแพร่แล้ว',
      className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      dotColor: 'bg-emerald-400',
    },
    draft: {
      label: 'แบบร่าง',
      className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      dotColor: 'bg-amber-400',
    },
    archived: {
      label: 'จัดเก็บแล้ว',
      className: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
      dotColor: 'bg-slate-400',
    },
  }[project.status] || {
    label: project.status,
    className: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    dotColor: 'bg-slate-400',
  };

  const accentColor = project.accentColor || '#10B981';

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-[#1E293B] rounded-xl border border-[#334155] hover:border-[#475569] overflow-hidden flex flex-col shadow-lg hover:shadow-2xl cursor-pointer transition-all"
    >
      {/* Accent color indicator strip at the top */}
      <div
        className="h-1.5 w-full transition-all group-hover:h-2"
        style={{
          backgroundColor: accentColor,
          boxShadow: `0 0 12px ${accentColor}80`,
        }}
      />

      {/* Cover Image Area */}
      <div className="relative h-44 sm:h-48 w-full bg-[#111827] overflow-hidden">
        {project.coverImage && !imgError ? (
          <img
            src={project.coverImage}
            alt={project.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${accentColor}25 0%, #111827 75%)`,
            }}
          >
            <Tv className="w-10 h-10 text-[#64748B] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs text-[#94A3B8]">JLED Interactive Proposal</span>
          </div>
        )}

        {/* Gradient Overlay for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-[#1E293B]/40 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border backdrop-blur-md shadow-sm ${statusConfig.className}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor} ${project.status === 'published' ? 'animate-pulse' : ''}`} />
            {statusConfig.label}
          </div>

          {/* Accent Color Dot indicator */}
          <div
            className="w-5 h-5 rounded-full border-2 border-white/40 shadow-md"
            style={{ backgroundColor: accentColor }}
            title={`สีแบรนด์: ${accentColor}`}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-semibold text-white text-base sm:text-lg line-clamp-1 group-hover:text-[var(--accent-color-light)] transition-colors">
            {project.name || 'ไม่มีชื่อโปรเจกต์'}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#94A3B8]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="truncate max-w-[150px]">{project.clientName || 'ไม่ได้ระบุลูกค้า'}</span>
            </span>
            <span className="flex items-center gap-1 text-[#64748B]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDateShort(project.updatedAt)}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="pt-3 border-t border-[#334155]/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {/* Edit Button */}
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-color)]/10 text-[var(--accent-color-light)] hover:bg-[var(--accent-color)] hover:text-white border border-[var(--accent-color)]/20 transition-all active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>แก้ไข</span>
            </button>

            {/* Preview Button */}
            <button
              type="button"
              onClick={handlePreview}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white bg-[#0B1120]/60 hover:bg-[#334155] border border-[#334155] transition-colors"
              title="เปิดดูพรีเซนเทชัน (แท็บใหม่)"
              aria-label="ดูตัวอย่าง"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className={`p-1.5 rounded-lg border transition-all ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'text-[#94A3B8] hover:text-white bg-[#0B1120]/60 hover:bg-[#334155] border-[#334155]'
              }`}
              title={copied ? 'คัดลอกลิงก์แล้ว!' : 'คัดลอกลิงก์พรีเซนเทชัน'}
              aria-label="คัดลอกลิงก์"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* More Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={handleToggleMenu}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#334155] transition-colors"
              aria-label="เมนูเพิ่มเติม"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 bottom-full mb-1.5 w-44 bg-[#1E293B] rounded-xl border border-[#334155] shadow-2xl py-1.5 z-30 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={handleDuplicate}
                    className="w-full px-3 py-2 text-left text-xs text-[#CBD5E1] hover:text-white hover:bg-[#334155] flex items-center gap-2 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-400" />
                    <span>ทำสำเนาโปรเจกต์</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleArchive}
                    className="w-full px-3 py-2 text-left text-xs text-[#CBD5E1] hover:text-white hover:bg-[#334155] flex items-center gap-2 transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5 text-amber-400" />
                    <span>{project.status === 'archived' ? 'ยกเลิกการจัดเก็บ' : 'จัดเก็บโปรเจกต์'}</span>
                  </button>

                  <div className="my-1 border-t border-[#334155]" />

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ลบโปรเจกต์</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProjectCard;
