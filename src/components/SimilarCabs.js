"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MmtCabResultCard from "./mmt/MmtCabResultCard";

export default function SimilarCabs({ currentCabId, cabSlug, cabType, vendor }) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = cabSlug || currentCabId;
    if (!key) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/cabs/related/${encodeURIComponent(key)}?limit=6`, { cache: "no-store" });
        const json = await res.json();
        let list = Array.isArray(json?.data) ? json.data : [];
        if (!list.length && cabType) {
          const fallback = await fetch(`/api/cabs?type=${encodeURIComponent(cabType)}&limit=8`, { cache: "no-store" });
          const fbJson = await fallback.json();
          list = Array.isArray(fbJson?.data) ? fbJson.data : [];
        }
        const filtered = list
          .filter((c) => String(c._id ?? c.id) !== String(currentCabId))
          .slice(0, 4);
        if (!cancelled) setSimilar(filtered);
      } catch {
        if (!cancelled) setSimilar([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cabSlug, currentCabId, cabType]);

  if (!loading && similar.length === 0) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xs font-semibold text-slate-900 sm:text-sm">Similar packages</h2>
          <p className="mt-0.5 text-[11px] text-slate-600 sm:text-xs">
            More {cabType || "cab"} options you can book next.
          </p>
        </div>
        <Link href="/cabs" className="text-[11px] font-semibold text-[#0056D2] hover:underline sm:text-xs">
          View all cabs →
        </Link>
      </div>

      {loading ? (
        <p className="mt-2.5 text-[11px] text-slate-500">Loading similar packages…</p>
      ) : (
        <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {similar.map((cab) => (
            <MmtCabResultCard key={String(cab._id ?? cab.id)} cab={cab} layout="card" catalogMode displayCity={cab.city} />
          ))}
        </div>
      )}
    </section>
  );
}
