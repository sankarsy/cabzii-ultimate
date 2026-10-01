import { cityAreas } from "../lib/seo/content";
import { cityBySlug, peerCitiesForHub } from "../lib/seo/cities";
import { SITE_NAME } from "../lib/seo/constants";
import { ACTING_DRIVER_HUB_SEO } from "./actingDriverHubSeo";
import { CALL_DRIVER_SERVICES } from "../lib/callDriver";
import { CALL_DRIVER_TARIFF } from "./call-drivers-chennai";
import { applyCityCabCms } from "./city-cabs";
import {
  actingDriverLandingPath,
  airportCabBookingPath,
  cityCabLandingPath,
  isActingDriverHubCity,
  ACTING_DRIVER_HUB_CITIES
} from "../lib/cityCabPaths";

function clampText(value, max) {
  const text = String(value || "").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 1)).trim()}…`;
}

function buildActingDriverFaqs(city) {
  const name = city.name;
  return [
    {
      question: `How do I book an acting driver in ${name}?`,
      answer: `Open this page, pick an existing Call Driver package (local, outstation, airport, monthly quote, corporate or valet), then continue to Call Driver book. Cabzii assigns a professional after you confirm — you do not pick a named driver from a public list.`
    },
    {
      question: `What packages are available for acting driver in ${name}?`,
      answer:
        "The same Call Driver packages used across Cabzii: Local Driver, Outstation Driver, Airport Driver, Monthly Driver (quote), Corporate Driver (quote) and Valet Parking. This page does not add extra packages."
    },
    {
      question: `How much does an acting driver cost in ${name}?`,
      answer: `Live fare is shown on Call Driver book. Published tariff: local from ₹${CALL_DRIVER_TARIFF.local.standard} for ${CALL_DRIVER_TARIFF.local.minHours} hours, extra hour ₹${CALL_DRIVER_TARIFF.local.extraHourStandard}. Outstation return from ₹${CALL_DRIVER_TARIFF.outstation.perDayStandard} per 12-hour day plus accommodation. One-way from ₹${CALL_DRIVER_TARIFF.outstation.oneWayRate} (min ${CALL_DRIVER_TARIFF.outstation.oneWayMinKm} km). Night charge ₹${CALL_DRIVER_TARIFF.local.nightCharge} from 10:15 pm to 5:30 am.`
    },
    {
      question: `Is acting driver in ${name} an airport taxi?`,
      answer: `No. Airport Call Driver is a chauffeur in your own car. If you need a Cabzii vehicle to or from the airport, book ${name} airport cab booking instead.`
    },
    {
      question: `Do you offer 24/7 emergency acting drivers in ${name}?`,
      answer: `No. You book for a published date and time. Night hours are accepted when a driver is free and may include the published night charge. Cabzii does not run a separate emergency-driver product.`
    },
    {
      question: `Can I hire a monthly or corporate driver in ${name}?`,
      answer: "Yes. Monthly Driver and Corporate Driver are quote-only on the same Call Driver form. Share hours and locations; Cabzii replies with a quote. Valet is for events and functions."
    }
  ];
}

export function buildActingDriverHubData(city) {
  if (!city || !isActingDriverHubCity(city.slug)) return null;
  const seeded = ACTING_DRIVER_HUB_SEO[city.slug];
  const name = city.name;
  const areas = cityAreas(city.slug);
  const nearby = peerCitiesForHub(city, 8).map((peer) => ({
    href: cityCabLandingPath(peer.slug),
    label: `${peer.name} city cabs`,
    city: peer.name
  }));
  const peerDriverLinks = ACTING_DRIVER_HUB_CITIES.filter((slug) => slug !== city.slug)
    .map((slug) => {
      const peer = cityBySlug(slug);
      return peer ? { href: actingDriverLandingPath(peer.slug), label: `Acting driver ${peer.name}` } : null;
    })
    .filter(Boolean);

  const places = (seeded?.areas?.length
    ? seeded.areas.map((place) => ({
        name: place.title,
        subtitle: place.body
      }))
    : areas.slice(0, 6).map((area) => ({
        name: area,
        subtitle: `Book a Call Driver in ${name} with ${area} as pickup.`
      })));

  return {
    city,
    path: actingDriverLandingPath(city.slug),
    cityHubPath: cityCabLandingPath(city.slug),
    airportPath: airportCabBookingPath(city.slug),
    callDriverPath: "/call-driver",
    title: clampText(seeded?.title || `Acting Driver in ${name} | Call Driver | ${SITE_NAME}`, 60),
    description: clampText(
      seeded?.description ||
        `Hire an acting driver in ${name} for your own car. Existing Call Driver packages — local, outstation, airport, monthly quote, corporate and valet.`,
      155
    ),
    keywords: seeded?.keywords || "",
    h1: seeded?.h1 || `Acting Driver in ${name} | Cabzii Call Driver`,
    lead:
      seeded?.lead ||
      `Book a professional to drive your car in ${name}. Same Call Driver packages as the rest of Cabzii.`,
    aboutCity: seeded?.aboutCity || "",
    heroAlt: `Acting driver / Call Driver for your own car in ${name}`,
    packages: CALL_DRIVER_SERVICES,
    nearby,
    peerDriverLinks,
    localAreas: areas.slice(0, 8),
    places,
    howToBook: [
      {
        title: "Choose a Call Driver package",
        subtitle: "Local, outstation, airport, monthly quote, corporate or valet — only the packages already on Call Driver."
      },
      {
        title: "Enter pickup in this city",
        subtitle: `Use a ${name} landmark, house or hotel as pickup. Airport chauffeur uses your car, not a Cabzii taxi.`
      },
      {
        title: "Confirm the live fare or quote",
        subtitle: "Hourly and daily packages show an estimate. Monthly and corporate stay quote-only until Cabzii replies."
      },
      {
        title: "Cabzii assigns a driver",
        subtitle: "After you confirm, an available professional is assigned. Cabzii can replace a driver if needed — this is not a public driver directory."
      }
    ],
    faqs: buildActingDriverFaqs(city),
    priceRange: "₹₹"
  };
}

export function getActingDriverHubData(citySlug) {
  const city = cityBySlug(citySlug);
  return city ? buildActingDriverHubData(city) : null;
}

export function actingDriverHubStaticParams() {
  return ACTING_DRIVER_HUB_CITIES.map((city) => ({ city }));
}

export function applyActingDriverCms(data, cms) {
  return applyCityCabCms(data, cms);
}
