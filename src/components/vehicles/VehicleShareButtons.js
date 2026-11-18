"use client";

import { Link2, MessageCircle, Share2 } from "../icons/rscIcons";
import { toast } from "react-toastify";
import { cabBookingPath } from "../../lib/catalogProduct";

export default function VehicleShareButtons({ cab, compact = false, variant = "pills" }) {
  const path = cabBookingPath(cab);
  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
  const text = `Book ${cab?.vehicleName || cab?.title || "cab"} on Cabzii`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const wa = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  if (variant === "icon") {
    const iconBtn =
      "cabzii-tap inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-[var(--cabzii-brand)]";
    return (
      <div className="flex items-center gap-2">
        <button type="button" onClick={copyLink} className={iconBtn} aria-label="Copy link">
          <Link2 className="h-4 w-4" />
        </button>
        <a href={wa} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="Share on WhatsApp">
          <MessageCircle className="h-4 w-4 text-emerald-600" />
        </a>
        {canNativeShare ? (
          <button
            type="button"
            onClick={() => navigator.share({ title: text, url }).catch(() => {})}
            className={iconBtn}
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    );
  }

  const btn =
    "inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 sm:gap-1.5 sm:rounded-lg sm:px-2.5 sm:py-1.5 sm:text-xs";

  return (
    <div className={`flex flex-wrap items-center ${compact ? "gap-1.5" : "gap-2"}`}>
      {!compact ? <span className="text-[10px] font-semibold text-slate-500 sm:text-xs">Share</span> : null}
      <button type="button" onClick={copyLink} className={btn}>
        <Link2 className="h-3 w-3 text-sky-500 sm:h-3.5 sm:w-3.5" /> Copy
      </button>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={`${btn} border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}>
        <MessageCircle className="h-3 w-3 text-emerald-500 sm:h-3.5 sm:w-3.5" /> WhatsApp
      </a>
      {canNativeShare ? (
        <button
          type="button"
          onClick={() => navigator.share({ title: text, url }).catch(() => {})}
          className={btn}
          aria-label="Share"
        >
          <Share2 className="h-3 w-3 text-sky-500 sm:h-3.5 sm:w-3.5" />
        </button>
      ) : null}
    </div>
  );
}
