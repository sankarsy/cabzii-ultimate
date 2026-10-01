import CityCabFaqAccordion from "./CityCabFaqAccordion";
import ActingDriverPackageSection from "./ActingDriverPackageSection";
import Breadcrumbs from "../seo/Breadcrumbs";
import DynamicPageHub from "../seo/DynamicPageHub";
import {
  AreaChips,
  ContactNap,
  HowToSteps,
  LinkChips,
  PlaceGrid,
  TrustStrip,
  WhyGrid
} from "./CityLandingBlocks";
import { actingDriverLandingPath, airportCabBookingPath, cityCabLandingPath } from "../../lib/cityCabPaths";
import { CALL_DRIVER_TARIFF } from "../../data/call-drivers-chennai";
import { CALL_DRIVER_SERVICES } from "../../lib/callDriver";
import { CarFront, Clock3, ShieldCheck, UserRound } from "lucide-react";

const DRIVER_TRUST = [
  { label: "Your car", value: "Driver only — no Cabzii taxi" },
  { label: "Packages", value: "Same as /call-driver" },
  { label: "Hours", value: "Published local and outstation" },
  { label: "Assign", value: "After you confirm" }
];

export default function ActingDriverLandingPage({ data, services = CALL_DRIVER_SERVICES }) {
  const { city } = data;
  const local = CALL_DRIVER_TARIFF.local;
  const outstation = CALL_DRIVER_TARIFF.outstation;

  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="section-shell py-5 sm:py-7">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: `${city.name} cabs`, path: data.cityHubPath || cityCabLandingPath(city.slug) },
              { name: "Acting driver", path: data.path }
            ]}
          />
          <h1 className="mt-3 text-center text-lg font-bold leading-tight tracking-tight text-slate-900 sm:text-xl md:text-2xl">
            {data.h1}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-slate-600 sm:text-sm">{data.lead}</p>
        </div>
      </div>

      <section className="section-shell py-6 sm:py-8">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">Call Driver packages in {city.name}</h2>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">
          These are the existing Call Driver packages — nothing extra is added for this city. Book on Call Driver;
          Cabzii assigns a driver after you confirm.
        </p>
        <div className="mt-4">
          <ActingDriverPackageSection pickup={city.name} initialServices={services} />
        </div>
      </section>

      <TrustStrip items={DRIVER_TRUST} />

      <WhyGrid
        title={`Why Cabzii acting driver in ${city.name}`}
        items={[
          {
            icon: CarFront,
            title: "Your car, our driver",
            body: `Acting driver in ${city.name} is a chauffeur for your vehicle. A Cabzii taxi is city cab booking, not this page.`
          },
          {
            icon: UserRound,
            title: "Existing packages only",
            body: "Local, outstation, airport, monthly quote, corporate and valet — the same Call Driver cards as /call-driver."
          },
          {
            icon: Clock3,
            title: "Published hours",
            body: `Local from ₹${local.standard} for ${local.minHours} hours (approx.). Extra hour ₹${local.extraHourStandard}. Outstation return from ₹${outstation.perDayStandard}/day plus accommodation.`
          },
          {
            icon: ShieldCheck,
            title: "Assigned after you book",
            body: "You book the service. Cabzii assigns an available professional and can replace a driver if needed."
          }
        ]}
      />

      <HowToSteps
        title={`How to book an acting driver in ${city.name}`}
        subtitle="Choose a package, confirm the live fare or request a quote, then Cabzii assigns the driver."
        steps={data.howToBook}
      />

      <section className="bg-[#f4f6fa] py-8">
        <div className="section-shell grid gap-4 lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)]">
          <ContactNap
            title={`Cabzii ${city.name} contact`}
            source="acting_driver_city"
            message={`Hi Cabzii, I want to book a Call Driver / acting driver in ${city.name}.\nPickup:\nDate:\nHours:\nVehicle:`}
          />
          <AreaChips title={`Pickup areas in ${city.name}`} areas={data.localAreas} />
        </div>
      </section>

      <article className="section-shell cabzii-seo-landing py-5 sm:py-8">
        <section className="cabzii-seo-block">
          <h2>Acting driver in {city.name}</h2>
          <p>
            Call Driver for your own car in {city.name}. This is not a Cabzii taxi. Book a package on this page or on
            /call-driver.
          </p>
          {data.aboutCity ? <p className="mt-2">{data.aboutCity}</p> : null}
        </section>

        {data.extraBody ? (
          <div
            className="prose prose-slate cabzii-seo-block max-w-none text-sm text-slate-700"
            dangerouslySetInnerHTML={{ __html: data.extraBody }}
          />
        ) : null}

        <PlaceGrid title={`Where people book Call Driver in ${city.name}`} places={data.places} />
      </article>

      <section className="section-shell pb-8">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">Acting driver in other cities</h2>
        <LinkChips items={data.peerDriverLinks} />
        <h3 className="mt-6 text-sm font-bold text-slate-900 sm:text-base">Related {city.name} bookings</h3>
        <LinkChips
          items={[
            { href: data.cityHubPath || cityCabLandingPath(city.slug), label: `${city.name} city cabs` },
            { href: data.airportPath || airportCabBookingPath(city.slug), label: `${city.name} airport cabs` },
            { href: "/call-driver", label: "Call Driver booking" },
            { href: "/tariff", label: "Cab tariff" },
            ...(data.nearby || [])
          ]}
        />
      </section>

      <section className="section-shell pb-10">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">Frequently asked questions</h2>
        <p className="mt-1 text-sm text-slate-600">Acting driver and Call Driver packages in {city.name}.</p>
        <div className="mt-4">
          <CityCabFaqAccordion faqs={data.faqs} />
        </div>
        <div className="mt-6">
          <LinkChips
            items={[
              { href: data.cityHubPath || cityCabLandingPath(city.slug), label: `${city.name} city cabs` },
              { href: actingDriverLandingPath(city.slug), label: "Acting driver" },
              { href: "/call-driver", label: "Book Call Driver" },
              { href: airportCabBookingPath(city.slug), label: "Airport taxi" }
            ]}
          />
        </div>
        <DynamicPageHub bare onlyIfStored className="mt-8" fallbackPage="drivers" citySlug={city.slug} path={data.path} />
      </section>
    </div>
  );
}
