"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useSiteSettings } from "./SiteSettingsProvider";
import TrustBadges from "./TrustBadges";

const FALLBACK_HERO_IMAGE = "/images/hero-banner.png";
const FALLBACK_TABS = [
  { id: "outstation", label: "Outstation", icon: "🚖" },
  { id: "local", label: "Local", icon: "📍" },
  { id: "airport", label: "Airport", icon: "✈️" },
  { id: "rental", label: "Rental", icon: "🗓️" },
  { id: "tour", label: "Tours", icon: "🗺️" }
];

export default function HeroSection({
  searchTab,
  setSearchTab,
  quickForm,
  setQuickForm,
  pickupSuggestions = [],
  dropSuggestions = [],
  onPickupSelect,
  onDropSelect,
  onSearch
}) {
  const settings = useSiteSettings();
  const hero = settings.hero || {};
  const heroImage = hero.image || FALLBACK_HERO_IMAGE;
  const tabs = hero.tabs?.length ? hero.tabs : FALLBACK_TABS;
  const cabTypes = hero.cabTypes?.length ? hero.cabTypes : ["Sedan", "SUV", "Innova"];
  const trustBadges = hero.trustBadges;
  const brandColor = settings.brandColor || "#0056D2";
  const isTour = searchTab === "tour";

  const renderTitle = () => {
    const title = hero.title || "Book Cabs, Taxis & Acting Drivers Online";
    const highlight = hero.titleHighlight || "Acting Drivers";
    if (!title.includes(highlight)) return title;
    const parts = title.split(highlight);
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 ? <span style={{ color: brandColor }}>{highlight}</span> : null}
      </span>
    ));
  };

  return (
    <section className="mt-4 relative overflow-hidden bg-[#f5f9ff] pb-4">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">

        {/* HERO */}
        <div className="grid items-center lg:grid-cols-[45%_55%] lg:min-h-[340px]">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 py-4 lg:py-5"
          >
            <p className="mb-2 text-[11px] font-semibold tracking-wide md:text-xs" style={{ color: brandColor }}>
              {hero.eyebrow || "Cabzii — cabzii.in | Book online across India"}
            </p>

            <h1 className="max-w-lg text-[1.75rem] font-extrabold leading-[1.08] text-[#081028] sm:text-[2.1rem] lg:text-[3rem]">
              {renderTitle()}
            </h1>

            <p className="mt-3 max-w-md text-[13px] leading-6 text-slate-600 md:text-sm">
              {hero.subtitle ||
                "Cabs, acting drivers and tour packages in Chennai, Bengaluru, Mumbai and across India — transparent fares, instant booking."}
            </p>
          </motion.div>

          {/* RIGHT IMAGE DESKTOP */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative hidden h-[340px] w-full lg:block"
          >
            <div className="relative h-full w-full overflow-hidden rounded-tr-2xl">

              <Image
                src={heroImage}
                alt="Cabzii Hero"
                fill
                priority
                sizes="70vw"
                className="object-cover object-center"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0056D2]/5 via-transparent to-black/10" />

              {/* OFFER CARD */}
              <div className="absolute right-6 top-6 rounded-2xl bg-white px-4 py-3 shadow-2xl">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  {hero.promoBadge || "Up To"}
                </p>

                <h3 className="text-3xl font-extrabold leading-none text-green-600">
                  {hero.promoTitle || "20% OFF"}
                </h3>

                <p className="mt-1 text-[11px] text-slate-500">{hero.promoSubtitle || "Cabs & Tours"}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* MOBILE IMAGE */}
        <div className="relative mb-3 h-[160px] overflow-hidden rounded-2xl lg:hidden">
          <Image
            src={heroImage}
            alt="Cabzii"
            fill
            priority
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* SEARCH BOX */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-20 rounded-br-2xl rounded-bl-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.05)]"
        >

          {/* TABS */}
          <div className="flex flex-wrap justify-start overflow-x-auto border-b border-slate-100 px-2 py-2 scrollbar-hide">

            {tabs.map((tab) => {
              const active = searchTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setSearchTab(tab.id)}
                  className={`relative flex min-w-fit items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    active
                      ? "bg-blue-50 text-[#0056D2]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* FORM */}
          <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2 lg:grid-cols-12 lg:items-end">

            {/* FROM */}
            <PlaceField
              className="lg:col-span-3"
              label={isTour ? "Pickup / City" : "From"}
              placeholder={isTour ? "City or pickup for tour" : "Pickup location"}
              value={quickForm.pickup}
              onChange={(value) => setQuickForm((p) => ({ ...p, pickup: value }))}
              suggestions={pickupSuggestions}
              onSelect={onPickupSelect}
            />

            {/* TO */}
            <PlaceField
              className={`lg:col-span-3 ${isTour ? "hidden md:block md:opacity-0 md:pointer-events-none" : ""}`}
              label="To"
              placeholder="Drop location"
              value={quickForm.drop}
              onChange={(value) => setQuickForm((p) => ({ ...p, drop: value }))}
              suggestions={dropSuggestions}
              onSelect={onDropSelect}
            />

            {/* DATE */}
            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-500">
                Date
              </label>

              <input
                type="date"
                value={quickForm.date}
                onChange={(e) =>
                  setQuickForm((p) => ({
                    ...p,
                    date: e.target.value
                  }))
                }
                className={inputClass}
              />
            </div>

            {/* CAB / TOUR */}
            <div className={`lg:col-span-2 ${isTour ? "hidden md:block md:opacity-0 md:pointer-events-none" : ""}`}>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-500">
                Cab
              </label>

              <select
                value={quickForm.cabType}
                onChange={(e) =>
                  setQuickForm((p) => ({
                    ...p,
                    cabType: e.target.value
                  }))
                }
                className={inputClass}
              >
                <option value="">Select cab</option>
                {cabTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* BUTTON */}
            <div className="lg:col-span-2">
              <button
                type="button"
                onClick={onSearch}
                className="h-[40px] w-full rounded-xl text-sm font-bold text-white shadow-md transition hover:opacity-90"
                style={{ backgroundColor: brandColor }}
              >
                {isTour ? "Find Tours" : "Search"}
              </button>
            </div>
          </div>

          <TrustBadges badges={trustBadges} />
        </motion.div>
      </div>
    </section>
  );
}

const inputClass =
  "h-[40px] w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0056D2] focus:ring-4 focus:ring-blue-100";

function PlaceField({ className = "", label, placeholder, value, onChange, suggestions, onSelect }) {
  return (
    <div className={`relative ${className}`}>
      <label className="mb-1.5 block text-[11px] font-semibold text-slate-500">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        autoComplete="off"
      />
      {suggestions?.length > 0 ? (
        <ul className="absolute z-30 mt-1 max-h-36 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-lg">
          {suggestions.map((place) => (
            <li key={place}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-slate-700 hover:bg-blue-50"
                onClick={() => onSelect?.(place)}
              >
                {place}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}