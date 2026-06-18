"use client";

import { useEffect, useRef, useState } from "react";
import { resolveTrustCounters } from "../../lib/marketingFromSettings";
import { useSiteSettings } from "../SiteSettingsProvider";
import { getTrustIcon, TRUST_ICON_STYLES } from "../icons/heroIcons";

function useCountUp(target, start, durationMs = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return undefined;
    let frame;
    const t0 = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - t0) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, start, durationMs]);
  return value;
}

function CounterCard({ item, start }) {
  const value = useCountUp(item.animate ? item.value : 0, start && item.animate);
  const Icon = getTrustIcon(item.iconKey);
  const style = TRUST_ICON_STYLES[item.iconKey] || TRUST_ICON_STYLES.verified;

  const valueText = item.animate
    ? `${value.toLocaleString("en-IN")}${item.suffix || ""}`
    : item.display || `${item.value}${item.suffix || ""}`;

  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-3 py-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:px-4 sm:py-6">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full ${style.iconBg} ${style.iconColor}`}
        aria-hidden
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        {valueText}
      </p>
      <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">{item.label}</p>
    </div>
  );
}

/** Animated count-up trust counters; reads Hero stats from admin site settings. */
export default function TrustCounters() {
  const settings = useSiteSettings();
  const counters = resolveTrustCounters(settings);
  const ref = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setStart(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-t border-slate-200 bg-slate-50/70 py-8 sm:py-10" aria-label="Cabzii in numbers">
      <div className="section-shell">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {counters.map((item) => (
            <CounterCard key={item.label} item={item} start={start} />
          ))}
        </div>
      </div>
    </section>
  );
}
