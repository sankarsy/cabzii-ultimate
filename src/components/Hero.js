"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const HERO_IMAGE = "/images/hero-banner.png";

const TABS = [
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
  onSearch
}) {
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
            <p className="mb-2 text-[11px] font-semibold tracking-wide text-[#0056D2] md:text-xs">
              Comfort. Safety. Reliability.
            </p>

            <h1 className="max-w-md text-[1.9rem] font-extrabold leading-[1.02] text-[#081028] sm:text-[2.3rem] lg:text-[3.4rem]">
              Your Journey,
              <br />
              Our{" "}
              <span className="text-[#0056D2]">
                Priority
              </span>
            </h1>

            <p className="mt-3 max-w-sm text-[13px] leading-6 text-slate-600 md:text-sm">
              Book cabs, tour packages and professional drivers
              at the best prices.
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
                src={HERO_IMAGE}
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
                  Up To
                </p>

                <h3 className="text-3xl font-extrabold leading-none text-green-600">
                  20%
                  <span className="ml-1 text-sm">OFF</span>
                </h3>

                <p className="mt-1 text-[11px] text-slate-500">
                  Tour Packages
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* MOBILE IMAGE */}
        <div className="relative mb-3 h-[160px] overflow-hidden rounded-2xl lg:hidden">
          <Image
            src={HERO_IMAGE}
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
          <div className="flex overflow-x-auto border-b border-slate-100 px-2 py-2 scrollbar-hide">

            {TABS.map((tab) => {
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
            <div className="lg:col-span-3">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-500">
                From
              </label>

              <input
                type="text"
                placeholder="Pickup location"
                value={quickForm.pickup}
                onChange={(e) =>
                  setQuickForm((p) => ({
                    ...p,
                    pickup: e.target.value
                  }))
                }
                className={inputClass}
              />
            </div>

            {/* TO */}
            <div className="lg:col-span-3">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-500">
                To
              </label>

              <input
                type="text"
                placeholder="Drop location"
                value={quickForm.drop}
                onChange={(e) =>
                  setQuickForm((p) => ({
                    ...p,
                    drop: e.target.value
                  }))
                }
                className={inputClass}
              />
            </div>

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

            {/* CAB */}
            <div className="lg:col-span-2">
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
                <option>Sedan</option>
                <option>SUV</option>
                <option>Innova</option>
              </select>
            </div>

            {/* BUTTON */}
            <div className="lg:col-span-2">
              <button
                onClick={onSearch}
                className="h-[40px] w-full rounded-xl bg-[#0056D2] text-sm font-bold text-white shadow-md transition hover:bg-[#0047b3]"
              >
                Search
              </button>
            </div>
          </div>

          {/* TRUST SECTION */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 px-4 py-3 text-[11px] text-slate-600 md:text-xs">
            <span>✅ Verified Drivers</span>
            <span>💰 Best Price</span>
            <span>🎧 24/7 Support</span>
            <span>🔒 Secure</span>
            <span>❌ Free Cancellation</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const inputClass =
  "h-[40px] w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0056D2] focus:ring-4 focus:ring-blue-100";