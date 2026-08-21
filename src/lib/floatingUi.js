/** Routes where floating widgets (chat, call FAB, sticky bar) should hide entirely. */
export const FLOATING_UI_HIDDEN_PREFIXES = [
  "/admin",
  "/driver",
  "/payment",
  "/login",
  "/cabs/passenger",
  "/drivers/passenger"
];

/** Known list / utility paths under catalog segments — not detail pages. */
const CATALOG_LIST_SEGMENTS = new Set(["passenger", "results"]);

/**
 * Product detail pages (cab/driver/holiday) use their own sticky booking bar on mobile.
 */
export function isCatalogDetailPage(pathname) {
  if (!pathname) return false;
  const cabDriver = pathname.match(/^\/(cabs|drivers)\/([^/]+)$/);
  if (cabDriver && !CATALOG_LIST_SEGMENTS.has(cabDriver[2])) return true;
  if (/^\/tour-packages\/[^/]+$/.test(pathname)) return true;
  if (/^\/holidays\/[^/]+$/.test(pathname)) return true;
  if (pathname.startsWith("/call-driver/book")) return true;
  return false;
}

export function shouldHideFloatingUi(pathname) {
  if (!pathname) return false;
  return FLOATING_UI_HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Global mobile sticky bar — hidden on detail pages that provide their own CTA bar. */
export function shouldHideStickyBookingBar(pathname) {
  return shouldHideFloatingUi(pathname) || isCatalogDetailPage(pathname);
}
