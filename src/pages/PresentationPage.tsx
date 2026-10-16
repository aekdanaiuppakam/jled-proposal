import { useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { FileQuestion, Lock, ArrowLeft, Eye, Edit3, Globe } from 'lucide-react';
import { usePublishedProject, useProjectBySlug, useProjectActions } from '../hooks/useProjects';
import { applyBranding, resetBranding } from '../lib/utils';
import {
  PresentationNav,
  ProjectHero,
  BeforeAfterSlider,
  PerspectiveGallery,
  VideoShowcase,
  SpecificationPanel,
  ProjectClosing,
} from '../components/presentation';
import type { ProjectSection } from '../types';

export function PresentationPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const isPreviewParam = searchParams.get('preview') === 'true';
  const { publishProject } = useProjectActions();

  // Fetch published project and any existing project (to distinguish 404 from draft)
  const publishedProject = usePublishedProject(slug || '');
  const existingProject = useProjectBySlug(slug || '');

  // Determine active project to render
  const isPreviewMode = isPreviewParam && !!existingProject;
  const activeProject = isPreviewMode ? existingProject : publishedProject;

  // Update document title
  useEffect(() => {
    if (activeProject?.name) {
      const suffix = activeProject.status === 'published' ? '' : ' (โหมดพรีวิว)';
      document.title = `${activeProject.name}${suffix} — JLED Proposal`;
    } else {
      document.title = 'JLED Proposal Platform';
    }

    return () => {
      document.title = 'JLED Proposal Platform';
    };
  }, [activeProject]);

  // Apply project branding CSS variables
  useEffect(() => {
    if (activeProject?.branding?.primaryColor) {
      applyBranding(
        activeProject.branding.primaryColor,
        activeProject.branding.secondaryColor
      );
    }

    return () => {
      resetBranding();
    };
  }, [activeProject]);

  // 1. Not Found State (404)
  if (!existingProject) {
    return (
      <main className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-[#94A3B8]">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            ไม่พบข้อมูลโปรเจกต์
          </h1>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed mb-8">
            ลิงก์ข้อเสนอที่คุณเปิดอาจไม่ถูกต้อง หรือโปรเจกต์นี้อาจถูกลบไปแล้ว
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-medium text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าหลักแดชบอร์ด</span>
          </Link>
        </div>
      </main>
    );
  }

  // 2. Draft / Not Published State (when visited without preview=true)
  if (!activeProject) {
    return (
      <main className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-400">
            <Lock className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-400 mb-3">
            สถานะ: แบบร่าง (Draft)
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            โปรเจกต์นี้ยังไม่ได้เผยแพร่
          </h1>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed mb-8">
            โปรเจกต์ &quot;{existingProject.name}&quot; ยังอยู่ในระหว่างการจัดทำและยังไม่เปิดให้เข้าชมสาธารณะ กรุณาติดต่อผู้รับผิดชอบโครงการ JLED
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <Link
              to={`/p/${existingProject.slug}?preview=true`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent-color)] hover:opacity-90 text-sm font-semibold text-white transition-all shadow-lg shadow-[var(--accent-color-muted)] w-full sm:w-auto"
            >
              <Eye className="w-4 h-4" />
              <span>ดูตัวอย่างแบบร่าง (Preview)</span>
            </Link>
            <Link
              to={`/admin/edit/${existingProject.id}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-medium text-white transition-all w-full sm:w-auto"
            >
              <Edit3 className="w-4 h-4" />
              <span>แก้ไขโปรเจกต์</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 3. Render Active Presentation Page (either Published or Admin Preview)
  // Sort and filter enabled sections
  const enabledSections = [...activeProject.sections]
    .filter((sec) => sec.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const renderSection = (section: ProjectSection) => {
    switch (section.sectionType) {
      case 'hero':
        return <ProjectHero key={section.id} project={activeProject} />;

      case 'before-after':
        return (
          <BeforeAfterSlider
            key={section.id}
            sets={activeProject.beforeAfterSets}
            title={section.title}
            description={section.description}
          />
        );

      case 'perspectives':
        return (
          <PerspectiveGallery
            key={section.id}
            views={activeProject.installationViews}
            title={section.title}
            description={section.description}
          />
        );

      case 'video-showcase':
        return (
          <VideoShowcase
            key={section.id}
            videos={activeProject.videos}
            title={section.title}
            description={section.description}
          />
        );

      case 'specifications':
        return (
          <SpecificationPanel
            key={section.id}
            specs={activeProject.specifications}
            title={section.title}
            description={section.description}
          />
        );

      case 'closing':
        return <ProjectClosing key={section.id} project={activeProject} />;

      default:
        return null;
    }
  };

  const handlePublishFromPreview = () => {
    if (activeProject) {
      publishProject(activeProject.id);
      window.location.href = `/p/${activeProject.slug}`;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0B1120] text-white selection:bg-[var(--accent-color-muted)] selection:text-[var(--accent-color-light)]">
      {/* Admin Preview Mode Banner if not published */}
      {isPreviewMode && activeProject.status !== 'published' && (
        <div className="sticky top-0 z-50 bg-amber-500/95 backdrop-blur-md text-black px-4 py-2.5 font-medium text-xs sm:text-sm flex flex-wrap items-center justify-between gap-3 shadow-xl border-b border-amber-600/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
            <span>
              <strong>โหมดพรีวิว (Admin Preview):</strong> โปรเจกต์นี้ยังไม่ได้เผยแพร่สู่สาธารณะ
            </span>
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <Link
              to={`/admin/edit/${activeProject.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/10 hover:bg-black/20 text-black text-xs font-semibold transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>แก้ไข</span>
            </Link>
            <button
              type="button"
              onClick={handlePublishFromPreview}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black text-white hover:bg-slate-900 text-xs font-semibold transition cursor-pointer shadow"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>เผยแพร่ทันที</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <PresentationNav
        clientName={activeProject.clientName}
        clientLogo={activeProject.branding.clientLogo}
        projectId={activeProject.id}
      />

      {/* Render all enabled sections */}
      <main className="w-full">
        {enabledSections.map((section) => renderSection(section))}
      </main>
    </div>
  );
}

export default PresentationPage;
