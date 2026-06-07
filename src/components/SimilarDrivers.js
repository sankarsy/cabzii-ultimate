"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buildDriverFareSlabs, num } from "../lib/driverFare";
import { catalogPublicPath } from "../lib/catalogProduct";
import { resolveMediaUrl } from "../lib/media";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=60";

export default function SimilarDrivers({ currentDriverId, vendor }) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/drivers?limit=8&page=1", { cache: "no-store" });
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        const filtered = list
          .filter((d) => String(d._id ?? d.id) !== String(currentDriverId))
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
  }, [currentDriverId]);

  if (!loading && similar.length === 0) return null;

  return (
    <section id="similar-drivers" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900">Similar drivers</h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Other verified drivers{vendor ? ` from ${vendor} and partners` : " available to book"}.
          </p>
        </div>
        <Link href="/drivers" className="text-xs font-semibold text-[#0056D2] hover:underline">
          View all drivers →
        </Link>
      </div>

      {loading ? (
        <p className="mt-4 text-xs text-slate-500">Loading alternatives…</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((driver) => {
            const id = String(driver._id ?? driver.id);
            const slabs = buildDriverFareSlabs(driver);
            const fromPrice = num(slabs[0]?.list);
            const discount = num(driver.discountPercentage);
            const youPay = discount > 0 ? Math.round(fromPrice * (1 - discount / 100)) : fromPrice;
            const img = resolveMediaUrl(driver.image) || FALLBACK_IMAGE;
            return (
              <Link
                key={id}
                href={catalogPublicPath(driver, "/drivers")}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-[#0056D2]/40 hover:shadow-md"
              >
                <img
                  src={img}
                  alt={driver.name}
                  className="h-24 w-full object-cover transition group-hover:scale-[1.02]"
                />
                <div className="p-3">
                  <p className="text-xs font-semibold text-[#0056D2]">Driver</p>
                  <h3 className="mt-0.5 line-clamp-1 text-sm font-bold text-slate-900">{driver.name}</h3>
                  <p className="text-[11px] text-slate-500">by {driver.vendor || "Cabzii"}</p>
                  <p className="mt-2 text-sm font-bold text-[#0056D2]">
                    From ₹{youPay.toLocaleString("en-IN")}
                    {discount > 0 ? (
                      <span className="ml-1 text-[10px] font-normal text-slate-600">{discount}% OFF</span>
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
