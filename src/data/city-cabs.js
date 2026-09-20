import { cityAreas } from "../lib/seo/content";
import { airportInfoForCity, cityHasCommercialAirport } from "../lib/seo/airports";
import { cityBySlug, MAIN_PAGE_CITY_SLUGS, peerCitiesForHub } from "../lib/seo/cities";
import { routesForCity } from "../lib/seo/routes";
import { formatRouteLabel } from "../lib/seo/internalLinks";
import { cityCabLandingPath, actingDriverLandingPath } from "../lib/cityCabPaths";
import { CAR_TARIFF, VAN_TARIFF } from "../lib/publishedTariff";
import { SITE_NAME } from "../lib/seo/constants";

const DZIRE = CAR_TARIFF.find((row) => /dzire/i.test(row.name)) || CAR_TARIFF[0];
const AMAZE = CAR_TARIFF.find((row) => /amaze/i.test(row.name));
const ERTIGA = CAR_TARIFF.find((row) => /ertiga/i.test(row.name));
const TEMPO = VAN_TARIFF.find((row) => /12 seater/i.test(row.name)) || VAN_TARIFF[0];

function inr(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function clampText(value, max) {
  const text = String(value || "").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 1)).trim()}…`;
}

function pickRoutes(citySlug, direction, limit) {
  const rows = routesForCity(citySlug).filter((route) =>
    direction === "from" ? route.from === citySlug : route.to === citySlug
  );
  const out = [];
  const seen = new Set();
  for (const route of rows) {
    if (!route?.slug || seen.has(route.slug)) continue;
    seen.add(route.slug);
    const otherSlug = direction === "from" ? route.to : route.from;
    out.push({
      href: `/routes/${route.slug}`,
      label: formatRouteLabel(route),
      otherSlug
    });
    if (out.length >= limit) break;
  }
  return out;
}

function buildTitle(cityName) {
  const candidates = [
    `Taxi Service in ${cityName} | Book Cabs, Fares & Offers | ${SITE_NAME}`,
    `Taxi Service in ${cityName} | Cabs & Offers | ${SITE_NAME}`,
    `${cityName} Taxi Service | Book Cabs | ${SITE_NAME}`,
    `${cityName} Taxi | Cabs | ${SITE_NAME}`
  ];
  return candidates.find((title) => title.length <= 60) || clampText(`${cityName} Taxi | ${SITE_NAME}`, 60);
}

function buildDescription(cityName) {
  return clampText(
    `Book outstation, airport and full-day cabs in ${cityName}. Pay 50% now. Time-based cancellation. First outstation ₹500 off (CABZII500).`,
    155
  );
}

function buildFaqs(city) {
  const name = city.name;
  const airport = airportInfoForCity(city.slug);
  const airportAnswer = cityHasCommercialAirport(city.slug)
    ? `Yes. Choose Airport in the booking form, set ${airport.name} as pickup or drop, then compare fares. Tolls, parking and extra km are listed on the quote — they are not assumed included.`
    : airport?.note
      ? `${airport.note} Use the Airport trip type and pay 50% to confirm. Cancellation follows the published time-based policy.`
      : `Book a cab from ${name} to the nearest commercial airport on Cabzii. Fares are shown before you pay.`;

  return [
    {
      question: `How can I book a round-trip cab from ${name}?`,
      answer: `Select Round-trip, enter your destination and dates, choose Hatchback, Sedan, SUV or Tempo Traveller, then pay 50% to confirm. Driver details follow after booking.`
    },
    {
      question: `Are toll charges included in the ${name} cab fare?`,
      answer: "No. Published package fares include fuel and driver service only. Tolls, parking, permits and GST (if applicable) are extra and shown on the live quote and tariff."
    },
    {
      question: `Can I book airport and full-day cabs in ${name}?`,
      answer: airportAnswer
    },
    {
      question: `What is the advance payment for a ${name} taxi booking?`,
      answer: "50% advance is required at booking. The remaining amount is paid as shown on the booking confirmation."
    },
    {
      question: `Is cancellation free on Cabzii ${name} cabs?`,
      answer: "No. Cancellation is time-based: more than 24 hours before pickup is a full refund after gateway deductions; 6–24 hours may attract up to 25%; under 6 hours or no-show may be up to 100%. See the cancellation policy."
    },
    {
      question: `How do I get up to Rs 500 off on ${name} outstation cabs?`,
      answer: "Apply coupon CABZII500 on your first outstation cab booking. The ₹500 discount is shown before you confirm payment."
    }
  ];
}

function buildCabTypes(cityName) {
  const sedanFrom = DZIRE.local4;
  const suvFrom = ERTIGA?.local4 || 1800;
  const tempoFrom = TEMPO.local5 || TEMPO.outMin;
  return [
    {
      id: "hatchback",
      name: "Hatchback cab",
      subtitle: `Compact cab for ${cityName} city drops. Wagon R class is quoted live when available; published compact starting fare is Swift Dzire ${inr(sedanFrom)} for 4 Hrs / 40 Km.`,
      fareFrom: sedanFrom,
      fareLabel: `From ${inr(sedanFrom)} · 4 Hrs / 40 Km`,
      capacity: "4 passengers",
      luggage: "2 bags",
      image: "/images/fallbacks/suv.svg",
      imageAlt: `Hatchback taxi for ${cityName} local and airport trips`
    },
    {
      id: "sedan",
      name: "Sedan cab",
      subtitle: `Swift Dzire from ${inr(DZIRE.local4)} and Honda Amaze from ${inr(AMAZE?.local4 || 1400)} for 4 Hrs / 40 Km on the published ${cityName} tariff.`,
      fareFrom: sedanFrom,
      fareLabel: `From ${inr(sedanFrom)} · 4 Hrs / 40 Km`,
      capacity: DZIRE.seats || "4+1",
      luggage: "3 bags",
      image: "/images/fallbacks/suv.svg",
      imageAlt: `Sedan taxi such as Swift Dzire in ${cityName}`
    },
    {
      id: "suv",
      name: "SUV cab",
      subtitle: `Maruti Ertiga / Tour M from ${inr(suvFrom)} for 4 Hrs / 40 Km. Innova and Crysta rates are listed on the Cabzii tariff.`,
      fareFrom: suvFrom,
      fareLabel: `From ${inr(suvFrom)} · 4 Hrs / 40 Km`,
      capacity: ERTIGA?.seats || "6+1",
      luggage: "4 bags",
      image: "/images/fallbacks/suv.svg",
      imageAlt: `SUV taxi for family trips from ${cityName}`
    },
    {
      id: "tempo",
      name: "Tempo Traveller cab",
      subtitle: `Tempo Traveller 12 seater from ${inr(tempoFrom)} for 5 Hrs / 50 Km. Groups use this for ${cityName} full-day and outstation trips.`,
      fareFrom: tempoFrom,
      fareLabel: `From ${inr(tempoFrom)} · 5 Hrs / 50 Km`,
      capacity: `${TEMPO.seats || 12} seats`,
      luggage: "8 bags",
      image: "/images/fallbacks/bus.svg",
      imageAlt: `Tempo Traveller hire in ${cityName}`
    }
  ];
}

/**
 * City taxi landing copy. Same factory feeds generateStaticParams for every main city.
 * @param {{ slug: string, name: string, state?: string }} city
 */
export function buildCityCabData(city) {
  const name = city.name;
  const airport = airportInfoForCity(city.slug);
  const fromRoutes = pickRoutes(city.slug, "from", 10);
  const toRoutes = pickRoutes(city.slug, "to", 10);
  const nearby = peerCitiesForHub(city, 8).map((peer) => ({
    href: cityCabLandingPath(peer.slug),
    label: `${peer.name} city cabs`,
    city: peer.name
  }));
  const places = cityAreas(city.slug)
    .slice(0, 6)
    .map((area) => ({
      name: area,
      subtitle: `Use a ${name} outstation or local cab for pickups around ${area}.`,
      href: `/cabs/results?serviceTripType=hourly&from=${encodeURIComponent(`${area}, ${name}`)}&city=${encodeURIComponent(name)}`
    }));

  const airportHeading = airport?.type === "local" ? `Cabs from ${name} Airport` : `Airport taxi from ${name}`;
  const airportLinks = [
    airport?.type === "local"
      ? { href: `/services/airport-taxi/${city.slug}`, label: `${airport.name} taxi (${airport.code})` }
      : airport
        ? { href: `/services/airport-taxi/${city.slug}`, label: `${name} transfer to ${airport.name}` }
        : null,
    { href: `/services/outstation-cab/${city.slug}`, label: `Outstation cab from ${name}` },
    { href: `/services/hourly-rental/${city.slug}`, label: `Full-day cab in ${name}` },
    { href: actingDriverLandingPath(city.slug), label: `Acting driver in ${name}` },
    { href: "/call-driver", label: "Book Call Driver" },
    { href: "/tariff", label: "Published Cabzii tariff" }
  ].filter(Boolean);

  return {
    city,
    path: cityCabLandingPath(city.slug),
    title: buildTitle(name),
    description: buildDescription(name),
    h1: `Taxi Services in ${name} – Book & Get Up to Rs 500 Off`,
    heroAlt: `Chauffeur-driven taxi service in ${name} with Cabzii`,
    heroSrc: "/images/hero-banner.svg",
    bookingDefaultFrom: name,
    airportPickupLabel: airport?.type === "local" ? airport.name : name,
    cabTypes: buildCabTypes(name),
    fromRoutes,
    toRoutes,
    places,
    nearby,
    airportHeading,
    airportIntro:
      airport?.type === "local"
        ? `Pre-book pickup or drop at ${airport.name} (${airport.code}). Full-day and outstation cabs from the terminal use the same booking form.`
        : airport?.note || `Book an airport transfer cab from ${name} on Cabzii.`,
    airportLinks,
    howToBook: [
      {
        title: `Enter pickup in ${name}`,
        subtitle: "Add from, to and date. Choose one-way, round-trip, airport or local."
      },
      {
        title: "Compare Hatchback, Sedan, SUV and Tempo Traveller",
        subtitle: "Fares, seats and luggage show on the results page before you pay."
      },
      {
        title: "Pay 50% to confirm",
        subtitle: "Advance is 50% at booking. Apply CABZII500 for ₹500 off the first outstation trip."
      },
      {
        title: "Get driver details",
        subtitle: "After confirmation you receive driver details on SMS or WhatsApp."
      }
    ],
    fareItems: [
      {
        title: "Fuel and driver service",
        subtitle: "Included in the published package fare for local, airport and outstation cabs."
      },
      {
        title: "Tolls and parking",
        subtitle: "Not included. Tolls, parking and permits are extra as per actuals on the quote."
      },
      {
        title: "GST",
        subtitle: "Package fares list fuel and driver service only. GST, if applicable, appears on the live quote."
      },
      {
        title: "Driver allowance",
        subtitle: `Driver batta is extra per calendar day (sedan ${inr(DZIRE.batta)}, Tempo Traveller ${inr(TEMPO.batta)}).`
      },
      {
        title: "Night and overtime charges",
        subtitle: "Late running is billed at the extra-hour rate on the tariff. Confirm night running on the quote."
      },
      {
        title: "Waiting time",
        subtitle: `Waiting beyond the package is charged as extra hours (sedan from ${inr(DZIRE.extraHr)} / hour).`
      }
    ],
    whyBook: [
      {
        title: "Published tariff, not a hidden meter",
        subtitle: `Local 4hr/40km, full-day and outstation km rates for ${name} are listed on the Cabzii tariff.`
      },
      {
        title: "Up to Rs 500 off outstation",
        subtitle: "First outstation booking: apply CABZII500 for ₹500 off before you confirm."
      },
      {
        title: "Airport, outstation and full-day in one form",
        subtitle: `One-way, round-trip, airport and local packages from ${name} use the same booking flow.`
      },
      {
        title: "Time-based cancellation",
        subtitle: "Refunds follow the published cancellation policy — not a blanket free-cancellation claim."
      }
    ],
    faqs: buildFaqs(city),
    priceRange: "₹₹"
  };
}

export function getCityCabData(citySlug) {
  const city = cityBySlug(citySlug);
  return city ? buildCityCabData(city) : null;
}

export function cityCabStaticParams() {
  return MAIN_PAGE_CITY_SLUGS.map((slug) => ({ slug: `${slug}-city-cabs` }));
}
