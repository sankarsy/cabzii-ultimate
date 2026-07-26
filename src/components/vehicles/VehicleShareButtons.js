"use client";

import { Link2, MessageCircle, Share2 } from "lucide-react";
import { toast } from "react-toastify";
import { catalogPublicPath } from "../../lib/catalogProduct";

export default function VehicleShareButtons({ cab }) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}${catalogPublicPath(cab, "/cabs")}`
      : catalogPublicPath(cab, "/cabs");
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

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-slate-500">Share</span>
      <button type="button" onClick={copyLink} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50">
        <Link2 className="h-3.5 w-3.5 text-sky-400" /> Copy link
      </button>
      <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-100">
        <MessageCircle className="h-3.5 w-3.5 text-emerald-400" /> WhatsApp
      </a>
      {typeof navigator !== "undefined" && navigator.share ? (
        <button
          type="button"
          onClick={() => navigator.share({ title: text, url }).catch(() => {})}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
        >
          <Share2 className="h-3.5 w-3.5 text-sky-400" /> Share
        </button>
      ) : null}
    </div>
  );
}
