"use client";

import { motion } from "framer-motion";

const FEATURES = [
  {
    title: "Sanitized Cabs",
    subtitle: "Clean & hygienic vehicles",
    icon: ShieldCheckIcon,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    title: "Live Tracking",
    subtitle: "Real-time trip tracking",
    icon: TrackingIcon,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600"
  },
  {
    title: "Transparent Pricing",
    subtitle: "No hidden charges",
    icon: TagIcon,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    title: "24/7 Customer Support",
    subtitle: "We are here to help",
    icon: HeadsetIcon,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600"
  },
  {
    title: "Doorstep Pickup",
    subtitle: "On-time pickup",
    icon: CarPickupIcon,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600"
  },
  {
    title: "Safe & Secure",
    subtitle: "Your safety is our priority",
    icon: LockIcon,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600"
  }
];

export default function WhyChooseUs() {
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
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
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
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${feature.iconBg} ${feature.iconColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-snug text-slate-900">{feature.title}</p>
                    <p className="mt-0.5 text-xs leading-snug text-slate-500">{feature.subtitle}</p>
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

function ShieldCheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function TrackingIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z" />
      <circle cx="12" cy="11" r="2.5" />
      <circle cx="12" cy="11" r="6" strokeDasharray="3 3" />
    </svg>
  );
}

function TagIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function HeadsetIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M3 11v2a7 7 0 0 0 7 7h1M21 11v2a7 7 0 0 1-7 7h-1" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function CarPickupIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M5 11l1.4-4.1A2 2 0 0 1 8.3 6h7.4a2 2 0 0 1 1.9 1.4L19 11" />
      <path d="M3 12h18v4a1 1 0 0 1-1 1h-1M3 12v4a1 1 0 0 0 1 1h1" />
      <circle cx="7.5" cy="17" r="1.3" />
      <circle cx="16.5" cy="17" r="1.3" />
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
