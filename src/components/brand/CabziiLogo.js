import { BRAND } from "../../lib/brand";

function SloganTagline({ onDark, compact }) {
  const sizeClass = compact ? "text-[8px]" : "text-[9px] sm:text-[10px]";

  return (
    <span className={`mt-1 inline-flex items-center sm:mt-1.5 ${sizeClass}`}>
      <span className={`whitespace-nowrap font-medium not-italic lowercase tracking-wide ${onDark ? "text-[#b9c6ee]" : "text-[var(--cabzii-muted)]"}`}>
        book. ride. explore.
      </span>
    </span>
  );
}

/**
 * cabzii wordmark — navy + orange zii, matching the brand template.
 */
export default function CabziiLogo({
  className = "",
  compact = false,
  onDark = false,
  showDomain = true,
  showTagline = false,
  showIcon = false
}) {
  void showIcon;

  const sizeClass = compact ? "text-lg" : "text-[1.45rem] sm:text-[1.65rem] lg:text-[1.75rem]";
  const cabColor = onDark ? "text-white" : "text-[var(--cabzii-ink)]";

  return (
    <span className={`cabzii-logo inline-flex select-none flex-col leading-none ${className}`} aria-label={BRAND.fullName}>
      <span className={`inline-flex items-baseline whitespace-nowrap font-extrabold lowercase tracking-tight ${sizeClass} ${cabColor}`}>
        <span>cab</span>
        <span className="text-[var(--cabzii-cta)]">zii</span>
        {showDomain ? <span className={onDark ? "text-white/80" : "text-[var(--cabzii-muted)]"}>.in</span> : null}
      </span>
      {showTagline ? <SloganTagline onDark={onDark} compact={compact} /> : null}
    </span>
  );
}
