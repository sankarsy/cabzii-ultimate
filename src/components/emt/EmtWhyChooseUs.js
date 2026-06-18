"use client";

import { resolveWhyFeatures, resolveWhySection, resolveWhyStats } from "../../lib/marketingFromSettings";
import { getTrustIcon, TRUST_ICON_STYLES } from "../icons/heroIcons";
import { useSiteSettings } from "../SiteSettingsProvider";
import SectionIntro from "../ui/SectionIntro";

export default function EmtWhyChooseUs() {
  const settings = useSiteSettings();
  const whySection = resolveWhySection(settings);
  const whyStats = resolveWhyStats(settings);
  const features = resolveWhyFeatures(settings);

  return (
    <section className="border-y border-slate-200/80 bg-white py-10 sm:py-14">
      <div className="section-shell">
        <SectionIntro
          eyebrow={whySection.eyebrow}
          title={whySection.title}
          subtitle={whySection.subtitle}
          className="text-center sm:mx-auto sm:max-w-2xl"
        />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-4 sm:gap-4">
          {whyStats.map((s) => (
            <div key={s.label} className="cabzii-card px-3 py-4 text-center sm:px-4 sm:py-5">
              <p className="text-xl font-extrabold tracking-tight text-[var(--cabzii-brand)] sm:text-2xl">{s.value}</p>
              <p className="mt-1 text-[11px] font-semibold text-slate-600 sm:text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {features.map((f) => {
            const Icon = getTrustIcon(f.iconKey);
            const style = TRUST_ICON_STYLES[f.iconKey] || TRUST_ICON_STYLES.verified;
            return (
              <div key={f.title} className="cabzii-card flex gap-3.5 p-4 sm:block sm:p-5 sm:text-center">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-slate-100/90 sm:mx-auto sm:mb-3 sm:h-12 sm:w-12 ${style.iconBg} ${style.iconColor}`}
                >
                  <Icon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
