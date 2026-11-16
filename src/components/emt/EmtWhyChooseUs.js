"use client";

import { resolveWhyFeatures, resolveWhySection, resolveWhyStats } from "../../lib/marketingFromSettings";
import { getTrustIcon, TRUST_ICON_STYLES } from "../icons/heroIcons";
import { DEFAULT_SITE_SETTINGS } from "../../lib/siteSettingsDefaults";
import HomeSectionHeader from "../home/HomeSectionHeader";

const STAT_ICON = {
  otp: "secure",
  upfront: "price",
  partner: "verified",
  chennai: "verified",
  whatsapp: "support"
};

function statIconKey(value) {
  return STAT_ICON[String(value || "").trim().toLowerCase()] || "verified";
}

export default function EmtWhyChooseUs({ settings = DEFAULT_SITE_SETTINGS }) {
  const whySection = resolveWhySection(settings);
  const whyStats = resolveWhyStats(settings);
  const features = resolveWhyFeatures(settings);

  return (
    <section className="home-band home-band-white">
      <div className="section-shell">
        <HomeSectionHeader
          eyebrow={whySection.eyebrow}
          title={whySection.title}
          subtitle={whySection.subtitle}
        />

        {whyStats.length ? (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {whyStats.map((s) => {
              const iconKey = statIconKey(s.value);
              const Icon = getTrustIcon(iconKey);
              const style = TRUST_ICON_STYLES[iconKey] || TRUST_ICON_STYLES.verified;
              return (
                <li
                  key={`${s.value}-${s.label}`}
                  className="flex items-center gap-2.5 rounded-2xl border border-[var(--cabzii-border)] bg-[var(--cabzii-bg)] px-3 py-3"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.iconBg} ${style.iconColor}`}
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block text-sm font-extrabold text-[var(--cabzii-ink)]">{s.value}</span>
                    <span className="block text-[11px] font-medium text-[var(--cabzii-muted)]">{s.label}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = getTrustIcon(f.iconKey);
            return (
              <div
                key={f.title}
                className="flex h-full min-w-0 flex-col gap-2.5 rounded-2xl border border-[var(--cabzii-border)] bg-white p-4"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--cabzii-sky)] text-[var(--cabzii-brand)]"
                  aria-hidden
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold leading-snug tracking-tight text-[var(--cabzii-ink)]">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--cabzii-muted)]">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
