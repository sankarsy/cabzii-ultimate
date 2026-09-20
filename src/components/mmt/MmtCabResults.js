"use client";

import { useMemo, useState } from "react";
import { Car, ChevronDown, Clock3, ListFilter, ArrowUpDown, ShieldCheck, Sparkles, X } from "lucide-react";
import { buildFareSlabs, formatRating } from "../../lib/cabFare";
import { resolveCabTripFare } from "../../lib/distanceFare";
import { getCabVehicleName } from "../../lib/catalogDisplay";
import {
  cabFuelLabel,
  cabFuelOptions,
  cabModelOptions,
  cabTypeBucket,
  cabTypeOptions,
  formatRatesLine
} from "../../lib/cabListing";
import { cabSlabForTrip } from "../../lib/mmtTrip";
import MmtCabResultCard from "./MmtCabResultCard";
import { formatInr } from "../../lib/formatInr";

const SORTS = [
  { id: "price-asc", label: "Price" },
  { id: "ratings", label: "Ratings" },
  { id: "title", label: "Name" }
];

function cabTripPrice(cab, trip) {
  const slabs = buildFareSlabs(cab);
  const slab = cabSlabForTrip(slabs, trip);
  const fare = resolveCabTripFare(cab, slab, trip);
  return fare.total > 0 ? fare.total : Number(cab.price) || 0;
}

function cabHasAc(cab) {
  const features = Array.isArray(cab.features) ? cab.features : [];
  return features.some((f) => /^(ac|a\/c|air\s*condition)/i.test(String(f).trim())) || /ac/i.test(String(cab.type || ""));
}

