import Image from "next/image";
import Link from "next/link";
import { Copy } from "lucide-react";
import { getOfferIcon } from "../icons/heroIcons";

export default function ShowcaseCard({ card: o, section = "offers", layout = "carousel" }) {
  const OfferIcon = getOfferIcon(o.iconKey);
  const layoutClass =
    layout === "grid"
      ? "h-full w-full"
      : "cabzii-hscroll-card shrink-0 snap-start sm:min-w-[16.25rem] sm:w-[16.25rem] sm:max-w-[18.75rem] lg:min-w-[calc(25%-0.75rem)] lg:w-[calc(25%-0.75rem)] lg:max-w-[calc(25%-0.75rem)]";

  return (
    <Link
      href={o.href || "/cabs"}
      className={`${layoutClass} group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[var(--emt-shadow-card)] transition-all duration-200 sm:hover:-translate-y-1 sm:hover:shadow-[var(--emt-shadow-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2`}
    >
      <div
        className={`relative flex min-h-[8.5rem] flex-col overflow-hidden bg-linear-to-br ${o.color || "from-[var(--cabzii-brand)] to-blue-500"} p-4 text-white`}
      >
        {o.image ? (
          <>
            <Image
              src={o.image}
              alt={o.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/45 to-slate-950/20" aria-hidden />
          </>
        ) : (
          <span
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/25 text-white ring-1 ring-white/30 backdrop-blur-sm"
            aria-hidden="true"
          >
            <OfferIcon className="h-[1.35rem] w-[1.35rem]" />
          </span>
        )}
        <div className="relative pr-12 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/95">{o.tag}</span>
          <h3 className="home-showcase-title mt-1 text-base font-extrabold leading-snug text-white!">{o.title}</h3>
        </div>
        {o.code ? (
          <button
            type="button"
            data-promo-code={o.code}
            className="relative mt-auto inline-flex items-center gap-1.5 self-start rounded border-[1.5px] border-dashed border-white/60 bg-white/20 px-2.5 py-1 text-xs font-bold tracking-wider text-white backdrop-blur-sm transition hover:bg-white/30"
            aria-label={`Copy promo code ${o.code}`}
          >
            {o.code}
            <Copy className="h-3.5 w-3.5 pointer-events-none" strokeWidth={2} aria-hidden />
          </button>
        ) : o.fare ? (
          <span className="relative mt-auto inline-flex items-center self-start rounded border-[1.5px] border-dashed border-white/60 bg-white/20 px-2.5 py-1 text-xs font-bold tracking-wider text-white backdrop-blur-sm">
            {o.fare}
          </span>
        ) : null}
      </div>

      <div className="flex min-h-[7.25rem] flex-col p-4">
        <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-600">{o.desc}</p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-[11px] font-medium text-slate-400">
            {o.validTill ? `Valid Till : ${o.validTill}` : "Instant confirmation"}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-extrabold tracking-wide text-slate-900 transition group-hover:text-[var(--cabzii-cta)]">
            BOOK NOW
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
