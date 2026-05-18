"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "50K+", label: "Happy Customers", icon: UsersIcon },
  { value: "10K+", label: "Trips Completed", icon: CarIcon },
  { value: "500+", label: "Verified Drivers", icon: DriverIcon },
  { value: "150+", label: "Cities Covered", icon: PinIcon },
  { value: "4.9/5", label: "Customer Rating", icon: StarIcon }
];

export default function HeroStats() {
  return (
    <section aria-label="Company statistics" className="relative z-10 bg-white pb-8 pt-2 lg:pb-10 lg:pt-0">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8"
      >
        <div className="rounded-full border border-slate-200/90 bg-white py-3 shadow-[0_8px_30px_rgba(15,23,42,0.08)] sm:py-3.5">
          <div className="flex items-stretch divide-x divide-slate-200 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 + index * 0.06, duration: 0.4 }}
                  className="flex min-w-[9.5rem] flex-1 items-center justify-center gap-2.5 px-3 sm:min-w-0 sm:gap-3 sm:px-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#0056D2] sm:h-11 sm:w-11">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-base font-bold leading-tight text-slate-900 sm:text-lg">{stat.value}</p>
                    <p className="text-[11px] font-medium text-slate-500 sm:text-xs">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function UsersIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
}

function DriverIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 3a3 3 0 0 0-3 3v1H8a2 2 0 0 0-2 2v2h12v-2a2 2 0 0 0-2-2h-1V6a3 3 0 0 0-3-3z" />
      <path d="M6 14h12v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2z" />
    </svg>
  );
}

function PinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

function StarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  );
}