function FilterSection({ title, selectedCount, onClear, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-[13px] font-bold text-slate-800">{title}</p>
        <div className="flex items-center gap-2">
          {selectedCount > 0 ? (
            <button
              type="button"
              onClick={onClear}
              className="text-[10px] font-bold uppercase tracking-wide text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
            className="text-slate-400 hover:text-slate-600"
          >
            <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} aria-hidden />
          </button>
        </div>
      </div>
      {open ? children : null}
    </div>
  );
}

function FilterChecks({ options, selected, onToggle }) {
  if (!options.length) return <p className="text-[12px] text-slate-400">None listed</p>;
  return (
    <ul className="space-y-0.5">
      {options.map((opt) => {
        const on = selected.includes(opt.label);
        return (
          <li key={opt.label}>
            <label className="flex cursor-pointer items-center gap-2 py-1 text-[13px] text-slate-700">
              <input
                type="checkbox"
                checked={on}
                onChange={() => onToggle(opt.label)}
                className="h-4 w-4 rounded border-slate-300 text-[#1a73e8] accent-[#1a73e8]"
              />
              <span className="min-w-0 flex-1 truncate">{opt.label}</span>
              <span className="shrink-0 text-[12px] text-slate-400">({opt.count})</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

function toggleValue(prev, value) {
  return prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
}

function BottomSheet({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[110] lg:hidden" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="absolute inset-0 bg-slate-900/40" aria-label="Close" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[16px] font-extrabold text-slate-900">{title}</p>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500" aria-label={`Close ${title}`}>
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function MmtCabResults({ cabs, trip, embedded = false, catalogMode = false, displayCity = "" }) {
  const [sort, setSort] = useState("price-asc");
  const [typeFilters, setTypeFilters] = useState([]);
  const [modelFilters, setModelFilters] = useState([]);
  const [fuelFilters, setFuelFilters] = useState([]);
  const [acOnly, setAcOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);
  const [mobileSheet, setMobileSheet] = useState(null);

  const typeOptions = useMemo(() => cabTypeOptions(cabs), [cabs]);
  const modelOptions = useMemo(() => cabModelOptions(cabs), [cabs]);
  const fuelOptions = useMemo(() => cabFuelOptions(cabs), [cabs]);

  const priceMax = useMemo(() => {
    const max = Math.max(500, ...cabs.map((c) => cabTripPrice(c, trip)));
    return Math.max(2500, Math.ceil(max / 100) * 100);
  }, [cabs, trip]);

  const priceCap = maxPrice > 0 ? maxPrice : priceMax;

  const filtered = useMemo(() => {
    let list = [...cabs];
    if (typeFilters.length) {
      list = list.filter((c) => typeFilters.includes(cabTypeBucket(c)));
    }
    if (modelFilters.length) {
      list = list.filter((c) => modelFilters.includes(getCabVehicleName(c)));
    }
    if (fuelFilters.length) {
      list = list.filter((c) => fuelFilters.includes(cabFuelLabel(c)));
    }
    if (acOnly) {
      list = list.filter(cabHasAc);
    }
    if (catalogMode) {
      list = list.filter((c) => cabTripPrice(c, trip) <= priceCap);
    }
    list.sort((a, b) => {
      if (sort === "price-asc") return cabTripPrice(a, trip) - cabTripPrice(b, trip);
      if (sort === "ratings") {
        const ra = Number(formatRating(a) || a.rating || 0);
        const rb = Number(formatRating(b) || b.rating || 0);
        return rb - ra;
      }
      return getCabVehicleName(a).localeCompare(getCabVehicleName(b));
    });
    return list;
  }, [cabs, sort, typeFilters, modelFilters, fuelFilters, acOnly, priceCap, trip, catalogMode]);

  function clearAll() {
    setTypeFilters([]);
    setModelFilters([]);
    setFuelFilters([]);
    setAcOnly(false);
    setMaxPrice(priceMax);
    setSort("price-asc");
  }

  const ratesLine = !catalogMode ? formatRatesLine(trip) : "";
  const showCoupon = !catalogMode && trip?.tripType === "outstation";
  const listingLayout = !embedded && !catalogMode;

  const mmtFilters = (
    <aside className="h-fit rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[15px] font-extrabold text-slate-900">Filters</p>
        <button type="button" onClick={clearAll} className="text-[11px] font-bold uppercase tracking-wide text-slate-400 hover:text-[#1a73e8]">
          Clear All
        </button>
      </div>

      <FilterSection title="Cab Type" selectedCount={typeFilters.length} onClear={() => setTypeFilters([])}>
        <FilterChecks options={typeOptions} selected={typeFilters} onToggle={(v) => setTypeFilters((p) => toggleValue(p, v))} />
      </FilterSection>

      <FilterSection title="Cab Model" selectedCount={modelFilters.length} onClear={() => setModelFilters([])} defaultOpen>
        <FilterChecks options={modelOptions} selected={modelFilters} onToggle={(v) => setModelFilters((p) => toggleValue(p, v))} />
      </FilterSection>

      <FilterSection title="Fuel Type" selectedCount={fuelFilters.length} onClear={() => setFuelFilters([])}>
        <FilterChecks options={fuelOptions} selected={fuelFilters} onToggle={(v) => setFuelFilters((p) => toggleValue(p, v))} />
      </FilterSection>
    </aside>
  );

  const catalogFilters = (
    <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-900">Filters</p>
        <button type="button" onClick={clearAll} className="text-xs font-semibold text-[#d84e55] hover:underline">
          Clear All
        </button>
      </div>
      <p className="mb-2 text-xs font-bold text-slate-700">Cab Type</p>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {typeOptions.map((opt) => {
          const on = typeFilters.includes(opt.label);
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => setTypeFilters((p) => toggleValue(p, opt.label))}
              className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-[10px] font-semibold ${
                on ? "border-[#d84e55] bg-rose-50 text-[#d84e55]" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <Car className="h-4 w-4" aria-hidden />
              {opt.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setAcOnly((v) => !v)}
          className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-[10px] font-semibold ${
            acOnly ? "border-[#d84e55] bg-rose-50 text-[#d84e55]" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          }`}
        >
          AC
        </button>
      </div>
      <p className="mb-2 text-xs font-bold text-slate-700">Price Range</p>
      <label className="mb-1 block">
        <input
          type="range"
          min={300}
          max={priceMax}
          step={50}
          value={priceCap}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#d84e55]"
        />
        <span className="mt-1 flex justify-between text-[11px] text-slate-500">
          <span>₹300</span>
          <span>₹{formatInr(priceCap)}</span>
        </span>
      </label>
    </aside>
  );

  const cards = catalogMode ? (
    <div className="cabzii-catalog-grid pt-1">
      {filtered.map((cab) => (
        <div className="cabzii-catalog-item" key={String(cab._id ?? cab.id)}>
          <MmtCabResultCard cab={cab} trip={trip} layout="card" catalogMode displayCity={displayCity} />
        </div>
      ))}
    </div>
  ) : (
    <div className="space-y-3">
      {filtered.map((cab) => (
        <MmtCabResultCard
          key={String(cab._id ?? cab.id)}
          cab={cab}
          trip={trip}
          catalogMode={catalogMode}
          displayCity={displayCity}
        />
      ))}
    </div>
  );

  const list = (
    <div className="min-w-0 space-y-3">
      {listingLayout ? (
        <>
          <div className="hidden overflow-hidden rounded-xl bg-gradient-to-r from-[#1a56db] via-[#1648b8] to-[#0f2f7a] px-3 py-3 lg:block sm:px-6">
            <div className="grid grid-cols-3 divide-x divide-white/20 text-center text-[11px] font-semibold text-white sm:text-[13px]">
              <div className="flex items-center justify-center gap-2 px-2">
                <ShieldCheck className="hidden h-5 w-5 sm:block" aria-hidden />
                Trusted Drivers
              </div>
              <div className="flex items-center justify-center gap-2 px-2">
                <Sparkles className="hidden h-5 w-5 sm:block" aria-hidden />
                Clean Cabs
              </div>
              <div className="flex items-center justify-center gap-2 px-2">
                <Clock3 className="hidden h-5 w-5 sm:block" aria-hidden />
                On-Time Pickup
              </div>
            </div>
          </div>
          {ratesLine ? <p className="text-[13px] text-slate-600">{ratesLine}</p> : null}
          {showCoupon ? (
            <div className="hidden items-center justify-between gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#e8f4ff] to-[#d7ecff] px-4 py-3 lg:flex">
              <div>
                <p className="text-[15px] font-extrabold text-[#1565c0]">Get ₹500 Off</p>
                <p className="text-[13px] text-slate-600">
                  Use coupon code: <span className="font-bold text-slate-800">CABZII500</span>
                </p>
                <p className="text-[11px] text-slate-500">First outstation booking</p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a73e8] text-lg font-black text-white">
                %
              </span>
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSort(s.id)}
              className={`rounded-full px-3 py-1.5 font-semibold ${sort === s.id ? "bg-[#d84e55] text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {s.label}
            </button>
          ))}
          <span className="ml-auto text-slate-500">
            Showing {filtered.length} {filtered.length === 1 ? "cab" : "cabs"}
          </span>
        </div>
      )}

      {filtered.length ? (
        cards
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
          No cabs match your filters. Try clearing filters or changing the route.
        </div>
      )}
    </div>
  );

  if (embedded) {
    return <div className="w-full space-y-3">{list}</div>;
  }

  if (catalogMode) {
    return (
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        {catalogFilters}
        {list}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 pb-24 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-5 lg:pb-0">
      <div className="hidden lg:block">{mmtFilters}</div>
      {list}

      <nav
        className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[80] grid grid-cols-3 overflow-hidden rounded-2xl bg-[#1c1c28] text-white shadow-[0_8px_28px_rgba(15,23,42,0.35)] lg:hidden"
        aria-label="Cab filters"
      >
        <button
          type="button"
          onClick={() => setMobileSheet("model")}
          className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold"
        >
          <Car className="h-4 w-4" aria-hidden />
          Car Model
        </button>
        <button
          type="button"
          onClick={() => setMobileSheet("sort")}
          className="flex flex-col items-center gap-0.5 border-x border-white/10 py-2.5 text-[11px] font-bold"
        >
          <ArrowUpDown className="h-4 w-4" aria-hidden />
          Sort
        </button>
        <button
          type="button"
          onClick={() => setMobileSheet("filters")}
          className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold"
        >
          <ListFilter className="h-4 w-4" aria-hidden />
          All Filters
        </button>
      </nav>

      <BottomSheet open={mobileSheet === "model"} title="Car Model" onClose={() => setMobileSheet(null)}>
        <FilterChecks options={modelOptions} selected={modelFilters} onToggle={(v) => setModelFilters((p) => toggleValue(p, v))} />
      </BottomSheet>
      <BottomSheet open={mobileSheet === "sort"} title="Sort" onClose={() => setMobileSheet(null)}>
        <ul className="space-y-1">
          {SORTS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  setSort(s.id);
                  setMobileSheet(null);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-semibold ${
                  sort === s.id ? "bg-[#e8f1fd] text-[#1a73e8]" : "text-slate-800"
                }`}
              >
                {s.label}
                {sort === s.id ? <span className="h-2.5 w-2.5 rounded-full bg-[#1a73e8]" /> : null}
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>
      <BottomSheet open={mobileSheet === "filters"} title="All Filters" onClose={() => setMobileSheet(null)}>
        <div className="-mx-1">{mmtFilters}</div>
      </BottomSheet>
    </div>
  );
}
