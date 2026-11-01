import { formatInrCurrency } from "../formatInr";
import { formatCabSeatLabel } from "../cabSeats";

/** Default fleet shown on service landing pages (matches Google rich-result attribute rows). */
export const DEFAULT_SERVICE_FLEET = ["Swift Dzire Tour S", "Wagon R", "Bolero", "Ertiga", "Innova Crysta"];

export const SERVICE_FLEET_BY_SLUG = {
  "tempo-traveller": ["Tempo Traveller 12 Seater", "Tempo Traveller 18 Seater", "Luxury Tempo 14 Seater"],
  "airport-taxi": DEFAULT_SERVICE_FLEET,
  "outstation-cab": DEFAULT_SERVICE_FLEET,
  "one-way-cab": DEFAULT_SERVICE_FLEET
};

export const SITE_SITELINKS = [
  { name: "Cab Booking", path: "/chennai" },
  { name: "Car Rental", path: "/services/car-rental/chennai" },
  { name: "Cab Rental", path: "/services/cab-rental/chennai" },
  { name: "Airport Taxi", path: "/chennai/airport-cab-booking" },
  { name: "Innova Crysta", path: "/cabs/mpv-toyota-innova-crysta" },
  { name: "All Cabs", path: "/cabs" }
];

export function formatSerpPrice(amount, { prefix = "From" } = {}) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return null;
  return `${prefix} ${formatInrCurrency(n)}`;
}

export function serpPriceLine(amount) {
  const line = formatSerpPrice(amount);
  return line ? `${line}. ` : "";
}

export function serviceFleetFor(serviceSlug) {
  return SERVICE_FLEET_BY_SLUG[serviceSlug] || DEFAULT_SERVICE_FLEET;
}

/** Visible + schema attribute pills for service pages. */
export function serviceSerpBadges(service, city) {
  const fleet = serviceFleetFor(service?.slug);
  const badges = [
    { label: `Vehicles: ${fleet.join(", ")}`, schemaName: "Available vehicles", schemaValue: fleet.join(", ") },
    { label: "Fares shown before you confirm", schemaName: "Pricing", schemaValue: "Upfront fare before confirmation" }
  ];
  if (service?.priceFrom) {
    badges.unshift({
      label: formatSerpPrice(service.priceFrom),
      schemaName: "Starting price",
      schemaValue: formatInrCurrency(service.priceFrom)
    });
  }
  if (city?.name) {
    badges.push({ label: `City: ${city.name}`, schemaName: "Service area", schemaValue: city.name });
  }
  return badges;
}

/** Vehicle detail attribute pills (Innova-style rich results). */
export function vehicleSerpBadges(cab) {
  if (!cab) return [];
  const badges = [];
  const seatLabel = formatCabSeatLabel(cab);
  badges.push({ label: `${seatLabel} Seats`, schemaName: "Seating capacity", schemaValue: seatLabel });
  badges.push({ label: "AC", schemaName: "Air conditioning", schemaValue: "Yes" });
  badges.push({ label: "Driver Included", schemaName: "Driver", schemaValue: "Professional driver included" });
  badges.push({ label: "Outstation", schemaName: "Trip type", schemaValue: "Local and outstation packages" });
  badges.push({ label: "Sanitized Car", schemaName: "Hygiene", schemaValue: "Sanitized before every trip" });
  if (cab.price) {
    const perKm =
      Number(cab?.farePackages?.outstationOneWay?.extraKmRate) ||
      Number(cab?.farePackages?.local4hr?.extraKmRate) ||
      0;
    if (perKm > 0) {
      badges.unshift({
        label: `From ₹${perKm}/km`,
        schemaName: "Per km rate",
        schemaValue: `₹${perKm} per km (one way)`
      });
    } else {
      badges.unshift({
        label: formatSerpPrice(cab.price),
        schemaName: "Starting price",
        schemaValue: formatInrCurrency(cab.price)
      });
    }
  }
  return badges;
}

export function badgesToSchemaProperties(badges = []) {
  return badges
    .filter((b) => b.schemaName && b.schemaValue)
    .map((b) => ({
      "@type": "PropertyValue",
      name: b.schemaName,
      value: b.schemaValue
    }));
}

export function formatBlogAuthor(author) {
  const name = String(author || "").trim();
  if (!name || name.toLowerCase() === "cabzii") return "Cabzii Team";
  if (name.toLowerCase().startsWith("by ")) return name.replace(/^by\s+/i, "");
  return name;
}

export function formatBlogDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
