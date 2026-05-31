import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import FaqSection from "./FaqSection";
import { cityAreas } from "../../lib/seo/content";
import { tunedServiceDescription } from "../../lib/seo/metadataTuning";
import { servicePath } from "../../lib/seo/services";
import { routesForCity } from "../../lib/seo/routes";

export default function ServiceLandingPage({ city, service, faqs }) {
  const path = servicePath(service, city);
  const areas = cityAreas(city.slug);
  const cityRoutes = routesForCity(city.slug).slice(0, 6);
  const searchHref = `/cabs/results?serviceTripType=outstation&from=${encodeURIComponent(city.name)}&to=&date=${new Date().toISOString().split("T")[0]}&time=09:00`;
  const h1 =
    service.slug === "car-rental" && city.slug === "chennai"
      ? "Car Rental in Chennai"
      : `${service.name} in ${city.name}`;
  const lead = tunedServiceDescription(service, city);

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: city.name, path: `/cab-booking/${city.slug}` },
            { name: service.name, path }
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
          {city.state} · {service.name}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">{h1}</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">{lead}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={searchHref}
            className="rounded-full bg-[var(--cabzii-brand)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0046b0]"
          >
            Book {service.name} in {city.name}
          </Link>
          <Link
            href={`/cab-booking/${city.slug}`}
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-sky-300"
          >
            All cabs in {city.name}
          </Link>
          <a
            href="https://wa.me/9944197416"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#25D366]/40 bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#20BA5A]"
          >
            WhatsApp support
          </a>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Why book on Cabzii?</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {service.highlights.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {areas.length ? (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Areas we serve in {city.name}</h2>
            <p className="mt-2 text-sm text-slate-600">
              Pickup available across popular neighbourhoods including {areas.join(", ")} and nearby localities.
            </p>
          </section>
        ) : null}

        {cityRoutes.length ? (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Popular routes from {city.name}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {cityRoutes.map((route) => (
                <li key={route.slug}>
                  <Link
                    href={`/routes/${route.slug}`}
                    className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[var(--cabzii-brand)]/30 hover:text-[var(--cabzii-brand)]"
                  >
                    {route.fromCity.name} → {route.toCity.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <FaqSection title={`${service.name} in ${city.name} — FAQ`} faqs={faqs} />

        <section className="mt-10 rounded-2xl bg-[var(--cabzii-brand)] p-6 text-white md:p-8">
          <h2 className="text-xl font-bold md:text-2xl">Ready to book {service.name.toLowerCase()}?</h2>
          <p className="mt-2 text-sm text-blue-100 md:text-base">
            Compare vendors, see fare upfront and confirm in minutes — no app download required.
          </p>
          <Link
            href={searchHref}
            className="mt-4 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[var(--cabzii-brand)] hover:bg-slate-100"
          >
            Search & book now
          </Link>
        </section>
    </article>
  );
}
