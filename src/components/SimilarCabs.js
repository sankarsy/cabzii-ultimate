"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { num } from "../lib/cabFare";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=60";

export default function SimilarCabs({ currentCabId, cabType, vendor }) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cabType) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ type: cabType, limit: "8" });
        const res = await fetch(`/api/cabs?${params}`, { cache: "no-store" });
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
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
  }, [cabType, currentCabId]);

  if (!loading && similar.length === 0) return null;

  return (
    <section id="similar-cabs" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900">Similar cabs</h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Alternative {cabType} options{cabType && vendor ? ` from other vendors` : ""}.
          </p>
        </div>
        <Link href="/cabs" className="text-xs font-semibold text-[#0056D2] hover:underline">
          View all cabs →
        </Link>
      </div>

      {loading ? (
        <p className="mt-4 text-xs text-slate-500">Loading alternatives…</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((cab) => {
            const id = String(cab._id ?? cab.id);
            const price = num(cab.price);
            const discount = num(cab.discountPercentage);
            const youPay = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
            const img = (cab.image && String(cab.image).trim()) || FALLBACK_IMAGE;
            return (
              <Link
                key={id}
                href={`/cabs/${id}`}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-[#0056D2]/40 hover:shadow-md"
              >
                <img
                  src={img}
                  alt={cab.title}
                  className="h-24 w-full object-cover transition group-hover:scale-[1.02]"
                />
                <div className="p-3">
                  <p className="text-xs font-semibold text-[#0056D2]">{cab.type}</p>
                  <h3 className="mt-0.5 line-clamp-1 text-sm font-bold text-slate-900">{cab.title}</h3>
                  <p className="text-[11px] text-slate-500">by {cab.vendor}</p>
                  <p className="mt-2 text-sm font-bold text-[#0056D2]">
                    From ₹{youPay.toLocaleString("en-IN")}
                    {discount > 0 ? (
                      <span className="ml-1 text-[10px] font-normal text-emerald-600">{discount}% OFF</span>
                    ) : null}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
