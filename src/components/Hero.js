"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const TABS = [
  { id: "outstation", label: "Outstation", icon: CarTabIcon },
  { id: "local", label: "Local", icon: PinTabIcon },
  { id: "airport", label: "Airport", icon: PlaneTabIcon },
  { id: "rental", label: "Rental", icon: KeyTabIcon },
  { id: "tours", label: "Tour Packages", icon: MapTabIcon }
];

const TRUST_ITEMS = [
  { label: "Verified Drivers", icon: ShieldIcon },
  { label: "Best Price Guarantee", icon: TagIcon },
  { label: "24/7 Support", icon: HeadsetIcon },
  { label: "Safe & Secure", icon: LockIcon },
  { label: "Free Cancellation", icon: CancelIcon }
];

const HERO_IMAGE = "/images/hero-banner.png";

export default function Hero({
  searchTab,
  setSearchTab,
  quickForm,
  setQuickForm,
  pickupSuggestions,
  dropSuggestions,
  onPickupSelect,
  onDropSelect,
  onSearch
}) {
  return (
    <section id="hero" className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="relative grid min-h-[360px] grid-cols-1 lg:min-h-[420px] lg:grid-cols-2">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col justify-center py-8 pr-0 lg:py-10 lg:pr-8"
          >
            <p className="text-sm font-semibold tracking-wide text-[#0056D2]">Comfort. Safety. Reliability.</p>
            <h1 className="mt-2 max-w-lg text-4xl font-extrabold leading-tight text-slate-900 md:text-[2.75rem] md:leading-[1.15]">
              Your Journey, <span className="text-[#0056D2]">Our Priority</span>
            </h1>
            <p className="mt-3 max-w-md text-base leading-relaxed text-slate-600">
              Book cabs, tour packages and professional drivers at the best prices. Travel smart with Cabzii.
            </p>
          </motion.div>

          {/* Right: promotional banner (desktop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative hidden min-h-[280px] lg:block"
          >
            <div className="absolute inset-0 overflow-hidden rounded-2xl border border-slate-200/80 shadow-md">
              <Image
                src={HERO_IMAGE}
                alt="Cabzii — cab services, acting drivers, and devotional tours"
                fill
                priority
                sizes="(max-width: 1024px) 0px, 50vw"
                className="object-cover object-center"
              />
            </div>
          </motion.div>
        </div>

        {/* Banner strip (mobile & tablet) */}
        <div className="relative mb-4 aspect-[21/9] max-h-44 w-full overflow-hidden rounded-xl border border-slate-200/80 shadow-md lg:hidden">
          <Image
            src={HERO_IMAGE}
            alt="Cabzii — cab services, acting drivers, and devotional tours"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Booking widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="relative z-20 -mt-4 mb-2 rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] lg:-mt-24 lg:mb-6"
        >
          <div className="flex flex-wrap gap-0.5 border-b border-slate-100 px-2 pt-2 sm:px-4">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = searchTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSearchTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3 py-3 text-sm font-semibold transition sm:px-4 ${
                    active ? "text-[#0056D2]" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-[#0056D2]" : "text-slate-400"}`} />
                  {tab.label}
                  {active ? <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#0056D2]" /> : null}
                </button>
              );
            })}
          </div>

          <div className="p-4 sm:p-5">
            {searchTab === "tours" ? (
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                <Field label="Search destination" className="flex-1">
                  <input
                    className={inputClass}
                    placeholder="Search tour packages or destinations…"
                    value={quickForm.pickup}
                    onChange={(e) => setQuickForm((p) => ({ ...p, pickup: e.target.value }))}
                  />
                </Field>
                <button type="button" onClick={onSearch} className={searchBtnClass}>
                  Search Tours
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
                <Field label="From" className="relative lg:col-span-3">
                  <span className="pointer-events-none absolute left-3 top-[2.35rem] h-2 w-2 rounded-full bg-emerald-500" />
                  <input
                    className={`${inputClass} pl-7`}
                    placeholder="Enter pickup location"
                    value={quickForm.pickup}
                    onChange={(e) => setQuickForm((p) => ({ ...p, pickup: e.target.value }))}
                  />
                  {pickupSuggestions.length > 0 && (
                    <SuggestionList items={pickupSuggestions} onSelect={onPickupSelect} />
                  )}
                </Field>
                <Field label="To" className="relative lg:col-span-3">
                  <span className="pointer-events-none absolute left-3 top-[2.35rem] h-2 w-2 rounded-full bg-red-500" />
                  <input
                    className={`${inputClass} pl-7`}
                    placeholder="Enter drop location"
                    value={quickForm.drop}
                    onChange={(e) => setQuickForm((p) => ({ ...p, drop: e.target.value }))}
                  />
                  {dropSuggestions.length > 0 && (
                    <SuggestionList items={dropSuggestions} onSelect={onDropSelect} />
                  )}
                </Field>
                <Field label="Date & Time" className="lg:col-span-2">
                  <div className="relative">
                    <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={searchTab === "airport" ? "datetime-local" : "date"}
                      className={`${inputClass} pl-10`}
                      placeholder="Select date & time"
                      value={quickForm.date}
                      onChange={(e) => setQuickForm((p) => ({ ...p, date: e.target.value }))}
                    />
                  </div>
                </Field>
                <Field label="Cab Type" className="lg:col-span-2">
                  <select
                    className={inputClass}
                    value={quickForm.cabType}
                    onChange={(e) => setQuickForm((p) => ({ ...p, cabType: e.target.value }))}
                  >
                    <option value="">Select cab type</option>
                    <option>Sedan</option>
                    <option>SUV</option>
                    <option>Van</option>
                    <option>Bus</option>
                  </select>
                </Field>
                <div className="lg:col-span-2">
                  <button type="button" onClick={onSearch} className={`${searchBtnClass} w-full`}>
                    Search Cabs
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2 border-t border-slate-100 px-4 py-3 sm:gap-x-8">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <span key={item.label} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <Icon className="h-4 w-4 text-[#0056D2] py-0.5" />
                  {item.label}
                </span>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="h-4 bg-white lg:h-3" />
    </section>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100";
const searchBtnClass =
  "rounded-lg bg-[#0056D2] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0047b3]";

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function SuggestionList({ items, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute z-30 mt-1 max-h-40 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
    >
      {items.map((place) => (
        <button
          key={place}
          type="button"
          onClick={() => onSelect(place)}
          className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
        >
          {place}
        </button>
      ))}
    </motion.div>
  );
}

function CarTabIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
}

function PinTabIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

function PlaneTabIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M2 12h5l3 9 4-18 3 9h5" />
    </svg>
  );
}

function KeyTabIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <circle cx="8" cy="15" r="4" />
      <path d="M12 15h8M16 11h4M18 7h2" />
    </svg>
  );
}

function MapTabIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M9 18l-6-3V6l6 3 6-3 6 3v9l-6 3-6-3z" />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ShieldIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function TagIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    </svg>
  );
}

function HeadsetIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M3 11v2a7 7 0 0 0 7 7h1M21 11v2a7 7 0 0 1-7 7h-1" />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CancelIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}
