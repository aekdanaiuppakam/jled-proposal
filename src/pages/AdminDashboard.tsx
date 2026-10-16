import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  X,
  FolderOpen,
  CheckCircle2,
  FileEdit,
  Archive,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectSummaries, useProjectActions } from '../hooks/useProjects';
import { ProjectCard } from '../components/admin/ProjectCard';
import type { ProjectStatus } from '../types';

type FilterTab = 'all' | ProjectStatus;

export function AdminDashboard() {
  const navigate = useNavigate();
  const summaries = useProjectSummaries();
  const { duplicateProject, archiveProject, unpublishProject, deleteProject } = useProjectActions();

  // State
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: summaries.length,
      published: summaries.filter((p) => p.status === 'published').length,
      draft: summaries.filter((p) => p.status === 'draft').length,
      archived: summaries.filter((p) => p.status === 'archived').length,
    };
  }, [summaries]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return summaries.filter((project) => {
      // Tab filter
      if (activeTab !== 'all' && project.status !== activeTab) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = project.name.toLowerCase().includes(query);
        const matchesClient = (project.clientName || '').toLowerCase().includes(query);
        const matchesSlug = project.slug.toLowerCase().includes(query);
        if (!matchesName && !matchesClient && !matchesSlug) {
          return false;
        }
      }
      return true;
    });
  }, [summaries, activeTab, searchQuery]);

  // Actions
  const handleDuplicate = (id: string) => {
    const copy = duplicateProject(id);
    if (copy) {
      showToast(`ทำสำเนา "${copy.name}" สำเร็จแล้ว`);
    }
  };

  const handleArchive = (id: string) => {
    const target = summaries.find((p) => p.id === id);
    if (target?.status === 'archived') {
      unpublishProject(id); // unarchive back to draft
      showToast(`กู้คืนโปรเจกต์ "${target.name}" กลับเป็นแบบร่างแล้ว`);
    } else {
      archiveProject(id);
      showToast(`จัดเก็บโปรเจกต์ "${target?.name || ''}" แล้ว`);
    }
  };

  const handlePromptDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      const target = summaries.find((p) => p.id === deleteTargetId);
      deleteProject(deleteTargetId);
      showToast(`ลบโปรเจกต์ "${target?.name || ''}" เรียบร้อยแล้ว`);
      setDeleteTargetId(null);
    }
  };

  const deleteTargetProject = useMemo(() => {
    return summaries.find((p) => p.id === deleteTargetId);
  }, [summaries, deleteTargetId]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1E293B] border border-[var(--accent-color)] text-white shadow-2xl backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[var(--accent-color)] flex-shrink-0" />
            <span className="text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              โปรเจกต์ทั้งหมด
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1E293B] text-[var(--accent-color-light)] border border-[#334155]">
              {summaries.length} โปรเจกต์
            </span>
          </div>
          <p className="mt-1 text-sm text-[#94A3B8]">
            จัดการข้อเสนอการติดตั้งจอ LED นำเสนอภาพจำลอง 3D และเอกสารพรีเซนเทชัน
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/admin/create')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-[var(--accent-color)] text-white hover:opacity-90 transition-all shadow-lg shadow-[var(--accent-color-muted)] hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>สร้างโปรเจกต์ใหม่</span>
        </button>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'all'
              ? 'bg-[#1E293B] border-[var(--accent-color)] shadow-md shadow-[var(--accent-color-muted)]'
              : 'bg-[#1E293B]/60 border-[#334155] hover:border-[#475569]'
          }`}
        >
          <div className="flex items-center justify-between text-[#94A3B8] mb-2">
            <span className="text-xs font-medium">โปรเจกต์ทั้งหมด</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{counts.all}</div>
        </div>

        <div
          onClick={() => setActiveTab('published')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'published'
              ? 'bg-[#1E293B] border-emerald-500 shadow-md shadow-emerald-500/20'
              : 'bg-[#1E293B]/60 border-[#334155] hover:border-[#475569]'
          }`}
        >
          <div className="flex items-center justify-between text-[#94A3B8] mb-2">
            <span className="text-xs font-medium">เผยแพร่แล้ว</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{counts.published}</div>
        </div>

        <div
          onClick={() => setActiveTab('draft')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'draft'
              ? 'bg-[#1E293B] border-amber-500 shadow-md shadow-amber-500/20'
              : 'bg-[#1E293B]/60 border-[#334155] hover:border-[#475569]'
          }`}
        >
          <div className="flex items-center justify-between text-[#94A3B8] mb-2">
            <span className="text-xs font-medium">แบบร่าง</span>
            <FileEdit className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{counts.draft}</div>
        </div>

        <div
          onClick={() => setActiveTab('archived')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'archived'
              ? 'bg-[#1E293B] border-slate-400 shadow-md shadow-slate-500/20'
              : 'bg-[#1E293B]/60 border-[#334155] hover:border-[#475569]'
          }`}
        >
          <div className="flex items-center justify-between text-[#94A3B8] mb-2">
            <span className="text-xs font-medium">จัดเก็บแล้ว</span>
            <Archive className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-300">{counts.archived}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111827] rounded-xl border border-[#334155] overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-[var(--accent-color)] text-white shadow'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <span>ทั้งหมด</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/25">
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('published')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'published'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <span>เผยแพร่แล้ว</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/25">
              {counts.published}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('draft')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'draft'
                ? 'bg-amber-600 text-white shadow'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <span>แบบร่าง</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/25">
              {counts.draft}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('archived')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'archived'
                ? 'bg-slate-600 text-white shadow'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <span>จัดเก็บแล้ว</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/25">
              {counts.archived}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อโปรเจกต์ หรือลูกค้า..."
            className="w-full pl-10 pr-9 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-xs sm:text-sm text-white placeholder-[#64748B] focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] outline-none transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-white rounded-md"
              aria-label="ล้างการค้นหา"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDuplicate={handleDuplicate}
              onArchive={handleArchive}
              onDelete={handlePromptDelete}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-4 text-center rounded-2xl bg-[#1E293B]/40 border border-[#334155] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#64748B] mb-4">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {searchQuery
              ? `ไม่พบโปรเจกต์ที่ตรงกับ "${searchQuery}"`
              : activeTab !== 'all'
              ? `ไม่มีโปรเจกต์ในหมวด "${activeTab}"`
              : 'ยังไม่มีโปรเจกต์ในระบบ'}
          </h3>
          <p className="text-sm text-[#94A3B8] max-w-md mb-6">
            {searchQuery
              ? 'ลองค้นหาด้วยคำอื่น หรือกดล้างการค้นหาเพื่อดูโปรเจกต์ทั้งหมด'
              : 'เริ่มต้นสร้างข้อเสนอการติดตั้งจอ LED ชิ้นแรกของคุณเพื่อนำเสนอลูกค้าแบบอินเทอร์แอคทีฟ'}
          </p>

          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-[#1E293B] text-white border border-[#334155] hover:bg-[#273548] transition-colors"
            >
              ล้างคำค้นหา
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/admin/create')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[var(--accent-color)] text-white hover:opacity-90 transition-all shadow-lg shadow-[var(--accent-color-muted)]"
            >
              <Plus className="w-4 h-4" />
              <span>สร้างโปรเจกต์ใหม่ตอนนี้</span>
            </button>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTargetId && deleteTargetProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTargetId(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">ยืนยันการลบโปรเจกต์</h3>
                  <p className="mt-1 text-sm text-[#94A3B8]">
                    คุณแน่ใจหรือไม่ว่าต้องการลบโปรเจกต์{' '}
                    <span className="text-white font-medium">"{deleteTargetProject.name}"</span>?
                    การกระทำนี้จะลบข้อมูลทั้งหมดและไม่สามารถเรียกคืนได้
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#334155] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[#94A3B8] hover:text-white bg-transparent hover:bg-[#334155] transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30 transition-all"
                >
                  ยืนยันการลบ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;
