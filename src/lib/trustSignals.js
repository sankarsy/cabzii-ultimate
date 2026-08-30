/**
 * Homepage trust copy — only claims Cabzii can currently support.
 * OTP is not listed: login OTP exists but is not a guaranteed customer experience.
 * Invented counts (50K+, 4.9/5) are not listed — see siteStats.js.
 */

export const TRUST_SIGNALS = [
  { label: "Customer reviews", iconKey: "rated", href: "/testimonials" },
  { label: "Partner vehicles", iconKey: "verified" },
  { label: "Upfront fares", iconKey: "price" },
  { label: "WhatsApp updates", iconKey: "support" }
];

export function looksLikeInventedCount(value) {
  const v = String(value || "").trim();
  if (!v) return false;
  if (/^\d+(\.\d+)?\s*k\+?$/i.test(v)) return true;
  if (/^\d{1,3}(?:,\d{3})+\+?$/.test(v)) return true;
  if (/^[1-5]\.\d\s*\/\s*5$/.test(v)) return true;
  const compact = v.replace(/\s/g, "");
  const digits = Number(compact.replace(/[^\d]/g, ""));
  if (/^\d{3,}\+?$/.test(compact) && digits >= 150) return true;
  return false;
}

export function isOtpGuaranteeClaim(...parts) {
  return parts.some((part) => /\botp\b/i.test(String(part || "")));
}

export function isUnsupportedTrustCopy(...parts) {
  return parts.some((part) => {
    const t = String(part || "");
    if (looksLikeInventedCount(t) || isOtpGuaranteeClaim(t)) return true;
    if (/24\s*[×x/]\s*7/i.test(t) || /\b24\/7\b/i.test(t)) return true;
    return false;
  });
}
