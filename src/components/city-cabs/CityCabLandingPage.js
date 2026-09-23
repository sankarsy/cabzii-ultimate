import Image from "next/image";
import Link from "next/link";
import CityCabBookingWidget from "./CityCabBookingWidget";
import CityCabFaqAccordion from "./CityCabFaqAccordion";
import Breadcrumbs from "../seo/Breadcrumbs";
import TrackedLeadCtas from "../conversion/TrackedLeadCtas";
import DynamicPageHub from "../seo/DynamicPageHub";
import { actingDriverLandingPath } from "../../lib/cityCabPaths";

function LinkGrid({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="block rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 hover:border-[var(--cabzii-brand)] hover:text-[var(--cabzii-brand)]"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function CityCabLandingPage({ data }) {
  const { city } = data;

  return (
    <article className="section-shell py-6 sm:py-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Car Rental", path: "/car-rental" },
          { name: `${city.name} Cabs`, path: data.path }
        ]}
      />

      <header className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{data.h1}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{data.description}</p>
          {data.extraBody ? (
            <div
              className="prose prose-slate mt-4 max-w-none text-sm text-slate-700"
              dangerouslySetInnerHTML={{ __html: data.extraBody }}
            />
          ) : null}
          <div className="mt-3">
            <TrackedLeadCtas
              source="city_cab_hero"
              message={`Hi Cabzii, I need a cab in ${city.name}.\nPickup:\nDrop:\nDate:\nPassengers:\nVehicle:`}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { href: `/services/airport-taxi/${city.slug}`, label: "Airport taxi", hint: "Pickup and drop" },
              { href: `/services/outstation-cab/${city.slug}`, label: "Outstation cab", hint: "One-way and round-trip" },
              { href: `/services/hourly-rental/${city.slug}`, label: "Local package", hint: "4 hr / 8 hr hire" },
              { href: actingDriverLandingPath(city.slug), label: "Acting driver", hint: "Driver for your car" }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 hover:border-[var(--cabzii-brand)]"
              >
                <span className="block text-sm font-bold text-slate-900">{item.label}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{item.hint}</span>
              </Link>
            ))}
          </div>
        </div>
        <CityCabBookingWidget
          cityName={city.name}
          defaultFrom={data.bookingDefaultFrom}
          airportLabel={data.airportPickupLabel}
        />
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Cab Types</h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.cabTypes.map((cab) => (
            <li key={cab.id} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={cab.image}
                  alt={cab.imageAlt}
                  width={80}
                  height={64}
                  loading="lazy"
                  unoptimized={cab.image.endsWith(".svg")}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900">{cab.name}</h3>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-600">{cab.subtitle}</p>
                <p className="mt-1.5 text-xs font-semibold text-slate-900">{cab.fareLabel}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {cab.capacity} · {cab.luggage}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">How to Book a Cab in {city.name}</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.howToBook.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--cabzii-brand)]">Step {index + 1}</p>
              <h3 className="mt-1 text-sm font-bold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{step.subtitle}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">What&apos;s Included in Your Fare</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.fareItems.map((item) => (
            <li key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.subtitle}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Why Book With Cabzii</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.whyBook.map((item) => (
            <li key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.subtitle}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">{data.airportHeading}</h2>
        <p className="mt-2 text-sm text-slate-600">{data.airportIntro}</p>
        <LinkGrid items={data.airportLinks} />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Places to Visit with {city.name} Outstation Cabs</h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.places.map((place) => (
            <li key={place.name}>
              <Link href={place.href} className="block rounded-2xl border border-slate-200 bg-white p-4 hover:border-[var(--cabzii-brand)]">
                <h3 className="text-sm font-bold text-slate-900">{place.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{place.subtitle}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
        <div className="mt-4">
          <CityCabFaqAccordion faqs={data.faqs} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Top Cab Routes from {city.name}</h2>
        <LinkGrid items={data.fromRoutes} />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Top Cab Routes to {city.name}</h2>
        <LinkGrid items={data.toRoutes} />
      </section>

      <section className="mt-10 mb-4">
        <h2 className="text-xl font-bold text-slate-900">Nearby City Taxi Services</h2>
        <LinkGrid items={data.nearby} />
      </section>

      <DynamicPageHub bare onlyIfStored className="mt-10 mb-4" fallbackPage="cabs" citySlug={city.slug} path={data.path} />
    </article>
  );
}
