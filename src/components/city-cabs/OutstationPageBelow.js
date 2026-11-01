import Link from "next/link";
import { CalendarCheck, Clock3, IndianRupee, MapPin, ShieldCheck, Smartphone } from "../icons/rscIcons";
import { WhyGrid } from "./CityLandingBlocks";
import { pickOutstationRoutes } from "../../lib/cityOutstationRoutes";
import { cityCabLandingPath } from "../../lib/cityCabPaths";
import { MAIN_PAGE_CITY_SLUGS, cityBySlug } from "../../lib/seo/cities";

const WHY_ITEMS = [
  {
    icon: Clock3,
    title: "On-Time, Every Time",
    body: "Share pickup time and landmark. The assigned driver follows that slot after you confirm."
  },
  {
    icon: IndianRupee,
    title: "Transparent Pricing",
    body: "Hatchback, Sedan, SUV and Van fares show before you pay. Tolls extra unless listed."
  },
  {
    icon: ShieldCheck,
    title: "Safety First",
    body: "Verified drivers and AC cabs. Fuel and driver are included in the published fare."
  },
  {
    icon: MapPin,
    title: "Widespread Availability",
    body: "Outstation, local, airport and hourly cabs from the cities Cabzii publishes."
  },
  {
    icon: CalendarCheck,
    title: "24/7 Service",
    body: "Early temple darshan or a late drop — book the slot that matches your trip."
  },
  {
    icon: Smartphone,
    title: "Easy Booking",
    body: "Pick From and To, choose a cab type, pay 50% to confirm. Call or WhatsApp if you need help."
  }
];

export function looksLikeHtml(value) {
  return /<\/?[a-z][\s\S]*>/i.test(String(value || ""));
}

/** Admin-written article only — SEO panel HTML, route body, or package description. */
export function cmsPageHtml(item) {
  const es = item?.enterpriseSeo && typeof item.enterpriseSeo === "object" ? item.enterpriseSeo : {};
  return String(item?.body || es.longSeoContent || item?.longSeoContent || item?.description || "").trim();
}

/** Renders admin-written SEO copy (HTML or plain text). Nothing is auto-filled. */
export function SeoPageArticle({ html, className = "" }) {
  const raw = String(html || "").trim();
  if (!raw) return null;
  if (looksLikeHtml(raw)) {
    return (
      <article
        className={`prose prose-slate max-w-none overflow-x-auto break-words text-left text-sm leading-relaxed text-slate-700 [&_h1]:text-left [&_h2]:text-left [&_h3]:text-left [&_img]:max-w-full [&_p]:text-left [&_table]:block [&_table]:overflow-x-auto [&_ul]:text-left [&_ol]:text-left ${className}`}
        dangerouslySetInnerHTML={{ __html: raw }}
      />
    );
  }
  return (
    <article className={`max-w-none whitespace-pre-line text-left text-sm leading-relaxed text-slate-700 ${className}`}>
      {raw}
    </article>
  );
}

export default function OutstationPageBelow({ fromName, fromSlug, toName, faqs = [], children }) {
  const routes = fromSlug ? pickOutstationRoutes(fromSlug, { direction: "from", limit: 16 }) : [];
  const cities = MAIN_PAGE_CITY_SLUGS.map((slug) => cityBySlug(slug)).filter(Boolean);
  const pair = fromName && toName && fromName.toLowerCase() !== toName.toLowerCase();

  return (
    <div className="bg-white">
      <WhyGrid title="Why Cabzii Cabs" items={WHY_ITEMS} align="left" />

      {children ? <div className="section-shell py-8 sm:py-10">{children}</div> : null}

      {routes.length ? (
        <section className="border-t border-slate-100 py-8 sm:py-10">
          <div className="section-shell">
            <h2 className="text-left text-lg font-bold text-slate-900 sm:text-xl">Popular Outstation Cab Routes</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
              {routes.map((route) => (
                <li key={route.href}>
                  <Link href={route.href} className="text-sm text-slate-700 hover:text-[var(--cabzii-brand)] hover:underline">
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {cities.length ? (
        <section className="border-t border-slate-100 bg-[#f8fafc] py-8 sm:py-10">
          <div className="section-shell">
            <h2 className="text-left text-lg font-bold text-slate-900 sm:text-xl">Cab Services by City</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-6">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={cityCabLandingPath(city.slug)}
                    className="text-sm text-slate-700 hover:text-[var(--cabzii-brand)] hover:underline"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {faqs.length ? (
        <section className="border-t border-slate-100 py-8 sm:py-10">
          <div className="section-shell">
            <h2 className="text-left text-lg font-bold text-slate-900 sm:text-xl">Frequently Asked Questions</h2>
            <p className="mt-2 text-left text-sm text-slate-500">
              Common questions on this {pair ? `${fromName} to ${toName}` : fromName} cab booking.
            </p>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2">
              {faqs.map(([question, answer], index) => (
                <li key={question}>
                  <details className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
                      {index + 1}. {question}
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{answer}</p>
                  </details>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}
    </div>
  );
}
