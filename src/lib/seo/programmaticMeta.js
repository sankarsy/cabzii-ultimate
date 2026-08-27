/**
 * Dynamic meta titles & descriptions for city/service/route landing pages.
 * Title ≤ 60 chars · Description 120–155 chars · Keywords at start.
 */

import { SEO_SERVICES } from "./services";
import { todayStr } from "../mmtTrip";
import { AIRPORT_BY_CITY, airportInfoForCity, cityHasCommercialAirport } from "./airports";

export { AIRPORT_BY_CITY } from "./airports";

export const META_TITLE_MAX = 60;
export const META_DESC_MIN = 120;
export const META_DESC_MAX = 155;

/** Trailing brand in Google SERP titles (e.g. `Chennai to Tirupati Cab Booking | Cabzii`). */
export const SERP_BRAND = "Cabzii";

/** Standard meta title for rich search results: `Primary | Detail | cabzii` */
export function formatSerpTitle(primary, detail) {
  const full = detail ? `${primary} | ${detail} | ${SERP_BRAND}` : `${primary} | ${SERP_BRAND}`;
  return clampTitle(full);
}

/** Service slug → blueprint template id */
export const SERVICE_TEMPLATE = {
  "one-way-cab": "outstation",
  "outstation-cab": "outstation",
  "airport-taxi": "airport",
  "car-rental": "local_rental",
  "cab-rental": "local_rental",
  "hourly-rental": "local_rental",
  "local-taxi": "local_rental",
  "driver-on-hire": "local_rental",
  "chauffeur-service": "local_rental",
  "tempo-traveller": "outstation",
  "tour-packages": "outstation"
};

/** Cities: which services appear first on /cab-booking/{city} (links to /services/...) */
export const CITY_PRIORITY_SERVICES = {
  madurai: ["one-way-cab", "car-rental", "outstation-cab", "local-taxi"],
  chennai: ["outstation-cab", "airport-taxi", "car-rental", "cab-rental", "one-way-cab"],
  bengaluru: ["cab-rental", "airport-taxi", "outstation-cab", "one-way-cab"],
  hyderabad: ["airport-taxi", "outstation-cab", "one-way-cab"],
  coimbatore: ["car-rental", "outstation-cab", "one-way-cab"],
  goa: ["car-rental", "outstation-cab", "airport-taxi", "one-way-cab"],
  delhi: ["car-rental", "airport-taxi", "outstation-cab", "one-way-cab"],
  trichy: ["car-rental", "cab-rental", "local-taxi", "outstation-cab"],
  kodaikanal: ["outstation-cab", "one-way-cab", "car-rental", "tour-packages"]
};

/** Explicit route slugs with tuned copy (others use route templates) */
export const PRIORITY_ROUTE_SLUGS = ["chennai-to-tirupati-cab", "bengaluru-to-tirupati-cab"];

function len(s) {
  return String(s || "").length;
}

/** Trim title to ≤ max without breaking mid-word when possible */
export function clampTitle(title, max = META_TITLE_MAX) {
  const t = String(title || "").trim();
  if (len(t) <= max) return t;
  const cut = t.slice(0, max - 1).trimEnd();
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > max * 0.55) return `${cut.slice(0, lastSpace)}…`;
  return `${cut}…`;
}

/** Trim description to 120–155 (prefer not below min) */
export function clampDescription(desc, min = META_DESC_MIN, max = META_DESC_MAX) {
  let d = String(desc || "").trim();
  if (len(d) > max) {
    const cut = d.slice(0, max - 1).trimEnd();
    const lastSpace = cut.lastIndexOf(" ");
    d = lastSpace > min ? `${cut.slice(0, lastSpace)}.` : `${cut}.`;
  }
  if (len(d) < min && len(d) > 0) {
    d = `${d} Compare fares and book on Cabzii.in.`;
    if (len(d) > max) d = d.slice(0, max - 1).trimEnd() + ".";
  }
  return d;
}

// ——— Blueprint templates ———

export function outstationServiceTitle(cityName) {
  return formatSerpTitle(`${cityName} One-Way Cabs`, "Outstation Packages");
}

export function outstationServiceDescription(cityName) {
  return clampDescription(
    `Book outstation and one-way cabs in ${cityName} with Cabzii.in. Sedan, SUV and Innova packages with fares shown before you confirm.`
  );
}

export function airportServiceTitle(cityName) {
  return formatSerpTitle(`Airport Taxi ${cityName}`, "Pickup & Drop");
}

export function airportServiceDescription(cityName) {
  return clampDescription(
    `Airport taxi in ${cityName} on Cabzii.in — pickup and drop with a fare shown before payment. Share flight time so the driver can plan buffer.`
  );
}

export function localRentalServiceTitle(cityName) {
  return formatSerpTitle(`Car Rental in ${cityName}`, "Hourly Packages");
}

export function localRentalServiceDescription(cityName) {
  return clampDescription(
    `Car rental in ${cityName} on Cabzii.in — chauffeur-driven hourly and full-day packages for local trips, weddings and sightseeing. Fares shown before you confirm.`
  );
}

function templateMeta(templateId, cityName) {
  switch (templateId) {
    case "airport":
      return {
        title: airportServiceTitle(cityName),
        description: airportServiceDescription(cityName)
      };
    case "local_rental":
      return {
        title: localRentalServiceTitle(cityName),
        description: localRentalServiceDescription(cityName)
      };
    case "outstation":
    default:
      return {
        title: outstationServiceTitle(cityName),
        description: outstationServiceDescription(cityName)
      };
  }
}

