const FACEBOOK_DEFAULT = "https://www.facebook.com/cabzii.in";
const INSTAGRAM_DEFAULT = "https://www.instagram.com/cabzii.in/";

/**
 * Ensure social URLs always open as absolute external links.
 * Handles env values like "www.facebook.com/cabzii.in" or bare "cabzii.in"
 * that would otherwise resolve relative to cabzii.in.
 */
export function normalizeSocialUrl(value, fallback) {
  const raw = String(value || "").trim();
  if (!raw) return fallback;

  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;

  const withoutLeadingSlashes = raw.replace(/^\/+/, "");

  if (/^(?:www\.)?(facebook|fb)\.com(?:\/|$)/i.test(withoutLeadingSlashes)) {
    return `https://${withoutLeadingSlashes}`;
  }

  if (/^(?:www\.)?instagram\.com(?:\/|$)/i.test(withoutLeadingSlashes)) {
    return `https://${withoutLeadingSlashes}`;
  }

  const fallbackUrl = new URL(fallback);
  const slug = withoutLeadingSlashes.replace(/^@/, "").replace(/\/+$/, "");
  return `${fallbackUrl.origin}/${slug}`;
}

/** Official Cabzii social profiles — used in footer, schema sameAs, etc. */
export const SOCIAL_LINKS = {
  instagram: {
    label: "Instagram",
    handle: "@cabzii.in",
    href: normalizeSocialUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL, INSTAGRAM_DEFAULT)
  },
  facebook: {
    label: "Facebook",
    handle: "Facebook",
    href: normalizeSocialUrl(process.env.NEXT_PUBLIC_FACEBOOK_URL, FACEBOOK_DEFAULT)
  }
};

export const SOCIAL_LINK_LIST = [SOCIAL_LINKS.instagram, SOCIAL_LINKS.facebook];
