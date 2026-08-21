import Link from "next/link";
import Breadcrumbs from "./seo/Breadcrumbs";
import FaqSection from "./seo/FaqSection";
import SerpRichBar from "./seo/SerpRichBar";
import BookingCtaBar from "./seo/BookingCtaBar";
import RelatedSeoLinks from "./seo/RelatedSeoLinks";
import { peerCitiesForHub, isTamilNaduCity } from "../lib/seo";
import { getCityFaqs } from "../lib/seo/content";
import { formatSerpPrice } from "../lib/seo/serpRichData";
import {
  tunedCabBookingDescription,
  tunedCabBookingH1,
  tunedActingDriverH1
} from "../lib/seo/metadataTuning";
import { servicesForCityHub } from "../lib/seo/programmaticMeta";
import { routeToCabSearchHref } from "../lib/routeTrip";
import { routesForCity } from "../lib/seo/routes";
import { servicePath } from "../lib/seo/services";

export default function CitySeoPage({
  city,
  variant,
  extraBody = "",
  headingOverride = "",
  reviewStats,
  priceFrom
}) {
  const isCab = variant === "cab";
  const title = headingOverride || (isCab ? tunedCabBookingH1(city) : tunedActingDriverH1(city));
  const lead = isCab ? tunedCabBookingDescription(city) : `Book a Cabzii Call Driver / acting driver in ${city.name} for your own car — local, outstation and airport driver service. Cabzii assigns a professional driver after you book.`;

  const hubPath = isCab ? `/cab-booking/${city.slug}` : `/acting-driver/${city.slug}`;
  const faqs = getCityFaqs(city, isCab ? "cab" : "driver");
  const cityRoutes = routesForCity(city.slug).slice(0, 8);
  const topServices = isCab ? servicesForCityHub(city.slug, 8) : servicesForCityHub(city.slug, 4);
  const bookHref = isCab
    ? `/cabs?city=${encodeURIComponent(city.slug)}`
    : `/call-driver`;

  return (
    <article className="section-shell cabzii-seo-landing">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Locations", path: "/locations" },
            { name: city.name, path: hubPath }
          ]}
        />

        <p className="cabzii-seo-kicker">
          {city.state} · Cabzii
        </p>
        <h1>{title}</h1>
        <p className="cabzii-seo-lead">{lead}</p>

        <BookingCtaBar
          variant="compact"
          bookHref={bookHref}
          bookLabel={isCab ? `Book cab in ${city.name}` : `Book a driver in ${city.name}`}
        />

        {isCab ? (
          <SerpRichBar
            ratingValue={reviewStats?.ratingValue}
            reviewCount={reviewStats?.reviewCount}
            priceLabel={formatSerpPrice(priceFrom || 999)}
            badges={[
              { label: "Vehicles: Dzire, Etios, Innova, Crysta" },
              { label: "Service: 24×7 Available" },
              { label: `City: ${city.name}` }
            ]}
          />
        ) : null}

        {extraBody ? (
          <div
            className="prose prose-slate mt-6 max-w-none text-sm text-slate-700 md:text-base"
            dangerouslySetInnerHTML={{ __html: extraBody }}
          />
        ) : null}

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Link
            href={isCab ? "/cabs" : "/call-driver"}
            className="cabzii-btn cabzii-btn-primary cabzii-btn-sm"
          >
            {isCab ? `Book cab in ${city.name}` : `Book a driver in ${city.name}`}
          </Link>
          <Link href="/cabs" className="cabzii-btn cabzii-btn-secondary cabzii-btn-sm">
            Browse all cabs
          </Link>
          <Link href="/call-driver" className="cabzii-btn cabzii-btn-secondary cabzii-btn-sm">
            Call Driver services
          </Link>
        </div>

        {isCab && city.slug === "chennai" ? (
          <section className="cabzii-seo-block rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <h2>Chennai cabs — hourly packages (4 hours &amp; 8 hours)</h2>
            <p className="mt-1.5 text-[11px] text-slate-700 sm:text-xs">
              Compare local cab packages on Cabzii — 4 hours / 40 km and 8 hours / 80 km slabs plus outstation and airport
              cabs across Chennai.
            </p>
          </section>
        ) : null}

        {isCab ? (
          <section className="cabzii-seo-block rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <h2>How to book a cab in {city.name}</h2>
            <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-[11px] sm:text-xs text-slate-700">
              <li>Enter pickup and drop location (or choose airport / outstation)</li>
              <li>Login with your 10-digit mobile number &amp; OTP</li>
              <li>Compare Dzire, Ertiga, Innova &amp; Tempo — see fares upfront</li>
              <li>Confirm booking — driver details on SMS / WhatsApp</li>
            </ol>
          </section>
        ) : null}

        {city.slug === "chennai" ? (
          <section className="cabzii-seo-block rounded-xl border border-sky-200 bg-sky-50/80 p-3 sm:p-4">
            <h2>Chennai travel guide</h2>
            <p className="mt-1.5 text-[11px] text-slate-700 sm:text-xs">
              {isCab
                ? "New on our blog: cab booking in Chennai, acting driver hire, taxi near me and Tirupati routes — from fares to vehicle tips."
                : "Need context on acting driver packages, call driver options and how they compare to full cab booking in Chennai?"}
            </p>
            <Link
              href="/blog/cab-booking-in-chennai-complete-guide-2026"
              className="mt-2 inline-block text-[11px] font-semibold sm:text-xs text-[var(--cabzii-brand)] hover:underline"
            >
              Cab Booking in Chennai — Complete Guide 2026 →
            </Link>
          </section>
        ) : null}

        <section className="cabzii-seo-block">
          <h2>
            {isCab ? "Popular cab services" : "Driver services"} in {city.name}
          </h2>
          <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
            {topServices.map((svc) => (
              <li key={svc.slug}>
                <Link
                  href={servicePath(svc, city)}
                  title={`${svc.name} in ${city.name} — book on Cabzii.in`}
                  className="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm hover:border-[var(--cabzii-brand)]/30 hover:text-[var(--cabzii-brand)]"
                >
                  <span className="block">{svc.name} in {city.name}</span>
                  <span className="mt-0.5 block text-xs font-normal text-slate-500">
                    View {svc.name.toLowerCase()} packages →
                  </span>
                </Link>
              </li>
            ))}
            {!isCab ? (
              <li>
                <Link
                  href={`/acting-driver/${city.slug}`}
                  className="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm hover:border-[var(--cabzii-brand)]/30"
                >
                  Acting driver packages
                </Link>
              </li>
            ) : null}
          </ul>
        </section>

        {cityRoutes.length ? (
          <section className="cabzii-seo-block">
            <h2>Popular routes from {city.name}</h2>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {cityRoutes.map((route) => (
                <li key={route.slug}>
                  <Link
                    href={routeToCabSearchHref(route)}
                    className="inline-block rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]"
                  >
                    {route.fromCity.name} → {route.toCity.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="cabzii-seo-block">
          <h2>
            {isCab ? "Why book cabs on Cabzii?" : "Why hire acting drivers on Cabzii?"}
          </h2>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[11px] text-slate-700 sm:text-xs">
            <li>Instant online booking with clear fare breakdown</li>
            <li>Verified vendors and professional drivers in {city.name}</li>
            <li>Outstation, airport, local and tour options in one place</li>
            <li>Support on WhatsApp for quick trip changes</li>
          </ul>
        </section>

        <FaqSection title={`${city.name} — FAQ`} faqs={faqs} />

        <RelatedSeoLinks
          page={isCab ? "cabs" : "drivers"}
          title={isCab ? `Related cab services near ${city.name}` : `Related driver services near ${city.name}`}
        />

        <section className="cabzii-seo-block">
          <h2>
            {isTamilNaduCity(city) ? "Other Tamil Nadu cities" : "Other service cities"}
          </h2>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {peerCitiesForHub(city, 12).map((c) => (
              <li key={c.slug}>
                <Link
                  href={isCab ? `/cab-booking/${c.slug}` : `/acting-driver/${c.slug}`}
                  className="inline-block rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-[var(--cabzii-brand)]"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/locations" className="mt-2 inline-block text-[11px] font-semibold sm:text-xs text-[var(--cabzii-brand)] hover:underline">
            View all service locations →
          </Link>
        </section>
    </article>
  );
}
