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
  ServiceCards,
  TrustStrip,
  WhyGrid
} from "./CityLandingBlocks";
import { actingDriverLandingPath, airportTaxiPublicPath } from "../../lib/cityCabPaths";
import { ORG_EMAIL, ORG_PHONE } from "../../lib/seo/constants";
import { Clock3, IndianRupee, MapPin, ShieldCheck } from "lucide-react";

export default function CityCabLandingPage({ data, cabs = [] }) {
  const { city } = data;

  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="section-shell py-5 sm:py-7">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: `${city.name} cabs`, path: data.path }
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

      <ServiceCards
        title={`Our services in ${city.name}`}
        subtitle="Book local and hourly on this form. Airport, outstation and acting driver have their own pages."
        items={[
          {
            href: data.path,
            label: "Local / hourly cab",
            hint: "4 hr and 8 hr packages. Choose Local on the form above."
          },
          {
            href: `/services/outstation-cab/${city.slug}`,
            label: "Outstation cab",
            hint: "One-way and round trip on published routes."
          },
          {
            href: airportTaxiPublicPath(city.slug),
            label: "Airport taxi",
            hint: "Pickup and drop at the published terminal."
          },
          {
            href: actingDriverLandingPath(city.slug),
            label: "Acting driver",
            hint: "A chauffeur for your own car — not a Cabzii taxi."
          }
        ]}
      />

      <WhyGrid
        title={`Why book a Cabzii cab in ${city.name}`}
        items={[
          {
            icon: IndianRupee,
            title: "Fare before you pay",
            body: "Local, airport and outstation quotes show first. Tolls extra unless listed."
          },
          {
            icon: Clock3,
            title: "Confirm, then assign",
            body: "Share pickup time and landmark. A driver is assigned after you confirm."
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
          }
        ]}
      />

      <HowToSteps
        title={`How cab booking in ${city.name} works`}
        subtitle="Pickup, fare, 50% confirmation, then driver details on WhatsApp or SMS."
        steps={data.howToBook}
      />

      <RouteFareGrid
        title={`Popular outstation routes from ${city.name}`}
        subtitle="Approximate catalog starting fares. Live quote depends on date and vehicle. Tolls extra unless listed."
        routes={data.fromRoutes}
      />

      <section className="bg-[#f4f6fa] py-8">
        <div className="section-shell grid gap-4 lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)]">
          <ContactNap
            title={`Cabzii ${city.name} contact`}
            source="city_cab_contact"
            message={`Hi Cabzii, I need a cab in ${city.name}.\nPickup:\nDrop:\nDate:\nPassengers:\nVehicle:`}
          />
          <AreaChips title={`Pickup areas in ${city.name}`} areas={data.localAreas} />
        </div>
      </section>

      <article className="section-shell cabzii-seo-landing py-5 sm:py-8">
        <section className="cabzii-seo-block">
          <h2>Cab booking in {city.name}</h2>
          <p>
            Use the form on this page for local, hourly, airport and outstation trips in {city.name}. Compare Hatchback,
            Sedan, SUV and Tempo Traveller, then pay the published 50% advance. Driver details follow after confirmation.
            Call {ORG_PHONE} or email {ORG_EMAIL}. There is no separate Cabzii app required.
          </p>
          {data.aboutCity ? <p className="mt-2">{data.aboutCity}</p> : null}
        </section>

        {data.extraBody ? (
          <div
            className="prose prose-slate cabzii-seo-block max-w-none text-sm text-slate-700"
            dangerouslySetInnerHTML={{ __html: data.extraBody }}
          />
        ) : null}

        <PlaceGrid title={`Places people book cabs for in ${city.name}`} places={data.places} />
      </article>

      {data.nearby?.length ? (
        <section className="section-shell pb-8">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">Cab services in nearby cities</h2>
          <p className="mt-1 text-sm text-slate-600">Curated city hubs — not a dump of every locality.</p>
          <LinkChips items={data.nearby} />
        </section>
      ) : null}

      <section className="section-shell pb-10">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">Frequently asked questions</h2>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">Booking, fares and airport cabs in {city.name}.</p>
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
