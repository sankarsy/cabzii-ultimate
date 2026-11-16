import Link from "next/link";

/** Shared homepage section title — title left, actions / view-all right. */
export default function HomeSectionHeader({
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel = "View all →",
  actions,
  className = ""
}) {
  return (
    <div className={`mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4 ${className}`}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--cabzii-brand)]">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 text-[1.25rem] font-extrabold tracking-tight text-[var(--cabzii-ink)] sm:text-[1.65rem]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--cabzii-muted)]">{subtitle}</p>
        ) : null}
      </div>
      {href || actions ? (
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          {href ? (
            <Link href={href} className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
              {linkLabel}
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
