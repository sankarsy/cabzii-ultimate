import { formatInr } from "./formatInr";
import { todayStr } from "./istDate";

export const CALL_DRIVER_SERVICES = [
  {
    id: "local",
    title: "Local Driver",
    shortTitle: "Local",
    blurb: "Driver for your own car for local city trips.",
    cta: "Book Now",
    quoteOnly: false
  },
  {
    id: "outstation",
    title: "Outstation Driver",
    shortTitle: "Outstation",
    blurb: "Hire a driver for your outstation trip.",
    cta: "Book Now",
    quoteOnly: false
  },
  {
    id: "airport",
    title: "Airport Driver",
    shortTitle: "Airport",
    blurb: "Driver for airport pickup or drop in your own vehicle.",
    cta: "Book Now",
    quoteOnly: false
  },
  {
    id: "school",
    title: "Monthly Driver",
    shortTitle: "Monthly",
    blurb: "School, personal or regular monthly driver requirement.",
    cta: "Request Quote",
    quoteOnly: true
  },
  {
    id: "corporate",
    title: "Corporate Driver",
    shortTitle: "Corporate",
    blurb: "Dedicated drivers for corporate requirements.",
    cta: "Get Quote",
    quoteOnly: true
  },
  {
    id: "valet",
    title: "Valet Parking",
    shortTitle: "Valet",
    blurb: "Professional drivers for events and functions.",
    cta: "Book Now",
    quoteOnly: false
  }
];

export const CALL_DRIVER_AIRPORTS = [
  { id: "MAA", label: "Chennai International Airport (MAA)" },
  { id: "MAA-T1", label: "Chennai Airport — Terminal 1" },
  { id: "MAA-T2", label: "Chennai Airport — Terminal 2" },
  { id: "BLR", label: "Kempegowda International Airport (BLR)" },
  { id: "TRZ", label: "Tiruchirappalli International Airport (TRZ)" },
  { id: "CJB", label: "Coimbatore International Airport (CJB)" },
  { id: "IXM", label: "Madurai Airport (IXM)" }
];

export const DRIVER_OPS_STATUS_LABELS = {
  pending: "Booking received",
  confirmed: "Booking confirmed",
  driver_assigned: "Driver assigned",
  driver_on_the_way: "Driver on the way",
  driver_arrived: "Driver arrived",
  trip_started: "Trip started",
  trip_completed: "Trip completed",
  cancelled: "Cancelled"
};

export function callDriverServiceById(id) {
  return CALL_DRIVER_SERVICES.find((s) => s.id === String(id || "")) || null;
}

export function callDriverBookHref(serviceId) {
  return `/call-driver/book?service=${encodeURIComponent(serviceId)}`;
}

export function formatFromPrice(fromPrice) {
  const n = Number(fromPrice);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `From ₹${formatInr(n)}`;
}

export function todayISODate() {
  return todayStr();
}

export function mergeCallDriverServices(apiServices) {
  const byId = new Map((Array.isArray(apiServices) ? apiServices : []).map((s) => [s.id, s]));
  return CALL_DRIVER_SERVICES.map((base) => {
    const extra = byId.get(base.id) || {};
    return {
      ...base,
      title: extra.title || base.title,
      blurb: extra.blurb || base.blurb,
      cta: extra.cta || base.cta,
      quoteOnly: extra.quoteOnly ?? base.quoteOnly,
      fromPrice: extra.fromPrice ?? null
    };
  });
}
