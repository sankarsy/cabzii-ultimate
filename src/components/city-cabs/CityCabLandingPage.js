import CityHubMarketplace from "./CityHubMarketplace";
import CityHubSeoArticle from "./CityHubSeoArticle";
import CityCabFaqAccordion from "./CityCabFaqAccordion";
import DynamicPageHub from "../seo/DynamicPageHub";
import { CityServiceGrid, LinkChips, PlaceGrid, RouteFareGrid, WhyGrid } from "./CityLandingBlocks";
import { actingDriverLandingPath, airportTaxiPublicPath } from "../../lib/cityCabPaths";
import { cityServiceLinks } from "../../lib/cityShowcase";
import { CalendarCheck, Clock3, IndianRupee, MapPin, ShieldCheck, Smartphone } from "../icons/rscIcons";

export default function CityCabLandingPage({ data, cabs = [], quotes = [] }) {
  const { city } = data;
  const cityLinks = cityServiceLinks(city);

  return (
    <div>
      <div className="bg-[#f4f6fa]">
        <div className="section-shell pt-6 pb-2 sm:pt-8">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--cabzii-cta)]">
            Cab booking · {city.name}
          </p>
          <h1 className="mt-1 px-1 text-center text-lg font-extrabold leading-tight tracking-tight text-slate-900 sm:text-2xl md:text-[1.75rem]">
            {data.h1}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl px-1 text-center text-sm text-slate-500">
            Book reliable and affordable cab services in {city.name} with Cabzii.
          </p>
        </div>
      </div>

      <CityHubMarketplace
        city={city}
        initialTrip={data.bookingTrip}
        initialCabs={cabs}
        localAreas={data.localAreas}
        airportLabel={data.airportLinks?.[0]?.label || data.airportHeading}
        showHero={false}
      />

      <RouteFareGrid
        title={`Top Outstation Routes in ${city.name}`}
        subtitle="Approximate starting fares. Live quote depends on date and vehicle. Tolls extra unless listed."
        routes={data.fromRoutes}
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

      <CityHubSeoArticle
        city={city}
        aboutCity={data.aboutCity}
        extraBody={data.extraBody}
        localAreas={data.localAreas}
        routes={data.fromRoutes}
        quotes={quotes}
      />

      <PlaceGrid title={`Top Tourist Places to Visit in ${city.name}`} places={data.places} />

      <CityServiceGrid title={`Cab services in ${city.name}`} items={cityLinks} />

      <section className="section-shell py-8 sm:py-10">
        <h2 className="text-center text-lg font-bold text-slate-900 sm:text-xl">Frequently asked questions</h2>
        <p className="mt-1 text-center text-xs text-slate-600 sm:text-sm">Booking, fares and airport cabs in {city.name}.</p>
        <div className="mt-4">
          <CityCabFaqAccordion faqs={data.faqs} />
        </div>
        <div className="mt-6">
          <LinkChips
            items={[
              { href: airportTaxiPublicPath(city.slug), label: "Airport taxi" },
              { href: `/services/outstation-cab/${city.slug}`, label: "Outstation cab" },
              { href: actingDriverLandingPath(city.slug), label: "Acting driver" },
              { href: "/tariff", label: "Published tariff" }
            ]}
          />
        </div>
        <DynamicPageHub bare onlyIfStored className="mt-8" fallbackPage="cabs" citySlug={city.slug} path={data.path} />
      </section>
    </div>
  );
}
