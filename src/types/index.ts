// ===== JLED Proposal Builder — Core Types =====

export type ProjectStatus = 'draft' | 'published' | 'archived';
export type PresentationTheme = 'dark' | 'light';
export type MediaType = 'image' | 'video';
export type SectionType =
  | 'hero'
  | 'before-after'
  | 'perspectives'
  | 'video-showcase'
  | 'specifications'
  | 'closing';

// ===== Project =====
export interface Project {
  id: string;
  slug: string;
  name: string;
  clientName: string;
  description: string;
  location?: string;
  installationType?: string;
  coverImage: string;
  status: ProjectStatus;
  language: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
  branding: ProjectBranding;
  sections: ProjectSection[];
  beforeAfterSets: BeforeAfterSet[];
  installationViews: InstallationView[];
  videos: ProjectVideo[];
  specifications: TechnicalSpecification[];
}

// ===== Branding =====
export interface ProjectBranding {
  primaryColor: string;
  secondaryColor?: string;
  theme: PresentationTheme;
  clientLogo?: string;
  heroImage: string;
  heroHeadline: string;
  heroSubheadline: string;
  closingHeadline?: string;
  closingDescription?: string;
  closingImage?: string;
  contactInfo?: string;
}

// ===== Sections =====
export interface ProjectSection {
  id: string;
  sectionType: SectionType;
  title: string;
  description?: string;
  sortOrder: number;
  enabled: boolean;
}

// ===== Before & After =====
export interface BeforeAfterSet {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  sortOrder: number;
}

// ===== Installation Views =====
export interface InstallationView {
  id: string;
  viewName: string;
  imageUrl: string;
  description?: string;
  sortOrder: number;
}

// ===== Videos =====
export interface ProjectVideo {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  sortOrder: number;
}

// ===== Technical Specifications =====
export interface TechnicalSpecification {
  id: string;
  fieldName: string;
  fieldValue: string;
  unit?: string;
  sortOrder: number;
}

// ===== Project Summary (list view) =====
export interface ProjectSummary {
  id: string;
  slug: string;
  name: string;
  clientName: string;
  coverImage: string;
  status: ProjectStatus;
  updatedAt: string;
  accentColor: string;
}

// ===== Editor Tab =====
export type EditorTab =
  | 'general'
  | 'branding'
  | 'before-after'
  | 'perspectives'
  | 'videos'
  | 'specifications'
  | 'sections'
  | 'preview';