/** Per city+service overrides when template copy needs a tweak */
const SERVICE_META_OVERRIDES = {
  "chennai:airport-taxi": {
    title: formatSerpTitle("Chennai Airport Taxi", "Airport Pickup & Drop"),
    description: clampDescription(
      "Book Chennai airport taxi (MAA) for pickup, drop and city transfers. Share terminal and flight time. Swift Dzire local packages from ₹1,200 (4 Hrs / 40 Km) on the published tariff."
    )
  },
  "chennai:local-taxi": {
    title: formatSerpTitle("Chennai Local Taxi", "Hourly & City Rides"),
    description: clampDescription(
      "Chennai local taxi service on Cabzii — point-to-point rides and 4hr/8hr packages across OMR, Anna Nagar, T. Nagar and more. Transparent fares, book online."
    )
  },
  "chennai:outstation-cab": {
    title: formatSerpTitle("Chennai Outstation Cab", "One-Way & Round-Trip Taxi"),
    description: clampDescription(
      "Outstation cab from Chennai on Cabzii — round-trip and multi-day highway packages. Sedan, SUV, Innova and tempo. Fares and km minimums on the published tariff."
    )
  },
  "chennai:one-way-cab": {
    title: formatSerpTitle("One Way Taxi Chennai", "Inter-City Drops"),
    description: clampDescription(
      "One way taxi from Chennai on Cabzii — inter-city drops without return empty charges. Tirupati, Pondicherry, Bengaluru and more. Starting fares on each route page."
    )
  },
  "chennai:tempo-traveller": {
    title: formatSerpTitle("Tempo Traveller Chennai", "12–18 Seater Hire"),
    description: clampDescription(
      "Tempo Traveller rental in Chennai — 12, 13, 14 and 18 seater. Local from ₹3,000 (5 Hrs / 50 Km) on the published van tariff. Group, wedding and pilgrimage hire."
    )
  },
  "bengaluru:airport-taxi": {
    title: formatSerpTitle("Bangalore Airport Taxi", "Pickup & 12 Hr Packages"),
    description: clampDescription(
      "Bangalore airport taxi (Kempegowda BLR) — pickup & drop, 4/8/12-hour packages. Book 12 hr / 120 km airport pickup online on Cabzii with upfront fares."
    )
  },
  "bengaluru:hourly-rental": {
    title: formatSerpTitle("Bangalore 12 Hour Cab", "Airport Pickup Packages"),
    description: clampDescription(
      "12 hour cab rental in Bangalore — ideal for airport pickup, meetings & city tours. 12 hr / 120 km packages from Kempegowda airport on Cabzii.in."
    )
  },
  "chennai:car-rental": {
    title: formatSerpTitle("Car Rental in Chennai", "Driver-Included Packages"),
    description: clampDescription(
      "Car rental in Chennai on Cabzii is chauffeur-driven local hire — 4 hour and 8 hour packages. Not self-drive. Compare fares on the published tariff and book with OTP."
    )
  },
  "chennai:cab-rental": {
    title: formatSerpTitle("Cab Rental Chennai", "Hourly & Full-Day Packages"),
    description: clampDescription(
      "Cab rental in Chennai — hourly and full-day city packages for meetings, weddings and sightseeing. Driver included. Extra km and extra hour rates on the Cabzii tariff."
    )
  },
  "chennai:hourly-rental": {
    title: formatSerpTitle("Hourly Cab Rental Chennai", "4/8/12 Hour Packages"),
    description: clampDescription(
      "Hourly and full-day taxi in Chennai — 4, 8 and 12 hour packages with extra km listed before you pay. Ideal for multi-stop city days. Book on Cabzii."
    )
  },
  "chennai:driver-on-hire": {
    title: formatSerpTitle("Driver on Hire Chennai", "Acting Driver Guide"),
    description: clampDescription(
      "Driver on hire in Chennai is Cabzii acting driver — a chauffeur for your own car. Book local, airport or outstation on Call Driver. Full city guide on acting driver Chennai."
    )
  },
  "chennai:chauffeur-service": {
    title: formatSerpTitle("Chauffeur Service Chennai", "Driver for Your Car"),
    description: clampDescription(
      "Chauffeur service in Chennai for city, airport and highway trips in your vehicle. Same Call Driver booking as acting driver. Packages shown before you confirm."
    )
  },
  "coimbatore:car-rental": {
    title: formatSerpTitle("Car Rental Coimbatore", "Hourly Cabs & Packages"),
    description: clampDescription(
      "Car rental in Coimbatore with Cabzii.in — 4hr and 8hr local packages for city errands, airport runs and sightseeing. Compare fares and book online."
    )
  },
  "madurai:car-rental": {
    title: formatSerpTitle("Car Rental Madurai", "Hourly & Daily Packages"),
    description: clampDescription(
      "Car rental in Madurai on Cabzii.in — flexible hourly and full-day cabs for temples, weddings and local travel. Transparent package fares, OTP booking."
    )
  },
  "goa:car-rental": {
    title: formatSerpTitle("Car Rental Goa", "Beach & City Hire"),
    description: clampDescription(
      "Car rental in Goa on Cabzii.in — sedan and SUV hire for North & South Goa trips, airport transfers and day tours. Book online with fixed package rates."
    )
  },
  "bengaluru:car-rental": {
    title: formatSerpTitle("Car Rental Bangalore", "Hourly Cabs & Packages"),
    description: clampDescription(
      "Car rental in Bangalore (Bengaluru) on Cabzii.in — hourly local hire, airport drops and city packages. Chauffeur-driven cabs with fares shown before you confirm."
    )
  },
  "trichy:car-rental": {
    title: formatSerpTitle("Car Rental Trichy", "Hourly & Local Packages"),
    description: clampDescription(
      "Car rental in Trichy on Cabzii.in — hourly and daily cab packages for Srirangam, airport and city travel. Upfront fares on Dzire, Ertiga and Innova."
    )
  },
  "delhi:car-rental": {
    title: formatSerpTitle("Car Rental Delhi", "Hourly & Airport Transfer"),
    description: clampDescription(
      "Car rental in Delhi on Cabzii.in — hourly city hire, airport transfers and local packages across NCR. Book online with transparent fares and OTP login."
    )
  },
  "bengaluru:cab-rental": {
    title: formatSerpTitle("Cab Rental Bangalore", "Hourly & City Packages"),
    description: clampDescription(
      "Cab rental in Bengaluru with Cabzii.in. Airport drops, outstation trips and local hourly hire. OTP booking with fares shown before you confirm."
    )
  }
};

