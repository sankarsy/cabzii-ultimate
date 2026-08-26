import Link from "next/link";
import { cabBookingLinks, actingDriverLinks, serviceLinks } from "../../lib/seo/internalLinks";
import { PRIMARY_FOCUS_CITY_SLUGS } from "../../lib/seo/cities";

export default function CabsCategorySeo() {
  const hubs = cabBookingLinks(12);
  const chennaiServices = serviceLinks("chennai", 8);

  return (
    <article className="section-shell space-y-6 pb-8 pt-2 text-sm text-slate-700">
      <section>
        <h2 className="text-lg font-bold text-slate-900">Cab booking on Cabzii</h2>
        <p className="mt-2 leading-relaxed">
          Cabzii is a cab booking platform, not a vendor marketplace. Search a city or route, compare vehicle packages,
          book and pay Cabzii, then a matching partner is assigned. Use this page for live inventory, or open a city hub
          when you already know the city.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Vehicle and trip types</h2>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          <li className="rounded-xl border border-slate-200 bg-white p-3">
            <strong>Local cabs</strong> — 4-hour / 8-hour city packages for meetings, hospitals and errands.
          </li>
          <li className="rounded-xl border border-slate-200 bg-white p-3">
            <strong>Airport taxis</strong> — pickup and drop at cities that have a commercial airport; otherwise a transfer
            to the nearest airport.
          </li>
          <li className="rounded-xl border border-slate-200 bg-white p-3">
            <strong>Outstation &amp; one-way</strong> — highway packages and true one-way drops without empty-return confusion.
          </li>
          <li className="rounded-xl border border-slate-200 bg-white p-3">
            <strong>Cab / car rental</strong> — chauffeur-driven hourly hire (not self-drive). Sedan, Ertiga, Innova, tempo.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">City cab hubs</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {hubs.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-block rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-sky-300"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-slate-500">
          Primary operating cities: {PRIMARY_FOCUS_CITY_SLUGS.join(", ")}.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Chennai services</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {chennaiServices.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-block rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-sky-300"
              >
                {item.label}
              </Link>
            </li>
          ))}
          {actingDriverLinks(4).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-block rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-sky-300"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
