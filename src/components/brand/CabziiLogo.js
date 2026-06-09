import Image from "next/image";
import { BRAND } from "../../lib/brand";

/**
 * Cabzii.in wordmark — brand icon + red "cab" + orange "zii".
 * @param {{ className?: string, compact?: boolean, onDark?: boolean, showDomain?: boolean, showIcon?: boolean }} props
 */
export default function CabziiLogo({
  className = "",
  compact = false,
  onDark = false,
  showDomain = true,
  showIcon = true
}) {
  const cabClass = "text-[var(--cabzii-red)]";
  const ziiClass = "text-[var(--cabzii-orange)]";
  const domainClass = onDark ? "text-white/80" : "text-slate-500";

  const iconSize = compact ? 28 : 36;

  return (
    <span
      className={`inline-flex select-none items-center gap-1.5 font-extrabold leading-none tracking-tight ${compact ? "text-lg" : "text-2xl"} ${className}`}
      aria-label={BRAND.fullName}
    >
      {showIcon ? (
        <Image
          src="/icon.svg"
          alt=""
          width={iconSize}
          height={iconSize}
          className="shrink-0 rounded-lg"
          priority
        />
      ) : null}
      <span className="inline-flex items-baseline whitespace-nowrap">
        <span className={cabClass}>cab</span>
        <span className={ziiClass}>zii</span>
        {showDomain ? (
          <span className={`ml-0.5 text-sm font-bold ${domainClass}`}>.in</span>
        ) : null}
      </span>
    </span>
  );
}
