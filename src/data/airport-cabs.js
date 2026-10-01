import { cityAreas } from "../lib/seo/content";
import { airportInfoForCity } from "../lib/seo/airports";
import { cityBySlug, peerCitiesForHub } from "../lib/seo/cities";
import { routesForCity } from "../lib/seo/routes";
import { formatRouteLabel } from "../lib/seo/internalLinks";
import { routePublicPath } from "../lib/seo/outstationPaths";
import {
  airportCabBookingPath,
  cityCabLandingPath,
  isAirportCabBookingCity,
  AIRPORT_CAB_BOOKING_CITIES
} from "../lib/cityCabPaths";
import { SITE_NAME } from "../lib/seo/constants";
import { airportHubSeo } from "./airportHubSeo";
import { todayStr } from "../lib/mmtTrip";
import { buildCabTypes } from "./cabTypes";
import { applyCityCabCms } from "./city-cabs";

function clampText(value, max) {
  const text = String(value || "").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 1)).trim()}…`;
}

function pickRoutes(citySlug, limit) {
  const rows = routesForCity(citySlug).filter((route) => route.from === citySlug);
  const out = [];
  const seen = new Set();
  for (const route of rows) {
    if (!route?.slug || seen.has(route.slug)) continue;
    seen.add(route.slug);
    out.push({
      href: routePublicPath(route.slug),
      label: formatRouteLabel(route),
      distance: route.distance || "",
      duration: route.duration || "",
      sedanFrom: route.sedanFrom || 0,
      suvFrom: route.suvFrom || 0,
      innovaFrom: route.innovaFrom || 0
    });
    if (out.length >= limit) break;
  }
  return out;
}

function buildAirportFaqs(city, airport) {
  const name = city.name;
  const code = airport?.code || "";
  return [
    {
      question: `How do I book a cab from ${name} Airport?`,
      answer: `Open this page, keep Airport selected, set ${airport?.name || `${name} Airport`} as From and your city drop as To, compare vehicles, then pay 50% to confirm. Driver details follow after booking.`
    },
    {
      question: `Can I book a cab to ${name} Airport for a departure?`,
      answer: `Yes. Use Airport, set your house or hotel as From and the airport as To. Book with enough buffer for traffic — Cabzii does not operate a walk-up airport counter.`
    },
    {
      question: `Is airport cab booking in ${name} a 24/7 stand?`,
      answer: `No. You book for a published pickup time. Early or late flights are accepted as scheduled trips. Support uses ${name} contact on this site — Cabzii does not claim a separate 24/7 emergency product.`
    },
    {
      question: `What vehicles are available for ${name} airport taxi?`,
      answer: "Hatchback, sedan, SUV, Innova and Tempo Traveller where listed on the quote. Choose by seats and luggage, then confirm the fare before payment."
    },
    {
      question: `Do you charge extra for ${name} airport bookings?`,
      answer: "The package fare includes fuel and driver service. Airport parking, tolls, extra km and waiting beyond the quote are extra unless listed. GST, if applicable, appears on the live quote."
    },
    {
      question: `Is the driver contact shared before the ride from ${code || name}?`,
      answer: "Yes. After you pay the published 50% advance and the booking is confirmed, Cabzii shares assigned driver details on SMS or WhatsApp."
    }
  ];
}

export function buildAirportCabData(city) {
  if (!city || !isAirportCabBookingCity(city.slug)) return null;
  const airport = airportInfoForCity(city.slug);
  if (airport?.type !== "local") return null;
  const seeded = airportHubSeo(city.slug);
  const name = city.name;
  const areas = cityAreas(city.slug);
  const defaultDrop = areas[0] || name;
  const fromRoutes = pickRoutes(city.slug, 12);
  const nearby = peerCitiesForHub(city, 8).map((peer) => ({
    href: cityCabLandingPath(peer.slug),
    label: `${peer.name} city cabs`,
    city: peer.name
  }));
  const airportPeerLinks = AIRPORT_CAB_BOOKING_CITIES.filter((slug) => slug !== city.slug).map((slug) => {
    const peer = cityBySlug(slug);
    return peer
      ? { href: airportCabBookingPath(peer.slug), label: `${peer.name} airport cabs` }
      : null;
  }).filter(Boolean);

  const places = (seeded?.drops?.length
    ? seeded.drops.map((place) => ({
        name: place.title,
        subtitle: place.body
      }))
    : areas.slice(0, 6).map((area) => ({
        name: area,
        subtitle: `Book ${name} airport pickup or drop with ${area} as the city side.`
      })));

  return {
    city,
    airport,
    path: airportCabBookingPath(city.slug),
    cityHubPath: cityCabLandingPath(city.slug),
    title: clampText(seeded?.title || `${name} Airport Cabs | Pickup & Drop | ${SITE_NAME}`, 60),
    description: clampText(
      seeded?.description ||
        `Book ${airport.name} pickup and drop on Cabzii. Pay 50% to confirm. Fuel and driver included; parking and tolls extra.`,
      155
    ),
    keywords: seeded?.keywords || "",
    h1: seeded?.h1 || `${name} Airport Cabs | Cabzii Airport Pickup & Drop`,
    lead: seeded?.lead || `Book pickup or drop at ${airport.name}. Fares show before you pay.`,
    aboutCity: seeded?.aboutCity || "",
    airportDetails: seeded?.airportDetails || `${airport.name} (${airport.code}).`,
    bookingTrip: {
      tripType: "airport",
      from: airport.name,
      to: defaultDrop,
      date: todayStr(),
      time: "09:00",
      roundTrip: false,
      city: name,
      direction: "pickup"
    },
    heroAlt: `${airport.name} taxi pickup and drop with Cabzii`,
    cabTypes: buildCabTypes(name),
    fromRoutes,
    nearby,
    airportPeerLinks,
    localAreas: areas.slice(0, 8),
    places,
    vehicles: ["Hatchback", "Sedan", "SUV / Ertiga", "Innova / Innova Crysta", "Tempo Traveller"],
    howToBook: [
      {
        title: "Choose Airport",
        subtitle: "Keep the Airport tab selected. Pickup is arrival (airport → city). Swap From/To for a drop to the terminal."
      },
      {
        title: "Enter terminal and city side",
        subtitle: `From for arrivals: ${airport.name}. To: your house, hotel or landmark in ${name}.`
      },
      {
        title: "Compare vehicles and confirm",
        subtitle: "Fares, seats and luggage show before you pay. Parking and tolls are extra unless listed."
      },
      {
        title: "Pay 50% and get driver details",
        subtitle: "Advance is 50% at booking. After confirmation you receive assigned driver details on SMS or WhatsApp. Share flight time if the wait matters."
      }
    ],
    faqs: buildAirportFaqs(city, airport),
    priceRange: "₹₹"
  };
}

export function getAirportCabData(citySlug) {
  const city = cityBySlug(citySlug);
  return city ? buildAirportCabData(city) : null;
}

export function airportHubStaticParams() {
  return AIRPORT_CAB_BOOKING_CITIES.map((city) => ({ city }));
}

export function applyAirportCabCms(data, cms) {
  const next = applyCityCabCms(data, cms);
  if (!next) return data;
  const details = String(cms?.airportDetails || "").trim();
  return {
    ...next,
    airportDetails: details || next.airportDetails
  };
}
