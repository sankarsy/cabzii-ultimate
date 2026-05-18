"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import DriverCard from "../../components/DriverCard";
import { motion } from "framer-motion";

export default function DriversPage() {
  const router = useRouter();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 24, total: 0, totalPages: 1 });

  useEffect(() => {
    const t = setTimeout(() => setQ(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [q]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const p = new URLSearchParams();
        p.set("page", String(page));
        p.set("limit", "24");
        if (q.trim()) p.set("q", q.trim());
        const res = await fetch(`/api/drivers?${p.toString()}`, { cache: "no-store" });
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : [];
        setDrivers(list);
        if (data?.meta && typeof data.meta.page === "number") {
          setMeta(data.meta);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, q]);

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">All Active Drivers</h1>
          <p className="mt-2 text-sm text-slate-600">Verified professional drivers with strong ratings and trip history.</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="driver-search" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Search (name, vendor, vehicles, SEO)
              </label>
              <input
                id="driver-search"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                placeholder="Type to filter…"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
              />
            </div>
          </div>

          {loading ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-md">Loading drivers…</div>
          ) : (
            <>
              {meta.total ? (
                <p className="mt-4 text-xs text-slate-500">
                  Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
                </p>
              ) : null}
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {drivers.map((driver, index) => {
                  const id = String(driver._id ?? driver.id);
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.04 }}
                      className="transition hover:-translate-y-1"
                    >
                      <DriverCard driver={driver} />
                    </motion.div>
                  );
                })}
              </div>
              {!drivers.length ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 shadow-md">
                  No drivers found.
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
