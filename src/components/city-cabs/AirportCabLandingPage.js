import SeoRouteCabListing from "../seo/SeoRouteCabListing";
import CityCabFaqAccordion from "./CityCabFaqAccordion";
import Breadcrumbs from "../seo/Breadcrumbs";
import DynamicPageHub from "../seo/DynamicPageHub";
import AirportSeoArticle from "./AirportSeoArticle";
import { CAB_TRUST, LinkChips, TrustStrip } from "./CityLandingBlocks";
import { actingDriverLandingPath, airportTaxiPublicPath, cityCabLandingPath } from "../../lib/cityCabPaths";

export default function AirportCabLandingPage({ data, cabs = [], quotes = [] }) {
  const { city, airport } = data;
  const airportLabel = airport?.name || `${city.name} Airport`;

  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="section-shell py-5 sm:py-7">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: `${city.name} cabs`, path: data.cityHubPath || cityCabLandingPath(city.slug) },
              { name: "Airport cab booking", path: data.path }
            ]}
          />
          <h1 className="px-1 text-center text-lg font-bold leading-tight tracking-tight text-slate-900 sm:text-xl md:text-2xl">
            {data.h1}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl px-1 text-center text-xs text-slate-600 sm:text-sm">{data.lead}</p>
        </div>
      </div>

      <SeoRouteCabListing initialTrip={data.bookingTrip} initialCabs={cabs} showHero={false} />
      <TrustStrip items={CAB_TRUST} />

      <AirportSeoArticle
        city={city}
        airport={airport}
        extraBody={data.extraBody}
        localAreas={data.localAreas}
        places={data.places}
        vehicles={data.vehicles}
        quotes={quotes}
        fromRoutes={data.fromRoutes}
      />

      <section className="section-shell pb-10">
        <h2 className="text-left text-lg font-bold text-slate-900 sm:text-xl">Frequently asked questions</h2>
        <p className="mt-1 text-left text-sm text-slate-600">
          Airport pickup, drop and fares for {airportLabel}.
        </p>
        <div className="mt-4">
          <CityCabFaqAccordion faqs={data.faqs} />
        </div>
        <div className="mt-6">
          <LinkChips
            items={[
              { href: data.cityHubPath || cityCabLandingPath(city.slug), label: `${city.name} city cabs` },
              { href: `/services/outstation-cab/${city.slug}`, label: "Outstation cab" },
              { href: actingDriverLandingPath(city.slug), label: "Acting driver" },
              { href: airportTaxiPublicPath(city.slug), label: "Airport taxi" }
            ]}
          />
        </div>
        <DynamicPageHub bare onlyIfStored className="mt-8" fallbackPage="cabs" citySlug={city.slug} path={data.path} />
      </section>
    </div>
  );
}
