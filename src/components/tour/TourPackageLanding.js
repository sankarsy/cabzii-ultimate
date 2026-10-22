"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, X as XIcon } from "lucide-react";
import CityHubMarketplace from "../city-cabs/CityHubMarketplace";
import OutstationPageBelow, { SeoPageArticle, cmsPageHtml } from "../city-cabs/OutstationPageBelow";
import { resolveMediaUrl } from "../../lib/media";
import { packageSeoHref } from "../../lib/holidayHome";
import { airportInfoForCity } from "../../lib/seo/airports";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { customerPickupCity, packageBookingTrip, packageDestinationName } from "../../lib/packageTrip";

function inr(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

function hasList(list) {
  return Array.isArray(list) && list.some((x) => String(x || "").trim());
}

/** SEO landing: cab marketplace + only admin-written page copy (no auto article, no vehicle price table). */
export default function TourPackageLanding({ pkg, related = [] }) {
  const { city: selectedCity, locating } = useSelectedCity();
  const origin = useMemo(() => customerPickupCity(selectedCity), [selectedCity]);
  const destName = useMemo(() => packageDestinationName(pkg), [pkg]);
  const bookingTrip = useMemo(() => packageBookingTrip(origin, destName), [origin, destName]);
  const airport = airportInfoForCity(origin.slug);
  const airportLabel = airport?.name ? `${airport.name} taxi` : "";
  const pickupReady = !locating && Boolean(origin.name);

  const gallery = (pkg.gallery || []).map(resolveMediaUrl).filter(Boolean);
  const faqs = (pkg.faqs || pkg.faq || [])
    .filter((f) => f.question && f.answer)
    .map((f) => [f.question, f.answer]);
  const itinerary = (pkg.itinerary || []).filter((d) => d.title || d.details);
  const pageHtml = cmsPageHtml(pkg);

  return (
    <div>
      <div className="bg-[#f4f6fa]">
        <div className="section-shell pt-6 pb-2 sm:pt-8">
          <nav className="mb-2 break-words px-1 text-center text-[11px] text-slate-500 sm:text-xs" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--cabzii-brand)]">
              Home
            </Link>
            <span className="mx-1.5 text-slate-300">/</span>
            <Link href="/holidays" className="hover:text-[var(--cabzii-brand)]">
              Tour Packages
            </Link>
            <span className="mx-1.5 text-slate-300">/</span>
            <span className="text-slate-600">{pkg.name}</span>
          </nav>
          {!pickupReady ? (
            <h1 className="text-center text-xl font-extrabold text-slate-900">Finding pickup location…</h1>
          ) : null}
        </div>
      </div>

      {pickupReady ? (
        <CityHubMarketplace city={origin} initialTrip={bookingTrip} airportLabel={airportLabel} />
      ) : (
        <p className="section-shell py-10 text-center text-sm text-slate-500">Loading cabs from your location…</p>
      )}

      <OutstationPageBelow fromName={origin.name} fromSlug={origin.slug} toName={destName} faqs={faqs}>
        <div className="space-y-6 text-left">
          {pageHtml ? (
            <SeoPageArticle html={pageHtml} />
          ) : null}

          {hasList(pkg.highlights) ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {pkg.highlights.filter((h) => String(h || "").trim()).map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" strokeWidth={2.5} aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          ) : null}

          {itinerary.length > 0 ? (
            <section>
              <h2 className="text-lg font-bold text-slate-900">Day-wise itinerary</h2>
              <ol className="mt-4 space-y-4 border-l-2 border-blue-100 pl-5">
                {itinerary.map((d, i) => (
                  <li key={`${d.day}-${i}`} className="relative">
                    <span className="absolute -left-[1.85rem] flex h-6 w-6 items-center justify-center rounded-full bg-[var(--cabzii-brand)] text-[10px] font-bold text-white">
                      {d.day || i + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Day {d.day || i + 1}
                      {d.title ? ` — ${d.title}` : ""}
                    </h3>
                    {d.details ? <p className="mt-1 text-sm leading-relaxed text-slate-600">{d.details}</p> : null}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {hasList(pkg.inclusions) || hasList(pkg.exclusions) ? (
            <div className="grid gap-4 md:grid-cols-2">
              {hasList(pkg.inclusions) ? (
                <section>
                  <h2 className="text-base font-bold text-slate-900">Inclusions</h2>
                  <ul className="mt-3 space-y-1.5">
                    {pkg.inclusions.filter((item) => String(item || "").trim()).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" strokeWidth={2.5} aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {hasList(pkg.exclusions) ? (
                <section>
                  <h2 className="text-base font-bold text-slate-900">Exclusions</h2>
                  <ul className="mt-3 space-y-1.5">
                    {pkg.exclusions.filter((item) => String(item || "").trim()).map((item) => (
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

          {gallery.length > 0 ? (
            <section>
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

          {pkg.cancellationPolicy || pkg.termsAndConditions ? (
            <section>
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

          {related.length > 0 ? (
            <section>
              <h2 className="text-base font-bold text-slate-900">Related tour packages</h2>
              <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {related.map((rp) => {
                  const img = resolveMediaUrl(rp.image);
                  return (
                    <Link
                      key={String(rp._id)}
                      href={packageSeoHref(rp)}
                      className="overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-[var(--cabzii-brand)]/40 hover:shadow-sm"
                    >
                      <div className="relative h-20 bg-slate-100 sm:h-[5.5rem]">
                        {img ? (
                          <Image src={img} alt={rp.imageAlt || rp.name} fill sizes="20vw" className="object-cover" />
                        ) : null}
                      </div>
                      <div className="p-2">
                        <h3 className="line-clamp-2 text-[11px] font-semibold leading-snug text-slate-900 sm:text-xs">{rp.name}</h3>
                        {rp.duration || rp.city ? (
                          <p className="mt-0.5 text-[10px] text-slate-500">{rp.duration || rp.city}</p>
                        ) : null}
                        <p className="mt-1 text-xs font-bold text-[var(--cabzii-brand)]">{inr(rp.price)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </OutstationPageBelow>
    </div>
  );
}
