import CityCabFaqAccordion from "./CityCabFaqAccordion";
import ActingDriverPackageSection from "./ActingDriverPackageSection";
import DynamicPageHub from "../seo/DynamicPageHub";
import { AreaChips, ContactNap, LinkChips, PlaceGrid, WhyGrid } from "./CityLandingBlocks";
import { airportCabBookingPath, cityCabLandingPath } from "../../lib/cityCabPaths";
import { CALL_DRIVER_TARIFF } from "../../data/call-drivers-chennai";
import { CALL_DRIVER_SERVICES } from "../../lib/callDriver";
import { CarFront, Clock3, ShieldCheck, UserRound } from "../icons/rscIcons";

export default function ActingDriverLandingPage({ data, services = CALL_DRIVER_SERVICES }) {
  const { city } = data;
  const local = CALL_DRIVER_TARIFF.local;
  const outstation = CALL_DRIVER_TARIFF.outstation;

  return (
    <div className="bg-[#f4f6fa]">
      <div className="section-shell pt-6 pb-1 sm:pt-8">
        <h1 className="px-1 text-center text-lg font-extrabold leading-tight tracking-tight text-slate-900 sm:text-2xl md:text-[1.75rem]">
          {data.h1}
        </h1>
        <p className="mx-auto mt-2 max-w-2xl px-1 text-center text-sm leading-relaxed text-slate-600">{data.lead}</p>
      </div>

      <ActingDriverPackageSection pickup={city.name} initialServices={services} />

      <WhyGrid
        title={`Why book an acting driver in ${city.name}`}
        align="left"
        items={[
          {
            icon: CarFront,
            title: "Your car in " + city.name,
            body: "A chauffeur for your vehicle — not a Cabzii taxi. Use city cab booking if you need a cab."
          },
          {
            icon: UserRound,
            title: "Same packages as Call Driver",
            body: "Local, outstation, airport, monthly quote, corporate and valet."
          },
          {
            icon: Clock3,
            title: "Published local hours",
            body: `From ₹${local.standard} for ${local.minHours} hours (approx.). Extra hour ₹${local.extraHourStandard}. Outstation return from ₹${outstation.perDayStandard}/day plus stay.`
          },
          {
            icon: ShieldCheck,
            title: "Assigned after you confirm",
            body: "You pick the package. Cabzii assigns an available driver for that trip."
          }
        ]}
      />

      {data.howToBook?.length ? (
        <section className="section-shell py-8 sm:py-10">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">How to book in {city.name}</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Choose a package, confirm the fare or request a quote, then Cabzii assigns the driver.
          </p>
          <ol className="mt-4 max-w-3xl list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-700">
            {data.howToBook.map((step) => (
              <li key={step.title}>
                <span className="font-bold text-slate-900">{step.title}.</span> {step.subtitle}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <article className="section-shell cabzii-seo-landing py-5 sm:py-8">
        <section className="cabzii-seo-block">
          <h2>Acting driver in {city.name} — Call Driver for your own car</h2>
          <p>
            Hire a Cabzii Call Driver in {city.name} when you want a professional to drive your car. This page is the
            city landing for acting driver / chauffeur-on-hire. Book the package on this page; Cabzii assigns a driver
            after you confirm. It is not a taxi and not a public driver directory.
          </p>
          {data.aboutCity ? <p className="mt-2">{data.aboutCity}</p> : null}
        </section>
        {data.extraBody ? (
          <div
            className="prose prose-slate cabzii-seo-block max-w-none overflow-x-auto break-words text-sm text-slate-700 [&_a]:font-semibold [&_a]:text-[var(--cabzii-cta)] [&_a]:no-underline hover:[&_a]:underline [&_img]:max-w-full"
            dangerouslySetInnerHTML={{ __html: data.extraBody }}
          />
        ) : null}
        <PlaceGrid title={`Where people book Call Driver in ${city.name}`} places={data.places} />
      </article>

      <section className="bg-slate-50 py-6 sm:py-8">
        <div className="section-shell grid gap-3 lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)]">
          <ContactNap
            title={`Cabzii ${city.name} contact`}
            source="acting_driver_city"
            message={`Hi Cabzii, I want to book a Call Driver / acting driver in ${city.name}.\nPickup:\nDate:\nHours:\nVehicle:`}
          />
          <AreaChips title={`Pickup areas in ${city.name}`} areas={data.localAreas} />
        </div>
      </section>

      <section className="section-shell py-6 sm:py-8">
        <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">Acting driver in other cities</h2>
        <LinkChips items={data.peerDriverLinks} />
        <h3 className="mt-5 text-sm font-extrabold text-slate-900">Related {city.name} bookings</h3>
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
        <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">Frequently asked questions</h2>
        <p className="mt-1 text-sm text-slate-600">Acting driver and Call Driver in {city.name}.</p>
        <div className="mt-4">
          <CityCabFaqAccordion faqs={data.faqs} />
        </div>
        <DynamicPageHub bare onlyIfStored className="mt-8" fallbackPage="drivers" citySlug={city.slug} path={data.path} />
      </section>
    </div>
  );
}
