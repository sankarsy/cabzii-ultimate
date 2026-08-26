"use client";

import Link from "next/link";
import { Palmtree } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CabziiBrowseHeader from "./mmt/CabziiBrowseHeader";
import PackageCard from "./PackageCard";
import RelatedSeoLinks from "./seo/RelatedSeoLinks";
import { packageBookingHref } from "../lib/holidayHome";
import { HOLIDAY_CATEGORIES, categoryLabel } from "../lib/holidays";
import { catalogPriorityParams, sortBySelectedCity } from "../lib/locationPriority";
import { useSelectedCity } from "../lib/useSelectedCity";
import { SEO_CITIES } from "../lib/seo/cities";

export default function HolidaysListPage() {
  const router = useRouter();
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
        icon={Palmtree}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Holidays", path: "/holidays" }
        ]}
      >
        <div className="flex flex-wrap gap-1.5 pb-0.5">
          {HOLIDAY_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.id === "all" ? "/holidays" : `/holidays?category=${cat.id}`}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                category === cat.id
                  ? "bg-[var(--cabzii-brand)] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--cabzii-brand)]"
              }`}
            >
              <span aria-hidden className="text-[10px]">{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
        </div>
        <div className="inline-flex max-w-full flex-wrap items-end gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 sm:gap-2 sm:px-2.5 sm:py-2">
          <div className="min-w-[8.5rem] sm:min-w-[11rem]">
            <label className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">Vendor</label>
            <select
              className="cabzii-input mt-0.5 w-full rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium sm:text-xs"
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
              router.push("/holidays");
            }}
            className="cabzii-btn cabzii-btn-secondary cabzii-btn-sm cabzii-tap !min-h-7 !px-2.5 !text-[10px]"
          >
            Reset
          </button>
        </div>
        {category !== "all" ? (
          <p className="text-[11px] text-slate-600">
            Showing <span className="font-semibold text-slate-800">{categoryLabel(category)}</span> packages
          </p>
        ) : null}
      </CabziiBrowseHeader>

      <div className="section-shell py-3 sm:py-4 md:py-5">
        {loading ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-xs text-slate-500 sm:p-8 sm:text-sm">
            Loading holiday packages…
          </div>
        ) : (
          <>
            {paginationLabel ? <p className="mb-2.5 text-[11px] text-slate-500 sm:mb-3">{paginationLabel}</p> : null}
            <div className="grid w-full grid-cols-2 gap-3 sm:gap-3.5 md:grid-cols-4 md:gap-4">
              {packages.map((pkg) => (
                <PackageCard
                  key={String(pkg._id ?? pkg.id)}
                  pkg={pkg}
                  actionText="Book"
                  actionHref={packageBookingHref(pkg)}
                />
              ))}
            </div>
            {!packages.length ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-xs text-slate-500 sm:p-6 sm:text-sm">
                No packages in {categoryLabel(category)}. Try another category or reset filters.
              </div>
            ) : null}
            {meta.totalPages > 1 ? (
              <div className="mt-4 flex justify-center gap-2 sm:mt-5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="cabzii-btn cabzii-btn-secondary cabzii-btn-sm cabzii-tap disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="flex items-center px-2 text-[11px] text-slate-600 sm:text-xs">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="cabzii-btn cabzii-btn-secondary cabzii-btn-sm cabzii-tap disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        )}
        <div className="mt-5 sm:mt-6">
          <RelatedSeoLinks
            page="packages"
            citySlug={SEO_CITIES.find((c) => c.name === selectedCity)?.slug || ""}
          />
        </div>
        <p className="mt-4 text-center sm:mt-5">
          <Link href="/" className="text-xs font-semibold text-[var(--cabzii-brand)] sm:text-sm">
            ← Back to home
          </Link>
        </p>
      </div>
    </>
  );
}
