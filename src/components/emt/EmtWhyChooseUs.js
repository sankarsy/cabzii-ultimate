import { WHY_STATS } from "../../lib/emt/constants";
import { getIcon } from "../icons";
import SectionIntro from "../ui/SectionIntro";

const FEATURES = [
  { iconKey: "verified", title: "Verified partners", desc: "Background-checked drivers and trusted cab vendors across South India." },
  { iconKey: "price", title: "Best price guarantee", desc: "Compare fares side-by-side before you pay — no hidden charges." },
  { iconKey: "secure", title: "Secure checkout", desc: "OTP-verified booking with encrypted payment on cabzii.in." },
  { iconKey: "support", title: "24×7 support", desc: "WhatsApp and phone support before, during, and after your trip." }
];

export default function EmtWhyChooseUs() {
  return (
    <section className="border-y border-slate-200/80 bg-white py-10 sm:py-14">
      <div className="section-shell">
        <SectionIntro
          eyebrow="Why Cabzii"
          title="A premium cab booking experience"
          subtitle="Trusted by riders for airport transfers, outstation trips, and local hire across Chennai and 20+ cities."
          className="text-center sm:mx-auto sm:max-w-2xl"
        />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-4 sm:gap-4">
          {WHY_STATS.map((s) => (
            <div key={s.label} className="cabzii-card px-3 py-4 text-center sm:px-4 sm:py-5">
              <p className="text-xl font-extrabold tracking-tight text-[var(--cabzii-brand)] sm:text-2xl">{s.value}</p>
              <p className="mt-1 text-[11px] font-semibold text-slate-600 sm:text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {FEATURES.map((f) => {
            const Icon = getIcon(f.iconKey);
            return (
              <div key={f.title} className="cabzii-card flex gap-3.5 p-4 sm:block sm:p-5 sm:text-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--cabzii-brand)]/10 text-[var(--cabzii-brand)] sm:mx-auto sm:mb-3 sm:h-12 sm:w-12">
                  {Icon ? <Icon className="h-5 w-5 sm:h-6 sm:w-6" /> : null}
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
