import { TRUST_COUNTERS, WHY_STATS } from "./marketingStats";

const DEFAULT_WHY_FEATURES = [
  { iconKey: "verified", title: "Verified partners", desc: "Background-checked drivers and trusted cab vendors across South India." },
  { iconKey: "price", title: "Best price guarantee", desc: "Compare fares side-by-side before you pay — no hidden charges." },
  { iconKey: "secure", title: "Secure checkout", desc: "OTP-verified booking with encrypted payment on cabzii.in." },
  { iconKey: "support", title: "24×7 support", desc: "WhatsApp and phone support before, during, and after your trip." }
];

const DEFAULT_WHY_SECTION = {
  eyebrow: "Why Cabzii",
  title: "A premium cab booking experience",
  subtitle: "Trusted by riders for airport transfers, outstation trips, and local hire across Chennai and 20+ cities."
};

const WHY_ICON_MAP = {
  shield: "verified",
  tracking: "support",
  tag: "price",
  headset: "support",
  pickup: "verified",
  lock: "secure",
  verified: "verified",
  price: "price",
  secure: "secure",
  support: "support"
};

const HERO_ICON_TO_TRUST = {
  users: "rated",
  car: "trips",
  driver: "verified",
  pin: "locations",
  star: "rated"
};

const COUNTER_STYLES = {
  rated: { color: "text-amber-500", bg: "bg-amber-50" },
  trips: { color: "text-[var(--cabzii-brand)]", bg: "bg-blue-50" },
  verified: { color: "text-emerald-600", bg: "bg-emerald-50" },
  locations: { color: "text-violet-600", bg: "bg-violet-50" }
};

/** Parse admin stat strings like "50K+", "150+", "4.9/5" for display or count-up. */
export function parseStatValue(raw) {
  const text = String(raw || "").trim();
  if (!text) return { animate: false, display: "", numeric: 0, suffix: "" };

  const kMatch = text.match(/^([\d,.]+)\s*K\+?$/i);
  if (kMatch) {
    const numeric = Math.round(parseFloat(kMatch[1].replace(/,/g, "")) * 1000);
    return { animate: true, display: text, numeric, suffix: "+" };
  }

  const plainNum = text.match(/^([\d,]+)(\+?)$/);
  if (plainNum && !text.includes("/")) {
    return {
      animate: true,
      display: text,
      numeric: parseInt(plainNum[1].replace(/,/g, ""), 10),
      suffix: plainNum[2] || ""
    };
  }

  return { animate: false, display: text, numeric: 0, suffix: "" };
}

export function resolveWhyStats(settings) {
  if (Array.isArray(settings?.whyStats) && settings.whyStats.length) {
    return settings.whyStats.map(({ value, label }) => ({
      value: String(value ?? ""),
      label: String(label ?? "")
    }));
  }
  return WHY_STATS;
}

export function resolveWhySection(settings) {
  const section = settings?.whySection || {};
  return {
    eyebrow: section.eyebrow || DEFAULT_WHY_SECTION.eyebrow,
    title: section.title || DEFAULT_WHY_SECTION.title,
    subtitle: section.subtitle || DEFAULT_WHY_SECTION.subtitle
  };
}

export function resolveWhyFeatures(settings) {
  if (Array.isArray(settings?.whyChooseUs) && settings.whyChooseUs.length) {
    return settings.whyChooseUs.slice(0, 4).map((item) => ({
      iconKey: WHY_ICON_MAP[item.iconKey] || item.iconKey || "verified",
      title: item.title || "",
      desc: item.subtitle || ""
    }));
  }
  return DEFAULT_WHY_FEATURES;
}

/** Animated trust counters — reads admin Hero stats when available. */
export function resolveTrustCounters(settings) {
  const stats = Array.isArray(settings?.heroStats) ? settings.heroStats : null;
  if (!stats?.length) return TRUST_COUNTERS;

  return stats.slice(0, 4).map((stat, index) => {
    const parsed = parseStatValue(stat.value);
    const iconKey = HERO_ICON_TO_TRUST[stat.iconKey] || TRUST_COUNTERS[index]?.iconKey || "verified";
    const style = COUNTER_STYLES[iconKey] || COUNTER_STYLES.verified;

    return {
      label: stat.label || TRUST_COUNTERS[index]?.label || "",
      value: parsed.animate ? parsed.numeric : 0,
      display: parsed.animate ? null : parsed.display,
      suffix: parsed.suffix,
      iconKey,
      color: style.color,
      bg: style.bg,
      animate: parsed.animate
    };
  });
}
