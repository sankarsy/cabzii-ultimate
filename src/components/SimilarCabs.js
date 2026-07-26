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
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900">Related vehicles</h2>
          <p className="mt-0.5 text-xs text-slate-600">
            More {cabType || "cab"} options{cabType && vendor ? " from other vendors" : ""}.
          </p>
        </div>
        <Link href="/cabs" className="text-xs font-semibold text-[#0056D2] hover:underline">View all cabs →</Link>
      </div>

      {loading ? (
        <p className="mt-4 text-xs text-slate-500">Loading related vehicles…</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {similar.map((cab) => (
            <MmtCabResultCard key={String(cab._id ?? cab.id)} cab={cab} layout="card" catalogMode displayCity={cab.city} />
          ))}
        </div>
      )}
    </section>
  );
}
