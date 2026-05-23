"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { num, packageYouPay } from "../lib/cabFare";
import { resolveMediaUrl } from "../lib/media";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=60";

export default function SimilarPackages({ currentPackageId, duration, vendor }) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: "12", page: "1" });
        if (duration) params.set("duration", duration);
        const res = await fetch(`/api/packages?${params}`, { cache: "no-store" });
        const json = await res.json();
        let list = Array.isArray(json?.data) ? json.data : [];
        if (list.length < 2 && vendor) {
          const res2 = await fetch(`/api/packages?limit=12&vendor=${encodeURIComponent(vendor)}`, {
            cache: "no-store"
          });
          const json2 = await res2.json();
          list = Array.isArray(json2?.data) ? json2.data : list;
        }
        const filtered = list
          .filter((p) => String(p._id ?? p.id) !== String(currentPackageId))
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
  }, [currentPackageId, duration, vendor]);

  if (!loading && similar.length === 0) return null;

  return (
    <section
      id="similar-packages"
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900">Similar tour packages</h2>
          <p className="mt-0.5 text-xs text-slate-600">
            {duration ? `More packages like ${duration}` : "Explore other curated tours"}.
          </p>
        </div>
        <Link href="/packages" className="text-xs font-semibold text-[#0056D2] hover:underline">
          View all tours →
        </Link>
      </div>

      {loading ? (
        <p className="mt-4 text-xs text-slate-500">Loading similar packages…</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((pkg) => {
            const id = String(pkg._id ?? pkg.id);
            const price = num(pkg.price);
            const discount = num(pkg.discountPercentage);
            const youPay = packageYouPay(price, discount);
            const img = resolveMediaUrl(pkg.image) || FALLBACK_IMAGE;
            return (
              <Link
                key={id}
                href={`/tour-booking?id=${id}`}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-[#0056D2]/40 hover:shadow-md"
              >
                <img
                  src={img}
                  alt={pkg.name}
                  className="h-24 w-full object-cover transition group-hover:scale-[1.02]"
                />
                <div className="p-3">
                  <p className="text-[10px] font-semibold text-[#0056D2]">{pkg.duration}</p>
                  <h3 className="mt-0.5 line-clamp-1 text-sm font-bold text-slate-900">{pkg.name}</h3>
                  <p className="text-[11px] text-slate-500">by {pkg.vendor}</p>
                  <p className="mt-2 text-sm font-bold text-[#0056D2]">
                    ₹{youPay.toLocaleString("en-IN")}
                    <span className="text-[10px] font-normal text-slate-500"> /person</span>
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
