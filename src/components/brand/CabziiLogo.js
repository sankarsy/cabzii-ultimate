import { BRAND } from "../../lib/brand";

/**
 * Cabzii.in wordmark — red "cab" + orange "zii", optional .in suffix.
 * @param {{ className?: string, compact?: boolean, onDark?: boolean, showDomain?: boolean }} props
 */
export default function CabziiLogo({ className = "", compact = false, onDark = false, showDomain = true }) {
  const cabClass = onDark ? "text-[var(--cabzii-red)]" : "text-[var(--cabzii-red)]";
  const ziiClass = onDark ? "text-[var(--cabzii-orange)]" : "text-[var(--cabzii-orange)]";
  const domainClass = onDark ? "text-white/70" : "text-slate-500";

  if (compact) {
    return (
      <span className={`inline-flex items-center font-extrabold tracking-tight ${className}`} aria-label={BRAND.fullName}>
        <span className={cabClass}>cab</span>
        <span className={ziiClass}>zii</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex select-none items-baseline gap-0.5 font-extrabold tracking-tight ${compact ? "text-lg" : "text-2xl"} ${className}`}
      aria-label={BRAND.fullName}
    >
      <span className={cabClass}>cab</span>
      <span className={ziiClass}>zii</span>
      {showDomain ? (
        <span className={`ml-0.5 text-sm font-bold ${domainClass}`}>.in</span>
      ) : null}
    </span>
  );
}
