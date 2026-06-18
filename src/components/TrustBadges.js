"use client";

import { getTrustIcon, TRUST_ICON_STYLES } from "./icons/heroIcons";

const FALLBACK_TRUST_BADGES = [
  { label: "Verified Drivers", iconKey: "verified" },
  { label: "Best Price", iconKey: "price" },
  { label: "24/7 Support", iconKey: "support" },
  { label: "Secure", iconKey: "secure" },
  { label: "Free Cancellation", iconKey: "cancel" }
];

const LABEL_ICON_MAP = {
  "verified drivers": "verified",
  "best price": "price",
  "24/7 support": "support",
  secure: "secure",
  "free cancellation": "cancel"
};

/** @deprecated Admin preview only — UI uses SVG icons */
export const EMOJI_BY_KEY = {
  verified: "✓",
  price: "₹",
  support: "☎",
  secure: "🔒",
  cancel: "↺"
};

export function normalizeTrustBadges(raw) {
  if (!Array.isArray(raw) || !raw.length) return FALLBACK_TRUST_BADGES;

  return raw.map((item) => {
    if (typeof item === "string") {
      const iconKey = LABEL_ICON_MAP[item.trim().toLowerCase()] || "verified";
      return { label: item, iconKey };
    }
    const iconKey = item.iconKey || LABEL_ICON_MAP[(item.label || "").trim().toLowerCase()] || "verified";
    return {
      label: item.label || "",
      iconKey
    };
  });
}

export default function TrustBadges({ badges }) {
  const items = normalizeTrustBadges(badges);

  return (
    <div
      className="scroll-x-touch flex flex-wrap items-center justify-start gap-x-1 gap-y-1 overflow-x-auto border-t border-slate-100 px-2 py-2 scrollbar-hide"
      aria-label="Trust highlights"
    >
      {items.map((badge) => {
        const Icon = getTrustIcon(badge.iconKey);
        const style = TRUST_ICON_STYLES[badge.iconKey] || TRUST_ICON_STYLES.verified;
        return (
          <span
            key={`${badge.label}-${badge.iconKey}`}
            className="flex min-w-fit items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 sm:px-3 sm:py-2"
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${style.iconBg} ${style.iconColor}`}
              aria-hidden="true"
            >
              <Icon className="h-4 w-4" />
            </span>
            {badge.label}
          </span>
        );
      })}
    </div>
  );
}
