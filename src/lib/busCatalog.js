import { normalizeBusTrip } from "./busBooking";

const BUS_TRIP_CACHE_PREFIX = "cabzii-bus-trip-";

function readCachedTrip(id) {
  if (typeof window === "undefined" || !id) return null;
  try {
    const raw = sessionStorage.getItem(`${BUS_TRIP_CACHE_PREFIX}${id}`);
    if (!raw) return null;
    return normalizeBusTrip(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function cacheBusTrip(trip) {
  if (typeof window === "undefined" || !trip?.id) return;
  try {
    sessionStorage.setItem(`${BUS_TRIP_CACHE_PREFIX}${trip.id}`, JSON.stringify(trip));
  } catch {
    /* quota */
  }
}

function isMongoObjectId(id) {
  return /^[a-f0-9]{24}$/i.test(String(id || ""));
}

/** Search live bus trips from admin/database only (no mock fallback). */
export async function searchBuses({ from = "", to = "", date = "" } = {}) {
  try {
    const q = new URLSearchParams();
    if (from) q.set("from", from);
    if (to) q.set("to", to);
    if (date) q.set("date", date);
    const res = await fetch(`/api/buses?${q.toString()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    const rows = Array.isArray(json?.data) ? json.data : [];
    return rows.map(normalizeBusTrip).filter(Boolean);
  } catch {
    return [];
  }
}

/** Resolve bus trip for seat map from API or session cache. */
export async function resolveBusTrip({ id, from = "", to = "", date = "" } = {}) {
  const cached = id ? readCachedTrip(id) : null;
  if (cached) return cached;

  if (id && isMongoObjectId(id)) {
    try {
      const res = await fetch(`/api/buses/${encodeURIComponent(id)}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          const trip = normalizeBusTrip(json.data);
          cacheBusTrip(trip);
          return trip;
        }
      }
    } catch {
      /* empty */
    }
  }

  if (from || to) {
    const trips = await searchBuses({ from, to, date });
    const match = id ? trips.find((t) => String(t.id) === String(id)) : trips[0];
    if (match) {
      cacheBusTrip(match);
      return match;
    }
  }

  return null;
}
