import Link from "next/link";
import Breadcrumbs from "./seo/Breadcrumbs";
import FaqSection from "./seo/FaqSection";
import { SEO_CITIES, SEO_SERVICES } from "../lib/seo";
import { getCityFaqs } from "../lib/seo/content";
import { tunedCabBookingDescription, tunedCabBookingH1, tunedActingDriverH1 } from "../lib/seo/metadataTuning";
import { routesForCity } from "../lib/seo/routes";
import { servicePath } from "../lib/seo/services";

export default function CitySeoPage({ city, variant }) {
  const isCab = variant === "cab";
  const title = isCab ? tunedCabBookingH1(city) : tunedActingDriverH1(city);
  const lead = isCab ? tunedCabBookingDescription(city) : `Hire verified acting drivers and chauffeurs in ${city.name} for hourly, daily and outstation trips on Cabzii.`;

  const hubPath = isCab ? `/cab-booking/${city.slug}` : `/acting-driver/${city.slug}`;
  const faqs = getCityFaqs(city, isCab ? "cab" : "driver");
  const cityRoutes = routesForCity(city.slug).slice(0, 8);
  const topServices = SEO_SERVICES.slice(0, 6);

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Locations", path: "/locations" },
            { name: city.name, path: hubPath }
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
          {city.state} · Cabzii
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">{title}</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">{lead}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={isCab ? "/cabs" : "/drivers"}
            className="rounded-full bg-[var(--cabzii-brand)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0046b0]"
          >
            {isCab ? `Book cab in ${city.name}` : `Hire driver in ${city.name}`}
          </Link>
          <Link href="/cabs" className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800">
            Browse all cabs
          </Link>
          <Link href="/drivers" className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700">
            Browse drivers
          </Link>
        </div>

        {isCab ? (
          <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-900">How to book a cab in {city.name}</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
              <li>Enter pickup and drop location (or choose airport / outstation)</li>
              <li>Login with your 10-digit mobile number &amp; OTP</li>
              <li>Compare Dzire, Ertiga, Innova &amp; Tempo — see fares upfront</li>
              <li>Confirm booking — driver details on SMS / WhatsApp</li>
            </ol>
          </section>
        ) : null}

        {city.slug === "chennai" ? (
          <section className="mt-10 rounded-xl border border-sky-200 bg-sky-50/80 p-5">
            <h2 className="text-lg font-bold text-slate-900">Chennai travel guide</h2>
            <p className="mt-2 text-sm text-slate-700">
              {isCab
                ? "New on our blog: cab booking in Chennai, acting driver hire, taxi near me and Tirupati routes — from fares to vehicle tips."
                : "Need context on acting driver packages, call driver options and how they compare to full cab booking in Chennai?"}
            </p>
            <Link
              href="/blog/cab-booking-in-chennai-complete-guide-2026"
              className="mt-3 inline-block text-sm font-semibold text-[var(--cabzii-brand)] hover:underline"
            >
              Cab Booking in Chennai — Complete Guide 2026 →
            </Link>
          </section>
        ) : null}

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
            {isCab ? "Popular cab services" : "Driver services"} in {city.name}
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {topServices.map((svc) => (
              <li key={svc.slug}>
                <Link
                  href={servicePath(svc, city)}
                  className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:border-[var(--cabzii-brand)]/30 hover:text-[var(--cabzii-brand)]"
                >
                  {svc.name} in {city.name}
                </Link>
              </li>
            ))}
            {!isCab ? (
              <li>
                <Link
                  href={`/acting-driver/${city.slug}`}
                  className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:border-[var(--cabzii-brand)]/30"
                >
                  Acting driver packages
                </Link>
              </li>
            ) : null}
          </ul>
        </section>

        {cityRoutes.length ? (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Popular routes from {city.name}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {cityRoutes.map((route) => (
                <li key={route.slug}>
                  <Link
                    href={`/routes/${route.slug}`}
                    className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]"
                  >
                    {route.fromCity.name} → {route.toCity.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
            {isCab ? "Why book cabs on Cabzii?" : "Why hire acting drivers on Cabzii?"}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>Instant online booking with clear fare breakdown</li>
            <li>Verified vendors and professional drivers in {city.name}</li>
            <li>Outstation, airport, local and tour options in one place</li>
            <li>Support on WhatsApp for quick trip changes</li>
          </ul>
        </section>

        <FaqSection title={`${city.name} — FAQ`} faqs={faqs} />

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Other cities</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {SEO_CITIES.filter((c) => c.slug !== city.slug)
              .slice(0, 12)
              .map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/cab-booking/${c.slug}`}
                    className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[var(--cabzii-brand)]"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
          </ul>
          <Link href="/locations" className="mt-3 inline-block text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
            View all service locations →
          </Link>
        </section>
    </article>
  );
}
