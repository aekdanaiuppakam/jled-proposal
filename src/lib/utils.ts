// ===== Utility Helpers =====

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function getProjectUrl(slug: string): string {
  return `${window.location.origin}/p/${slug}`;
}

/** Applies project branding CSS variables to document root */
export function applyBranding(primaryColor: string, secondaryColor?: string): void {
  const root = document.documentElement;
  root.style.setProperty('--accent-color', primaryColor);

  // Derive hover/light/muted variants
  root.style.setProperty('--accent-color-hover', adjustBrightness(primaryColor, -20));
  root.style.setProperty('--accent-color-light', adjustBrightness(primaryColor, 30));
  root.style.setProperty(
    '--accent-color-muted',
    hexToRgba(primaryColor, 0.15)
  );

  if (secondaryColor) {
    root.style.setProperty('--secondary-color', secondaryColor);
  }
}

/** Reset branding to defaults */
export function resetBranding(): void {
  const root = document.documentElement;
  root.style.setProperty('--accent-color', '#10B981');
  root.style.setProperty('--accent-color-hover', '#059669');
  root.style.setProperty('--accent-color-light', '#34D399');
  root.style.setProperty('--accent-color-muted', 'rgba(16, 185, 129, 0.15)');
  root.style.removeProperty('--secondary-color');
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function adjustBrightness(hex: string, amount: number): string {
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