/** Cab hub /cab-booking/{city} */
const CAB_BOOKING_META = {
  chennai: {
    title: formatSerpTitle("Chennai Cab Booking", "Local, Airport & Outstation"),
    description: clampDescription(
      "Book cabs in Chennai with Cabzii — airport taxi, local packages, outstation and one-way trips. Upfront fares, OTP booking and WhatsApp support."
    )
  },
  salem: {
    title: formatSerpTitle("Cab Booking Salem", "Outstation & Local Taxi"),
    description: clampDescription(
      "Cab booking in Salem on Cabzii — outstation to Chennai and Coimbatore, local packages and one-way cabs. Transparent fares and OTP booking online."
    )
  },
  vellore: {
    title: formatSerpTitle("Cab Booking Vellore", "Outstation & Local Taxi"),
    description: clampDescription(
      "Book cabs in Vellore with Cabzii — Chennai trips, CMC/VIT transfers and local hire. Sedan, SUV and Innova with fares shown before you confirm."
    )
  },
  erode: {
    title: formatSerpTitle("Cab Booking Erode", "Outstation & Local"),
    description: clampDescription(
      "Cab booking in Erode on Cabzii — outstation to Chennai and Coimbatore, local taxi packages and one-way trips. Compare fares and book online."
    )
  },
  hosur: {
    title: formatSerpTitle("Cab Booking Hosur", "Bengaluru & Chennai"),
    description: clampDescription(
      "Book cabs in Hosur with Cabzii — quick trips to Bengaluru and Chennai, local packages and outstation hire. Upfront fares and OTP booking."
    )
  },
  madurai: {
    title: formatSerpTitle("Cab Booking Madurai", "Online Taxi & Outstation"),
    description: clampDescription(
      "Cab booking in Madurai on Cabzii.in — online taxi, one-way and outstation cabs to Trichy, Chennai and hill stations. Transparent fares and OTP booking."
    )
  },
  bengaluru: {
    title: formatSerpTitle("Bengaluru Cab Booking", "Airport Taxi & Outstation"),
    description: clampDescription(
      "Book cabs in Bengaluru with Cabzii.in. Airport drops, outstation trips and local hire. OTP booking with fares shown before you confirm."
    )
  },
  hyderabad: {
    title: formatSerpTitle("Hyderabad Cab Booking", "Airport & Outstation"),
    description: clampDescription(
      "Book cabs in Hyderabad with Cabzii.in. Airport taxi, outstation and one-way trips. Fares shown before you confirm — OTP booking online."
    )
  },
  coimbatore: {
    title: formatSerpTitle("Cab Booking Coimbatore", "Online Taxi & Packages"),
    description: clampDescription(
      "Cab booking in Coimbatore with Cabzii.in — outstation, airport taxi and one-way cabs to Bengaluru, Kodaikanal and Tirupati. Book online with upfront fares."
    )
  },
  trichy: {
    title: formatSerpTitle("Cab Booking Trichy", "Online Taxi & Rental"),
    description: clampDescription(
      "Cab booking in Trichy on Cabzii.in — local hourly rental, outstation and one-way cabs to Chennai and Madurai. Compare fares and book online."
    )
  },
  kodaikanal: {
    title: formatSerpTitle("Cab Booking Kodaikanal", "Hill Station Taxi"),
    description: clampDescription(
      "Cab booking to Kodaikanal on Cabzii.in — outstation taxis from Coimbatore, Madurai and Chennai. Sedan, SUV and Innova for hill station trips with fixed fares."
    )
  }
};

