import Image from "next/image";
import Link from "next/link";
import { Check, X as XIcon, MapPin, CalendarDays, Phone } from "lucide-react";
import FaqSection from "../seo/FaqSection";
import WhatsAppIcon from "../WhatsAppIcon";
import { resolveMediaUrl } from "../../lib/media";
import { whatsappBookingUrl, telUrl } from "../../lib/conversion";

function inr(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

/** SEO landing page for a tour package — hero, overview, itinerary, pricing, gallery, FAQs, CTA. */
export default function TourPackageLanding({ pkg, related = [] }) {
  const bookingHref = `/holidays/${pkg.slug || pkg._id}`;
  const cover = resolveMediaUrl(pkg.image);
  const gallery = (pkg.gallery || []).map(resolveMediaUrl).filter(Boolean);
  const durationLabel =
    pkg.days > 0
      ? `${pkg.days} Day${pkg.days > 1 ? "s" : ""}${pkg.nights > 0 ? ` / ${pkg.nights} Night${pkg.nights > 1 ? "s" : ""}` : ""}`
      : pkg.duration;
  const waUrl = whatsappBookingUrl({
    message: `Hi Cabzii, I'm interested in the "${pkg.name}" tour package${durationLabel ? ` (${durationLabel})` : ""}. Please share availability and final price.`
  });
  const hasDiscount = Number(pkg.originalPrice) > Number(pkg.price);
  const faqs = (pkg.faqs || [])
    .filter((f) => f.question && f.answer)
    .map((f) => [f.question, f.answer]);
  const itinerary = (pkg.itinerary || []).filter((d) => d.title || d.details);

  return (
    <section className="bg-cabzii-page pb-10">
      {/* Hero */}
      <div className="relative isolate overflow-hidden bg-[var(--cabzii-header)]">
        {cover ? (
          <Image src={cover} alt={pkg.imageAlt || pkg.name} fill sizes="100vw" className="object-cover opacity-30" />
        ) : null}
        <div className="relative mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
          <nav className="text-xs text-white/70" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/holidays" className="hover:text-white">Tour Packages</Link>
            <span className="mx-1.5">/</span>
            <span className="text-white/90">{pkg.name}</span>
          </nav>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            {pkg.seoTitle || `${pkg.name} — Book Online`}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85">
            {durationLabel ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" strokeWidth={1.75} aria-hidden /> {durationLabel}
              </span>
            ) : null}
            {pkg.destination || pkg.city ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                {pkg.destination || pkg.city}
                {pkg.state ? `, ${pkg.state}` : ""}
              </span>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{inr(pkg.price)}</span>
              {hasDiscount ? <span className="text-sm text-white/60 line-through">{inr(pkg.originalPrice)}</span> : null}
              <span className="text-xs text-white/70">per package</span>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href={bookingHref}
              className="cabzii-tap rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[var(--cabzii-brand)] shadow-lg transition hover:bg-blue-50"
            >
              Book this package
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="cabzii-tap inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#20BA5A]"
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp quote
            </a>
            <a
              href={telUrl()}
              className="cabzii-tap inline-flex items-center gap-1.5 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <Phone className="h-4 w-4" strokeWidth={2} aria-hidden /> Call now
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {/* Overview */}
        {pkg.description || pkg.seoDescription ? (
          <article className="cabzii-card mt-6 p-5 md:p-6">
            <h2 className="text-lg font-bold text-slate-900">Package overview</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {pkg.description || pkg.seoDescription}
            </p>
            {(pkg.highlights || []).length > 0 ? (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {pkg.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ) : null}

        {/* Itinerary */}
        {itinerary.length > 0 ? (
          <section className="cabzii-card mt-6 p-5 md:p-6">
            <h2 className="text-lg font-bold text-slate-900">Day-wise itinerary</h2>
            <ol className="mt-4 space-y-4 border-l-2 border-blue-100 pl-5">
              {itinerary.map((d, i) => (
                <li key={`${d.day}-${i}`} className="relative">
                  <span className="absolute -left-[1.85rem] flex h-6 w-6 items-center justify-center rounded-full bg-[var(--cabzii-brand)] text-[10px] font-bold text-white">
                    {d.day || i + 1}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Day {d.day || i + 1}{d.title ? ` — ${d.title}` : ""}
                  </h3>
                  {d.details ? <p className="mt-1 text-sm leading-relaxed text-slate-600">{d.details}</p> : null}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {/* Inclusions / Exclusions */}
        {(pkg.inclusions || []).length > 0 || (pkg.exclusions || []).length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {(pkg.inclusions || []).length > 0 ? (
              <section className="cabzii-card p-5">
                <h2 className="text-base font-bold text-slate-900">Inclusions</h2>
                <ul className="mt-3 space-y-1.5">
                  {pkg.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {(pkg.exclusions || []).length > 0 ? (
              <section className="cabzii-card p-5">
                <h2 className="text-base font-bold text-slate-900">Exclusions</h2>
                <ul className="mt-3 space-y-1.5">
                  {pkg.exclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" strokeWidth={2.5} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        ) : null}

        {/* Pricing by cab type */}
        {(pkg.cabTypes || []).length > 0 ? (
          <section className="cabzii-card mt-6 overflow-hidden p-5 md:p-6">
            <h2 className="text-lg font-bold text-slate-900">Pricing by vehicle</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-4">Vehicle</th>
                    <th className="py-2 pr-4">Seats</th>
                    <th className="py-2">Package price</th>
                  </tr>
                </thead>
                <tbody>
                  {pkg.cabTypes.map((ct) => (
                    <tr key={ct.id || ct.label} className="border-b border-slate-100 last:border-0">
                      <td className="py-2.5 pr-4 font-semibold text-slate-800">{ct.label}</td>
                      <td className="py-2.5 pr-4 text-slate-600">{ct.seats}</td>
                      <td className="py-2.5 font-bold text-slate-900">
                        {inr(Math.round(Number(pkg.price || 0) * Number(ct.multiplier || 1)))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Toll, permit & driver bata as per actuals unless stated in inclusions.</p>
          </section>
        ) : null}

        {/* Gallery */}
        {gallery.length > 0 ? (
          <section className="mt-6">
            <h2 className="text-lg font-bold text-slate-900">Gallery</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gallery.map((src, i) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={src}
                    alt={`${pkg.name} — photo ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* FAQs */}
        {faqs.length > 0 ? (
          <div className="mt-6">
            <FaqSection title={`${pkg.name} — FAQ`} faqs={faqs} />
          </div>
        ) : null}

        {/* Policies */}
        {pkg.cancellationPolicy || pkg.termsAndConditions ? (
          <section className="cabzii-card mt-6 p-5 md:p-6">
            {pkg.cancellationPolicy ? (
              <>
                <h2 className="text-base font-bold text-slate-900">Cancellation policy</h2>
                <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-slate-600">{pkg.cancellationPolicy}</p>
              </>
            ) : null}
            {pkg.termsAndConditions ? (
              <>
                <h2 className={`text-base font-bold text-slate-900 ${pkg.cancellationPolicy ? "mt-4" : ""}`}>
                  Terms & conditions
                </h2>
                <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-slate-600">{pkg.termsAndConditions}</p>
              </>
            ) : null}
          </section>
        ) : null}

        {/* Related packages */}
        {related.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">Related tour packages</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              {related.map((rp) => {
                const img = resolveMediaUrl(rp.image);
                return (
                  <Link
                    key={String(rp._id)}
                    href={`/tour-packages/${rp.slug || rp._id}`}
                    className="cabzii-card cabzii-card-interactive group overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] bg-slate-100">
                      {img ? (
                        <Image src={img} alt={rp.imageAlt || rp.name} fill sizes="33vw" className="object-cover transition group-hover:scale-105" />
                      ) : null}
                    </div>
                    <div className="p-3.5">
                      <h3 className="line-clamp-2 text-sm font-bold text-slate-900">{rp.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">{rp.duration || rp.city}</p>
                      <p className="mt-1.5 text-sm font-extrabold text-[var(--cabzii-brand)]">{inr(rp.price)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Bottom CTA */}
        <section className="mt-8 rounded-2xl bg-[var(--cabzii-brand)] p-6 text-center text-white md:p-8">
          <h2 className="text-xl font-bold">Ready to book {pkg.name}?</h2>
          <p className="mt-1.5 text-sm text-blue-100">Instant confirmation · Verified drivers · Transparent pricing</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            <Link href={bookingHref} className="cabzii-tap rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-[var(--cabzii-brand)] hover:bg-blue-50">
              Book now — {inr(pkg.price)}
            </Link>
            <a href={waUrl} target="_blank" rel="noreferrer" className="cabzii-tap inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#20BA5A]">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </section>
      </div>
    </section>
  );
}
