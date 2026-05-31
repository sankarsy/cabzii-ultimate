import { SITE_NAME } from "./constants";

/** Search-intent tuned titles & descriptions (canonical URLs unchanged). */
export function tunedCabBookingTitle(city) {
  if (city.slug === "chennai") {
    return "Cab Booking in Chennai | Online Taxi Service 24/7 | Cabzii";
  }
  return `Cab Booking in ${city.name} | Online Taxi & Outstation | Cabzii`;
}

export function tunedCabBookingDescription(city) {
  if (city.slug === "chennai") {
    return `Cab booking in Chennai — compare Dzire, Ertiga, Innova & Tempo fares from ₹999. Airport pickup, outstation & local packages. Enter pickup, choose vehicle, login with OTP & book 24/7 on ${SITE_NAME}.`;
  }
  return `Cab booking in ${city.name}, ${city.state} — online taxi with transparent fares. Airport transfer, outstation one way & round trip, local hourly packages. Book instantly on ${SITE_NAME}.`;
}

export function tunedCabBookingH1(city) {
  if (city.slug === "chennai") {
    return "Cab Booking in Chennai — Online Taxi & Outstation Cabs";
  }
  return `Cab Booking in ${city.name} — Online Taxi Service`;
}

export function tunedActingDriverTitle(city) {
  if (city.slug === "tirupati") {
    return "Acting Driver in Tirupati | Chauffeur on Hire | Cabzii";
  }
  return `Acting Driver in ${city.name} | Driver on Hire | Cabzii`;
}

export function tunedActingDriverDescription(city) {
  return `Acting driver in ${city.name}, ${city.state} — verified chauffeurs for your car. Hourly, daily & outstation packages with allowance included. Book online on ${SITE_NAME}.`;
}

export function tunedActingDriverH1(city) {
  return `Acting Driver in ${city.name} — Chauffeur on Hire`;
}

export function tunedCabBookingKeywords(city) {
  const cityLower = city.name.toLowerCase();
  const base = [
    `cab booking in ${cityLower}`,
    `cab booking ${cityLower}`,
    `online cab booking ${cityLower}`,
    `taxi ${cityLower}`,
    `taxi service ${cityLower}`,
    `outstation cab ${cityLower}`,
    `airport taxi ${cityLower}`,
    "cabzii"
  ];
  if (city.slug === "chennai") {
    return [
      "cab booking in chennai",
      "online cab booking chennai",
      "taxi services in chennai",
      "chennai taxi cab service",
      "cab booking chennai",
      "car rental in chennai",
      "travels in chennai",
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
    return "Cab Booking in Chennai | Daily & Outstation Packages | Cabzii";
  }
  return `${service.name} in ${city.name} | Book Online | Cabzii`;
}

export function tunedServiceDescription(service, city) {
  if (service.slug === "car-rental" && city.slug === "chennai") {
    return `Book car rental in Chennai with sedan, SUV, Innova & tempo options. Daily rental, airport transfer and outstation trips with transparent fares from ₹${service.priceFrom?.toLocaleString("en-IN") || "1,200"}+. Compare vendors and book online on Cabzii.`;
  }
  if (service.slug === "cab-rental" && city.slug === "chennai") {
    return `Cab booking in Chennai — local day trips, airport runs and outstation travel. Hourly and full-day packages from ₹${service.priceFrom?.toLocaleString("en-IN") || "1,400"}+ with clear km limits on Cabzii.`;
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
