import { useSyncExternalStore, useCallback } from 'react';
import {
  subscribe,
  getAllProjects,
  getProjectSummaries,
  getProjectById,
  getProjectBySlug,
  getPublishedProjectBySlug,
  createProject,
  updateProject,
  duplicateProject,
  deleteProject,
  publishProject,
  unpublishProject,
  archiveProject,
} from '../store/projectStore';
import type { Project, ProjectSummary } from '../types';

// ===== Snapshot functions =====
function getProjectsSnapshot(): Project[] {
  return getAllProjects();
}

function getSummariesSnapshot(): ProjectSummary[] {
  return getProjectSummaries();
}

// ===== Hooks =====

export function useProjects(): Project[] {
  return useSyncExternalStore(subscribe, getProjectsSnapshot);
}

export function useProjectSummaries(): ProjectSummary[] {
  return useSyncExternalStore(subscribe, getSummariesSnapshot);
}

export function useProject(id: string): Project | undefined {
  const getSnapshot = useCallback(() => getProjectById(id), [id]);
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function useProjectBySlug(slug: string): Project | undefined {
  const getSnapshot = useCallback(() => getProjectBySlug(slug), [slug]);
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function usePublishedProject(slug: string): Project | undefined {
  const getSnapshot = useCallback(() => getPublishedProjectBySlug(slug), [slug]);
  return useSyncExternalStore(subscribe, getSnapshot);
}

// ===== Action hooks =====
export function useProjectActions() {
  return {
    createProject,
    updateProject,
    duplicateProject,
    deleteProject,
    publishProject,
    unpublishProject,
    archiveProject,
  };
}
