import { useState, useMemo, type ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  FileText,
  Palette,
  SlidersHorizontal,
  Layers,
  Video,
  Cpu,
  LayoutTemplate,
  Monitor,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Globe,
  Sun,
  Moon,
  Smartphone,
  Tablet,
  Laptop,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProject, useProjectActions } from '../hooks/useProjects';
import type {
  Project,
  EditorTab,
  BeforeAfterSet,
  InstallationView,
  ProjectVideo,
  TechnicalSpecification,
  ProjectSection,
  PresentationTheme,
  ProjectStatus,
} from '../types';
import { generateId, slugify, getProjectUrl, copyToClipboard } from '../lib/utils';

// Preset color options for quick branding
const COLOR_PRESETS = [
  { name: 'JLED Emerald', hex: '#10B981' },
  { name: 'Cyber Cyan', hex: '#06B6D4' },
  { name: 'Royal Blue', hex: '#3B82F6' },
  { name: 'Electric Indigo', hex: '#6366F1' },
  { name: 'Tech Purple', hex: '#8B5CF6' },
  { name: 'Vibrant Amber', hex: '#F59E0B' },
  { name: 'Neon Orange', hex: '#F97316' },
  { name: 'Crimson Red', hex: '#EF4444' },
];

export function ProjectEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectFromStore = useProject(id || '');

  if (!projectFromStore) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-2 border-[#334155] border-t-[var(--accent-color)] rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">ไม่พบโปรเจกต์นี้ในระบบ</h2>
        <p className="text-sm text-[#94A3B8] mb-6">โปรเจกต์อาจถูกลบไปแล้วหรือรหัสไม่ถูกต้อง</p>
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#1E293B] hover:bg-[#273548] text-white border border-[#334155]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปยังแดชบอร์ด</span>
        </button>
      </div>
    );
  }

  return <ProjectEditorForm key={projectFromStore.id} projectFromStore={projectFromStore} />;
}