const ROUTE_META_OVERRIDES = {
  "chennai-to-pondicherry-cab": {
    title: formatSerpTitle("Chennai to Pondicherry Cab", "One-Way Taxi"),
    description: clampDescription(
      "Chennai to Pondicherry cab on Cabzii — one-way taxi from ₹2,800 sedan. ECR highway, 160 km, 3–4 hours. Book online with upfront fare."
    )
  },
  "chennai-to-bangalore-cab": {
    title: formatSerpTitle("Chennai to Bangalore Taxi", "One-Way Cab"),
    description: clampDescription(
      "Chennai to Bangalore taxi on Cabzii — one-way cab from ₹4,500 sedan. NH48 route, 350 km, 6–7 hours. Compare sedan, SUV and Innova fares online."
    )
  },
  "chennai-to-bengaluru-cab": {
    title: formatSerpTitle("Chennai to Bangalore Taxi", "One-Way Cab"),
    description: clampDescription(
      "Chennai to Bangalore taxi on Cabzii — one-way cab from ₹4,500 sedan. NH48 route, 350 km, 6–7 hours. Compare sedan, SUV and Innova fares online."
    )
  },
  "chennai-to-tirupati-cab": {
    title: formatSerpTitle("Chennai to Tirupati Cab", "One-Way & Round Trip Taxi"),
    description: clampDescription(
      "Chennai to Tirupati cab on Cabzii — sedan from ₹3,250, Ertiga from ₹4,500. Swift Dzire, Honda Amaze and Innova. 135 km, 3–4 hrs. Fare shown before you confirm."
    )
  },
  "chennai-to-rameswaram-cab": {
    title: formatSerpTitle("Chennai to Rameswaram Cab Booking", "From ₹5,200"),
    description: clampDescription(
      "Chennai to Rameswaram cab on Cabzii — pilgrimage taxi from ₹3,250 sedan (250 km min + extra km). Pamban bridge route, 560 km, 8–9 hrs. Book Dzire, Amaze or Innova online."
    )
  },
  "madurai-to-rameswaram-cab": {
    title: formatSerpTitle("Madurai to Rameswaram Cab", "Temple Day Trip"),
    description: clampDescription(
      "Madurai to Rameswaram cab on Cabzii — temple day trip from ₹2,800 sedan. 170 km, 3–4 hrs via Pamban. Book online with a fare shown before you confirm."
    )
  },
  "coimbatore-to-ooty-cab": {
    title: formatSerpTitle("Coimbatore to Ooty Cab", "Hill Station Taxi"),
    description: clampDescription(
      "Coimbatore to Ooty cab on Cabzii — hill drive taxi from ₹2,200 sedan. 85 km, 3 hrs through Nilgiri ghats. Book sedan, SUV or Innova online with upfront fare."
    )
  },
  "chennai-to-vellore-cab": {
    title: formatSerpTitle("Chennai to Vellore Cab", "One-Way Taxi"),
    description: clampDescription(
      "Chennai to Vellore cab on Cabzii — one-way taxi from ₹2,600 sedan. 140 km, 3 hours. Medical, education and city travel with upfront fares."
    )
  },
  "chennai-to-coimbatore-cab": {
    title: formatSerpTitle("Chennai to Coimbatore Cab", "One-Way Taxi"),
    description: clampDescription(
      "Chennai to Coimbatore cab on Cabzii — one-way from ₹6,500 sedan. 505 km highway trip, 8–9 hours. Book sedan, SUV or Innova online."
    )
  },
  "chennai-to-madurai-cab": {
    title: formatSerpTitle("Chennai to Madurai Taxi", "One-Way Cab"),
    description: clampDescription(
      "Chennai to Madurai taxi on Cabzii — one-way cab from ₹6,000 sedan. 460 km, 7–8 hours. Temple and family travel with transparent pricing."
    )
  },
  "chennai-to-salem-cab": {
    title: formatSerpTitle("Chennai to Salem Taxi", "One-Way Cab"),
    description: clampDescription(
      "Chennai to Salem taxi on Cabzii — one-way cab from ₹4,300 sedan. 340 km, 5–6 hours. Book online with upfront fare and instant confirmation."
    )
  },
  "chennai-to-trichy-cab": {
    title: formatSerpTitle("Chennai to Trichy Taxi", "330 km · One-Way Cab Service"),
    description: clampDescription(
      "Chennai to Trichy taxi & cab service from ₹4,200. 330 km distance by car, 5–6 hours. Book one-way taxi online — Srirangam & city drops on Cabzii."
    )
  },
  "chennai-to-kanchipuram-cab": {
    title: formatSerpTitle("Chennai to Kanchipuram Cab", "Temple One-Way Taxi"),
    description: clampDescription(
      "Chennai to Kanchipuram cab on Cabzii — one-way taxi, about 75 km / 2 hours on the catalog. Indicative sedan from ₹1,800. Confirm the live fare before you pay."
    )
  },
  "chennai-to-tiruvannamalai-cab": {
    title: formatSerpTitle("Chennai to Tiruvannamalai Cab", "One-Way Taxi"),
    description: clampDescription(
      "Chennai to Tiruvannamalai cab on Cabzii — one-way taxi, about 185 km / 4 hours on the catalog. Indicative sedan from ₹3,000. Book with OTP."
    )
  },
  "chennai-to-kanyakumari-cab": {
    title: formatSerpTitle("Chennai to Kanyakumari Cab", "One-Way Taxi"),
    description: clampDescription(
      "Chennai to Kanyakumari cab on Cabzii — long highway one-way, about 700 km / 11–12 hours on the catalog. Confirm sedan/SUV fare on the route page before payment."
    )
  },
  "chennai-to-ooty-cab": {
    title: formatSerpTitle("Chennai to Ooty Cab", "Hill Station Taxi"),
    description: clampDescription(
      "Chennai to Ooty cab on Cabzii — about 555 km / 9–10 hours on the catalog. For the shorter hill hop see Coimbatore to Ooty. Confirm the live fare before you pay."
    )
  },
  "madurai-to-kanyakumari-cab": {
    title: formatSerpTitle("Madurai to Kanyakumari Cab", "One-Way Taxi"),
    description: clampDescription(
      "Madurai to Kanyakumari cab on Cabzii — one-way taxi with distance and starting fare on this route page. Book sedan or SUV with OTP."
    )
  },
  "bengaluru-to-mysore-cab": {
    title: formatSerpTitle("Bengaluru to Mysore Cab", "One-Way Taxi"),
    description: clampDescription(
      "Bengaluru to Mysore cab on Cabzii — one-way taxi, about 145 km / 3–4 hours on the catalog. Indicative sedan from ₹2,499. Confirm the live quote."
    )
  },
  "bengaluru-to-tirupati-cab": {
    title: formatSerpTitle("Bengaluru to Tirupati Cab", "One-Way Taxi"),
    description: clampDescription(
      "Bengaluru to Tirupati one-way cab on Cabzii.in — sedan and SUV options with distance and starting fare on the route page. Book online with OTP."
    )
  }
};

