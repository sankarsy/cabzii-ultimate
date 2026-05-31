"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CabziiBrowseHeader from "./mmt/CabziiBrowseHeader";
import PackageCard from "./PackageCard";
import RelatedSeoLinks from "./seo/RelatedSeoLinks";
import { HOLIDAY_CATEGORIES, categoryLabel } from "../lib/holidays";
import { catalogPriorityParams, sortBySelectedCity } from "../lib/locationPriority";
import { useSelectedCity } from "../lib/useSelectedCity";

export default function HolidaysListPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [packages, setPackages] = useState([]);
  const [facetRows, setFacetRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [facetsLoading, setFacetsLoading] = useState(true);
  const [vendor, setVendor] = useState("All");
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const { city: selectedCity } = useSelectedCity();

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    (async () => {
      setFacetsLoading(true);
      try {
        const res = await fetch("/api/packages?limit=100&page=1", { cache: "no-store" });
        const data = await res.json();
        setFacetRows(Array.isArray(data?.data) ? data.data : []);
      } finally {
        setFacetsLoading(false);
      }
    })();
  }, []);

  const vendors = useMemo(() => ["All", ...new Set(facetRows.map((item) => item.vendor).filter(Boolean))], [facetRows]);

  const loadPackages = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      p.set("page", String(page));
      p.set("limit", "12");
      if (vendor !== "All") p.set("vendor", vendor);
      if (category && category !== "all") p.set("category", category);
      const res = await fetch(`/api/packages?${p.toString()}${catalogPriorityParams(selectedCity)}`, {
        cache: "no-store"
      });
      const data = await res.json();
      setPackages(sortBySelectedCity(Array.isArray(data?.data) ? data.data : [], selectedCity));
      if (data?.meta?.page) setMeta(data.meta);
    } finally {
      setLoading(false);
    }
  }, [category, page, selectedCity, vendor]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  useEffect(() => {
    setPage(1);
  }, [vendor, category, selectedCity]);

  const paginationLabel = useMemo(() => {
    const { total, page: pg, limit } = meta;
    if (!total) return "";
    const start = (pg - 1) * limit + 1;
    const end = Math.min(pg * limit, total);
    return `Showing ${start}–${end} of ${total}`;
  }, [meta]);

  return (
    <>
      <CabziiBrowseHeader
        title="Holiday packages"
        subtitle="Pilgrimage, beach, hill & heritage trips — flat package fare, toll & permit extra"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Holidays", path: "/holidays" }
        ]}
      >
        <div className="flex flex-wrap gap-2 pb-1">
          {HOLIDAY_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.id === "all" ? "/holidays" : `/holidays?category=${cat.id}`}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                category === cat.id
                  ? "bg-[var(--cabzii-brand)] text-white shadow"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--cabzii-brand)]"
              }`}
            >
              <span aria-hidden>{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-end">
          <div className="flex-1 sm:max-w-xs">
            <label className="cabzii-search-label">Vendor</label>
            <select
              className="cabzii-input mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              disabled={facetsLoading}
            >
              {vendors.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              setVendor("All");
              setCategory("all");
            }}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white"
          >
            Reset
          </button>
        </div>
        {category !== "all" ? (
          <p className="text-xs text-slate-600">
            Showing <span className="font-semibold text-slate-800">{categoryLabel(category)}</span> packages
          </p>
        ) : null}
      </CabziiBrowseHeader>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {loading ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
            Loading holiday packages…
          </div>
        ) : (
          <>
            {paginationLabel ? <p className="mb-4 text-xs text-slate-500">{paginationLabel}</p> : null}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {packages.map((pkg) => (
                <PackageCard
                  key={String(pkg._id ?? pkg.id)}
                  pkg={pkg}
                  actionText="View package"
                  actionHref={`/holidays/${String(pkg._id ?? pkg.id)}`}
                />
              ))}
            </div>
            {!packages.length ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
                No packages in {categoryLabel(category)}. Try another category or reset filters.
              </div>
            ) : null}
            {meta.totalPages > 1 ? (
              <div className="mt-8 flex justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="py-2 text-sm text-slate-600">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        )}
        <div className="mt-8">
          <RelatedSeoLinks page="packages" />
        </div>
        <p className="mt-6 text-center">
          <Link href="/" className="text-sm font-semibold text-[var(--cabzii-brand)]">
            ← Back to home
          </Link>
        </p>
      </div>
    </>
  );
}
