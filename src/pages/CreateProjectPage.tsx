import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Tv,
  Building2,
  MapPin,
  Check,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useProjectActions } from '../hooks/useProjects';

const POPULAR_COLORS = [
  { name: 'JLED Emerald', hex: '#10B981' },
  { name: 'Cyber Cyan', hex: '#06B6D4' },
  { name: 'Royal Blue', hex: '#3B82F6' },
  { name: 'Electric Indigo', hex: '#6366F1' },
  { name: 'Tech Purple', hex: '#8B5CF6' },
  { name: 'Vibrant Amber', hex: '#F59E0B' },
  { name: 'Neon Orange', hex: '#F97316' },
  { name: 'Crimson Red', hex: '#EF4444' },
];

const INSTALLATION_TYPES = [
  'Outdoor LED Display (กลางแจ้ง)',
  'Indoor HD Display (ในร่ม)',
  'Naked-Eye 3D Curved LED (จอโค้ง 3 มิติ)',
  'Transparent LED Film (จอโปร่งแสง)',
  'Rental & Stage LED (เวทีและอีเวนต์)',
  'LED Ribbon / Perimeter (จอขอบสนาม/ป้ายยาว)',
];

export function CreateProjectPage() {
  const navigate = useNavigate();
  const { createProject } = useProjectActions();

  // Form states
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [installationType, setInstallationType] = useState(INSTALLATION_TYPES[0]);
  const [accentColor, setAccentColor] = useState('#10B981');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('กรุณาระบุชื่อโปรเจกต์');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = createProject({
        name: name.trim(),
        clientName: clientName.trim(),
        description: description.trim(),
        location: location.trim(),
        installationType: installationType.trim(),
        branding: {
          primaryColor: accentColor,
          theme: 'dark',
          heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
          heroHeadline: `${name.trim()} - LED Display Proposal`,
          heroSubheadline:
            description.trim() ||
            'สำรวจการติดตั้งจอ LED ที่เสนอ ผ่านภาพจำลองที่สมจริง มุมมองการติดตั้งที่หลากหลาย และการสาธิตแบบอินเทอร์แอคทีฟ',
          closingHeadline: 'จินตนาการอนาคตของพื้นที่คุณ',
          closingDescription:
            'ด้วยเทคโนโลยีจอ LED คุณภาพสูง พื้นที่อาคารของคุณจะกลายเป็นสื่อโฆษณาที่ทรงพลังและน่าจดจำ',
          contactInfo: 'ติดต่อ JLED: contact@jled.co.th | 02-XXX-XXXX',
        },
      });

      // Navigate to project editor
      navigate(`/admin/edit/${created.id}`);
    } catch {
      setError('เกิดข้อผิดพลาดในการสร้างโปรเจกต์ โปรดลองอีกครั้ง');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-[#334155]/60">
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="p-2 rounded-xl text-[#94A3B8] hover:text-white bg-[#1E293B] hover:bg-[#273548] border border-[#334155] transition-colors"
          title="กลับไปยังแดชบอร์ด"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">สร้างโปรเจกต์ใหม่</h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            ระบุรายละเอียดเบื้องต้นเพื่อเริ่มต้นสร้างข้อเสนอการติดตั้งจอ LED
          </p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5 sm:p-8 space-y-6 shadow-xl">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center justify-between">
              <span>
                ชื่อโปรเจกต์ <span className="text-rose-400">*</span>
              </span>
              <span className="text-[11px] text-[#94A3B8] font-normal">เช่น Royal-D LED Proposal</span>
            </label>
            <div className="relative">
              <Tv className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="ระบุชื่อโปรเจกต์ เช่น สำนักงานใหญ่ บจก. เอบีซี..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-[var(--accent-color)] outline-none text-sm transition"
                autoFocus
              />
            </div>
          </div>

          {/* Client Name */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              ชื่อลูกค้า / บริษัท
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="เช่น Royal-D Beverage, CP All, Central Group..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-[var(--accent-color)] outline-none text-sm transition"
              />
            </div>
          </div>

          {/* Location & Installation Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-200">สถานที่ติดตั้ง</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="เช่น กรุงเทพมหานคร, ถนนสุขุมวิท..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-[var(--accent-color)] outline-none text-sm transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-200">
                ประเภทการติดตั้งจอ LED
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={installationType}
                  onChange={(e) => setInstallationType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border border-[#334155] rounded-xl text-white focus:border-[var(--accent-color)] outline-none text-sm transition cursor-pointer appearance-none"
                >
                  {INSTALLATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              คำอธิบายโปรเจกต์โดยสรุป
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุวัตถุประสงค์ของการติดตั้ง เช่น ติดตั้งบนผนังหน้าอาคารเพื่อเป็นสื่อโฆษณาและส่งเสริมภาพลักษณ์แบรนด์..."
              className="w-full px-4 py-2.5 bg-[#0B1120] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-[var(--accent-color)] outline-none text-sm transition resize-none"
            />
          </div>

          {/* Accent Color Selection */}
          <div className="space-y-3 pt-3 border-t border-[#334155]/60">
            <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center justify-between">
              <span>เลือกสีแบรนด์หลัก (Accent Color)</span>
              <span className="font-mono text-xs text-[var(--accent-color-light)]">{accentColor}</span>
            </label>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {POPULAR_COLORS.map((col) => (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() => setAccentColor(col.hex)}
                  className={`h-9 rounded-xl flex items-center justify-center transition-all ${
                    accentColor.toLowerCase() === col.hex.toLowerCase()
                      ? 'ring-2 ring-white scale-110 shadow-lg'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                >
                  {accentColor.toLowerCase() === col.hex.toLowerCase() && (
                    <Check className="w-4 h-4 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                placeholder="#10B981"
                className="flex-1 px-3.5 py-2 bg-[#0B1120] border border-[#334155] rounded-xl text-white font-mono text-xs sm:text-sm focus:border-[var(--accent-color)] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#334155]/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#94A3B8] hover:text-white bg-transparent hover:bg-[#0B1120] border border-transparent hover:border-[#334155] transition-all"
          >
            ยกเลิก
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--accent-color)] text-white hover:opacity-90 transition-all shadow-lg shadow-[var(--accent-color-muted)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'กำลังสร้างโปรเจกต์...' : 'สร้างและเข้าสู่หน้าแก้ไข'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProjectPage;
