import Image from "next/image";
import { BRAND } from "../../lib/brand";
import { BRAND_APPLE_TOUCH } from "../../lib/brandAssets";

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

  const wordmark = (
    <>
      <span className={cabClass}>cab</span>
      <span className={ziiClass}>zii</span>
      {!compact && showDomain ? (
        <span className={`ml-0.5 text-sm font-bold ${domainClass}`}>.in</span>
      ) : null}
    </>
  );

  return (
    <span
      className={`inline-flex select-none items-center gap-2 font-extrabold tracking-tight ${compact ? "text-lg" : "text-2xl"} ${className}`}
      aria-label={BRAND.fullName}
    >
      {showIcon ? (
        <Image
          src={BRAND_APPLE_TOUCH}
          alt=""
          width={iconSize}
          height={iconSize}
          className="shrink-0 rounded-lg"
          priority
        />
      ) : null}
      {wordmark}
    </span>
  );
}
