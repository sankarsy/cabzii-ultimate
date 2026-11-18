"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CallDriverServiceIcon from "./CallDriverMarks";
import TaxiContactCard from "../city-cabs/TaxiContactCard";
import CityCabFaqAccordion from "../city-cabs/CityCabFaqAccordion";
import { LinkChips, WhyGrid } from "../city-cabs/CityLandingBlocks";
import RelatedSeoLinks from "../seo/RelatedSeoLinks";
import ApproxPriceNote from "../ui/ApproxPriceNote";
import { CALL_DRIVER_SERVICES, callDriverBookHref, callDriverFareLabel, mergeCallDriverServices } from "../../lib/callDriver";
import { DEFAULT_CALL_DRIVER_PAGE } from "../../lib/callDriverPage";
import {
  actingDriverLandingPath,
  airportTaxiPublicPath,
  callDriverCityPath,
  cityCabLandingPath,
  isLiveCallDriverCitySlug
} from "../../lib/cityCabPaths";
import { resolveScopedCity } from "../../lib/cityShowcase";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { CalendarCheck, IndianRupee, MapPin, ShieldCheck, Smartphone, UserRound } from "../icons/rscIcons";

export default function CallDriverLanding({
  showSeoCopy = false,
  city = { slug: "chennai", name: "Chennai" },
  title,
  subtitle,
  intro = DEFAULT_CALL_DRIVER_PAGE.intro,
  sections = DEFAULT_CALL_DRIVER_PAGE.sections,
  faqs = []
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { city: selectedCity, locating } = useSelectedCity();
  const cityName = city?.name || "Chennai";
  const citySlug = city?.slug || "chennai";
  const heading = title || `Book a driver for your own car in ${cityName}`;
  const lede = subtitle || `A professional driver for the car you already have in ${cityName}.`;
  const [services, setServices] = useState(CALL_DRIVER_SERVICES);
  const [selectedId, setSelectedId] = useState("local");
  const [pageCopy, setPageCopy] = useState({ intro, sections });

  useEffect(() => {
    if (locating) return;
    if (pathname.startsWith("/call-driver/book")) return;
    const scoped = resolveScopedCity(selectedCity);
    const slug = isLiveCallDriverCitySlug(scoped.slug) ? scoped.slug : "chennai";
    const target = callDriverCityPath(slug);
    if (target !== pathname) router.replace(target);
  }, [locating, pathname, router, selectedCity]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/call-driver", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json?.data) return;
        if (json.data.services) setServices(mergeCallDriverServices(json.data.services));
        if (json.data.page) {
          setPageCopy({
            intro: json.data.page.intro || intro,
            sections: Array.isArray(json.data.page.sections) && json.data.page.sections.length ? json.data.page.sections : sections
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [intro, sections]);

  const selected = services.find((service) => service.id === selectedId) || services[0];

  return (
    <div className="bg-[#f4f6fa]">
      <div className="section-shell pt-6 pb-1 sm:pt-8">
        <h1 className="px-1 text-center text-lg font-extrabold leading-tight tracking-tight text-slate-900 sm:text-2xl md:text-[1.75rem]">
          {heading}
        </h1>
        <p className="mx-auto mt-2 max-w-2xl px-1 text-center text-sm leading-relaxed text-slate-600">{lede}</p>
        <p className="mx-auto mt-2 max-w-2xl px-1 text-center text-sm leading-relaxed text-slate-600">{pageCopy.intro}</p>
      </div>

      <div className="section-shell grid gap-3 py-4 sm:gap-4 sm:py-5 sm:pl-20 lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)] lg:py-6 xl:pl-6">
        <aside className="min-w-0 space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
            <h2 className="text-base font-bold text-slate-900">Choose a service</h2>
            <div className="mt-3 grid grid-cols-3 gap-1 rounded-2xl bg-[var(--cabzii-sky)] p-1" role="tablist" aria-label="Call Driver service">
              {services.map((service) => {
                const active = service.id === selected?.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedId(service.id)}
                    className={`min-h-11 rounded-xl px-1 py-2 text-center text-[12px] font-bold leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2 ${
                      active ? "bg-[var(--cabzii-brand)] text-white" : "text-[var(--cabzii-brand)] hover:bg-white"
                    }`}
                  >
                    {service.shortTitle || service.title}
                  </button>
                );
              })}
            </div>
            {selected ? (
              <div className="mt-4">
                <p className="text-lg font-extrabold tracking-tight text-slate-900">{selected.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{selected.blurb}</p>
                <p className="mt-3 text-sm font-extrabold text-slate-900">{callDriverFareLabel(selected)}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Driver for your own car in {cityName}. A driver is assigned after you confirm.
                </p>
                <Link
                  href={callDriverBookHref(selected.id, { pickup: cityName })}
                  className="mt-4 flex min-h-12 items-center justify-center rounded-[10px] bg-[var(--cabzii-brand)] px-4 text-[15px] font-bold text-white hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2"
                >
                  {selected.cta || "Book now"}
                </Link>
              </div>
            ) : null}
          </div>
          <div className="hidden lg:block">
            <TaxiContactCard cityName={cityName} />
          </div>
        </aside>

        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:p-4">
          <h2 className="px-1 text-base font-bold text-slate-900">Call Driver in {cityName}</h2>
          <p className="mt-1 px-1 text-sm text-slate-600">You book the service. Cabzii assigns the driver.</p>
          <ul className="mt-3 space-y-2">
            {services.map((service) => {
              const active = service.id === selected?.id;
              return (
                <li key={service.id}>
                  <Link
                    href={callDriverBookHref(service.id, { pickup: cityName })}
                    onClick={() => setSelectedId(service.id)}
                    aria-current={active ? "true" : undefined}
                    className={`flex items-start gap-3 rounded-xl border p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2 ${
                      active ? "border-[var(--cabzii-brand)] bg-[var(--cabzii-sky)]" : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="flex h-12 w-14 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                      <CallDriverServiceIcon id={service.id} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-extrabold leading-snug text-slate-900">{service.title}</span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-slate-600">{service.blurb}</span>
                      <span className="mt-1 block text-[12px] font-semibold text-slate-700">{callDriverFareLabel(service)}</span>
                    </span>
                    <span className="hidden shrink-0 self-center rounded-[10px] bg-[var(--cabzii-brand)] px-3 py-2 text-[13px] font-bold text-white sm:inline-flex">
                      {service.cta || "Book now"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <ApproxPriceNote />
        </div>

        <div className="lg:hidden">
          <TaxiContactCard cityName={cityName} />
        </div>
      </div>

      <WhyGrid
        title={`Why book a Call Driver in ${cityName}`}
        items={[
          {
            icon: UserRound,
            title: "Your own car",
            body: "A professional driver for the car you already have. This is not a Cabzii taxi."
          },
          {
            icon: IndianRupee,
            title: "Fare before you confirm",
            body: "The estimate is shown first. Monthly and corporate work is quoted from your schedule."
          },
          {
            icon: CalendarCheck,
            title: "Confirm, then assign",
            body: "A driver is assigned after you confirm. You do not pick a named driver."
          },
          {
            icon: MapPin,
            title: "Local, outstation, airport",
            body: `City hours, a highway day, or airport pickup and drop in ${cityName}, in your vehicle.`
          },
          {
            icon: ShieldCheck,
            title: "Cabzii assigns the driver",
            body: "Drivers are managed by Cabzii. Named driver records stay off the public site."
          },
          {
            icon: Smartphone,
            title: "Book on this page",
            body: "Choose a service and confirm. Call or WhatsApp if you need help. No separate app."
          }
        ]}
      />

      {showSeoCopy ? (
        <div className="section-shell space-y-8 py-8 text-sm leading-relaxed text-slate-700 sm:py-10">
          {(pageCopy.sections || []).map((section) =>
            section.heading || section.body ? (
              <section key={section.heading} className="max-w-3xl">
                {section.heading ? <h2 className="text-lg font-bold text-slate-900">{section.heading}</h2> : null}
                {section.body ? (
                  <div
                    className="mt-2 [&_a]:font-semibold [&_a]:text-[var(--cabzii-brand)] [&_a]:underline-offset-2 hover:[&_a]:underline [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_p]:mt-2"
                    dangerouslySetInnerHTML={{ __html: section.body }}
                  />
                ) : null}
              </section>
            ) : null
          )}
        </div>
      ) : null}

      {faqs.length ? (
        <section className="section-shell py-8 sm:py-10">
          <h2 className="text-center text-lg font-bold text-slate-900 sm:text-xl">Frequently asked questions</h2>
          <p className="mt-1 text-center text-sm text-slate-600">Call Driver and acting driver in {cityName}.</p>
          <div className="mt-4">
            <CityCabFaqAccordion faqs={faqs} />
          </div>
        </section>
      ) : null}

      <div className="section-shell pb-10">
        <LinkChips
          items={[
            { href: cityCabLandingPath(citySlug), label: `Cab booking in ${cityName}` },
            { href: airportTaxiPublicPath(citySlug), label: "Airport taxi" },
            { href: actingDriverLandingPath(citySlug), label: "Acting driver" },
            { href: "/tariff", label: "Published tariff" }
          ]}
        />
        <div className="mt-8">
          <RelatedSeoLinks page="drivers" />
        </div>
      </div>
    </div>
  );
}
