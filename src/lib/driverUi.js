export function shortBookingId(id) {
  const s = String(id || "");
  return s.length > 8 ? s.slice(-8).toUpperCase() : s.toUpperCase();
}

export function tripPackageLabel(trip) {
  if (trip?.packageHours) return `${trip.packageHours} hr package`;
  if (trip?.packageId) return String(trip.packageId);
  return trip?.serviceTripType || trip?.tripType || "Trip";
}

export function mapsSearchHref(place) {
  const q = String(place || "").trim();
  if (!q) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function telHref(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits ? `tel:+91${digits.slice(-10)}` : "";
}

export function formatClock(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(d);
}

export function isOnTrip(trip) {
  return Boolean(trip?.tripStartedAt) && !trip?.tripFinishedAt && trip?.status === "confirmed";
}

export function tripStatusLabel(trip) {
  if (!trip) return "";
  if (trip.status === "cancelled") return "Cancelled";
  if (trip.tripFinishedAt || trip.status === "finished") return "Finished";
  if (isOnTrip(trip)) return "On trip";
  if (trip.status === "confirmed") return "Confirmed";
  if (trip.status === "pending") return "Pending";
  return trip.status || "";
}

export function pickNextTrip(today = [], upcoming = []) {
  const pool = [...today, ...upcoming].filter(
    (t) => t.status === "confirmed" || t.status === "pending"
  );
  return pool.find((t) => !isOnTrip(t) && !t.tripFinishedAt) || pool[0] || null;
}
