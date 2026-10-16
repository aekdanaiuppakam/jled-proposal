import { motion } from 'framer-motion';
import {
  ArrowUp,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  Sparkles,
  Award,
  Cpu,
  Wrench,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import type { Project } from '../../types';

export interface ProjectClosingProps {
  project: Project;
}

interface ParsedContact {
  type: 'phone' | 'line' | 'email' | 'company' | 'text';
  label: string;
  value: string;
  href?: string;
}

function parseContactInfo(raw?: string): ParsedContact[] {
  if (!raw) return [];
  // Split on newlines, pipes, or semicolons
  const parts = raw
    .split(/\n|\||;/)
    .map((s) => s.trim())
    .filter(Boolean);

  const items: ParsedContact[] = [];

  for (const part of parts) {
    const lower = part.toLowerCase();
    if (lower.includes('line')) {
      const val = part.replace(/^line:?\s*/i, '').trim();
      const cleanHandle = val.startsWith('@') ? val.slice(1) : val;
      items.push({
        type: 'line',
        label: 'LINE Official',
        value: val,
        href: `https://line.me/R/ti/p/~${cleanHandle}`,
      });
    } else if (part.includes('@') && !part.startsWith('@')) {
      const emailMatch = part.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const val = emailMatch
        ? emailMatch[0]
        : part.replace(/^(อีเมล|email):?\s*/i, '').trim();
      items.push({
        type: 'email',
        label: 'อีเมลสอบถาม',
        value: val,
        href: `mailto:${val}`,
      });
    } else if (lower.includes('โทร') || lower.includes('tel') || /[\d-]{8,}/.test(part)) {
      const phoneDigits = part.replace(/[^\d+]/g, '');
      const display = part.replace(/^(โทร|tel):?\s*/i, '').trim();
      items.push({
        type: 'phone',
        label: 'โทรศัพท์สายตรง',
        value: display,
        href: phoneDigits ? `tel:${phoneDigits}` : undefined,
      });
    } else if (
      lower.includes('บริษัท') ||
      lower.includes('co.,') ||
      lower.includes('ltd')
    ) {
      items.push({
        type: 'company',
        label: 'ผู้พัฒนาและติดตั้ง',
        value: part,
      });
    } else {
      items.push({
        type: 'text',
        label: 'ข้อมูลติดต่อ',
        value: part,
      });
    }
  }

  // Fallback defaults if list is empty
  if (items.length === 0) {
    items.push(
      {
        type: 'company',
        label: 'ผู้พัฒนาและติดตั้ง',
        value: 'บริษัท เจแอลอีดี จำกัด (JLED Co., Ltd.)',
      },
      {
        type: 'phone',
        label: 'โทรศัพท์สายตรง',
        value: '02-877-2266',
        href: 'tel:028772266',
      },
      {
        type: 'line',
        label: 'LINE Official',
        value: '@jled',
        href: 'https://line.me/R/ti/p/~jled',
      },
      {
        type: 'email',
        label: 'อีเมลสอบถาม',
        value: 'contact@jled.co.th',
        href: 'mailto:contact@jled.co.th',
      }
    );
  }

  return items;
}

export function ProjectClosing({ project }: ProjectClosingProps) {
  const closingImage =
    project.branding.closingImage ||
    project.branding.heroImage ||
    project.coverImage;

  const headline =
    project.branding.closingHeadline || 'จินตนาการอนาคตของพื้นที่คุณ';
  const description =
    project.branding.closingDescription ||
    'ด้วยเทคโนโลยีจอ LED คุณภาพสูง พื้นที่อาคารของคุณจะกลายเป็นสื่อโฆษณาและภาพลักษณ์องค์กรที่ทรงพลังและน่าจดจำ';
  const contactItems = parseContactInfo(project.branding.contactInfo);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="closing"
      className="relative w-full overflow-hidden bg-[#0B1120] border-t border-white/10 pt-20 sm:pt-28 pb-16"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[var(--accent-color)] opacity-[0.04] blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        {/* 1. BEST FINAL INSTALLATION MOCKUP SHOWCASE */}
        {closingImage && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-3xl overflow-hidden border border-white/15 shadow-2xl mb-16 bg-[#111827]"
          >
            <img
              src={closingImage}
              alt={headline}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-black/30 to-black/10 group-hover:via-black/20 transition-all duration-300" />

            {/* Overlaid Badges and Labels */}
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Architectural LED Visualization</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
                  {project.name}
                </h3>
              </div>

              {project.installationType && (
                <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-slate-200">
                  {project.installationType}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 2. SECTION HEADLINE & DESCRIPTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider mb-6"
            style={{ color: 'var(--accent-color)' }}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>JLED Engineering Excellence</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.25] mb-6"
          >
            {headline}
          </motion.h2>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[#94A3B8] leading-relaxed"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* 3. JLED PROJECT GUARANTEES & STANDARDS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-16"
        >
          <div className="p-6 rounded-2xl bg-[#1E293B]/60 backdrop-blur-md border border-white/5 hover:border-white/15 transition-all flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">รับประกัน 2 ปีเต็ม On-site Service</h4>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              พร้อมทีมวิศวกรผู้เชี่ยวชาญดูแลระบบ สต็อกอะไหล่สำรอง และเข้าบริการตรวจเช็กตลอดอายุการใช้งาน
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1E293B]/60 backdrop-blur-md border border-white/5 hover:border-white/15 transition-all flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Wrench className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">มาตรฐานโครงสร้างวิศวกรรม</h4>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              โครงสร้างเหล็กชุบกัลวาไนซ์ปลอดสนิม คำนวณแรงลมและมาตรฐานการติดตั้งตามหลักวิศวกรรมสถาปัตย์
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1E293B]/60 backdrop-blur-md border border-white/5 hover:border-white/15 transition-all flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">ระบบควบคุมคอนเทนต์ Cloud CMS</h4>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              อัปเดตสื่อโฆษณา จัดคิวแสดงผล และตั้งเวลาเปิด-ปิดอัตโนมัติผ่านคอมพิวเตอร์หรือสมาร์ตโฟนได้ทุกที่
            </p>
          </div>
        </motion.div>

        {/* 4. PROFESSIONAL CONTACT CARD & BACK TO TOP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1E293B]/80 to-[#111827]/80 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wider block mb-1"
                style={{ color: 'var(--accent-color)' }}
              >
                Contact & Consultation
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                พร้อมเริ่มโครงการหรือต้องการข้อมูลเพิ่มเติม?
              </h3>
            </div>

            <button
              type="button"
              onClick={handleScrollToTop}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm text-[#94A3B8] hover:text-white transition-all cursor-pointer self-start sm:self-auto shrink-0"
            >
              <span>กลับสู่ด้านบน</span>
              <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-1" />
            </button>
          </div>

          {/* Contact Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {contactItems.map((item, idx) => {
              const Icon =
                item.type === 'phone'
                  ? Phone
                  : item.type === 'line'
                  ? MessageCircle
                  : item.type === 'email'
                  ? Mail
                  : Building2;

              const content = (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl bg-[#0B1120]/60 border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between h-full ${
                    item.href ? 'hover:bg-[#1E293B]/80 group/card cursor-pointer' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
                      {item.label}
                    </span>
                    <Icon
                      className="w-4 h-4 text-[#94A3B8] group-hover/card:text-[var(--accent-color)] transition-colors"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white break-words">
                      {item.value}
                    </span>
                    {item.href && (
                      <ExternalLink className="w-3.5 h-3.5 text-[#64748B] group-hover/card:text-white shrink-0 transition-colors" />
                    )}
                  </div>
                </div>
              );

              if (item.href) {
                return (
                  <a
                    key={idx}
                    href={item.href}
                    target={item.type === 'line' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {content}
                  </a>
                );
              }

              return <div key={idx}>{content}</div>;
            })}
          </div>
        </motion.div>

        {/* 5. JLED COMPANY BRANDING / WATERMARK & FOOTER */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-white tracking-wider">
              J<span style={{ color: 'var(--accent-color)' }}>LED</span>
            </span>
            <span className="text-white/30">|</span>
            <span>Interactive Architectural Proposal Platform</span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-[#64748B]">
            {project.clientName
              ? `เอกสารข้อเสนอนี้จัดทำเป็นพิเศษสำหรับ ${project.clientName}`
              : 'เอกสารข้อเสนอโครงการติดตั้งจอ LED โดย JLED'}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default ProjectClosing;
