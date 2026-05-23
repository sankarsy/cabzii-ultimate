import Link from "next/link";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Breadcrumbs from "./seo/Breadcrumbs";
import FaqSection from "./seo/FaqSection";
import { SEO_CITIES, SEO_SERVICES } from "../lib/seo";
import { getCityFaqs } from "../lib/seo/content";
import { routesForCity } from "../lib/seo/routes";
import { servicePath } from "../lib/seo/services";

export default function CitySeoPage({ city, variant }) {
  const isCab = variant === "cab";
  const title = isCab ? `Cab & Taxi Booking in ${city.name}` : `Acting Driver in ${city.name}`;
  const lead = isCab
    ? `Book outstation cabs, airport taxis, local rentals and tempo travellers in ${city.name}, ${city.state} with transparent pricing on Cabzii.`
    : `Hire verified acting drivers and chauffeurs in ${city.name} for hourly, daily and outstation trips on Cabzii.`;

  const hubPath = isCab ? `/cab-booking/${city.slug}` : `/acting-driver/${city.slug}`;
  const faqs = getCityFaqs(city, isCab ? "cab" : "driver");
  const cityRoutes = routesForCity(city.slug).slice(0, 8);
  const topServices = SEO_SERVICES.slice(0, 6);

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
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
            href={`/search?q=${encodeURIComponent(isCab ? `cab ${city.name}` : `acting driver ${city.name}`)}&pickup=${encodeURIComponent(city.name)}`}
            className="rounded-full bg-[#0056D2] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0046b0]"
          >
            {isCab ? `Search cabs in ${city.name}` : `Find drivers in ${city.name}`}
          </Link>
          <Link href="/cabs" className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800">
            Browse all cabs
          </Link>
          <Link href="/drivers" className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700">
            Browse drivers
          </Link>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
            {isCab ? "Popular cab services" : "Driver services"} in {city.name}
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {topServices.map((svc) => (
              <li key={svc.slug}>
                <Link
                  href={servicePath(svc, city)}
                  className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:border-[#0056D2]/30 hover:text-[#0056D2]"
                >
                  {svc.name} in {city.name}
                </Link>
              </li>
            ))}
            {!isCab ? (
              <li>
                <Link
                  href={`/acting-driver/${city.slug}`}
                  className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:border-[#0056D2]/30"
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
                    className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#0056D2]"
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
                    className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#0056D2]"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
          </ul>
          <Link href="/locations" className="mt-3 inline-block text-sm font-semibold text-[#0056D2] hover:underline">
            View all service locations →
          </Link>
        </section>
      </article>
      <Footer />
    </main>
  );
}
