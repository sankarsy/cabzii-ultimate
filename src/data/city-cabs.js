import { cityAreas } from "../lib/seo/content";
import { airportInfoForCity, cityHasCommercialAirport } from "../lib/seo/airports";
import { cityBySlug, MAIN_PAGE_CITY_SLUGS, peerCitiesForHub } from "../lib/seo/cities";
import { routesForCity } from "../lib/seo/routes";
import { formatRouteLabel } from "../lib/seo/internalLinks";
import { routePublicPath } from "../lib/seo/outstationPaths";
import { cityCabLandingPath, actingDriverLandingPath, airportTaxiPublicPath } from "../lib/cityCabPaths";
import { SITE_NAME } from "../lib/seo/constants";
import { cityHubSeo } from "./cityHubSeo";
import { todayStr } from "../lib/mmtTrip";
import { buildCabTypes } from "./cabTypes";

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
      href: routePublicPath(route.slug),
      label: formatRouteLabel(route),
      otherSlug,
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

function buildTitle(cityName, seeded) {
  if (seeded?.title) return clampText(seeded.title, 60);
  const candidates = [
    `Best Cab Services in ${cityName} | ${SITE_NAME}`,
    `Cab Services in ${cityName} | ${SITE_NAME}`,
    `${cityName} Taxi | ${SITE_NAME}`
  ];
  return candidates.find((title) => title.length <= 60) || clampText(`${cityName} Taxi | ${SITE_NAME}`, 60);
}

function buildDescription(cityName, seeded) {
  if (seeded?.description) return clampText(seeded.description, 155);
  return clampText(
    `Book outstation, airport and local cabs in ${cityName}. Pay 50% now. Fuel and driver included. Tolls extra unless listed.`,
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

/**
 * City taxi landing copy. Same factory feeds generateStaticParams for every main city.
 * @param {{ slug: string, name: string, state?: string }} city
 */
export function buildCityCabData(city) {
  const name = city.name;
  const seeded = cityHubSeo(city.slug);
  const airport = airportInfoForCity(city.slug);
  const fromRoutes = pickRoutes(city.slug, "from", 10);
  const nearby = peerCitiesForHub(city, 8).map((peer) => ({
    href: cityCabLandingPath(peer.slug),
    label: `${peer.name} city cabs`,
    city: peer.name
  }));
  const places = (seeded?.places?.length
    ? seeded.places.map((place) => ({
        name: place.title,
        subtitle: place.body,
        href: `/cabs/results?serviceTripType=hourly&from=${encodeURIComponent(name)}&to=${encodeURIComponent(place.title)}&city=${encodeURIComponent(name)}`
      }))
    : cityAreas(city.slug)
        .slice(0, 6)
        .map((area) => ({
          name: area,
          subtitle: `Use a ${name} local or outstation cab for pickups around ${area}.`,
          href: `/cabs/results?serviceTripType=hourly&from=${encodeURIComponent(`${area}, ${name}`)}&city=${encodeURIComponent(name)}`
        })));

  const airportHeading = airport?.type === "local" ? `Cabs from ${name} Airport` : `Airport taxi from ${name}`;
  const airportLinks = [
    airport?.type === "local"
      ? { href: airportTaxiPublicPath(city.slug), label: `${airport.name} taxi (${airport.code})` }
      : airport
        ? { href: airportTaxiPublicPath(city.slug), label: `${name} transfer to ${airport.name}` }
        : null,
    { href: `/services/outstation-cab/${city.slug}`, label: `Outstation cab from ${name}` },
    { href: cityCabLandingPath(city.slug), label: `Local / hourly cab in ${name}` },
    { href: actingDriverLandingPath(city.slug), label: `Acting driver in ${name}` },
    { href: "/call-driver", label: "Book Call Driver" },
    { href: "/tariff", label: "Published Cabzii tariff" }
  ].filter(Boolean);

  return {
    city,
    path: cityCabLandingPath(city.slug),
    title: buildTitle(name, seeded),
    description: buildDescription(name, seeded),
    keywords: seeded?.keywords || "",
    h1: seeded?.h1 || `Best Cab Services in ${name} - Cabzii`,
    lead: seeded?.lead || `Book airport, local and outstation cabs in ${name}. Fares show before you pay.`,
    aboutCity: seeded?.aboutCity || "",
    bookingTrip: {
      tripType: "local",
      from: name,
      to: name,
      date: todayStr(),
      time: "09:00",
      roundTrip: false,
      city: name,
      packageHours: 8
    },
    heroAlt: `Chauffeur-driven taxi service in ${name} with Cabzii`,
    cabTypes: buildCabTypes(name),
    fromRoutes,
    places,
    nearby,
    localAreas: cityAreas(city.slug).slice(0, 8),
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
    faqs: buildFaqs(city),
    priceRange: "₹₹"
  };
}

export function getCityCabData(citySlug) {
  const city = cityBySlug(citySlug);
  return city ? buildCityCabData(city) : null;
}

export function cityHubStaticParams() {
  return MAIN_PAGE_CITY_SLUGS.map((city) => ({ city }));
}

/** Overlay admin CMS (same ranking SEO type) onto the city taxi landing. */
export function applyCityCabCms(data, cms) {
  if (!data || !cms) return data;
  const cmsFaqs = Array.isArray(cms.faqs)
    ? cms.faqs.filter((row) => String(row?.question || "").trim() && String(row?.answer || "").trim())
    : [];
  const cmsPlaces = Array.isArray(cms.touristPlaces)
    ? cms.touristPlaces
        .filter((row) => String(row?.title || "").trim() && String(row?.body || "").trim())
        .map((row) => ({
          name: String(row.title).trim(),
          subtitle: String(row.body).trim(),
          href:
            String(row.href || "").trim() ||
            `/cabs/results?serviceTripType=hourly&from=${encodeURIComponent(data.city.name)}&to=${encodeURIComponent(row.title)}&city=${encodeURIComponent(data.city.name)}`
        }))
    : [];
  const cmsLocations = Array.isArray(cms.popularLocations)
    ? cms.popularLocations.map((s) => String(s).trim()).filter(Boolean)
    : [];
  return {
    ...data,
    title: String(cms.seoTitle || "").trim() || data.title,
    description: String(cms.seoDescription || "").trim() || data.description,
    h1: String(cms.h1 || "").trim() || data.h1,
    lead: String(cms.lead || "").trim() || data.lead,
    aboutCity: String(cms.aboutCity || "").trim() || data.aboutCity,
    extraBody: String(cms.body || "").trim(),
    airportIntro: String(cms.airportDetails || "").trim() || data.airportIntro,
    faqs: cmsFaqs.length ? cmsFaqs : data.faqs,
    places: cmsPlaces.length ? cmsPlaces : data.places,
    localAreas: cmsLocations.length ? cmsLocations : data.localAreas || [],
    keywords: String(cms.seo || "").trim() || data.keywords
  };
}
