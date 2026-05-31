/** Merge class names (shadcn-style utility). */
export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}
