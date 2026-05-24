import { SITE_NAME } from "./constants";

/** Search-intent tuned titles & descriptions (canonical URLs unchanged). */
export function tunedCabBookingTitle(city) {
  if (city.slug === "chennai") {
    return "Travels in Chennai | Cab, Taxi & Car Rental Near You | Cabzii";
  }
  return `Cab Booking ${city.name} | Taxi & Outstation Cabs | Cabzii`;
}

export function tunedCabBookingDescription(city) {
  if (city.slug === "chennai") {
    return `Book travels in Chennai — cabs, taxis, car rental, airport pickup and outstation trips. Compare sedan, SUV & Innova fares with verified drivers. Instant online booking on ${SITE_NAME}.`;
  }
  return `Book cabs and taxis in ${city.name}, ${city.state} with ${SITE_NAME}. Airport pickup, outstation, local rental, acting driver and transparent fares — instant online booking.`;
}

export function tunedCabBookingKeywords(city) {
  const cityLower = city.name.toLowerCase();
  const base = [
    `cab booking ${cityLower}`,
    `taxi ${cityLower}`,
    `outstation cab ${cityLower}`,
    `airport taxi ${cityLower}`,
    "cabzii"
  ];
  if (city.slug === "chennai") {
    return [
      "travels in chennai",
      "travels near me chennai",
      "travel agency chennai",
      "car rental in chennai",
      "cab rental chennai",
      ...base
    ];
  }
  return base;
}

export function tunedServiceTitle(service, city) {
  if (service.slug === "car-rental" && city.slug === "chennai") {
    return "Car Rental in Chennai | Best Rates & Instant Booking | Cabzii";
  }
  if (service.slug === "cab-rental" && city.slug === "chennai") {
    return "Cab Rental in Chennai | Daily & Outstation Packages | Cabzii";
  }
  return `${service.name} in ${city.name} | Book Online | Cabzii`;
}

export function tunedServiceDescription(service, city) {
  if (service.slug === "car-rental" && city.slug === "chennai") {
    return `Book car rental in Chennai with sedan, SUV, Innova & tempo options. Daily rental, airport transfer and outstation trips with transparent fares from ₹${service.priceFrom?.toLocaleString("en-IN") || "1,200"}+. Compare vendors and book online on Cabzii.`;
  }
  if (service.slug === "cab-rental" && city.slug === "chennai") {
    return `Cab rental in Chennai for local day trips, airport runs and outstation travel. Hourly and full-day packages with clear km limits — book instantly on Cabzii.`;
  }
  return `Book ${service.name.toLowerCase()} in ${city.name}, ${city.state}. ${service.highlights[0]}. Compare fares and book instantly on Cabzii with OTP login.`;
}

export function tunedServiceKeywords(service, city) {
  const cityLower = city.name.toLowerCase();
  const base = [
    `${service.primaryKeyword} ${cityLower}`,
    `${service.slug.replace(/-/g, " ")} ${cityLower}`,
    `cabzii ${cityLower}`,
    `taxi ${cityLower}`,
    `cab booking ${cityLower}`
  ];
  if (service.slug === "car-rental" && city.slug === "chennai") {
    return [
      "car rental in chennai",
      "car rental near me chennai",
      "car hire chennai",
      "rent a car chennai",
      "self drive alternative chennai",
      ...base
    ];
  }
  return base;
}
