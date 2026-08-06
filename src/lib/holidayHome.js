import { serviceFallbackPath } from "./dynamicImageSeo";
import { packageDisplayPrice } from "./tourPackagePricing";

export { packageDisplayPrice } from "./tourPackagePricing";

/** Match homepage destination tiles to catalog packages */
export const DOMESTIC_DESTINATION_MATCHERS = [
  { slug: "tirupati", label: "Tirupati", nameIncludes: "Tirupati", cityMatch: "Tirupati" },
  { slug: "goa", label: "Goa", nameIncludes: "Goa", cityMatch: "Goa" },
  { slug: "kerala", label: "Kerala", nameIncludes: "Kerala", cityMatch: "Kochi" },
  { slug: "rajasthan", label: "Rajasthan", nameIncludes: "Rajasthan", cityMatch: "Jaipur" },
  { slug: "rameswaram", label: "Rameswaram", nameIncludes: "Rameswaram", cityMatch: "Rameswaram" },
  { slug: "manali", label: "Manali", nameIncludes: "Manali", cityMatch: "Manali" }
];

/**
 * Local theme covers — replace files under /public/images/holiday-themes/ or package.image from admin.
 * No hardcoded CDN product photos.
 */
export const DOMESTIC_DESTINATION_IMAGES = {
  tirupati: "/images/holiday-themes/pilgrimage.svg",
  goa: "/images/holiday-themes/beach.svg",
  kerala: "/images/holiday-themes/beach.svg",
  rajasthan: "/images/holiday-themes/safari.svg",
  rameswaram: "/images/holiday-themes/pilgrimage.svg",
  manali: "/images/holiday-themes/family.svg",
  default: serviceFallbackPath("holiday")
};

export const HOLIDAY_THEMES = [
  { id: "beach", title: "Beach", iconKey: "beach", category: "beach" },
  { id: "pilgrimage", title: "Pilgrimage", iconKey: "pilgrimage", category: "pilgrimage" },
  { id: "safari", title: "Safari Trails", iconKey: "safari", category: "adventure" },
  { id: "family", title: "Family Retreat", iconKey: "family", category: "family" },
  { id: "luxury", title: "Luxury", iconKey: "luxury", category: "honeymoon" }
];

export function themeHref(theme) {
  if (theme?.category) return `/holidays?category=${encodeURIComponent(theme.category)}`;
  return "/holidays";
}

export function findPackage(packages, matcher = {}) {
  if (!matcher || !Array.isArray(packages)) return null;
  const list = packages.filter((p) => p && (p._id || p.id));
  return (
    list.find((p) => {
      if (matcher.nameIncludes && String(p.name || "").toLowerCase().includes(matcher.nameIncludes.toLowerCase())) {
        return true;
      }
      if (matcher.cityMatch && String(p.city || "").toLowerCase() === matcher.cityMatch.toLowerCase()) {
        return true;
      }
      if (matcher.category && p.category === matcher.category) {
        return true;
      }
      return false;
    }) || null
  );
}

/** SEO content page (slug). */
export function packageSeoHref(pkg) {
  if (!pkg) return "/holidays";
  if (pkg.slug) return `/tour-packages/${pkg.slug}`;
  const id = pkg._id || pkg.id;
  return id ? `/holidays/${id}` : "/holidays";
}

/** Booking page — prefers SEO slug (`/holidays/tirupati-…`); falls back to Mongo id. */
export function packageBookingHref(pkg) {
  if (!pkg) return "/holidays";
  const slug = pkg.slug ? String(pkg.slug).trim() : "";
  if (slug) return `/holidays/${slug}`;
  const id = pkg._id || pkg.id;
  return id ? `/holidays/${id}` : packageSeoHref(pkg);
}

/** Catalog card link — SEO landing when slug exists, else booking. */
export function packageDetailHref(pkg) {
  if (!pkg) return "/holidays";
  if (pkg.slug) return packageSeoHref(pkg);
  return packageBookingHref(pkg);
}

export function buildDomesticDestinations(packages) {
  return DOMESTIC_DESTINATION_MATCHERS.map((matcher) => {
    const pkg = findPackage(packages, matcher);
    const cover = DOMESTIC_DESTINATION_IMAGES[matcher.slug] || DOMESTIC_DESTINATION_IMAGES.tirupati;
    return {
      slug: matcher.slug,
      name: matcher.label,
      priceFrom: pkg ? packageDisplayPrice(pkg) : 0,
      image: pkg?.image || cover,
      fallbackImage: cover,
      href: pkg ? packageDetailHref(pkg) : `/holidays?category=pilgrimage`,
      packageName: pkg?.name || null
    };
  });
}
