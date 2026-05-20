"use client";

import { motion } from "framer-motion";

const STATS = [
  {
    value: "50K+",
    label: "Happy Customers",
    icon: UsersIcon,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    value: "10K+",
    label: "Trips Completed",
    icon: CarIcon,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600"
  },
  {
    value: "500+",
    label: "Verified Drivers",
    icon: DriverIcon,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    value: "150+",
    label: "Cities Covered",
    icon: PinIcon,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600"
  },
  {
    value: "4.9/5",
    label: "Customer Rating",
    icon: StarIcon,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600"
  }
];

export default function HeroStats() {
  return (
    <section
      aria-label="Company statistics"
      className="relative z-10 py-6 md:py-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8"
      >
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
            {STATS.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.35 }}
                  className="flex items-center gap-3 px-4 py-5 sm:px-5"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${stat.iconBg} ${stat.iconColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-lg font-bold leading-tight text-slate-900">
                      {stat.value}
                    </p>

                    <p className="mt-0.5 text-xs leading-snug text-slate-500">
                      {stat.label}
                    </p>
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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CarIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
}

function DriverIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3a3 3 0 0 0-3 3v1H8a2 2 0 0 0-2 2v2h12v-2a2 2 0 0 0-2-2h-1V6a3 3 0 0 0-3-3z" />
      <path d="M6 14h12v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2z" />
    </svg>
  );
}

function PinIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

function StarIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  );
}