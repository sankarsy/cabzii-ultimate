import { BRAND } from "../../lib/brand";

function SloganTagline({ onDark, compact }) {
  const sizeClass = compact ? "text-[8px]" : "text-[9px] sm:text-[10px]";
  const bookColor = onDark ? "text-[#FF9933]" : "text-[var(--cabzii-orange)]";
  const rideColor = onDark ? "text-sky-100" : "text-[var(--cabzii-brand)]";
  const exploreColor = onDark ? "text-emerald-400" : "text-[#138808]";

  return (
    <span className={`mt-1 inline-flex items-center sm:mt-1.5 ${sizeClass}`}>
      <span className="whitespace-nowrap font-medium not-italic lowercase tracking-wide">
        <span className={bookColor}>book.</span>{" "}
        <span className={rideColor}>ride.</span>{" "}
        <span className={exploreColor}>explore.</span>
      </span>
    </span>
  );
}

/**
 * cabzii.in wordmark — lowercase, Cabzii orange.
 */
export default function CabziiLogo({
  className = "",
  compact = false,
  onDark = false,
  showDomain = true,
  showTagline = false,
  /** @deprecated Icon removed — kept for API compatibility */
  showIcon = false
}) {
  void showIcon;

  const sizeClass = compact ? "text-lg" : "text-xl sm:text-2xl lg:text-[1.65rem]";
  const nameColor = onDark ? "text-orange-300" : "text-[var(--cabzii-cta)]";

  return (
    <span
      className={`inline-flex select-none flex-col leading-none ${className}`}
      aria-label={BRAND.fullName}
    >
      <span
        className={`inline-flex items-baseline whitespace-nowrap font-bold lowercase tracking-tight ${sizeClass} ${nameColor}`}
      >
        <span>cabzii</span>
        {showDomain ? <span>.in</span> : null}
      </span>

      {showTagline ? <SloganTagline onDark={onDark} compact={compact} /> : null}
    </span>
  );
}
