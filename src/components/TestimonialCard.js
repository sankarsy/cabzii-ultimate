import { getInitials } from "../lib/avatar";
import { typo } from "../lib/typography";

export default function TestimonialCard({ item }) {
  const rating = Math.min(5, Math.max(1, Number(item.rating) || 5));
  const name = item.name || "Guest";
  const initials = getInitials(name);

  return (
    <article className="group relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="h-1 bg-[#0056D2]" />

      <div className="flex flex-1 flex-col p-4">
        <span className={`inline-flex w-fit rounded-full bg-[#0056D2]/10 px-2 py-0.5 ${typo.eyebrow}`}>
          Customer review
        </span>

        <h3 className={`mt-2 line-clamp-1 ${typo.h3}`}>{name}</h3>

        <div className="mt-1.5">
          <StarRating rating={rating} />
        </div>

        <p className={`mt-2 line-clamp-4 flex-1 ${typo.bodySm}`}>&ldquo;{item.message}&rdquo;</p>

        <div className="mt-3 flex items-center gap-2.5 border-t border-slate-100 pt-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-800">{name}</p>
            {item.location ? <p className={typo.caption}>{item.location}</p> : null}
          </div>
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            Verified
          </span>
        </div>
      </div>
    </article>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "text-amber-400" : "text-slate-200"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}