export function getServiceMeta(service, city) {
  const key = `${city.slug}:${service.slug}`;
  const override = SERVICE_META_OVERRIDES[key];
  if (override) return override;

  if (service.slug === "hourly-rental") {
    return {
      title: formatSerpTitle(`Full Day Taxi ${city.name}`, "4/8/12 Hr Cab Packages"),
      description: clampDescription(
        `Full day taxi and cab rental in ${city.name} — 4, 8 and 12 hour packages with upfront fares. Book online on Cabzii.in.`
      )
    };
  }

  if (service.slug === "cab-rental") {
    return {
      title: formatSerpTitle(`Cab Rental ${city.name}`, "Hourly & Full-Day Packages"),
      description: clampDescription(
        `Cab rental in ${city.name} on Cabzii.in — hourly and full-day packages for local trips, weddings and sightseeing. Fares shown before you confirm.`
      )
    };
  }

  if (service.slug === "driver-on-hire") {
    return {
      title: formatSerpTitle(`Driver on Hire ${city.name}`, "Acting Driver"),
      description: clampDescription(
        `Hire a driver in ${city.name} for your own car — hourly, daily and outstation chauffeur packages on Cabzii. Book online with upfront fares.`
      )
    };
  }

  if (service.slug === "chauffeur-service") {
    return {
      title: formatSerpTitle(`Chauffeur Service ${city.name}`, "Driver for Your Car"),
      description: clampDescription(
        `Book chauffeur service in ${city.name} with Cabzii — a driver for your own car on city and highway trips. Packages shown before you confirm.`
      )
    };
  }

  if (service.slug === "airport-taxi") {
    const airport = airportInfoForCity(city.slug);
    const priceFrom = service.priceFrom || 699;
    if (airport?.type === "local") {
      const label = airport.label || city.name;
      return {
        title: formatSerpTitle(`Airport Taxi from ${label} Airport`, "Book Now"),
        description: clampDescription(
          `Starting from ₹${priceFrom.toLocaleString("en-IN")}. Book airport taxi in ${label} (${airport.code}) on Cabzii.in — share terminal and flight time. Fare shown before you confirm.`
        )
      };
    }
    if (airport?.type === "nearest") {
      return {
        title: formatSerpTitle(`Airport Taxi from ${city.name}`, `${airport.code} Transfer`),
        description: clampDescription(
          `${airport.note} Cab to ${airport.name} from ${city.name} on Cabzii — upfront fare, OTP booking.`
        )
      };
    }
  }

  if (service.slug === "outstation-cab") {
    return {
      title: formatSerpTitle(`Outstation Cab ${city.name}`, "Round Trip Packages"),
      description: clampDescription(
        `Outstation cab from ${city.name} on Cabzii — round-trip and multi-day highway packages with per-km clarity. Book sedan, SUV or Innova online.`
      )
    };
  }

  const templateId = SERVICE_TEMPLATE[service.slug] || "outstation";
  return templateMeta(templateId, city.name);
}

/* Deterministic variant picker — same page always gets the same copy,
   but neighbouring pages get different patterns (avoids templated SERPs). */
function hashSlug(slug) {
  let h = 0;
  const s = String(slug || "");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973;
  return h;
}

