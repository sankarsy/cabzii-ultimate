import { airportByCode } from "./airports";

const AIRLINES = [
  { name: "IndiGo", code: "6E", logo: "https://logo.clearbit.com/goindigo.in" },
  { name: "Air India", code: "AI", logo: "https://logo.clearbit.com/airindia.in" },
  { name: "SpiceJet", code: "SG", logo: "https://logo.clearbit.com/spicejet.com" },
  { name: "Vistara", code: "UK", logo: "https://logo.clearbit.com/airvistara.com" },
  { name: "Akasa Air", code: "QP", logo: "https://logo.clearbit.com/akasaair.com" }
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildFlight(id, fromCode, toCode, date, stops) {
  const airline = AIRLINES[id % AIRLINES.length];
  const origin = airportByCode(fromCode) || { code: fromCode, city: fromCode, airport: fromCode };
  const dest = airportByCode(toCode) || { code: toCode, city: toCode, airport: toCode };
  const depHour = 5 + (id % 18);
  const durationMin = stops === 0 ? rand(90, 180) : rand(240, 420);
  const base = rand(3200, 14500);
  const dep = `${String(depHour).padStart(2, "0")}:${rand(0, 59) < 30 ? "00" : "30"}`;
  const arrH = (depHour + Math.floor(durationMin / 60)) % 24;
  const arr = `${String(arrH).padStart(2, "0")}:${dep.split(":")[1]}`;

  return {
    id: `flt-${id}`,
    airline,
    flightNumber: `${airline.code} ${100 + id * 7}`,
    origin: { ...origin, terminal: `T${(id % 3) + 1}` },
    destination: { ...dest, terminal: `T${id % 2}` },
    departure: { time: dep, airport: origin.code, city: origin.city },
    arrival: { time: arr, airport: dest.code, city: dest.city },
    duration: `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`,
    durationMin,
    stops,
    aircraft: id % 2 ? "A320neo" : "B737-800",
    price: base,
    fareTypes: [
      { label: "SAVER", price: base, features: ["7kg cabin", "15kg check-in", "Non-refundable"] },
      { label: "FLEXI", price: base + rand(800, 1500), features: ["7kg cabin", "20kg check-in", "Free reschedule"] },
      { label: "CORPORATE", price: base + rand(2000, 3500), features: ["Priority check-in", "Lounge", "Full refund"] }
    ],
    amenities: stops === 0 ? ["Meals optional", "USB power"] : ["Meals", "Layover lounge"]
  };
}

/**
 * Generate mock flight results for search params.
 * @param {{ from: string, to: string, date?: string, tripType?: string }} params
 */
export function searchMockFlights(params) {
  const from = String(params.from || "DEL").toUpperCase();
  const to = String(params.to || "BOM").toUpperCase();
  if (from === to) return [];

  const list = [];
  for (let i = 0; i < 14; i++) {
    const stops = i % 5 === 0 ? 0 : i % 3 === 0 ? 2 : 1;
    list.push(buildFlight(i, from, to, params.date, stops));
  }
  return list.sort((a, b) => a.price - b.price);
}

export function filterFlights(flights, filters) {
  let out = [...flights];
  if (filters.maxPrice) out = out.filter((f) => f.price <= filters.maxPrice);
  if (filters.nonStop) out = out.filter((f) => f.stops === 0);
  if (filters.oneStop) out = out.filter((f) => f.stops === 1);
  if (filters.airlines?.length) {
    out = out.filter((f) => filters.airlines.includes(f.airline.code));
  }
  if (filters.sort === "fastest") out.sort((a, b) => a.durationMin - b.durationMin);
  else if (filters.sort === "latest") out.sort((a, b) => b.departure.time.localeCompare(a.departure.time));
  else if (filters.sort === "earliest") out.sort((a, b) => a.departure.time.localeCompare(b.departure.time));
  else out.sort((a, b) => a.price - b.price);
  return out;
}
