/** Approximate city centres for instant geocoding & distance (South India + metros). */
const CITY_COORDS = {
  chennai: { lat: 13.0827, lng: 80.2707, city: "Chennai" },
  madras: { lat: 13.0827, lng: 80.2707, city: "Chennai" },
  bengaluru: { lat: 12.9716, lng: 77.5946, city: "Bengaluru" },
  bangalore: { lat: 12.9716, lng: 77.5946, city: "Bengaluru" },
  coimbatore: { lat: 11.0168, lng: 76.9558, city: "Coimbatore" },
  madurai: { lat: 9.9252, lng: 78.1198, city: "Madurai" },
  tiruchirappalli: { lat: 10.7905, lng: 78.7047, city: "Tiruchirappalli" },
  trichy: { lat: 10.7905, lng: 78.7047, city: "Tiruchirappalli" },
  salem: { lat: 11.6643, lng: 78.146, city: "Salem" },
  pondicherry: { lat: 11.9416, lng: 79.8083, city: "Pondicherry" },
  puducherry: { lat: 11.9416, lng: 79.8083, city: "Pondicherry" },
  hyderabad: { lat: 17.385, lng: 78.4867, city: "Hyderabad" },
  mumbai: { lat: 19.076, lng: 72.8777, city: "Mumbai" },
  pune: { lat: 18.5204, lng: 73.8567, city: "Pune" },
  kochi: { lat: 9.9312, lng: 76.2673, city: "Kochi" },
  trivandrum: { lat: 8.5241, lng: 76.9366, city: "Thiruvananthapuram" },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366, city: "Thiruvananthapuram" },
  vellore: { lat: 12.9165, lng: 79.1325, city: "Vellore" },
  erode: { lat: 11.341, lng: 77.7172, city: "Erode" },
  tirupati: { lat: 13.6288, lng: 79.4192, city: "Tirupati" },
  ooty: { lat: 11.4064, lng: 76.6932, city: "Udhagamandalam" },
  udhagamandalam: { lat: 11.4064, lng: 76.6932, city: "Udhagamandalam" },
  kodaikanal: { lat: 10.2381, lng: 77.4892, city: "Kodaikanal" },
  sabarimala: { lat: 9.4346, lng: 77.0811, city: "Sabarimala" },
  sabarimalai: { lat: 9.4346, lng: 77.0811, city: "Sabarimala" },
  pamba: { lat: 9.408, lng: 77.08, city: "Pamba" },
  ayyappankovil: { lat: 9.8384, lng: 77.0276, city: "Ayyappan Kovil" },
  kanchipuram: { lat: 12.8342, lng: 79.7036, city: "Kanchipuram" },
  tirunelveli: { lat: 8.7139, lng: 77.7567, city: "Tirunelveli" },
  thanjavur: { lat: 10.787, lng: 79.1378, city: "Thanjavur" },
  hosur: { lat: 12.7409, lng: 77.8253, city: "Hosur" },
  nagercoil: { lat: 8.1833, lng: 77.4119, city: "Nagercoil" }
};

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function coordsForPlaceLabel(label) {
  const raw = String(label || "").trim();
  if (!raw) return null;

  const first = raw.split(",")[0].trim();
  const key = normalizeKey(first);
  if (CITY_COORDS[key]) {
    return { ...CITY_COORDS[key], label: raw };
  }

  for (const [name, coords] of Object.entries(CITY_COORDS)) {
    if (key.includes(name) || name.includes(key)) {
      return { ...coords, label: raw };
    }
  }
  return null;
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const toRad = (n) => (Number(n) * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const MAX_GPS_CITY_KM = 80;

/** Closest catalog city for a one-shot GPS pin. Not a live tracker. */
export function nearestCityFromCoords(lat, lng) {
  const userLat = Number(lat);
  const userLng = Number(lng);
  if (!Number.isFinite(userLat) || !Number.isFinite(userLng)) return null;
  let best = null;
  const seen = new Set();
  for (const row of Object.values(CITY_COORDS)) {
    if (!row?.city || seen.has(row.city)) continue;
    seen.add(row.city);
    const km = haversineKm(userLat, userLng, row.lat, row.lng);
    if (!best || km < best.km) best = { name: row.city, km };
  }
  if (!best || best.km > MAX_GPS_CITY_KM) return null;
  return best;
}

export function enrichPredictionWithCoords(prediction) {
  if (prediction?.lat != null && prediction?.lng != null) return prediction;
  const hit = coordsForPlaceLabel(prediction?.label);
  if (!hit) return prediction;
  return {
    ...prediction,
    lat: hit.lat,
    lng: hit.lng,
    city: hit.city || prediction.city
  };
}