function inr(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export function getCabBookingMeta(city) {
  if (CAB_BOOKING_META[city.slug]) return CAB_BOOKING_META[city.slug];

  const hasAirport = cityHasCommercialAirport(city.slug);
  const variants = hasAirport
    ? [
        {
          title: formatSerpTitle(`${city.name} Cab Booking`, "Airport Taxi & Packages"),
          description: clampDescription(
            `Book cabs in ${city.name} with Cabzii.in. Outstation, airport taxi and local hire. Transparent fares and OTP booking.`
          )
        },
        {
          title: formatSerpTitle(`Cab Booking ${city.name}`, "Online Taxi Service"),
          description: clampDescription(
            `Cab booking in ${city.name} made easy — compare outstation, airport and hourly packages on Cabzii.in. Professional drivers, upfront fares, instant OTP booking.`
          )
        },
        {
          title: formatSerpTitle(`Taxi in ${city.name}`, "Book Cabs Online"),
          description: clampDescription(
            `Need a taxi in ${city.name}? Book local, airport and outstation cabs on Cabzii.in with transparent fares and OTP booking.`
          )
        }
      ]
    : [
        {
          title: formatSerpTitle(`${city.name} Cab Booking`, "Outstation & Local Taxi"),
          description: clampDescription(
            `Book cabs in ${city.name} with Cabzii.in — local packages, outstation and one-way trips. Transparent fares, OTP booking and WhatsApp support.`
          )
        },
        {
          title: formatSerpTitle(`Cab Booking ${city.name}`, "Online Taxi Service"),
          description: clampDescription(
            `Cab booking in ${city.name} — compare local hourly and outstation packages on Cabzii.in. Professional drivers, upfront fares, instant OTP booking.`
          )
        },
        {
          title: formatSerpTitle(`Taxi in ${city.name}`, "Book Cabs Online"),
          description: clampDescription(
            `Need a taxi in ${city.name}? Book local and outstation cabs on Cabzii.in with transparent fares and OTP booking.`
          )
        }
      ];
  return variants[hashSlug(city.slug) % variants.length];
}

export function getRouteMeta(route) {
  const { slug, fromCity, toCity, distance, duration, sedanFrom } = route;
  if (ROUTE_META_OVERRIDES[slug]) return ROUTE_META_OVERRIDES[slug];

  const from = fromCity.name;
  const to = toCity.name;
  const hasTrip = Boolean(distance && duration);
  const hasFare = Number(sedanFrom) > 0;

  /* Intent-rotated recipes (pharmacy-sheet style):
     transactional · price · informational · trust */
  const variants = [];

  variants.push({
    title: formatSerpTitle(`${from} to ${to} Cab`, "Book One-Way Taxi Online"),
    description: clampDescription(
      hasTrip
        ? `Book ${from} to ${to} one-way cab online — ${distance}, around ${duration}. Fare shown before payment on Cabzii.in.`
        : `Book ${from} to ${to} one-way cab online with Cabzii.in. Door pickup, fare shown before payment, and OTP confirmation.`
    )
  });

  if (hasFare) {
    variants.push({
      title: formatSerpTitle(`${from} to ${to} Taxi`, `Fare from ${inr(sedanFrom)}`),
      description: clampDescription(
        `${from} to ${to} taxi fare from ${inr(sedanFrom)} (sedan). Compare sedan, SUV & Innova rates${hasTrip ? ` for the ${distance} trip` : ""} on Cabzii.in — zero hidden charges.`
      )
    });
  }

  if (hasTrip) {
    variants.push({
      title: formatSerpTitle(`${from} to ${to} Cab`, `${distance} in ${duration}`),
      description: clampDescription(
        `Travelling from ${from} to ${to}? It's ${distance} by road, around ${duration}. Book a cab on Cabzii.in with the fare shown before you confirm.`
      )
    });
  }

  variants.push({
    title: formatSerpTitle(`One Way Cab ${from} to ${to}`, "Fixed Fare"),
    description: clampDescription(
      `One-way ${from} to ${to} cab on Cabzii.in — door pickup and fare shown before you pay. Sedan, SUV and Innova options where listed.`
    )
  });

  return variants[hashSlug(slug) % variants.length];
}

export function getServiceH1(service, city) {
  if (city.slug === "chennai" && service.slug === "airport-taxi") {
    return "Chennai Airport Taxi (MAA) — Pickup, Drop & City Transfers";
  }
  if (city.slug === "chennai" && service.slug === "outstation-cab") {
    return "Outstation Cab from Chennai — One-Way vs Round Trip";
  }
  if (city.slug === "chennai" && service.slug === "tempo-traveller") {
    return "Tempo Traveller in Chennai — 12 to 18 Seater Group Hire";
  }
  if (city.slug === "chennai" && service.slug === "one-way-cab") {
    return "One-Way Cab from Chennai — Inter-City Drops";
  }
  if (service.slug === "hourly-rental") {
    return `Full Day Taxi in ${city.name} — 4/8/12 Hour Packages`;
  }
  if (city.slug === "chennai" && service.slug === "car-rental") {
    return "Car Rental in Chennai — Driver-Included 4 & 8 Hour Packages";
  }
  if (city.slug === "chennai" && service.slug === "cab-rental") {
    return "Cab Rental in Chennai — Hourly & Full-Day City Hire";
  }
  if (service.slug === "cab-rental") {
    return `Cab Rental in ${city.name} — Hourly & Full-Day Packages`;
  }
  if (service.slug === "airport-taxi") {
    const airport = airportInfoForCity(city.slug);
    if (airport?.type === "local") {
      const label = airport.label || city.name;
      return `${label} Airport Taxi — Pickup & Drop`;
    }
    if (airport?.type === "nearest") {
      return `Airport Taxi from ${city.name} — ${airport.name}`;
    }
    return `Airport Transfer Cabs from ${city.name}`;
  }
  const templateId = SERVICE_TEMPLATE[service.slug] || "outstation";
  if (templateId === "airport") return `Airport Transfer Cabs from ${city.name}`;
  if (templateId === "local_rental") {
    if (service.slug === "cab-rental") return `Cab Rental in ${city.name}`;
    if (service.slug === "driver-on-hire") return `Driver on Hire in ${city.name}`;
    if (service.slug === "chauffeur-service") return `Chauffeur Service in ${city.name}`;
    if (service.slug === "hourly-rental") return `Hourly Cab Rental in ${city.name}`;
    if (service.slug === "local-taxi") return `Local Taxi in ${city.name}`;
    return `Car Rental in ${city.name}`;
  }
  if (service.slug === "one-way-cab") return `One-Way Cabs in ${city.name}`;
  return `${service.name} in ${city.name}`;
}

export function getCabBookingH1(city) {
  if (city.slug === "chennai") return "Cab Booking in Chennai — Airport, Local & Outstation";
  if (city.slug === "madurai") return "Cab Booking Madurai — Online Taxi & Outstation";
  if (city.slug === "coimbatore") return "Cab Booking in Coimbatore — Online Taxi Service";
  if (city.slug === "trichy") return "Cab Booking Trichy — Online Taxi & Local Rental";
  if (city.slug === "kodaikanal") return "Cab Booking Kodaikanal — Hill Station Taxi";
  if (city.slug === "salem") return "Cab Booking in Salem — Outstation & Local Taxi";
  if (city.slug === "vellore") return "Cab Booking in Vellore — Online Taxi Service";
  return `Cab Booking in ${city.name} — Online Taxi Service`;
}

/** Search results deep-link for service landing CTAs */
export function serviceSearchHref(service, city) {
  if (service.slug === "tour-packages" || service.slug === "holiday-packages") {
    const q = new URLSearchParams({ city: city.name });
    return `/holidays?${q.toString()}`;
  }

  const base = new URLSearchParams({
    from: city.name,
    date: todayStr(),
    time: "09:00"
  });

  if (service.slug === "airport-taxi") {
    base.set("serviceTripType", "airport");
    base.set("to", city.name);
    base.set("direction", "pickup");
  } else if (service.slug === "hourly-rental") {
    base.set("serviceTripType", "hourly");
    base.set("from", city.slug === "bengaluru" ? "Kempegowda International Airport, Bengaluru" : city.name);
    base.set("to", city.name);
    base.set("city", city.name);
    base.set("packageHours", city.slug === "bengaluru" ? "12" : "8");
  } else if (
    service.slug === "car-rental" ||
    service.slug === "cab-rental" ||
    service.slug === "local-taxi"
  ) {
    base.set("serviceTripType", "local");
    base.set("to", city.name);
    base.set("packageHours", "8");
  } else {
    base.set("serviceTripType", "outstation");
    base.set("to", "");
  }

  return `/cabs/results?${base.toString()}`;
}

export function serviceMetaKeywords(service, city) {
  const cityLower = city.name.toLowerCase();
  const templateId = SERVICE_TEMPLATE[service.slug] || "outstation";
  const base = [
    `${service.primaryKeyword} ${cityLower}`,
    `${service.slug.replace(/-/g, " ")} ${cityLower}`,
    `cabzii ${cityLower}`
  ];

  if (service.slug === "hourly-rental") {
    return [
      `full day taxi ${cityLower}`,
      `full day taxi in ${cityLower}`,
      `full day cab in ${cityLower}`,
      `cab package in ${cityLower}`,
      `hourly cab rental ${cityLower}`,
      `daily cab service ${cityLower}`,
      ...base
    ];
  }

  if (service.slug === "cab-rental") {
    return [
      `cab rental ${cityLower}`,
      `cab rental in ${cityLower}`,
      `${cityLower} cab rental`,
      `${cityLower} taxi rental`,
      `taxi rental in ${cityLower}`,
      ...base
    ];
  }

  if (templateId === "outstation") {
    return [
      `one way cab ${cityLower}`,
      `outstation cab ${cityLower}`,
      `outstation taxi ${cityLower}`,
      `outstation taxi in ${cityLower}`,
      `outstation cab booking ${cityLower}`,
      `outstation cabs ${cityLower}`,
      `outstation car rental ${cityLower}`,
      `cab for outstation from ${cityLower}`,
      ...base
    ];
  }
  if (templateId === "airport") {
    const airport = AIRPORT_BY_CITY[city.slug];
    const label = (airport?.label || city.name).toLowerCase();
    return [
      `airport taxi ${cityLower}`,
      `${label} airport taxi`,
      `airport drop ${cityLower}`,
      `airport pickup ${cityLower}`,
      `${cityLower} airport transfer`,
      ...base
    ];
  }
  const rentalKw = [
    `car rental in ${cityLower}`,
    `car rental ${cityLower}`,
    `cab rental in ${cityLower}`,
    `cab rental ${cityLower}`,
    `local taxi ${cityLower}`
  ];
  if (city.slug === "bengaluru") {
    rentalKw.unshift("car rental in bangalore", "car rental bangalore", "cab rental bangalore");
  }
  if (city.slug === "chennai") {
    rentalKw.push("car rental maduravoyal", "car rental in maduravoyal");
  }
  if (service.slug === "car-rental") {
    return [...rentalKw, "car rental near me", ...base];
  }
  return [...rentalKw, ...base];
}

export function cabBookingMetaKeywords(city) {
  const cityLower = city.name.toLowerCase();
  const bangaloreExtras =
    city.slug === "bengaluru"
      ? ["cab booking bangalore", "bangalore cab booking", "cab services bangalore"]
      : [];
  const chennaiExtras =
    city.slug === "chennai"
      ? [
          "tour s taxi booking chennai",
          "dzire tour s taxi chennai",
          "swift dzire taxi booking chennai",
          "dezire taxi booking chennai",
          "wagon r taxi booking chennai",
          "wegon r taxi chennai",
          "bolero taxi booking chennai",
          "boliro taxi chennai",
          "innova crysta taxi chennai",
          "car rental chennai",
          "cab rental chennai",
          "tour s taxi booking"
        ]
      : [];
  return [
    `cab booking in ${cityLower}`,
    `cab booking ${cityLower}`,
    `${cityLower} cab booking`,
    `book cab in ${cityLower}`,
    `book a cab in ${cityLower}`,
    `book taxi ${cityLower}`,
    `cab ${cityLower}`,
    `${cityLower} cab`,
    `${cityLower} cabs`,
    `cab in ${cityLower}`,
    `${cityLower} cab service`,
    `${cityLower} cab hire`,
    `${cityLower} taxi hire`,
    `cab service in ${cityLower}`,
    `cab services in ${cityLower}`,
    `cab services ${cityLower}`,
    `cabs services in ${cityLower}`,
    `${cityLower} cab services`,
    `daily cab service ${cityLower}`,
    `taxi ${cityLower}`,
    `outstation cab ${cityLower}`,
    `airport taxi ${cityLower}`,
    ...bangaloreExtras,
    ...chennaiExtras,
    "cabzii"
  ];
}

/** Ordered services for city hub — priority slugs first, then fill to limit */
export function servicesForCityHub(citySlug, limit = 8) {
  const priority = CITY_PRIORITY_SERVICES[citySlug];
  const ordered = [];
  const seen = new Set();

  if (priority) {
    for (const slug of priority) {
      const svc = SEO_SERVICES.find((s) => s.slug === slug);
      if (svc) {
        ordered.push(svc);
        seen.add(slug);
      }
    }
  }

  for (const svc of SEO_SERVICES) {
    if (!seen.has(svc.slug) && ordered.length < limit) {
      ordered.push(svc);
      seen.add(svc.slug);
    }
  }

  return ordered;
}

const ROUTE_KEYWORD_OVERRIDES = {
  "chennai-to-rameswaram-cab": [
    "chennai to rameswaram cab",
    "chennai to rameswaram taxi",
    "rameswaram cab from chennai",
    "chennai rameswaram pilgrimage cab",
    "pamban bridge cab booking"
  ],
  "madurai-to-rameswaram-cab": [
    "madurai to rameswaram cab",
    "madurai to rameswaram taxi",
    "rameswaram temple cab from madurai",
    "madurai rameswaram day trip cab"
  ],
  "coimbatore-to-ooty-cab": [
    "coimbatore to ooty cab",
    "coimbatore to ooty taxi",
    "ooty cab from coimbatore",
    "nilgiri hill station cab"
  ],
  "chennai-to-tirupati-cab": [
    "tirupati car booking",
    "chennai to tirupati cab booking",
    "chennai tirupati car rental",
    "chennai to tirupati taxi",
    "chennai to tirupati cab",
    "one way cab chennai to tirupati",
    "tirupati cab from chennai",
    "chennai to tirupati car rental"
  ],
  "chennai-to-trichy-cab": [
    "chennai to trichy taxi",
    "chennai to trichy distance by car",
    "chennai to trichy cabs",
    "cab from chennai to trichy",
    "chennai to trichy cab service",
    "chennai to trichy one way taxi",
    "chennai to trichy oneway taxi",
    "chennai to trichy cab",
    "one way cab chennai to trichy"
  ]
};

export function getRouteH1(route) {
  const h1BySlug = {
    "chennai-to-trichy-cab": "Chennai to Trichy Taxi — One-Way Cab Service",
    "chennai-to-tirupati-cab": "Chennai to Tirupati Cab — Darshan One-Way Taxi",
    "chennai-to-pondicherry-cab": "Chennai to Pondicherry Cab — ECR One-Way Taxi",
    "chennai-to-bangalore-cab": "Chennai to Bangalore Taxi — NH48 One-Way Cab",
    "chennai-to-kanchipuram-cab": "Chennai to Kanchipuram Cab — Temple One-Way Taxi",
    "chennai-to-tiruvannamalai-cab": "Chennai to Tiruvannamalai Cab — One-Way Taxi",
    "chennai-to-rameswaram-cab": "Chennai to Rameswaram Cab — Pilgrimage One-Way Taxi",
    "chennai-to-madurai-cab": "Chennai to Madurai Taxi — One-Way Cab",
    "chennai-to-kanyakumari-cab": "Chennai to Kanyakumari Cab — One-Way Taxi",
    "chennai-to-ooty-cab": "Chennai to Ooty Cab — Hill Station One-Way Taxi",
    "madurai-to-rameswaram-cab": "Madurai to Rameswaram Cab — Temple Day Trip",
    "madurai-to-kanyakumari-cab": "Madurai to Kanyakumari Cab — One-Way Taxi",
    "coimbatore-to-ooty-cab": "Coimbatore to Ooty Cab — Hill Transfer Taxi",
    "bengaluru-to-tirupati-cab": "Bengaluru to Tirupati Cab — Darshan One-Way Taxi",
    "bengaluru-to-mysore-cab": "Bengaluru to Mysore Cab — One-Way Taxi"
  };
  if (h1BySlug[route.slug]) return h1BySlug[route.slug];
  return `${route.fromCity.name} to ${route.toCity.name} Cab — One Way Taxi`;
}

export function routeMetaKeywords(route) {
  if (ROUTE_KEYWORD_OVERRIDES[route.slug]) {
    return ROUTE_KEYWORD_OVERRIDES[route.slug];
  }
  const from = route.fromCity.name.toLowerCase();
  const to = route.toCity.name.toLowerCase();
  return [
    `one way cab ${from} to ${to}`,
    `${from} to ${to} taxi`,
    `outstation cab ${from}`,
    "cabzii one way cab"
  ];
}
