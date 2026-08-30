import { resolveWhyFeatures, resolveWhySection, resolveWhyStats } from "../../lib/marketingFromSettings";
import { getTrustIcon, TRUST_ICON_STYLES } from "../icons/heroIcons";
import { DEFAULT_SITE_SETTINGS } from "../../lib/siteSettingsDefaults";

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
    <section className="border-y border-slate-200/80 bg-slate-50/50 py-6 sm:py-8">
      <div className="section-shell">
        <div className="text-center">
          {whySection.eyebrow ? (
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--cabzii-brand)]">
              {whySection.eyebrow}
            </p>
          ) : null}
          <h2 className="mt-1 text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
            {whySection.title}
          </h2>
          {whySection.subtitle ? (
            <p className="mx-auto mt-1 max-w-xl text-xs leading-relaxed text-slate-600 sm:text-sm">
              {whySection.subtitle}
            </p>
          ) : null}
        </div>

        {whyStats.length ? (
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {whyStats.map((s) => {
              const iconKey = statIconKey(s.value);
              const Icon = getTrustIcon(iconKey);
              const style = TRUST_ICON_STYLES[iconKey] || TRUST_ICON_STYLES.verified;
              return (
                <li key={`${s.value}-${s.label}`}>
                  <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${style.iconBg} ${style.iconColor}`}
                      aria-hidden
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="pr-0.5 text-left leading-tight">
                      <span className="block text-[11px] font-bold text-slate-900">{s.value}</span>
                      <span className="block text-[10px] font-medium text-slate-500">{s.label}</span>
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = getTrustIcon(f.iconKey);
            const style = TRUST_ICON_STYLES[f.iconKey] || TRUST_ICON_STYLES.verified;
            return (
              <div key={f.title} className="flex gap-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.iconBg} ${style.iconColor}`}
                  aria-hidden
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-bold leading-snug text-slate-900">{f.title}</h3>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-slate-600">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
