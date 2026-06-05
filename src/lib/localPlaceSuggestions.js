import { enrichPredictionWithCoords } from "./indiaCityCoords";
import { filterTamilNaduCities } from "./tamilNaduCities";

const METRO_LABELS = [
  "Bengaluru, Karnataka, India",
  "Hyderabad, Telangana, India",
  "Mumbai, Maharashtra, India",
  "Pune, Maharashtra, India",
  "Kochi, Kerala, India",
  "Thiruvananthapuram, Kerala, India"
];

function matchesQuery(label, query) {
  return label.toLowerCase().includes(query.toLowerCase());
}

export function localPlaceSuggestions(input, types = "address") {
  const q = String(input || "").trim();
  if (q.length < 2) return [];

  const seen = new Set();
  const out = [];

  const push = (label, source = "local") => {
    const key = label.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(
      enrichPredictionWithCoords({
        label,
        source,
        placeId: null
      })
    );
  };

  filterTamilNaduCities(q)
    .slice(0, 10)
    .forEach((label) => push(label, "tamilnadu"));

  if (types === "address") {
    METRO_LABELS.filter((label) => matchesQuery(label, q))
      .slice(0, 4)
      .forEach((label) => push(label, "metro"));
  }

  return out.slice(0, 12);
}

export function mergePlaceSuggestions(...lists) {
  const seen = new Set();
  const out = [];
  for (const list of lists) {
    for (const item of list || []) {
      const label = typeof item === "string" ? item : item?.label;
      if (!label) continue;
      const key = label.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(typeof item === "string" ? { label: item, placeId: null } : item);
    }
  }
  return out.slice(0, 12);
}
