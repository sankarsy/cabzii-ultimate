import { BRAND } from "../../lib/brand";

function SloganTagline({ onDark, compact }) {
  const sizeClass = compact ? "text-[8px]" : "text-[9px] sm:text-[10px]";
  const bookColor = onDark ? "text-[#FF9933]" : "text-[var(--cabzii-orange)]";
  const rideColor = onDark ? "text-sky-100" : "text-[var(--cabzii-brand)]";
  const exploreColor = onDark ? "text-emerald-400" : "text-[#138808]";

  return (
    <span className={`mt-1 inline-flex items-center gap-1.5 sm:mt-1.5 sm:gap-2 ${sizeClass}`}>
      <span className="h-px w-3 shrink-0 bg-[#FF9933] sm:w-4" aria-hidden />
      <span className="whitespace-nowrap font-medium italic tracking-wide">
        <span className={bookColor}>Book.</span>{" "}
        <span className={rideColor}>Ride.</span>{" "}
        <span className={exploreColor}>Explore.</span>
      </span>
      <span className="h-px w-3 shrink-0 bg-[#138808] sm:w-4" aria-hidden />
    </span>
  );
}

/**
 * Cabzii.in wordmark — EaseMyTrip-style layout (no icon).
 * Blue brand name · italic .in · optional “Book. Ride. Explore.” tagline with tricolor accents.
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
  /* Navy header: bright blue wordmark; light footer: brand blue */
  const nameColor = onDark ? "text-[#7ec4ff]" : "text-[var(--cabzii-brand)]";
  const domainColor = onDark ? "text-white/70" : "text-slate-800";

  return (
    <span
      className={`inline-flex select-none flex-col leading-none ${className}`}
      aria-label={BRAND.fullName}
    >
      <span className={`inline-flex items-baseline whitespace-nowrap font-bold tracking-tight ${sizeClass}`}>
        <span className={nameColor}>Cabzii</span>
        {showDomain ? (
          <span
            className={`ml-px font-serif text-[0.42em] font-normal italic leading-none ${domainColor}`}
            aria-hidden
          >
            .in
          </span>
        ) : null}
      </span>

      {showTagline ? <SloganTagline onDark={onDark} compact={compact} /> : null}
    </span>
  );
}
