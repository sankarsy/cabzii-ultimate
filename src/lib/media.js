const BACKEND_BASE =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL)) ||
  "https://api.cabzii.in";

/** Public API origin used for uploaded files in the browser. */
export function getMediaBackendBase() {
  return String(BACKEND_BASE || "https://api.cabzii.in").replace(/\/$/, "");
}

/** Normalize stored paths to `/uploads/...` */
export function normalizeStoredImagePath(path) {
  if (path == null) return "";
  const trimmed = String(path).trim();
  if (!trimmed) return "";

  const uploadMatch = trimmed.match(/\/uploads\/([^?#]+)/i);
  if (uploadMatch) return `/uploads/${uploadMatch[1]}`;

  if (trimmed.startsWith("uploads/")) return `/${trimmed}`;
  return trimmed;
}

/** Turn stored image paths into a browser-loadable URL. */
export function resolveMediaUrl(path) {
  if (path == null) return "";
  const trimmed = String(path).trim();
  if (!trimmed) return "";

  const normalized = normalizeStoredImagePath(trimmed);
  const base = getMediaBackendBase();

  if (normalized.startsWith("/uploads/")) {
    return `${base}${normalized}`;
  }

  if (/^https?:\/\//i.test(normalized)) return normalized;

  if (normalized.startsWith("/")) return `${base}${normalized}`;
  if (normalized.startsWith("uploads/")) return `${base}/${normalized}`;
  return normalized;
}

export function normalizeGalleryPaths(gallery) {
  if (!Array.isArray(gallery)) {
    return String(gallery || "")
      .split(",")
      .map((g) => normalizeStoredImagePath(g.trim()))
      .filter(Boolean);
  }
  return gallery.map((g) => normalizeStoredImagePath(g)).filter(Boolean);
}
