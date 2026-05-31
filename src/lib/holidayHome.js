import { num, packageYouPay } from "./cabFare";

/** Match homepage destination tiles to catalog packages */
export const DOMESTIC_DESTINATION_MATCHERS = [
  { slug: "tirupati", label: "Tirupati", nameIncludes: "Tirupati", cityMatch: "Tirupati" },
  { slug: "goa", label: "Goa", nameIncludes: "Goa", cityMatch: "Goa" },
  { slug: "kerala", label: "Kerala", nameIncludes: "Kerala", cityMatch: "Kochi" },
  { slug: "rajasthan", label: "Rajasthan", nameIncludes: "Rajasthan", cityMatch: "Jaipur" },
  { slug: "rameswaram", label: "Rameswaram", nameIncludes: "Rameswaram", cityMatch: "Rameswaram" },
  { slug: "manali", label: "Manali", nameIncludes: "Manali", cityMatch: "Manali" }
];

export const INTERNATIONAL_DESTINATIONS = [
  {
    slug: "dubai",
    name: "Dubai",
    priceFrom: 24999,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&h=280&q=80",
    href: "/flights?from=DEL&to=DXB"
  },
  {
    slug: "singapore",
    name: "Singapore",
    priceFrom: 27999,
    image: "https://images.unsplash.com/photo-1525629920041-4fffe988b9a0?auto=format&fit=crop&w=400&h=280&q=80",
    href: "/flights?from=DEL&to=SIN"
  },
  {
    slug: "bangkok",
    name: "Bangkok",
    priceFrom: 18999,
    image: "https://images.unsplash.com/photo-1552465011-b40e1d7e5776?auto=format&fit=crop&w=400&h=280&q=80",
    href: "/flights?from=DEL&to=BKK"
  },
  {
    slug: "bali",
    name: "Bali",
    priceFrom: 32999,
    image: "https://images.unsplash.com/photo-1537996194471-c480c8a963b0?auto=format&fit=crop&w=400&h=280&q=80",
    href: "/holidays"
  },
  {
    slug: "maldives",
    name: "Maldives",
    priceFrom: 45999,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&h=280&q=80",
    href: "/holidays?category=honeymoon"
  },
  {
    slug: "paris",
    name: "Paris",
    priceFrom: 65999,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&h=280&q=80",
    href: "/holidays"
  }
];

export const HOLIDAY_THEMES = [
  { id: "beach", title: "Beach", emoji: "🏖️", category: "beach" },
  { id: "pilgrimage", title: "Pilgrimage", emoji: "🛕", category: "pilgrimage" },
  { id: "safari", title: "Safari Trails", emoji: "🚙", category: "adventure" },
  { id: "family", title: "Family Retreat", emoji: "👨‍👩‍👧‍👦", category: "family" },
  { id: "luxury", title: "Luxury", emoji: "💎", category: "honeymoon" }
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

export function packageDetailHref(pkg) {
  if (!pkg) return "/holidays";
  return `/holidays/${encodeURIComponent(String(pkg._id ?? pkg.id))}`;
}

export function packageDisplayPrice(pkg) {
  if (!pkg) return 0;
  const base = num(pkg.price);
  const discount = num(pkg.discountPercentage);
  return packageYouPay(base, discount);
}

export function buildDomesticDestinations(packages) {
  return DOMESTIC_DESTINATION_MATCHERS.map((matcher) => {
    const pkg = findPackage(packages, matcher);
    const fallbackImage =
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&h=280&q=80";
    return {
      slug: matcher.slug,
      name: matcher.label,
      priceFrom: pkg ? packageDisplayPrice(pkg) : 0,
      image: pkg?.image || fallbackImage,
      href: pkg ? packageDetailHref(pkg) : `/holidays?category=pilgrimage`,
      packageName: pkg?.name || null
    };
  });
}
