"use client";

import { motion } from "framer-motion";
import { useSiteSettings } from "./SiteSettingsProvider";
import { getIcon, ShieldCheckIcon, WHY_ICON_STYLES } from "./icons";

const FALLBACK_FEATURES = [
  { title: "Sanitized Cabs", subtitle: "Clean & hygienic vehicles", iconKey: "shield" },
  { title: "Live Tracking", subtitle: "Real-time trip tracking", iconKey: "tracking" },
  { title: "Transparent Pricing", subtitle: "No hidden charges", iconKey: "tag" },
  { title: "24/7 Customer Support", subtitle: "We are here to help", iconKey: "headset" },
  { title: "Doorstep Pickup", subtitle: "On-time pickup", iconKey: "pickup" },
  { title: "Safe & Secure", subtitle: "Your safety is our priority", iconKey: "lock" }
];

export default function WhyChooseUs() {
  const settings = useSiteSettings();
  const features = settings.whyChooseUs?.length ? settings.whyChooseUs : FALLBACK_FEATURES;

  return (
    <section aria-label="Why choose Cabzii" className="py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8"
      >
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col divide-y divide-slate-100 lg:flex-row lg:divide-x lg:divide-y-0">
            {features.map((feature, index) => {
              const Icon = getIcon(feature.iconKey) || ShieldCheckIcon;
              const style = WHY_ICON_STYLES[feature.iconKey] || WHY_ICON_STYLES.shield;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.35 }}
                  className="flex flex-1 items-center gap-3 px-4 py-4 sm:px-5 sm:py-5"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${style.iconBg} ${style.iconColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug text-slate-900">{feature.title}</p>
                    <p className="mt-0.5 text-xs leading-snug text-slate-600">{feature.subtitle}</p>
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
