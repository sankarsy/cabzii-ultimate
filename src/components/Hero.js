"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useSiteSettings } from "./SiteSettingsProvider";
import TrustBadges from "./TrustBadges";
import PlaceAutocomplete from "./PlaceAutocomplete";
import { inputBaseClass, typo } from "../lib/typography";
import {
  CalendarIcon,
  CarIcon,
  getIcon,
  HERO_TAB_ICON_KEYS,
  HERO_TAB_ICON_STYLES,
  MapPinIcon,
  LandmarkIcon,
  MapPinnedIcon,
  SearchIcon
} from "./icons";

const FALLBACK_HERO_IMAGE = "/images/hero-banner.png";
const FALLBACK_TABS = [
  { id: "outstation", label: "Outstation" },
  { id: "local", label: "Local" },
  { id: "airport", label: "Airport" },
  { id: "rental", label: "Rental" },
  { id: "tour", label: "Tours" }
];

export default function HeroSection({
  searchTab,
  setSearchTab,
  quickForm,
  setQuickForm,
  selectedCity = "",
  onPickupResolved,
  onDropResolved,
  onSearch
}) {
  const settings = useSiteSettings();
  const hero = settings.hero || {};
  const heroImage = hero.image || FALLBACK_HERO_IMAGE;
  const rawTabs = hero.tabs?.length ? hero.tabs : FALLBACK_TABS;
  const tabs = rawTabs.filter((tab) => tab?.id && tab?.label);
  const displayTabs = tabs.length ? tabs : FALLBACK_TABS;
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
    <section className="relative mt-4 bg-white pb-4">
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
            <p className={`mb-2 ${typo.eyebrow}`} style={{ color: brandColor }}>
              {hero.eyebrow || "Cabzii — cabzii.in | Book online across India"}
            </p>

            <h1 className={`max-w-lg ${typo.h1}`}>
              {renderTitle()}
            </h1>

            <p className={`mt-3 max-w-md ${typo.body}`}>
              {hero.subtitle ||
                "Compare sedan, SUV and Innova fares from verified vendors. Airport, local, outstation and acting driver booking with instant OTP confirmation."}
            </p>
          </motion.div>

          {/* RIGHT IMAGE DESKTOP */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative hidden h-[340px] w-full lg:block"
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl">

              <Image
                src={heroImage}
                alt="Book cabs, taxis and acting drivers online with Cabzii"
                fill
                priority
                sizes="70vw"
                className="object-cover object-center"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0056D2]/5 via-transparent to-black/10" />

              {/* OFFER CARD — excluded from Google snippets via data-nosnippet */}
              <div
                className="absolute right-3 top-3 rounded-lg bg-white px-2.5 py-2 shadow-md sm:right-4 sm:top-4"
                data-nosnippet
                aria-hidden="true"
              >
                <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                  {hero.promoBadge || "Up To"}
                </p>

                <p className="text-lg font-extrabold leading-tight text-green-600 sm:text-xl">
                  {hero.promoTitle || "20% OFF"}
                </p>

                <p className="mt-0.5 text-[9px] text-slate-500">{hero.promoSubtitle || "Cabs & Tours"}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SEARCH BOX — above mobile banner so tabs stay visible without scrolling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-30 mt-1 w-full min-w-0 overflow-visible rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.05)]"
        >

          {/* TABS */}
          <div
            className="flex flex-nowrap gap-1 overflow-x-auto border-b border-slate-100 px-2 py-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Search type"
          >
            {displayTabs.map((tab) => {
              const active = searchTab === tab.id;
              const tabIconKey = HERO_TAB_ICON_KEYS[tab.id];
              const TabIcon = tabIconKey ? getIcon(tabIconKey) : null;
              const tabTone = HERO_TAB_ICON_STYLES[tab.id] || HERO_TAB_ICON_STYLES.local;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSearchTab(tab.id)}
                  className={`relative flex shrink-0 snap-start flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition touch-manipulation sm:flex-row sm:gap-2 sm:px-3.5 sm:py-2.5 sm:text-sm ${
                    active
                      ? "bg-blue-50 text-[#0056D2] shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {TabIcon ? (
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full sm:h-7 sm:w-7 ${
                        active ? tabTone.active : tabTone.idle
                      }`}
                      aria-hidden="true"
                    >
                      <TabIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </span>
                  ) : null}
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* FORM */}
          <form
            className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-12 lg:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              onSearch?.();
            }}
          >

            {/* FROM */}
            <PlaceAutocomplete
              className="min-w-0 lg:col-span-3"
              label={isTour ? "Pickup / City" : "From"}
              labelDesktop={isTour ? "Pickup / City" : "From (Google Maps)"}
              placeholder={isTour ? "City, area or pincode" : "Pickup location"}
              value={quickForm.pickup}
              onChange={(value) => setQuickForm((p) => ({ ...p, pickup: value }))}
              onResolved={onPickupResolved}
              leadingIcon={isTour ? LandmarkIcon : MapPinIcon}
              leadingIconClassName={isTour ? "text-rose-600" : "text-emerald-600"}
            />

            {/* TO */}
            <div className={`min-w-0 lg:col-span-3 ${isTour ? "hidden" : ""}`}>
              <PlaceAutocomplete
                label="To"
                labelDesktop="To (Google Maps)"
                placeholder="Drop location"
                value={quickForm.drop}
                onChange={(value) => setQuickForm((p) => ({ ...p, drop: value }))}
                onResolved={onDropResolved}
                leadingIcon={MapPinnedIcon}
                leadingIconClassName="text-rose-600"
              />
            </div>

            {/* DATE */}
            <div className="min-w-0 lg:col-span-2">
              <label className={`mb-1.5 block ${typo.label}`}>Date</label>
              <div className="relative">
                <CalendarIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-600"
                  aria-hidden="true"
                />
                <input
                  type="date"
                  value={quickForm.date}
                  onChange={(e) =>
                    setQuickForm((p) => ({
                      ...p,
                      date: e.target.value
                    }))
                  }
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* CAB / TOUR */}
            <div className={`min-w-0 lg:col-span-2 ${isTour ? "hidden" : ""}`}>
              <label className={`mb-1.5 block ${typo.label}`}>Cab</label>
              <div className="relative">
                <CarIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0056D2]"
                  aria-hidden="true"
                />
                <select
                  value={quickForm.cabType}
                  onChange={(e) =>
                    setQuickForm((p) => ({
                      ...p,
                      cabType: e.target.value
                    }))
                  }
                  className={`${inputClass} pl-10`}
                >
                  <option value="">Select cab</option>
                  {cabTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* BUTTON */}
            <div className="min-w-0 lg:col-span-2">
              <label className={`mb-1.5 hidden lg:block ${typo.label}`} aria-hidden="true">
                &nbsp;
              </label>
              <button
                type="submit"
                className={`inline-flex h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-xl ${typo.btn} text-white shadow-md transition active:opacity-90 sm:h-10 sm:hover:opacity-90`}
                style={{ backgroundColor: brandColor }}
              >
                <SearchIcon className="h-4 w-4 shrink-0" />
                {isTour ? "Find Tours" : "Search"}
              </button>
            </div>
          </form>

          <TrustBadges badges={trustBadges} />
        </motion.div>

        {/* MOBILE IMAGE */}
        <div className="relative mt-3 h-[140px] overflow-hidden rounded-2xl sm:h-[160px] lg:hidden">
          <Image
            src={heroImage}
            alt="Cabzii online cab and taxi booking"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>
    </section>
  );
}

const inputClass = inputBaseClass;