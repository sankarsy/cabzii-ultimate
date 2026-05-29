"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CabCard from "../../components/CabCard";
import FilterSidebar from "../../components/FilterSidebar";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import PageBanner from "../../components/PageBanner";
import RelatedSeoLinks from "../../components/seo/RelatedSeoLinks";
import { sortBySelectedCity } from "../../lib/locationPriority";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { motion } from "framer-motion";

function buildCabQuery(filters, page) {
  const p = new URLSearchParams();
  p.set("page", String(page));
  p.set("limit", "12");
  if (filters.vehicleType) p.set("type", filters.vehicleType);
  if (filters.priceRange) p.set("maxPrice", filters.priceRange);
  filters.amenities.forEach((a) => p.append("features", a));
  if (filters.city) p.set("priorityCity", filters.city);
  return p.toString();
}

export default function Cabs() {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [cabs, setCabs] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    priceRange: "",
    vehicleType: "",
    amenities: [],
    city: ""
  });
  const [detectedCity, setDetectedCity] = useState("");
  const { city: selectedCity } = useSelectedCity();

  const loadCabs = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildCabQuery(filters, page);
      const res = await fetch(`/api/cabs?${qs}`, { cache: "no-store" });
      const data = await res.json();
      const rows = Array.isArray(data?.data) ? data.data : [];
      setCabs(sortBySelectedCity(rows, filters.city || selectedCity));
      if (data?.meta && typeof data.meta.page === "number") {
        setMeta(data.meta);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, page, selectedCity]);

  useEffect(() => {
    loadCabs();
  }, [loadCabs]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const city = params.get("city");
    if (type && ["Sedan", "SUV", "Van", "Bus"].includes(type)) {
      setFilters((prev) => ({ ...prev, vehicleType: type }));
    }
    if (city) setFilters((prev) => ({ ...prev, city }));
  }, []);

  useEffect(() => {
    if (selectedCity) setFilters((prev) => ({ ...prev, city: selectedCity }));
  }, [selectedCity]);

  useEffect(() => {
    if (filters.city) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city = data?.address?.city || data?.address?.town || data?.address?.county || "";
          if (city) {
            setDetectedCity(city);
            setFilters((prev) => ({ ...prev, city }));
          }
        } catch {
          // ignore
        }
      },
      () => {},
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 1000 * 60 * 20 }
    );
  }, [filters.city]);

  useEffect(() => {
    setPage(1);
  }, [filters.priceRange, filters.vehicleType, filters.amenities, filters.city]);

  const paginationLabel = useMemo(() => {
    const { total, page: p, limit } = meta;
    if (!total) return "";
    const start = (p - 1) * limit + 1;
    const end = Math.min(p * limit, total);
    return `Showing ${start}–${end} of ${total}`;
  }, [meta]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <PageBanner
            title="All Cabs"
            subtitle={`Filter, compare and book trusted cabs across vendors.${filters.city ? ` Priority: ${filters.city}.` : ""}`}
            breadcrumbs={[
              { name: "Home", path: "/" },
              { name: "Cabs", path: "/cabs" }
            ]}
          />

          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
            <div className="hidden md:block" />
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 ease-in-out hover:bg-slate-100 md:hidden"
            >
              Open Filters
            </button>
          </div>

          <div className="flex flex-col gap-6 md:flex-row">
            <aside className="hidden w-full md:sticky md:top-24 md:block md:w-96 lg:w-[28rem] md:self-stretch">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                mobileOpen={false}
                setMobileOpen={setMobileFilterOpen}
              />
            </aside>

            <div className="w-full">
              {filters.city ? (
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 font-semibold text-sky-700">
                    Nearby city: {filters.city}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, city: "" }))}
                    className="rounded-full border border-slate-300 px-3 py-1 font-semibold text-slate-700"
                  >
                    Clear
                  </button>
                </div>
              ) : detectedCity ? (
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, city: detectedCity }))}
                  className="mb-3 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700"
                >
                  Show near {detectedCity}
                </button>
              ) : null}
              {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-md">Loading cabs...</div>
              ) : cabs.length ? (
                <>
                  {paginationLabel ? <p className="mb-3 text-xs text-slate-500">{paginationLabel}</p> : null}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cabs.map((cab, index) => (
                      <motion.article
                        key={String(cab._id ?? cab.id)}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.03 }}
                        className="transition hover:-translate-y-1"
                      >
                        <CabCard cab={cab} bookHref={`/cabs/${String(cab._id ?? cab.id)}`} />
                      </motion.article>
                    ))}
                  </div>
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
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-md">
                  <h3 className="text-lg font-bold text-slate-900">No cabs match your filters</h3>
                  <p className="mt-2 text-sm text-slate-600">Try broader filters or reset to see more cabs.</p>
                </div>
              )}
            </div>
          </div>

          <RelatedSeoLinks page="cabs" />
        </div>

        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          mobileOpen={mobileFilterOpen}
          setMobileOpen={setMobileFilterOpen}
          inline={false}
        />
      </section>
      <Footer />
    </main>
  );
}
