import CityHubMarketplace from "./CityHubMarketplace";
import CityCabFaqAccordion from "./CityCabFaqAccordion";
import DynamicPageHub from "../seo/DynamicPageHub";
import SeoPageView from "../seo/SeoPageView";
import { SeoPageArticle } from "./OutstationPageBelow";
import { CityServiceGrid, LinkChips, PlaceGrid, RouteFareGrid, WhyGrid } from "./CityLandingBlocks";
import { actingDriverLandingPath, airportTaxiPublicPath, cityCabLandingPath } from "../../lib/cityCabPaths";
import { cityServiceLinks } from "../../lib/cityShowcase";
import { tunedServiceH1 } from "../../lib/seo/metadataTuning";
import { CalendarCheck, Clock3, IndianRupee, MapPin, ShieldCheck, Smartphone } from "../icons/rscIcons";

function faqObjects(faqs) {
  return (Array.isArray(faqs) ? faqs : [])
    .map((row) => {
      if (Array.isArray(row)) return { question: row[0], answer: row[1] };
      return { question: row?.question, answer: row?.answer };
    })
    .filter((row) => String(row.question || "").trim() && String(row.answer || "").trim());
}

function quoteName(item) {
  const name = String(item?.name || "").trim();
  if (!name) return "Guest";
  const parts = name.split(/\s+/);
  if (parts.length === 1) return parts[0];
  const last = parts[1]?.[0];
  return last ? `${parts[0]} ${last}.` : parts[0];
}

export default function OutstationCabLandingPage({
  city,
  service,
  extraBody = "",
  faqs = [],
  cabs = [],
  quotes = [],
  fromRoutes = [],
  places = [],
  localAreas = [],
  bookingTrip,
  airportLabel = "",
  path = ""
}) {
  const cityLinks = cityServiceLinks(city);
  const h1 = tunedServiceH1(service, city);
  const lead = `One-way and round-trip cabs from ${city.name}. Fares shown before you confirm.`;
  const faqList = faqObjects(faqs);

  return (
    <div>
      <SeoPageView pageType="service" city={city.slug} service={service.slug} />
      <div className="bg-[#f4f6fa]">
        <div className="section-shell pt-6 pb-2 sm:pt-8">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--cabzii-cta)]">
            Outstation cab · {city.name}
          </p>
          <h1 className="mt-1 px-2 text-center text-[1.05rem] font-extrabold leading-snug tracking-tight text-slate-900 sm:px-1 sm:text-2xl sm:leading-tight md:text-[1.75rem]">
            {h1}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl px-2 text-center text-[13px] text-slate-500 sm:px-1 sm:text-sm">{lead}</p>
        </div>
      </div>

      <CityHubMarketplace
        city={city}
        initialTrip={bookingTrip}
        initialCabs={cabs}
        localAreas={localAreas}
        airportLabel={airportLabel}
        showHero={false}
      />

      <RouteFareGrid
        title={`Top Outstation Routes in ${city.name}`}
        subtitle="Approximate starting fares. Live quote depends on date and vehicle. Tolls extra unless listed."
        routes={fromRoutes}
      />

      <WhyGrid
        title="Why Cabzii Cabs"
        items={[
          {
            icon: Clock3,
            title: "On-time pickup",
            body: "Share pickup time and landmark. Driver details are sent after you confirm."
          },
          {
            icon: IndianRupee,
            title: "Fare before you pay",
            body: "City, airport and outstation quotes show first. Tolls extra unless listed."
          },
          {
            icon: ShieldCheck,
            title: "Fuel and driver included",
            body: "Parking, permits and extra km are extra unless the quote lists them."
          },
          {
            icon: MapPin,
            title: "Door pickup",
            body: `Enter the street in ${city.name}. This is not a station-only transfer.`
          },
          {
            icon: CalendarCheck,
            title: "Confirm, then assign",
            body: "A driver is assigned for that trip after you confirm."
          },
          {
            icon: Smartphone,
            title: "Easy booking",
            body: "Use the form on this page. Call or WhatsApp if you need help. No separate app required."
          }
        ]}
      />

      {extraBody ? (
        <article className="bg-white py-8 sm:py-10">
          <div className="section-shell max-w-3xl">
            <SeoPageArticle html={extraBody} />
          </div>
        </article>
      ) : null}

      {quotes.length ? (
        <section className="bg-white py-2 sm:py-4">
          <div className="section-shell max-w-3xl">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">What travellers say</h2>
            <ul className="mt-3 space-y-4">
              {quotes.map((item) => (
                <li key={String(item._id ?? item.name)} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-800">“{item.message}”</p>
                  <p className="mt-2 text-sm font-semibold text-slate-600">— {quoteName(item)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <PlaceGrid title={`Top Tourist Places to Visit in ${city.name}`} places={places} />

      <CityServiceGrid title={`Cab services in ${city.name}`} items={cityLinks} />

      <section className="section-shell py-8 sm:py-10">
        <h2 className="text-center text-lg font-bold text-slate-900 sm:text-xl">Frequently asked questions</h2>
        <p className="mt-1 text-center text-xs text-slate-600 sm:text-sm">
          Outstation, one-way and round-trip cabs from {city.name}.
        </p>
        <div className="mt-4">
          <CityCabFaqAccordion faqs={faqList} />
        </div>
        <div className="mt-6">
          <LinkChips
            items={[
              { href: cityCabLandingPath(city.slug), label: "Cab booking" },
              { href: airportTaxiPublicPath(city.slug), label: "Airport taxi" },
              { href: actingDriverLandingPath(city.slug), label: "Acting driver" },
              { href: "/tariff", label: "Published tariff" }
            ]}
          />
        </div>
        <DynamicPageHub bare onlyIfStored className="mt-8" fallbackPage="cabs" citySlug={city.slug} path={path} />
      </section>
    </div>
  );
}
