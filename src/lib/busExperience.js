/** RedBus-style defaults for policies, cancellation, rest stops, route and live tracking. */

export const CITY_COORDS = {
  chennai: [13.0827, 80.2707],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  coimbatore: [11.0168, 76.9558],
  madurai: [9.9252, 78.1198],
  tirupati: [13.6288, 79.4192],
  pondicherry: [11.9416, 79.8083],
  puducherry: [11.9416, 79.8083],
  trichy: [10.7905, 78.7047],
  hyderabad: [17.385, 78.4867],
  salem: [11.6643, 78.146]
};

export const DEFAULT_POLICIES = {
  luggage: "2 pieces of luggage will be accepted free. Excess baggage over 15 kg per passenger is chargeable as per operator rules.",
  pets: "Pets are not allowed.",
  liquor: "Carrying or consuming liquor inside the bus is prohibited. The operator may deny boarding without refund.",
  pickupTime: "The operator is not obligated to wait beyond the scheduled boarding time. No refund for late arrivals at the pickup point."
};

export const DEFAULT_CANCELLATION = [
  { hoursBefore: 8, refundPercent: 85 },
  { hoursBefore: 4, refundPercent: 50 },
  { hoursBefore: 0, refundPercent: 5 }
];

export const FEATURE_ICONS = [
  "Water bottle",
  "Blankets",
  "Snacks",
  "Charging point",
  "Reading light",
  "Pillow",
  "CCTV",
  "Bed sheet"
];

export function cityCoords(name) {
  const key = String(name || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  return CITY_COORDS[key] || null;
}

export function defaultRouteStops(fromCity, toCity) {
  const from = fromCity || "Chennai";
  const to = toCity || "Coimbatore";
  const extras = {
    "chennai-coimbatore": ["Maduranthakam", "Melmaruvathur", "Villupuram", "Salem", "Erode", "Tirupur"],
    "chennai-bengaluru": ["Sriperumbudur", "Kanchipuram", "Vellore", "Krishnagiri", "Hosur"],
    "chennai-madurai": ["Tindivanam", "Villupuram", "Trichy"],
    "chennai-tirupati": ["Red Hills", "Tiruttani"]
  };
  const key = `${from} ${to}`.toLowerCase().replace(/\s+/g, "-");
  const mid = extras[key] || extras[`${from.toLowerCase()}-${to.toLowerCase()}`] || [];
  return [from, ...mid, to];
}

export function defaultRestStops(fromCity) {
  return [
    {
      name: `${fromCity || "Highway"} Omni Bus Owners Association Motel`,
      time: "01:00",
      durationMin: 15,
      features: ["Washroom Hygiene", "Food Quality", "Safety"]
    }
  ];
}

export function parseCancellationText(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [hours, pct] = line.split("|").map((s) => s.trim());
      return { hoursBefore: Number(hours) || 0, refundPercent: Number(pct) || 0 };
    });
}

export function cancellationToText(rows) {
  if (!Array.isArray(rows) || !rows.length) return "";
  return rows.map((r) => `${r.hoursBefore} | ${r.refundPercent}`).join("\n");
}

export function parseRestStopsText(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, time = "", duration = "15", features = ""] = line.split("|").map((s) => s.trim());
      return {
        name,
        time,
        durationMin: Number(duration) || 15,
        features: features
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      };
    });
}

export function restStopsToText(rows) {
  if (!Array.isArray(rows) || !rows.length) return "";
  return rows
    .map((r) => [r.name, r.time, r.durationMin, (r.features || []).join(", ")].filter((v) => v !== "" && v != null).join(" | "))
    .join("\n");
}

function addHoursToDate(date, hhmm) {
  const [h, m] = String(hhmm || "00:00")
    .split(":")
    .map((n) => Number(n) || 0);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

export function cancellationSlabs(trip, travelDate) {
  const policy = trip?.cancellationPolicy?.length ? trip.cancellationPolicy : DEFAULT_CANCELLATION;
  const day = travelDate ? new Date(`${travelDate}T00:00:00`) : new Date();
  const depart = addHoursToDate(day, trip?.departure?.time || trip?.departureTime || "20:30");
  const fmt = (d) =>
    d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true });

  const sorted = [...policy].sort((a, b) => b.hoursBefore - a.hoursBefore);
  return sorted.map((row, i) => {
    const until = new Date(depart.getTime() - row.hoursBefore * 3600000);
    const prev = sorted[i - 1];
    const from = prev ? new Date(depart.getTime() - prev.hoursBefore * 3600000) : null;
    return {
      ...row,
      label: from
        ? `From ${fmt(from)} Until ${fmt(until)}`
        : `Before ${fmt(until)}`,
      until
    };
  });
}

export function livePosition(trip) {
  const stored = trip?.liveTracking || {};
  if (Number.isFinite(stored.lat) && Number.isFinite(stored.lng)) {
    return { lat: stored.lat, lng: stored.lng, source: "admin", status: stored.status || "on_time" };
  }
  const from = cityCoords(trip?.fromCity);
  const to = cityCoords(trip?.toCity);
  if (!from || !to) return null;
  const now = Date.now();
  const day = new Date();
  const depart = addHoursToDate(day, trip?.departure?.time || "20:30");
  const arrive = new Date(depart.getTime() + (Number(trip?.durationMin) || 480) * 60000);
  let t = (now - depart.getTime()) / Math.max(arrive.getTime() - depart.getTime(), 1);
  t = Math.min(1, Math.max(0.08, t));
  return {
    lat: from[0] + (to[0] - from[0]) * t,
    lng: from[1] + (to[1] - from[1]) * t,
    source: "estimated",
    status: stored.status || "on_time"
  };
}

export function lovedTags(trip) {
  const n = Number(trip?.reviewCount) || 400;
  return [
    ["Cleanliness", Math.round(n * 0.91)],
    ["Staff behavior", Math.round(n * 0.9)],
    ["Punctuality", Math.round(n * 0.88)],
    ["Seat / Sleep Comfort", Math.round(n * 0.88)],
    ["Driving", Math.round(n * 0.81)],
    ["AC", Math.round(n * 0.74)],
    ["Rest stop hygiene", Math.round(n * 0.73)],
    ["Live tracking", Math.round(n * 0.67)]
  ];
}

export function ratingBars() {
  return [
    [5, 88],
    [4, 7],
    [3, 3],
    [2, 1],
    [1, 1]
  ];
}
