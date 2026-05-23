const BACKEND_BASE =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL)) ||
  "http://localhost:8000";

/** Turn stored image paths into a full URL the browser can load. */
export function resolveMediaUrl(path) {
  if (path == null) return "";
  const trimmed = String(path).trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = BACKEND_BASE.replace(/\/$/, "");
  if (trimmed.startsWith("/uploads/")) return `${base}${trimmed}`;
  if (trimmed.startsWith("uploads/")) return `${base}/${trimmed}`;
  if (trimmed.startsWith("/")) return `${base}${trimmed}`;
  return trimmed;
}
