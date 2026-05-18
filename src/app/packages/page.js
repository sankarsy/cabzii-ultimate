"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import PackageCard from "../../components/PackageCard";
import { motion } from "framer-motion";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [facetRows, setFacetRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [facetsLoading, setFacetsLoading] = useState(true);
  const [vendor, setVendor] = useState("All");
  const [duration, setDuration] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadFacets = async () => {
      setFacetsLoading(true);
      try {
        const res = await fetch("/api/packages?limit=100&page=1", { cache: "no-store" });
        const data = await res.json();
        setFacetRows(Array.isArray(data?.data) ? data.data : []);
      } finally {
        setFacetsLoading(false);
      }
    };
    loadFacets();
  }, []);

  const vendors = useMemo(() => ["All", ...new Set(facetRows.map((item) => item.vendor).filter(Boolean))], [facetRows]);
  const durations = useMemo(() => ["All", ...new Set(facetRows.map((item) => item.duration).filter(Boolean))], [facetRows]);

  const loadPackages = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      p.set("page", String(page));
      p.set("limit", "12");
      if (vendor !== "All") p.set("vendor", vendor);
      if (duration !== "All") p.set("duration", duration);
      const res = await fetch(`/api/packages?${p.toString()}`, { cache: "no-store" });
      const data = await res.json();
      setPackages(Array.isArray(data?.data) ? data.data : []);
      if (data?.meta && typeof data.meta.page === "number") {
        setMeta(data.meta);
      }
    } finally {
      setLoading(false);
    }
  }, [duration, page, vendor]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  useEffect(() => {
    setPage(1);
  }, [vendor, duration]);

  const paginationLabel = useMemo(() => {
    const { total, page: pg, limit } = meta;
    if (!total) return "";
    const start = (pg - 1) * limit + 1;
    const end = Math.min(pg * limit, total);
    return `Showing ${start}–${end} of ${total}`;
  }, [meta]);

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">All Tour Packages</h1>
          <p className="mt-2 text-sm text-slate-600">Explore all curated packages and filter by vendor and duration.</p>

          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-md md:flex-row md:items-center">
            <select
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-600 disabled:opacity-50"
              value={vendor}
              onChange={(event) => setVendor(event.target.value)}
              disabled={facetsLoading}
            >
              {vendors.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-600 disabled:opacity-50"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              disabled={facetsLoading}
            >
              {durations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setVendor("All");
                setDuration("All");
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>

          {loading ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-md">
              Loading packages...
            </div>
          ) : (
            <>
              {paginationLabel ? <p className="mt-4 text-xs text-slate-500">{paginationLabel}</p> : null}
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {packages.map((tour, index) => (
                  <motion.div
                    key={String(tour._id ?? tour.id)}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                    className="transition hover:-translate-y-1"
                  >
                    <PackageCard pkg={tour} actionText="Book Now" actionHref={`/tour-booking?id=${String(tour._id ?? tour.id)}`} />
                  </motion.div>
                ))}
              </div>
              {!packages.length ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 shadow-md">
                  No packages match these filters.
                </div>
              ) : null}
              {meta.totalPages > 1 ? (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-600">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
