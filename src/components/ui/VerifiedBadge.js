import { BadgeCheck } from "lucide-react";

export default function VerifiedBadge({ className = "", compact = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200/80 sm:text-[11px] ${className}`}
    >
      <BadgeCheck className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2.25} aria-hidden />
      {compact ? "Verified" : "Verified partner"}
    </span>
  );
}
