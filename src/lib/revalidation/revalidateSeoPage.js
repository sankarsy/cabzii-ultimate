import { revalidatePath } from "next/cache";
import { isSafeSeoPath } from "./paths";

/** Revalidate one public SEO path. Never invalidates the whole layout tree. */
export function revalidateSeoPage(path) {
  if (!isSafeSeoPath(path)) return false;
  revalidatePath(path);
  return true;
}

export function revalidateSeoPages(paths = []) {
  const unique = [...new Set((paths || []).filter(Boolean))];
  return unique.filter((path) => revalidateSeoPage(path));
}
