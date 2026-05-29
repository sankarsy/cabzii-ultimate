"use client";

import { motion } from "framer-motion";
import { useSiteSettings } from "./SiteSettingsProvider";
import { getIcon, STAT_ICON_STYLES, UsersIcon } from "./icons";

const FALLBACK_STATS = [
  { value: "50K+", label: "Happy Customers", iconKey: "users" },
  { value: "10K+", label: "Trips Completed", iconKey: "car" },
  { value: "500+", label: "Verified Drivers", iconKey: "driver" },
  { value: "150+", label: "Cities Covered", iconKey: "pin" },
  { value: "4.9/5", label: "Customer Rating", iconKey: "star" }
];

export default function HeroStats() {
  const settings = useSiteSettings();
  const stats = settings.heroStats?.length ? settings.heroStats : FALLBACK_STATS;

  return (
    <section aria-label="Company statistics" className="relative z-10 py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8"
      >
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
            {stats.map((stat, index) => {
              const Icon = getIcon(stat.iconKey) || UsersIcon;
              const style = STAT_ICON_STYLES[stat.iconKey] || STAT_ICON_STYLES.users;

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.35 }}
                  className="flex items-center gap-2.5 px-3 py-4 sm:px-4 sm:py-5"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${style.iconBg} ${style.iconColor}`}
                  >
                    <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-base font-bold leading-tight text-slate-900 sm:text-lg">{stat.value}</p>
                    <p className="mt-0.5 text-xs leading-snug text-slate-500">{stat.label}</p>
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
