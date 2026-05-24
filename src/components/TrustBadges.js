"use client";

export const EMOJI_BY_KEY = {
  verified: "✅",
  price: "💰",
  support: "🎧",
  secure: "🔒",
  cancel: "🔄"
};

const FALLBACK_TRUST_BADGES = [
  { label: "Verified Drivers", iconKey: "verified", icon: "✅" },
  { label: "Best Price", iconKey: "price", icon: "💰" },
  { label: "24/7 Support", iconKey: "support", icon: "🎧" },
  { label: "Secure", iconKey: "secure", icon: "🔒" },
  { label: "Free Cancellation", iconKey: "cancel", icon: "🔄" }
];

const LABEL_ICON_MAP = {
  "verified drivers": "verified",
  "best price": "price",
  "24/7 support": "support",
  secure: "secure",
  "free cancellation": "cancel"
};

export function normalizeTrustBadges(raw) {
  if (!Array.isArray(raw) || !raw.length) return FALLBACK_TRUST_BADGES;

  return raw.map((item) => {
    if (typeof item === "string") {
      const iconKey = LABEL_ICON_MAP[item.trim().toLowerCase()] || "verified";
      return { label: item, iconKey, icon: EMOJI_BY_KEY[iconKey] };
    }
    const iconKey = item.iconKey || LABEL_ICON_MAP[(item.label || "").trim().toLowerCase()] || "verified";
    return {
      label: item.label || "",
      iconKey,
      icon: item.icon || EMOJI_BY_KEY[iconKey] || "✅"
    };
  });
}

export default function TrustBadges({ badges }) {
  const items = normalizeTrustBadges(badges);

  return (
    <div
      className="flex flex-wrap items-center justify-start gap-x-0.5 gap-y-1 overflow-x-auto border-t border-slate-100 px-2 py-2 scrollbar-hide"
      aria-label="Trust highlights"
    >
      {items.map((badge) => (
        <span
          key={`${badge.label}-${badge.iconKey}`}
          className="flex min-w-fit items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#0056D2] transition hover:bg-blue-50/80"
        >
          <span className="text-sm leading-none" aria-hidden="true">
            {badge.icon}
          </span>
          {badge.label}
        </span>
      ))}
    </div>
  );
}
