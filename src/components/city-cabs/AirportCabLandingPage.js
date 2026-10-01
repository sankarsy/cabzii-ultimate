import SeoRouteCabListing from "../seo/SeoRouteCabListing";
import CityCabFaqAccordion from "./CityCabFaqAccordion";
import Breadcrumbs from "../seo/Breadcrumbs";
import DynamicPageHub from "../seo/DynamicPageHub";
import {
  AreaChips,
  CAB_TRUST,
  ContactNap,
  HowToSteps,
  LinkChips,
  PlaceGrid,
  RouteFareGrid,
  TrustStrip,
  WhyGrid
} from "./CityLandingBlocks";
import { actingDriverLandingPath, airportTaxiPublicPath, cityCabLandingPath } from "../../lib/cityCabPaths";
import { ORG_EMAIL, ORG_PHONE } from "../../lib/seo/constants";
import { Clock3, IndianRupee, Plane, ShieldCheck } from "lucide-react";

export default function AirportCabLandingPage({ data, cabs = [] }) {
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
          <h1 className="mt-3 text-center text-lg font-bold leading-tight tracking-tight text-slate-900 sm:text-xl md:text-2xl">
            {data.h1}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-slate-600 sm:text-sm">{data.lead}</p>
        </div>
      </div>

      <SeoRouteCabListing initialTrip={data.bookingTrip} initialCabs={cabs} />
      <TrustStrip items={CAB_TRUST} />

      <WhyGrid
        title={`Why Cabzii airport cabs in ${city.name}`}
        items={[
          {
            icon: Clock3,
            title: "Book the pickup time",
            body: "Set arrival or departure on the form. Cabzii assigns a driver after you confirm."
          },
          {
            icon: IndianRupee,
            title: "Fare before you pay",
            body: "Airport quotes show before payment. Parking, tolls and extra km are extra unless listed."
          },
          {
            icon: Plane,
            title: "Pickup and drop",
            body: `Arrivals: ${airportLabel} as From. Departures: city as From and the airport as To.`
          },
          {
            icon: ShieldCheck,
            title: "Assigned after you book",
            body: "You book the cab with Cabzii. A professional driver is assigned after confirmation."
          }
        ]}
      />

      <HowToSteps
        title={`How ${city.name} airport taxi booking works`}
        subtitle="Choose pickup or drop, confirm the fare, pay 50%, then receive driver details."
        steps={data.howToBook}
      />

      <section className="bg-[#f4f6fa] py-8">
        <div className="section-shell grid gap-4 lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)]">
          <ContactNap
            title={`Cabzii ${city.name} taxi contact`}
            source="airport_cab_contact"
            message={`Hi Cabzii, I need an airport cab in ${city.name}.\nAirport: ${airportLabel}\nPickup or drop:\nFlight time:\nPassengers:\nVehicle:`}
          />
          <AreaChips title={`Service areas from ${airportLabel}`} areas={data.localAreas} />
        </div>
      </section>

      <article className="section-shell cabzii-seo-landing py-5 sm:py-8">
        <section className="cabzii-seo-block">
          <h2>Airport cab booking in {city.name}</h2>
          <p>
            Book a pickup or drop at {airportLabel} on this page. Compare Hatchback, Sedan, SUV and Innova, then pay
            50% to confirm. Driver details follow after confirmation. Call {ORG_PHONE} or email {ORG_EMAIL}.
          </p>
          {data.airportDetails ? <p className="mt-2">{data.airportDetails}</p> : null}
          {data.aboutCity ? <p className="mt-2">{data.aboutCity}</p> : null}
          {(data.vehicles || []).length ? (
            <p className="mt-2 text-sm text-slate-600">
              Vehicles: {(data.vehicles || []).join(" · ")}. Fuel and driver included. Airport parking, tolls, extra km
              and waiting beyond the quote are extra unless listed.
            </p>
          ) : null}
        </section>

        {data.extraBody ? (
          <div
            className="prose prose-slate cabzii-seo-block max-w-none text-sm text-slate-700"
            dangerouslySetInnerHTML={{ __html: data.extraBody }}
          />
        ) : null}

        <PlaceGrid title={`Common drops from ${airportLabel}`} places={data.places} />
      </article>

      <RouteFareGrid
        title={`Popular outstation cab routes from ${city.name}`}
        subtitle="After you land, onward city-to-city trips use featured corridors. Approximate fares. Tolls extra unless listed."
        routes={data.fromRoutes}
      />

      <section className="section-shell pb-8">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">Airport cabs in other cities</h2>
        <LinkChips items={data.airportPeerLinks} />
        {data.nearby?.length ? (
          <>
            <h3 className="mt-6 text-sm font-bold text-slate-900 sm:text-base">Cab services by city</h3>
            <LinkChips items={data.nearby} />
          </>
        ) : null}
      </section>

      <section className="section-shell pb-10">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">Frequently asked questions</h2>
        <p className="mt-1 text-sm text-slate-600">Airport pickup, drop and fares in {city.name}.</p>
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
