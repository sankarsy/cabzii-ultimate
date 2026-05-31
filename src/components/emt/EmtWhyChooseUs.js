import { WHY_STATS } from "../../lib/emt/constants";

const FEATURES = [
  { icon: "✅", title: "Verified partners", desc: "Airlines, hotels & cab vendors you can trust." },
  { icon: "💰", title: "Best price guarantee", desc: "Compare fares side-by-side before you pay." },
  { icon: "🔒", title: "Secure checkout", desc: "OTP login and encrypted payment flow." },
  { icon: "🎧", title: "24×7 support", desc: "WhatsApp & phone when you need help on trip." }
];

export default function EmtWhyChooseUs() {
  return (
    <section className="border-y border-slate-100 bg-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center text-xl font-bold text-slate-900 sm:text-2xl">Why book on cabzii.in</h2>
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {WHY_STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold text-[var(--cabzii-brand)] sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cabzii-brand)]/10 text-xl">
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
              <p className="mt-1 text-xs text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