function ProjectEditorForm({ projectFromStore }: { projectFromStore: Project }) {
  const navigate = useNavigate();
  const { updateProject } = useProjectActions();

  // Local editable draft state initialized directly from store
  const [formData, setFormData] = useState<Project>(() =>
    JSON.parse(JSON.stringify(projectFromStore))
  );
  const [activeTab, setActiveTab] = useState<EditorTab>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedLink, setCopiedLink] = useState(false);

  // Compute unsaved changes flag
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(projectFromStore);
  }, [formData, projectFromStore]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 3000);
  };

  // Save handler
  const handleSave = () => {
    setIsSaving(true);
    updateProject(formData.id, formData);
    setTimeout(() => {
      setIsSaving(false);
      showToast('บันทึกข้อมูลเรียบร้อยแล้ว');
    }, 200);
  };

  // Copy link handler
  const handleCopyLink = async () => {
    try {
      await copyToClipboard(getProjectUrl(formData.slug));
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      showToast('คัดลอกลิงก์เรียบร้อยแล้ว');
    } catch {
      // Fallback
    }
  };

  const accentColor = formData.branding.primaryColor || '#10B981';

  // Helper update root fields
  const updateField = <K extends keyof Project>(key: K, value: Project[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Helper update branding fields
  const updateBranding = <K extends keyof Project['branding']>(
    key: K,
    value: Project['branding'][K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      branding: { ...prev.branding, [key]: value },
    }));
  };

  const tabs: { id: EditorTab; label: string; icon: typeof FileText }[] = [
    { id: 'general', label: 'ข้อมูลทั่วไป', icon: FileText },
    { id: 'branding', label: 'ธีม & สีแบรนด์', icon: Palette },
    { id: 'before-after', label: 'ก่อน & หลัง', icon: SlidersHorizontal },
    { id: 'perspectives', label: 'มุมมองติดตั้ง', icon: Layers },
    { id: 'videos', label: 'วิดีโอ', icon: Video },
    { id: 'specifications', label: 'สเปกจอ LED', icon: Cpu },
    { id: 'sections', label: 'ลำดับเซกชัน', icon: LayoutTemplate },
    { id: 'preview', label: 'ดูตัวอย่าง & แชร์', icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1E293B] border border-[var(--accent-color)] text-white shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-color)] flex-shrink-0" />
            <span className="text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Top Command Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#334155]/60">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-white bg-[#1E293B] hover:bg-[#273548] border border-[#334155] transition-colors"
            title="กลับไปยังแดชบอร์ด"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate max-w-md">
                {formData.name || 'ไม่มีชื่อโปรเจกต์'}
              </h1>
              {hasUnsavedChanges ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  ยังไม่บันทึก
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Check className="w-3 h-3 text-emerald-400" />
                  บันทึกล่าสุดแล้ว
                </span>
              )}
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              ลูกค้า: {formData.clientName || 'ไม่ได้ระบุ'} &bull; Slug: /p/{formData.slug}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Status selector */}
          <select
            value={formData.status}
            onChange={(e) => updateField('status', e.target.value as ProjectStatus)}
            className="px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-xs sm:text-sm text-white focus:border-[var(--accent-color)] outline-none cursor-pointer"
          >
            <option value="draft">🟡 แบบร่าง (Draft)</option>
            <option value="published">🟢 เผยแพร่แล้ว (Published)</option>
            <option value="archived">⚪ จัดเก็บ (Archived)</option>
          </select>

          {/* Quick Preview button */}
          <button
            type="button"
            onClick={() =>
              window.open(
                `/p/${formData.slug}${formData.status === 'draft' ? '?preview=true' : ''}`,
                '_blank',
                'noopener,noreferrer'
              )
            }
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#94A3B8] hover:text-white bg-[#1E293B] hover:bg-[#273548] border border-[#334155] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">ดูหน้าพรีเซนต์</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--accent-color)] text-white hover:opacity-90 transition-all shadow-lg shadow-[var(--accent-color-muted)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#111827] rounded-xl border border-[#334155] overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[var(--accent-color)] text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5 sm:p-7 shadow-xl">
        {/* TAB 1: GENERAL */}
        {activeTab === 'general' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">ข้อมูลทั่วไปของโปรเจกต์</h2>
              <p className="text-xs text-[#94A3B8]">
                กำหนดชื่อโปรเจกต์ ชื่อลูกค้า URL สำหรับเข้าชม และข้อมูลพื้นฐานของการติดตั้ง
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  ชื่อโปรเจกต์ <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const newName = e.target.value;
                    updateField('name', newName);
                  }}
                  placeholder="เช่น Royal-D LED Installation Proposal"
                  className="w-full px-4 py-2.5 bg-[#0B1120] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-[var(--accent-color)] outline-none text-sm transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  ชื่อลูกค้า / องค์กร
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => updateField('clientName', e.target.value)}
                  placeholder="เช่น Royal-D Beverage Co., Ltd."
                  className="w-full px-4 py-2.5 bg-[#0B1120] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-[var(--accent-color)] outline-none text-sm transition"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Slug (URL นำเสนอ) <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => updateField('slug', slugify(formData.name) || formData.id)}
                    className="text-[11px] text-[var(--accent-color-light)] hover:underline"
                  >
                    สร้างจากชื่อ
                  </button>
                </div>
                <div className="flex items-center bg-[#0B1120] border border-[#334155] rounded-xl overflow-hidden focus-within:border-[var(--accent-color)]">
                  <span className="px-3 text-xs text-[#64748B] select-none">/p/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => updateField('slug', slugify(e.target.value))}
                    placeholder="royal-d"
                    className="w-full py-2.5 pr-4 bg-transparent text-white outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">ภาษาที่แสดงผล</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#334155] bg-[#0B1120] text-xs text-white cursor-pointer flex-1">
                    <input
                      type="radio"
                      name="lang"
                      checked={formData.language === 'th'}
                      onChange={() => updateField('language', 'th')}
                      className="accent-[var(--accent-color)]"
                    />
                    <span>ภาษาไทย (TH)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#334155] bg-[#0B1120] text-xs text-white cursor-pointer flex-1">
                    <input
                      type="radio"
                      name="lang"
                      checked={formData.language === 'en'}
                      onChange={() => updateField('language', 'en')}
                      className="accent-[var(--accent-color)]"
                    />
                    <span>English (EN)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">สถานที่ติดตั้ง</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="เช่น กรุงเทพมหานคร, อาคารสำนักงานใหญ่"
                  className="w-full px-4 py-2.5 bg-[#0B1120] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-[var(--accent-color)] outline-none text-sm transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">ประเภทการติดตั้ง</label>
                <input
                  type="text"
                  value={formData.installationType || ''}
                  onChange={(e) => updateField('installationType', e.target.value)}
                  placeholder="เช่น Outdoor Curved LED Display, Indoor Fine Pitch P1.8"
                  className="w-full px-4 py-2.5 bg-[#0B1120] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-[var(--accent-color)] outline-none text-sm transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">คำอธิบายภาพรวมโปรเจกต์</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="ระบุวัตถุประสงค์ของการติดตั้ง จุดเด่น และประโยชน์ที่ลูกค้าจะได้รับ..."
                className="w-full px-4 py-2.5 bg-[#0B1120] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-[var(--accent-color)] outline-none text-sm transition resize-none"
              />
            </div>

            {/* Cover Image Input with Preview */}
            <div className="space-y-2 pt-2 border-t border-[#334155]/60">
              <label className="text-xs font-semibold text-slate-300">
                URL รูปหน้าปก (Cover Image)
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => updateField('coverImage', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-4 py-2.5 bg-[#0B1120] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-[var(--accent-color)] outline-none text-sm transition"
                />
              </div>

              {formData.coverImage && (
                <div className="mt-3 relative w-full h-44 rounded-xl overflow-hidden border border-[#334155] bg-[#0B1120]">
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <span className="text-xs text-white/90 font-medium">ตัวอย่างรูปภาพหน้าปก</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: BRANDING */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">การปรับแต่งแบรนด์ & สี (Branding)</h2>
              <p className="text-xs text-[#94A3B8]">
                ปรับแต่งโทนสีหลักและรอง ข้อความหัวเรื่อง และภาพฮีโร่เพื่อให้เข้ากับอัตลักษณ์ของลูกค้า
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls Column */}
              <div className="lg:col-span-7 space-y-6">
                {/* Accent Color Selection */}
                <div className="space-y-3 p-4 rounded-xl bg-[#0B1120] border border-[#334155]">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>สีหลักของโปรเจกต์ (Primary Accent Color)</span>
                    <span className="font-mono text-xs text-[var(--accent-color-light)]">
                      {accentColor}
                    </span>
                  </label>

                  {/* Preset Swatches */}
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => updateBranding('primaryColor', preset.hex)}
                        className={`h-8 rounded-lg flex items-center justify-center transition-all ${
                          accentColor.toLowerCase() === preset.hex.toLowerCase()
                            ? 'ring-2 ring-white scale-110 shadow-lg'
                            : 'hover:scale-105 opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: preset.hex }}
                        title={preset.name}
                      >
                        {accentColor.toLowerCase() === preset.hex.toLowerCase() && (
                          <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom Color Input */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => updateBranding('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={formData.branding.primaryColor}
                      onChange={(e) => updateBranding('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-white font-mono text-sm focus:border-[var(--accent-color)] outline-none"
                      placeholder="#10B981"
                    />
                  </div>
                </div>

                {/* Secondary Color & Theme */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 p-4 rounded-xl bg-[#0B1120] border border-[#334155]">
                    <label className="text-xs font-semibold text-slate-300">
                      สีรอง (Secondary Color - ตัวเลือก)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.branding.secondaryColor || '#3B82F6'}
                        onChange={(e) => updateBranding('secondaryColor', e.target.value)}
                        className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formData.branding.secondaryColor || ''}
                        onChange={(e) => updateBranding('secondaryColor', e.target.value)}
                        placeholder="#3B82F6"
                        className="flex-1 px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-white font-mono text-xs focus:border-[var(--accent-color)] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 p-4 rounded-xl bg-[#0B1120] border border-[#334155]">
                    <label className="text-xs font-semibold text-slate-300">
                      ธีมการนำเสนอ (Theme)
                    </label>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => updateBranding('theme', 'dark' as PresentationTheme)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                          formData.branding.theme === 'dark'
                            ? 'bg-[var(--accent-color)] text-white shadow'
                            : 'bg-[#1E293B] text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span>Dark Theme</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateBranding('theme', 'light' as PresentationTheme)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                          formData.branding.theme === 'light'
                            ? 'bg-slate-200 text-slate-900 shadow font-semibold'
                            : 'bg-[#1E293B] text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5" />
                        <span>Light Theme</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hero Headlines */}
                <div className="space-y-4 p-4 rounded-xl bg-[#0B1120] border border-[#334155]">
                  <h3 className="text-sm font-semibold text-white">เนื้อหา Hero Section</h3>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-300">Hero Headline (หัวเรื่องหลัก)</label>
                    <input
                      type="text"
                      value={formData.branding.heroHeadline}
                      onChange={(e) => updateBranding('heroHeadline', e.target.value)}
                      placeholder="เช่น LED Display Installation Proposal"
                      className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-white text-sm focus:border-[var(--accent-color)] outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-300">Hero Subheadline (คำอธิบายรอง)</label>
                    <textarea
                      rows={2}
                      value={formData.branding.heroSubheadline}
                      onChange={(e) => updateBranding('heroSubheadline', e.target.value)}
                      placeholder="คำอธิบายสั้นๆ..."
                      className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-white text-sm focus:border-[var(--accent-color)] outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-300">Hero Image URL</label>
                      <input
                        type="url"
                        value={formData.branding.heroImage}
                        onChange={(e) => updateBranding('heroImage', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-white text-xs focus:border-[var(--accent-color)] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-300">โลโก้ลูกค้า URL (Client Logo)</label>
                      <input
                        type="url"
                        value={formData.branding.clientLogo || ''}
                        onChange={(e) => updateBranding('clientLogo', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-white text-xs focus:border-[var(--accent-color)] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Closing Section */}
                <div className="space-y-4 p-4 rounded-xl bg-[#0B1120] border border-[#334155]">
                  <h3 className="text-sm font-semibold text-white">เนื้อหา Closing Section (ปิดท้าย)</h3>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-300">Closing Headline</label>
                    <input
                      type="text"
                      value={formData.branding.closingHeadline || ''}
                      onChange={(e) => updateBranding('closingHeadline', e.target.value)}
                      placeholder="เช่น จินตนาการอนาคตของพื้นที่คุณ"
                      className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-white text-sm focus:border-[var(--accent-color)] outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-300">Closing Description</label>
                    <textarea
                      rows={2}
                      value={formData.branding.closingDescription || ''}
                      onChange={(e) => updateBranding('closingDescription', e.target.value)}
                      placeholder="ข้อความกระตุ้นการตัดสินใจ..."
                      className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-white text-sm focus:border-[var(--accent-color)] outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-300">ข้อมูลติดต่อ (Contact Info)</label>
                    <input
                      type="text"
                      value={formData.branding.contactInfo || ''}
                      onChange={(e) => updateBranding('contactInfo', e.target.value)}
                      placeholder="ติดต่อ JLED: contact@jled.co.th | 02-XXX-XXXX"
                      className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-white text-sm focus:border-[var(--accent-color)] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Panel Column */}
              <div className="lg:col-span-5">
                <div className="sticky top-24 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                      ตัวอย่างการแสดงผลสีสด (Live Preview)
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#0B1120] border border-[#334155]">
                      {formData.branding.theme.toUpperCase()}
                    </span>
                  </div>

                  {/* Simulated Hero Card */}
                  <div
                    className={`rounded-2xl border p-5 shadow-2xl relative overflow-hidden transition-colors ${
                      formData.branding.theme === 'light'
                        ? 'bg-white text-slate-900 border-slate-200'
                        : 'bg-[#0B1120] text-white border-[#334155]'
                    }`}
                  >
                    {/* Simulated Background glow */}
                    <div
                      className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-30"
                      style={{ backgroundColor: accentColor }}
                    />

                    {/* Top Simulated Nav */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-md"
                          style={{ backgroundColor: accentColor, color: '#FFFFFF' }}
                        >
                          J
                        </div>
                        <span className="font-bold text-xs tracking-tight">JLED Proposal</span>
                      </div>

                      {formData.branding.clientLogo ? (
                        <img
                          src={formData.branding.clientLogo}
                          alt="Client Logo"
                          className="h-5 object-contain"
                        />
                      ) : (
                        <span className="text-[11px] font-semibold opacity-70">
                          {formData.clientName || 'CLIENT'}
                        </span>
                      )}
                    </div>

                    {/* Mock Hero Headline */}
                    <div className="space-y-2 py-2">
                      <div
                        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${accentColor}25`,
                          color: accentColor,
                          border: `1px solid ${accentColor}40`,
                        }}
                      >
                        LED DISPLAY PROPOSAL
                      </div>
                      <h4 className="text-base sm:text-lg font-extrabold leading-tight">
                        {formData.branding.heroHeadline || 'LED Display Installation Proposal'}
                      </h4>
                      <p className="text-xs opacity-75 line-clamp-3 leading-relaxed">
                        {formData.branding.heroSubheadline || 'ข้อเสนอการติดตั้งจอ LED แบบเสมือนจริง'}
                      </p>
                    </div>

                    {/* Mock Buttons */}
                    <div className="mt-4 flex items-center gap-2">
                      <div
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-md cursor-default text-center flex-1"
                        style={{ backgroundColor: accentColor }}
                      >
                        สำรวจภาพจำลอง 3D
                      </div>
                      {formData.branding.secondaryColor && (
                        <div
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white cursor-default text-center"
                          style={{ backgroundColor: formData.branding.secondaryColor }}
                        >
                          สเปก
                        </div>
                      )}
                    </div>

                    {/* Bottom closing snippet */}
                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] opacity-60">
                      <span>{formData.branding.contactInfo || 'JLED Presentation'}</span>
                      <span style={{ color: accentColor }}>&bull; Interactive</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BEFORE / AFTER */}
        {activeTab === 'before-after' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">
                  ชุดภาพ ก่อน & หลังการติดตั้ง (Before / After)
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  เพิ่มคู่ภาพพื้นที่เดิมเปรียบเทียบกับภาพเรนเดอร์ที่มีการติดตั้งจอ LED
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newSet: BeforeAfterSet = {
                    id: generateId(),
                    title: `มุมมองใหม่ #${formData.beforeAfterSets.length + 1}`,
                    beforeImage: '',
                    afterImage: '',
                    sortOrder: formData.beforeAfterSets.length,
                  };
                  updateField('beforeAfterSets', [...formData.beforeAfterSets, newSet]);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--accent-color)] text-white hover:opacity-90 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มชุดภาพ ก่อน-หลัง</span>
              </button>
            </div>

            {formData.beforeAfterSets.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-[#334155] rounded-xl">
                <SlidersHorizontal className="w-10 h-10 text-[#64748B] mx-auto mb-2" />
                <p className="text-sm text-slate-300">ยังไม่มีชุดภาพ Before/After</p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  กดปุ่ม "เพิ่มชุดภาพ ก่อน-หลัง" ด้านบนเพื่อเริ่มสร้าง
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.beforeAfterSets.map((item, index) => {
                  const moveUp = () => {
                    if (index === 0) return;
                    const items = [...formData.beforeAfterSets];
                    const temp = items[index - 1];
                    items[index - 1] = items[index];
                    items[index] = temp;
                    // re-assign sortOrder
                    items.forEach((it, i) => (it.sortOrder = i));
                    updateField('beforeAfterSets', items);
                  };

                  const moveDown = () => {
                    if (index === formData.beforeAfterSets.length - 1) return;
                    const items = [...formData.beforeAfterSets];
                    const temp = items[index + 1];
                    items[index + 1] = items[index];
                    items[index] = temp;
                    items.forEach((it, i) => (it.sortOrder = i));
                    updateField('beforeAfterSets', items);
                  };

                  const handleDelete = () => {
                    const items = formData.beforeAfterSets.filter((_, i) => i !== index);
                    items.forEach((it, i) => (it.sortOrder = i));
                    updateField('beforeAfterSets', items);
                  };

                  const handleUpdate = (field: keyof BeforeAfterSet, val: string | number) => {
                    const items = [...formData.beforeAfterSets];
                    items[index] = { ...items[index], [field]: val };
                    updateField('beforeAfterSets', items);
                  };

                  return (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 rounded-xl bg-[#0B1120] border border-[#334155] space-y-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#1E293B] border border-[#334155] text-xs font-bold flex items-center justify-center text-[var(--accent-color-light)]">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdate('title', e.target.value)}
                            placeholder="เช่น มุมมองด้านหน้าอาคาร (Façade)"
                            className="px-3 py-1.5 bg-[#1E293B] border border-[#334155] rounded-lg text-sm text-white font-semibold focus:border-[var(--accent-color)] outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={moveUp}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] disabled:opacity-30"
                            title="เลื่อนขึ้น"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={moveDown}
                            disabled={index === formData.beforeAfterSets.length - 1}
                            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] disabled:opacity-30"
                            title="เลื่อนลง"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleDelete}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors ml-1"
                            title="ลบชุดภาพนี้"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Before Image */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
                            <span>ภาพก่อนติดตั้ง (Before Image URL)</span>
                          </label>
                          <input
                            type="url"
                            value={item.beforeImage}
                            onChange={(e) => handleUpdate('beforeImage', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-xs text-white focus:border-[var(--accent-color)] outline-none"
                          />
                          {item.beforeImage && (
                            <div className="h-32 rounded-lg overflow-hidden border border-[#334155] bg-black/40">
                              <img
                                src={item.beforeImage}
                                alt="Before"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>

                        {/* After Image */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                            <span>ภาพหลังติดตั้งพร้อมจอ LED (After Image URL)</span>
                          </label>
                          <input
                            type="url"
                            value={item.afterImage}
                            onChange={(e) => handleUpdate('afterImage', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-xs text-white focus:border-[var(--accent-color)] outline-none"
                          />
                          {item.afterImage && (
                            <div className="h-32 rounded-lg overflow-hidden border border-[#334155] bg-black/40">
                              <img
                                src={item.afterImage}
                                alt="After"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PERSPECTIVES */}
        {activeTab === 'perspectives' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">
                  มุมมองการติดตั้งจำลอง (Installation Perspectives)
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  จัดแสดงมุมมองต่างๆ เช่น ด้านหน้า มุมมองระยะไกล มุมมองระดับสายตา มุมมองเวลากลางคืน
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newView: InstallationView = {
                    id: generateId(),
                    viewName: `มุมมอง #${formData.installationViews.length + 1}`,
                    imageUrl: '',
                    description: '',
                    sortOrder: formData.installationViews.length,
                  };
                  updateField('installationViews', [...formData.installationViews, newView]);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--accent-color)] text-white hover:opacity-90 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มมุมมองใหม่</span>
              </button>
            </div>

            {formData.installationViews.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-[#334155] rounded-xl">
                <Layers className="w-10 h-10 text-[#64748B] mx-auto mb-2" />
                <p className="text-sm text-slate-300">ยังไม่มีมุมมองการติดตั้ง</p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  กดปุ่ม "เพิ่มมุมมองใหม่" เพื่อแสดงมิติต่างๆ ของจอ LED
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.installationViews.map((view, index) => {
                  const moveUp = () => {
                    if (index === 0) return;
                    const items = [...formData.installationViews];
                    const temp = items[index - 1];
                    items[index - 1] = items[index];
                    items[index] = temp;
                    items.forEach((it, i) => (it.sortOrder = i));
                    updateField('installationViews', items);
                  };

                  const moveDown = () => {
                    if (index === formData.installationViews.length - 1) return;
                    const items = [...formData.installationViews];
                    const temp = items[index + 1];
                    items[index + 1] = items[index];
                    items[index] = temp;
                    items.forEach((it, i) => (it.sortOrder = i));
                    updateField('installationViews', items);
                  };

                  const handleDelete = () => {
                    const items = formData.installationViews.filter((_, i) => i !== index);
                    items.forEach((it, i) => (it.sortOrder = i));
                    updateField('installationViews', items);
                  };

                  const handleUpdate = (field: keyof InstallationView, val: string | number) => {
                    const items = [...formData.installationViews];
                    items[index] = { ...items[index], [field]: val };
                    updateField('installationViews', items);
                  };

                  return (
                    <div
                      key={view.id}
                      className="p-4 rounded-xl bg-[#0B1120] border border-[#334155] space-y-3 shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="w-6 h-6 rounded-full bg-[#1E293B] border border-[#334155] text-xs font-bold flex items-center justify-center text-[var(--accent-color-light)]">
                              {index + 1}
                            </span>
                            <input
                              type="text"
                              value={view.viewName}
                              onChange={(e) => handleUpdate('viewName', e.target.value)}
                              placeholder="เช่น มุมมองระยะ 50 เมตร"
                              className="w-full px-2.5 py-1.5 bg-[#1E293B] border border-[#334155] rounded-lg text-sm text-white font-medium focus:border-[var(--accent-color)] outline-none"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={moveUp}
                              disabled={index === 0}
                              className="p-1 rounded text-[#94A3B8] hover:text-white disabled:opacity-30"
                              title="เลื่อนขึ้น"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={moveDown}
                              disabled={index === formData.installationViews.length - 1}
                              className="p-1 rounded text-[#94A3B8] hover:text-white disabled:opacity-30"
                              title="เลื่อนลง"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={handleDelete}
                              className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                              title="ลบมุมมองนี้"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400">Image URL</label>
                          <input
                            type="url"
                            value={view.imageUrl}
                            onChange={(e) => handleUpdate('imageUrl', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-1.5 bg-[#1E293B] border border-[#334155] rounded-lg text-xs text-white focus:border-[var(--accent-color)] outline-none"
                          />
                        </div>

                        {view.imageUrl && (
                          <div className="h-36 rounded-lg overflow-hidden border border-[#334155] bg-black/40">
                            <img
                              src={view.imageUrl}
                              alt={view.viewName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div>
                          <label className="text-[11px] text-slate-400">คำอธิบายมุมมอง</label>
                          <textarea
                            rows={2}
                            value={view.description || ''}
                            onChange={(e) => handleUpdate('description', e.target.value)}
                            placeholder="เช่น มุมมองจากสี่แยกหลัก ผู้ขับขี่มองเห็นชัดเจน 100%..."
                            className="w-full px-3 py-1.5 bg-[#1E293B] border border-[#334155] rounded-lg text-xs text-white focus:border-[var(--accent-color)] outline-none resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: VIDEOS */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">
                  วิดีโอสาธิตและโมเดลเคลื่อนไหว (Videos)
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  เพิ่มลิงก์วิดีโอสาธิตการทำงาน คอนเทนต์จำลอง หรือการเรนเดอร์ภาพเคลื่อนไหว
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newVideo: ProjectVideo = {
                    id: generateId(),
                    title: `วิดีโอใหม่ #${formData.videos.length + 1}`,
                    videoUrl: '',
                    thumbnailUrl: '',
                    sortOrder: formData.videos.length,
                  };
                  updateField('videos', [...formData.videos, newVideo]);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--accent-color)] text-white hover:opacity-90 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มวิดีโอใหม่</span>
              </button>
            </div>

            {formData.videos.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-[#334155] rounded-xl">
                <Video className="w-10 h-10 text-[#64748B] mx-auto mb-2" />
                <p className="text-sm text-slate-300">ยังไม่มีวิดีโอในโปรเจกต์นี้</p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  กดปุ่ม "เพิ่มวิดีโอใหม่" เพื่อใส่คลิปตัวอย่างจอ LED หรือโมเดล 3D Animation
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.videos.map((vid, index) => {
                  const moveUp = () => {
                    if (index === 0) return;
                    const items = [...formData.videos];
                    const temp = items[index - 1];
                    items[index - 1] = items[index];
                    items[index] = temp;
                    items.forEach((it, i) => (it.sortOrder = i));
                    updateField('videos', items);
                  };

                  const moveDown = () => {
                    if (index === formData.videos.length - 1) return;
                    const items = [...formData.videos];
                    const temp = items[index + 1];
                    items[index + 1] = items[index];
                    items[index] = temp;
                    items.forEach((it, i) => (it.sortOrder = i));
                    updateField('videos', items);
                  };

                  const handleDelete = () => {
                    const items = formData.videos.filter((_, i) => i !== index);
                    items.forEach((it, i) => (it.sortOrder = i));
                    updateField('videos', items);
                  };

                  const handleUpdate = (field: keyof ProjectVideo, val: string | number) => {
                    const items = [...formData.videos];
                    items[index] = { ...items[index], [field]: val };
                    updateField('videos', items);
                  };

                  return (
                    <div
                      key={vid.id}
                      className="p-4 sm:p-5 rounded-xl bg-[#0B1120] border border-[#334155] space-y-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-6 h-6 rounded-full bg-[#1E293B] border border-[#334155] text-xs font-bold flex items-center justify-center text-[var(--accent-color-light)]">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            value={vid.title}
                            onChange={(e) => handleUpdate('title', e.target.value)}
                            placeholder="ชื่อวิดีโอ เช่น 3D Simulation Walkthrough"
                            className="w-full max-w-md px-3 py-1.5 bg-[#1E293B] border border-[#334155] rounded-lg text-sm text-white font-semibold focus:border-[var(--accent-color)] outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={moveUp}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] disabled:opacity-30"
                            title="เลื่อนขึ้น"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={moveDown}
                            disabled={index === formData.videos.length - 1}
                            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] disabled:opacity-30"
                            title="เลื่อนลง"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleDelete}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 ml-1"
                            title="ลบวิดีโอนี้"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-300">
                            Video URL (MP4 หรือ Direct Link)
                          </label>
                          <input
                            type="url"
                            value={vid.videoUrl}
                            onChange={(e) => handleUpdate('videoUrl', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-xs text-white focus:border-[var(--accent-color)] outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-300">
                            Thumbnail URL (ภาพปกวิดีโอ)
                          </label>
                          <input
                            type="url"
                            value={vid.thumbnailUrl || ''}
                            onChange={(e) => handleUpdate('thumbnailUrl', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-xs text-white focus:border-[var(--accent-color)] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SPECIFICATIONS */}
        {activeTab === 'specifications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">
                  ข้อมูลจำเพาะทางเทคนิค (Technical Specifications)
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  ระบุรายละเอียดของฮาร์ดแวร์จอ LED เช่น ความสว่าง ระยะพิกเซล และขนาด
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newSpec: TechnicalSpecification = {
                    id: generateId(),
                    fieldName: 'สเปกใหม่',
                    fieldValue: '-',
                    unit: '',
                    sortOrder: formData.specifications.length,
                  };
                  updateField('specifications', [...formData.specifications, newSpec]);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--accent-color)] text-white hover:opacity-90 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มข้อมูลจำเพาะ</span>
              </button>
            </div>

            {/* Quick Template Chips */}
            <div className="p-3 bg-[#0B1120] rounded-xl border border-[#334155] space-y-2">
              <span className="text-[11px] font-semibold text-[#94A3B8]">
                เพิ่มสเปกสำเร็จรูปยอดนิยมคลิกเดียว:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Pixel Pitch', val: 'P3.91', unit: 'mm' },
                  { name: 'ความสว่าง (Brightness)', val: '6,500', unit: 'nits' },
                  { name: 'Refresh Rate', val: '3,840', unit: 'Hz' },
                  { name: 'ขนาดจอรวม (Width x Height)', val: '12 x 6', unit: 'เมตร' },
                  { name: 'ระดับการกันน้ำและฝุ่น', val: 'IP65', unit: '(หน้า/หลัง)' },
                  { name: 'ความละเอียดรวม', val: '3072 x 1536', unit: 'px' },
                  { name: 'กำลังไฟฟ้าเฉลี่ย', val: '280', unit: 'W/m²' },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      const newSpec: TechnicalSpecification = {
                        id: generateId(),
                        fieldName: preset.name,
                        fieldValue: preset.val,
                        unit: preset.unit,
                        sortOrder: formData.specifications.length,
                      };
                      updateField('specifications', [...formData.specifications, newSpec]);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs bg-[#1E293B] hover:bg-[#273548] border border-[#334155] text-slate-300 hover:text-white transition-colors"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {formData.specifications.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-[#334155] rounded-xl">
                <Cpu className="w-10 h-10 text-[#64748B] mx-auto mb-2" />
                <p className="text-sm text-slate-300">ยังไม่มีข้อมูลจำเพาะ</p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  เลือกปุ่มเทมเพลตด้านบน หรือกด "เพิ่มข้อมูลจำเพาะ" เพื่อระบุคุณสมบัติของจอ
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {formData.specifications.map((spec, index) => {
                  const moveUp = () => {
                    if (index === 0) return;
                    const items = [...formData.specifications];
                    const temp = items[index - 1];
                    items[index - 1] = items[index];
                    items[index] = temp;
                    items.forEach((it, i) => (it.sortOrder = i));
                    updateField('specifications', items);
                  };

                  const moveDown = () => {
                    if (index === formData.specifications.length - 1) return;
                    const items = [...formData.specifications];
                    const temp = items[index + 1];
                    items[index + 1] = items[index];
                    items[index] = temp;
                    items.forEach((it, i) => (it.sortOrder = i));
                    updateField('specifications', items);
                  };

                  const handleDelete = () => {
                    const items = formData.specifications.filter((_, i) => i !== index);
                    items.forEach((it, i) => (it.sortOrder = i));
                    updateField('specifications', items);
                  };

                  const handleUpdate = (
                    field: keyof TechnicalSpecification,
                    val: string | number
                  ) => {
                    const items = [...formData.specifications];
                    items[index] = { ...items[index], [field]: val };
                    updateField('specifications', items);
                  };

                  return (
                    <div
                      key={spec.id}
                      className="p-3 rounded-xl bg-[#0B1120] border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-5 h-5 rounded-full bg-[#1E293B] text-[10px] font-bold flex items-center justify-center text-[#94A3B8]">
                          {index + 1}
                        </span>

                        <input
                          type="text"
                          value={spec.fieldName}
                          onChange={(e) => handleUpdate('fieldName', e.target.value)}
                          placeholder="ชื่อสเปก เช่น ความสว่าง"
                          className="flex-1 px-3 py-1.5 bg-[#1E293B] border border-[#334155] rounded-lg text-xs sm:text-sm text-white focus:border-[var(--accent-color)] outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 sm:w-72">
                        <input
                          type="text"
                          value={spec.fieldValue}
                          onChange={(e) => handleUpdate('fieldValue', e.target.value)}
                          placeholder="ค่า เช่น 7,000"
                          className="flex-1 px-3 py-1.5 bg-[#1E293B] border border-[#334155] rounded-lg text-xs sm:text-sm text-white font-mono focus:border-[var(--accent-color)] outline-none"
                        />
                        <input
                          type="text"
                          value={spec.unit || ''}
                          onChange={(e) => handleUpdate('unit', e.target.value)}
                          placeholder="หน่วย เช่น nits"
                          className="w-20 px-2.5 py-1.5 bg-[#1E293B] border border-[#334155] rounded-lg text-xs text-white focus:border-[var(--accent-color)] outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-1 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={moveUp}
                          disabled={index === 0}
                          className="p-1.5 rounded text-[#94A3B8] hover:text-white disabled:opacity-30"
                          title="เลื่อนขึ้น"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={moveDown}
                          disabled={index === formData.specifications.length - 1}
                          className="p-1.5 rounded text-[#94A3B8] hover:text-white disabled:opacity-30"
                          title="เลื่อนลง"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 ml-1"
                          title="ลบสเปกนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: SECTIONS */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">
                การจัดการและเรียงลำดับเซกชัน (Sections Order)
              </h2>
              <p className="text-xs text-[#94A3B8]">
                เปิด/ปิด หรือสลับลำดับการแสดงผลของแต่ละส่วนในหน้าพรีเซนเทชัน
              </p>
            </div>

            <div className="space-y-3">
              {formData.sections.map((section, index) => {
                const moveUp = () => {
                  if (index === 0) return;
                  const items = [...formData.sections];
                  const temp = items[index - 1];
                  items[index - 1] = items[index];
                  items[index] = temp;
                  items.forEach((it, i) => (it.sortOrder = i));
                  updateField('sections', items);
                };

                const moveDown = () => {
                  if (index === formData.sections.length - 1) return;
                  const items = [...formData.sections];
                  const temp = items[index + 1];
                  items[index + 1] = items[index];
                  items[index] = temp;
                  items.forEach((it, i) => (it.sortOrder = i));
                  updateField('sections', items);
                };

                const toggleEnabled = () => {
                  const items = [...formData.sections];
                  items[index] = { ...items[index], enabled: !items[index].enabled };
                  updateField('sections', items);
                };

                const handleUpdate = (field: keyof ProjectSection, val: string | number | boolean) => {
                  const items = [...formData.sections];
                  items[index] = { ...items[index], [field]: val };
                  updateField('sections', items);
                };

                return (
                  <div
                    key={section.id}
                    className={`p-4 rounded-xl border transition-all ${
                      section.enabled
                        ? 'bg-[#0B1120] border-[#334155]'
                        : 'bg-[#0B1120]/40 border-[#334155]/40 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        {/* Toggle switch */}
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={section.enabled}
                            onChange={toggleEnabled}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-6 bg-[#1E293B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-color)] border border-[#334155]"></div>
                        </label>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded bg-[#1E293B] text-[var(--accent-color-light)] font-mono border border-[#334155]">
                              {section.sectionType}
                            </span>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => handleUpdate('title', e.target.value)}
                              placeholder="หัวข้อเซกชัน"
                              className="px-3 py-1 bg-[#1E293B] border border-[#334155] rounded-lg text-sm text-white font-medium focus:border-[var(--accent-color)] outline-none flex-1 max-w-sm"
                            />
                          </div>

                          <input
                            type="text"
                            value={section.description || ''}
                            onChange={(e) => handleUpdate('description', e.target.value)}
                            placeholder="คำอธิบายสั้นของเซกชัน..."
                            className="w-full px-3 py-1 bg-[#1E293B] border border-[#334155] rounded-lg text-xs text-[#94A3B8] focus:border-[var(--accent-color)] outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={moveUp}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] disabled:opacity-30"
                          title="เลื่อนขึ้น"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={moveDown}
                          disabled={index === formData.sections.length - 1}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] disabled:opacity-30"
                          title="เลื่อนลง"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 8: PREVIEW & SHARE */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">
                ดูตัวอย่างและแชร์ลิงก์ (Preview & Share)
              </h2>
              <p className="text-xs text-[#94A3B8]">
                ทดสอบการแสดงผลเสมือนจริงในขนาดหน้าจอต่างๆ พร้อมแชร์ลิงก์ให้กับลูกค้าทันที
              </p>
            </div>

            {/* Sharing Bar */}
            <div className="p-4 rounded-xl bg-[#0B1120] border border-[#334155] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 space-y-1">
                <span className="text-xs font-semibold text-slate-300">
                  ลิงก์สำหรับส่งให้ลูกค้า (Public Proposal URL):
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3.5 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-xs sm:text-sm font-mono text-[var(--accent-color-light)] select-all truncate">
                    {getProjectUrl(formData.slug)}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                      copiedLink
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-[#1E293B] text-white hover:bg-[#273548] border-[#334155]'
                    }`}
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</span>
                  </button>
                </div>
              </div>

              {/* Status and Open button */}
              <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#334155]">
                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      'status',
                      formData.status === 'published' ? 'draft' : 'published'
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                    formData.status === 'published'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                  }`}
                >
                  {formData.status === 'published' ? '🟢 สถานะ: เผยแพร่แล้ว' : '🟡 สถานะ: แบบร่าง'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      `/p/${formData.slug}${formData.status === 'draft' ? '?preview=true' : ''}`,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--accent-color)] text-white hover:opacity-90 transition-all shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>เปิดแท็บใหม่</span>
                </button>
              </div>
            </div>

            {/* Device Frame Controls */}
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <span className="text-xs text-[#94A3B8]">จำลองมุมมองอุปกรณ์:</span>
              <div className="flex items-center gap-1 bg-[#0B1120] p-1 rounded-xl border border-[#334155]">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    previewDevice === 'desktop'
                      ? 'bg-[var(--accent-color)] text-white shadow'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                  title="จอคอมพิวเตอร์ Desktop"
                >
                  <Laptop className="w-4 h-4" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    previewDevice === 'tablet'
                      ? 'bg-[var(--accent-color)] text-white shadow'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                  title="แท็บเล็ต Tablet"
                >
                  <Tablet className="w-4 h-4" />
                  <span className="hidden sm:inline">Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    previewDevice === 'mobile'
                      ? 'bg-[var(--accent-color)] text-white shadow'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                  title="สมาร์ตโฟน Mobile"
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>
            </div>

            {/* Embedded Iframe Container */}
            <div className="flex justify-center bg-[#0B1120] rounded-2xl p-4 sm:p-6 border border-[#334155] overflow-hidden min-h-[550px]">
              <div
                className={`transition-all duration-300 ease-in-out bg-[#111827] rounded-xl overflow-hidden border border-[#475569] shadow-2xl flex flex-col ${
                  previewDevice === 'desktop'
                    ? 'w-full h-[650px]'
                    : previewDevice === 'tablet'
                    ? 'w-[768px] h-[650px]'
                    : 'w-[375px] h-[650px]'
                }`}
              >
                {/* Browser bar mockup */}
                <div className="h-8 bg-[#1E293B] border-b border-[#334155] px-3 flex items-center gap-2 select-none flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 mx-4 text-center">
                    <span className="px-3 py-0.5 rounded text-[11px] font-mono text-[#94A3B8] bg-[#0B1120]/70 border border-[#334155]">
                      /p/{formData.slug}
                    </span>
                  </div>
                  <Globe className="w-3.5 h-3.5 text-[#64748B]" />
                </div>

                {/* Iframe */}
                <iframe
                  src={`/p/${formData.slug}?preview=true`}
                  title="Presentation Preview"
                  className="w-full flex-1 border-0 bg-[#0B1120]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectEditorPage;
