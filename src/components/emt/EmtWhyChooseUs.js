import { WHY_STATS } from "../../lib/emt/constants";

const FEATURES = [
  { icon: "✅", title: "Verified partners", desc: "Airlines, hotels & cab vendors you can trust." },
  { icon: "💰", title: "Best price guarantee", desc: "Compare fares side-by-side before you pay." },
  { icon: "🔒", title: "Secure checkout", desc: "OTP login and encrypted payment flow." },
  { icon: "🎧", title: "24×7 support", desc: "WhatsApp & phone when you need help on trip." }
];

export default function EmtWhyChooseUs() {
  return (
    <section className="border-y border-slate-100 bg-white py-10 sm:py-12">
      <div className="section-shell">
        <h2 className="mb-6 text-center text-lg font-bold text-slate-900 sm:mb-8 sm:text-2xl">Why book on cabzii.in</h2>
        <div className="mb-8 grid grid-cols-2 gap-3 sm:mb-10 sm:grid-cols-4 sm:gap-4">
          {WHY_STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold text-[var(--cabzii-brand)] sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3 text-left sm:block sm:text-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--cabzii-brand)]/10 text-lg sm:mx-auto sm:mb-2 sm:h-12 sm:w-12 sm:text-xl">
                {f.icon}
              </div>
              <div className="min-w-0 sm:block">
                <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600 sm:mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
