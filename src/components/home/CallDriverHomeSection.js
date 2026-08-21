import Link from "next/link";

export default function CallDriverHomeSection() {
  return (
    <section className="border-t border-slate-200 bg-gradient-to-br from-sky-50 to-white py-8 sm:py-12">
      <div className="section-shell">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--cabzii-brand)]">Call Driver</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          Need a Driver for Your Own Car?
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Book a trusted Cabzii Call Driver in Chennai and outstation. You choose the service — Cabzii assigns a
          professional driver after booking.
        </p>
        <p className="mt-3 text-sm font-medium text-slate-700">
          Local trips • Outstation • Airport • Monthly • Corporate • Valet
        </p>
        <Link href="/call-driver" className="cabzii-btn cabzii-btn-cta cabzii-tap mt-5 min-h-12 px-6">
          Book a Driver
        </Link>
      </div>
    </section>
  );
}
