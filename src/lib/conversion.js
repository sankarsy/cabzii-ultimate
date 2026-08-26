import { ORG_PHONE } from "./seo/constants";

export const CABZII_PHONE = ORG_PHONE;
export const CABZII_PHONE_DIGITS = "919944197416";
export const CABZII_WHATSAPP = "9944197416";

function titleFromSlug(slug = "") {
  return String(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function asSearchParams(searchParams) {
  if (!searchParams) return new URLSearchParams();
  if (typeof searchParams.get === "function") return searchParams;
  if (typeof searchParams === "string") return new URLSearchParams(searchParams);
  return new URLSearchParams(searchParams);
}

/**
 * Page-aware WhatsApp copy so Tirupati cab, bus, holiday, etc. send the matching enquiry.
 */
export function bookingWhatsappMessage({
  pathname = "",
  searchParams,
  city = "Chennai",
  intent = ""
} = {}) {
  const path = String(pathname || "").split("?")[0].toLowerCase();
  const q = asSearchParams(searchParams);
  const cityName = city || "Chennai";
  const fromQ = q.get("from") || q.get("pickup") || "";
  const toQ = q.get("to") || q.get("drop") || "";
  const dateQ = q.get("date") || "___";
  const holidayQ = q.get("q") || q.get("category") || "";

  if (intent === "exit") {
    if (path.includes("tirupati")) {
      return "Hi Cabzii, I was looking at Tirupati cab booking — please share sedan/SUV fare, date availability and pickup options.";
    }
    if (path.startsWith("/buses")) {
      return `Hi Cabzii, I was looking at bus tickets${fromQ && toQ ? ` from ${fromQ} to ${toQ}` : ""}. Please share seat availability and fare.`;
    }
    return `Hi Cabzii, I was about to leave — please share a quick quote for my trip from ${cityName}.`;
  }

  const routeMatch = path.match(/\/routes\/([a-z0-9-]+)/);
  if (routeMatch) {
    const slug = routeMatch[1].replace(/-cab$/, "");
    const [fromSlug, toSlug] = slug.split("-to-");
    if (fromSlug && toSlug) {
      const from = titleFromSlug(fromSlug);
      const to = titleFromSlug(toSlug);
      return `Hi Cabzii, I want to book a ${from} to ${to} cab. Date: ${dateQ}. Passengers: ___. Please share sedan and SUV fare.`;
    }
  }

  if (path.includes("/cab-booking/tirupati") || path.includes("/acting-driver/tirupati")) {
    return "Hi Cabzii, I want to book a Tirupati cab. Pickup: ___. Date: ___. Passengers: ___. Please share sedan/SUV fare and availability.";
  }

  const cityPage = path.match(/\/(?:cab-booking|acting-driver)\/([a-z0-9-]+)/);
  if (cityPage) {
    const place = titleFromSlug(cityPage[1]);
    const kind = path.includes("acting-driver") ? "acting driver" : "cab";
    return `Hi Cabzii, I want to book a ${kind} in ${place}. Pickup: ___. Date: ___. Please share fare and availability.`;
  }

  const serviceMatch = path.match(/\/services\/([a-z0-9-]+)\/([a-z0-9-]+)/);
  if (serviceMatch) {
    const service = titleFromSlug(serviceMatch[1]);
    const place = titleFromSlug(serviceMatch[2]);
    return `Hi Cabzii, I want to book ${service} in ${place}. Date: ${dateQ}. Please share fare and availability.`;
  }

  if (path.startsWith("/buses")) {
    const from = fromQ || cityName || "Chennai";
    const to = toQ;
    if (to) {
      return `Hi Cabzii, I want to book a bus from ${from} to ${to}. Date: ${dateQ}. Seats: ___. Please share availability and fare.`;
    }
    return `Hi Cabzii, I want to book a bus from ${from}. Date: ${dateQ}. Please share routes and fares.`;
  }

  if (path.startsWith("/holidays") || path.startsWith("/tour-packages") || path.startsWith("/packages")) {
    const topic = holidayQ || (path.includes("tirupati") ? "tirupati" : "");
    if (String(topic).toLowerCase().includes("tirupati")) {
      return "Hi Cabzii, I want to book a Tirupati tour package / cab. Pickup city: Chennai. Date: ___. Please share package options and fare.";
    }
    if (topic) {
      return `Hi Cabzii, I want to book a ${titleFromSlug(topic)} holiday package. Pickup: ${cityName}. Date: ${dateQ}. Please share options and fare.`;
    }
    return `Hi Cabzii, I want to book a holiday package from ${cityName}. Date: ${dateQ}. Please share options and fare.`;
  }

  if (path.startsWith("/drivers") || path.startsWith("/call-driver") || path.startsWith("/acting-driver")) {
    return `Hi Cabzii, I want to book a Call Driver service in ${cityName}. Date: ${dateQ}. Please share local, outstation or airport driver rates.`;
  }

  if (path.includes("airport")) {
    return `Hi Cabzii, I need ${cityName} airport taxi. Terminal: ___. Flight time: ___. Please quote sedan/SUV fare.`;
  }

  if (fromQ && toQ) {
    return `Hi Cabzii, I want to book a cab from ${fromQ} to ${toQ}. Date: ${dateQ}. Passengers: ___. Please share sedan and SUV fare.`;
  }

  return `Hi Cabzii, I want to book a cab in ${cityName}. Pickup: ___. Drop: ___. Date: ${dateQ}. Please share fare and availability.`;
}

export function whatsappQuoteMessage({
  service = "Cab",
  vehicleName = "",
  pickup = "",
  drop = "",
  travelDate = "",
  pickupTime = "",
  passengers = "",
  quoteRef = "",
  estimatedFare = "",
  distanceKm = "",
  tripType = "",
  packageLabel = "",
  pdfUrl = "",
  viewUrl = ""
} = {}) {
  const fare =
    estimatedFare && Number(estimatedFare) > 0
      ? `₹${Number(estimatedFare).toLocaleString("en-IN")}`
      : "";
  const lines = [
    "Cabzii package quote",
    "",
    quoteRef ? `Quote ref: ${quoteRef}` : null,
    `Vehicle: ${vehicleName || service || "Cab"}`,
    tripType ? `Service: ${tripType}` : `Service: ${service}`,
    packageLabel ? `Package: ${packageLabel}` : null,
    pickup ? `Pickup: ${pickup}` : null,
    drop ? `Drop: ${drop}` : null,
    travelDate ? `Travel date: ${travelDate}` : null,
    pickupTime ? `Pickup time: ${pickupTime}` : null,
    distanceKm ? `Distance: ${distanceKm} km` : null,
    passengers ? `Passengers: ${passengers}` : null,
    fare ? `Quoted fare: ${fare}` : null,
    "",
    "--- Package details (text) ---",
    "This is a trip package quote, not a confirmed booking.",
    viewUrl ? `View quote: ${viewUrl}` : null,
    pdfUrl ? `PDF copy: ${pdfUrl}` : null,
    "",
    "Please confirm on WhatsApp to book."
  ];
  return lines.filter((line) => line !== null).join("\n");
}

export function tripContextFromNextUrl(nextUrl = "") {
  try {
    const u = new URL(String(nextUrl || "/"), "https://cabzii.in");
    const path = u.pathname.toLowerCase();
    const q = u.searchParams;
    let service = "Cab";
    if (path.includes("call-driver") || path.includes("driver")) service = "Call Driver";
    else if (path.includes("bus")) service = "Bus";
    else if (path.includes("holiday") || path.includes("package")) service = "Holiday package";
    const tripType = q.get("serviceTripType") || q.get("tripType") || "";
    return {
      service,
      tripType,
      pickup: q.get("from") || q.get("pickup") || "",
      drop: q.get("to") || q.get("drop") || "",
      travelDate: q.get("date") || "",
      pickupTime: q.get("time") || q.get("pickupTime") || "",
      passengers: q.get("passengers") || q.get("seats") || "",
      vehicleName: q.get("vehicle") || q.get("cabName") || "",
      vehicleId: q.get("cabId") || q.get("cab") || q.get("id") || q.get("itemId") || "",
      distanceKm: q.get("distanceKm") || "",
      estimatedFare: q.get("total") || q.get("baseFare") || "",
      packageLabel: q.get("package") || q.get("packageId") || ""
    };
  } catch {
    return {
      service: "Cab",
      tripType: "",
      pickup: "",
      drop: "",
      travelDate: "",
      pickupTime: "",
      passengers: "",
      vehicleName: "",
      vehicleId: "",
      distanceKm: "",
      estimatedFare: "",
      packageLabel: ""
    };
  }
}

/** Pre-filled WhatsApp message for booking intent (URL-encoded). */
export function whatsappBookingUrl({
  message,
  phone = CABZII_WHATSAPP,
  pathname,
  searchParams,
  city,
  intent
} = {}) {
  const digits = String(phone).replace(/\D/g, "");
  const text =
    message ||
    bookingWhatsappMessage({ pathname, searchParams, city, intent });
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function telUrl(phone = CABZII_PHONE) {
  const normalized = String(phone).replace(/[^\d+]/g, "");
  return `tel:${normalized.startsWith("+") ? normalized : `+91${normalized.replace(/^91/, "")}`}`;
}

export function airportTaxiWhatsappUrl(direction = "pickup", city = "Chennai") {
  const msg =
    direction === "drop"
      ? `Hi Cabzii, I need ${city} airport DROP taxi. Pickup area: ___. Flight time: ___. Please quote sedan/SUV fare.`
      : `Hi Cabzii, I need ${city} airport PICKUP taxi. Terminal: ___. Flight landing: ___. Please quote sedan/SUV fare.`;
  return whatsappBookingUrl({ message: msg });
}

export function routeQuoteWhatsappUrl(from, to) {
  return whatsappBookingUrl({
    message: `Hi Cabzii, I want to book a one-way cab from ${from} to ${to}. Date: ___. Passengers: ___. Please share fare for sedan and SUV.`
  });
}

export function bangaloreAirport12HrWhatsappUrl() {
  return whatsappBookingUrl({
    message:
      "Hi Cabzii, I need Bangalore (Kempegowda) airport pickup with a 12-hour cab package (120 km). Date: ___. Time: ___. Passengers: ___. Please quote sedan/SUV fare."
  });
}
