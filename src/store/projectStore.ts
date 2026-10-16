// ===== Project Data Store =====
// localStorage-based MVP — designed for easy Supabase migration.
// All data access goes through this service.

import type { Project, ProjectSummary } from '../types';
import { generateId, slugify } from '../lib/utils';
import { royalDProject } from '../data/demo-royal-d';

const STORAGE_KEY = 'jled_projects';

// ===== Initialize with demo data =====
function initializeStore(): Map<string, Project> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Project[];
      const map = new Map<string, Project>();
      for (const p of parsed) {
        // Upgrade legacy royal-d only if it has placeholder unsplash image
        if (p.id === royalDProject.id && (!p.coverImage || p.coverImage.includes('unsplash.com'))) {
          map.set(royalDProject.id, royalDProject);
        } else {
          map.set(p.id, p);
        }
      }
      if (!map.has(royalDProject.id)) {
        map.set(royalDProject.id, royalDProject);
      }
      persistStore(map);
      return map;
    } catch {
      // corrupted data, reinitialize
    }
  }
  const map = new Map<string, Project>();
  map.set(royalDProject.id, royalDProject);
  persistStore(map);
  return map;
}

function persistStore(store: Map<string, Project>): void {
  const projects = Array.from(store.values());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

let projectStore = initializeStore();

function computeProjects(store: Map<string, Project>): Project[] {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

function computeSummaries(projects: Project[]): ProjectSummary[] {
  return projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    clientName: p.clientName,
    coverImage: p.coverImage,
    status: p.status,
    updatedAt: p.updatedAt,
    accentColor: p.branding.primaryColor,
  }));
}

let cachedProjects: Project[] = computeProjects(projectStore);
let cachedSummaries: ProjectSummary[] = computeSummaries(cachedProjects);

// ===== Event system for reactivity =====
type Listener = () => void;
const listeners = new Set<Listener>();

function notify(): void {
  cachedProjects = computeProjects(projectStore);
  cachedSummaries = computeSummaries(cachedProjects);
  for (const listener of listeners) {
    listener();
  }
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ===== CRUD Operations =====

export function getAllProjects(): Project[] {
  return cachedProjects;
}

export function getProjectSummaries(): ProjectSummary[] {
  return cachedSummaries;
}

export function getProjectById(id: string): Project | undefined {
  return projectStore.get(id);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return Array.from(projectStore.values()).find((p) => p.slug === slug);
}

export function getPublishedProjectBySlug(slug: string): Project | undefined {
  const project = getProjectBySlug(slug);
  if (project && project.status === 'published') {
    return project;
  }
  return undefined;
}

export function createProject(partial: Partial<Project> = {}): Project {
  const id = generateId();
  const now = new Date().toISOString();
  const name = partial.name || 'โปรเจกต์ใหม่';

  const project: Project = {
    id,
    slug: partial.slug || slugify(name) || id,
    name,
    clientName: partial.clientName || '',
    description: partial.description || '',
    location: partial.location || '',
    installationType: partial.installationType || 'LED Display',
    coverImage: partial.coverImage || '',
    status: 'draft',
    language: 'th',
    createdAt: now,
    updatedAt: now,
    branding: partial.branding || {
      primaryColor: '#10B981',
      theme: 'dark',
      heroImage: '',
      heroHeadline: 'LED Display Installation Proposal',
      heroSubheadline:
        'สำรวจการติดตั้งจอ LED ที่เสนอ ผ่านภาพจำลองที่สมจริง มุมมองการติดตั้งที่หลากหลาย และการสาธิตแบบอินเทอร์แอคทีฟ',
    },
    sections: partial.sections || [
      { id: generateId(), sectionType: 'hero', title: 'Hero', sortOrder: 0, enabled: true },
      { id: generateId(), sectionType: 'before-after', title: 'ก่อน & หลังการติดตั้ง', sortOrder: 1, enabled: true },
      { id: generateId(), sectionType: 'perspectives', title: 'มุมมองการติดตั้ง', sortOrder: 2, enabled: true },
      { id: generateId(), sectionType: 'video-showcase', title: 'วิดีโอ', sortOrder: 3, enabled: true },
      { id: generateId(), sectionType: 'specifications', title: 'ข้อมูลจำเพาะ', sortOrder: 4, enabled: true },
      { id: generateId(), sectionType: 'closing', title: 'ปิดท้าย', sortOrder: 5, enabled: true },
    ],
    beforeAfterSets: partial.beforeAfterSets || [],
    installationViews: partial.installationViews || [],
    videos: partial.videos || [],
    specifications: partial.specifications || [],
  };

  projectStore.set(id, project);
  persistStore(projectStore);
  notify();
  return project;
}

export function updateProject(id: string, updates: Partial<Project>): Project | undefined {
  const existing = projectStore.get(id);
  if (!existing) return undefined;

  const updated: Project = {
    ...existing,
    ...updates,
    id: existing.id, // prevent id change
    updatedAt: new Date().toISOString(),
    branding: updates.branding
      ? { ...existing.branding, ...updates.branding }
      : existing.branding,
  };

  projectStore.set(id, updated);
  persistStore(projectStore);
  notify();
  return updated;
}

export function duplicateProject(id: string): Project | undefined {
  const source = projectStore.get(id);
  if (!source) return undefined;

  const newId = generateId();
  const now = new Date().toISOString();

  const duplicate: Project = {
    ...JSON.parse(JSON.stringify(source)),
    id: newId,
    slug: `${source.slug}-copy-${newId.slice(0, 4)}`,
    name: `${source.name} (สำเนา)`,
    status: 'draft' as const,
    createdAt: now,
    updatedAt: now,
  };

  // Regenerate all nested IDs
  duplicate.sections = duplicate.sections.map((s: typeof duplicate.sections[0]) => ({
    ...s,
    id: generateId(),
  }));
  duplicate.beforeAfterSets = duplicate.beforeAfterSets.map((s: typeof duplicate.beforeAfterSets[0]) => ({
    ...s,
    id: generateId(),
  }));
  duplicate.installationViews = duplicate.installationViews.map((s: typeof duplicate.installationViews[0]) => ({
    ...s,
    id: generateId(),
  }));
  duplicate.videos = duplicate.videos.map((s: typeof duplicate.videos[0]) => ({
    ...s,
    id: generateId(),
  }));
  duplicate.specifications = duplicate.specifications.map((s: typeof duplicate.specifications[0]) => ({
    ...s,
    id: generateId(),
  }));

  projectStore.set(newId, duplicate);
  persistStore(projectStore);
  notify();
  return duplicate;
}

export function deleteProject(id: string): boolean {
  const deleted = projectStore.delete(id);
  if (deleted) {
    persistStore(projectStore);
    notify();
  }
  return deleted;
}

export function publishProject(id: string): Project | undefined {
  return updateProject(id, { status: 'published' });
}

export function unpublishProject(id: string): Project | undefined {
  return updateProject(id, { status: 'draft' });
}

export function archiveProject(id: string): Project | undefined {
  return updateProject(id, { status: 'archived' });
}

/** Reset store to demo data (for development) */
export function resetStore(): void {
  projectStore = new Map<string, Project>();
  projectStore.set(royalDProject.id, royalDProject);
  persistStore(projectStore);
  notify();
}
