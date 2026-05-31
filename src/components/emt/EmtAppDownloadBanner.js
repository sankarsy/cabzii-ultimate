import { BRAND } from "../../lib/brand";

export default function EmtAppDownloadBanner() {
  return (
    <section className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-[var(--cabzii-header)] px-6 py-10 text-center text-white sm:flex-row sm:text-left">
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Mobile app</p>
            <h2 className="mt-1 text-xl font-bold sm:text-2xl">Get the cabzii.in app</h2>
            <p className="mt-2 text-sm text-white/85">
              Book cabs, flights &amp; hotels on the go — exclusive deals on {BRAND.domain}.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              Coming soon
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              <span
                className="cursor-not-allowed rounded-xl bg-black/60 px-5 py-3 text-sm font-bold text-white/70"
                aria-disabled="true"
              >
                App Store
              </span>
              <span
                className="cursor-not-allowed rounded-xl bg-[var(--cabzii-brand)]/60 px-5 py-3 text-sm font-bold text-white/70"
                aria-disabled="true"
              >
                Google Play
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
