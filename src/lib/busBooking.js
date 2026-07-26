/** Bus booking utilities — seat layouts, pricing, stop parsing. */

export const BUS_TYPES = [
  { id: "ac-seater", label: "AC Seater", icon: "armchair" },
  { id: "ac-sleeper", label: "AC Sleeper", icon: "bed" },
  { id: "non-ac-seater", label: "Non-AC Seater", icon: "armchair" },
  { id: "volvo-ac", label: "Volvo AC Sleeper", icon: "bed" }
];

export const SEAT_TYPES = {
  seater: { label: "Seater", color: "sky" },
  sleeper: { label: "Sleeper", color: "indigo" },
  "lower-berth": { label: "Lower", color: "emerald" },
  "upper-berth": { label: "Upper", color: "violet" },
  ladies: { label: "Ladies", color: "rose" },
  booked: { label: "Booked", color: "slate" }
};

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}

/** Standard 2+2 seater layout (40 seats). */
export function generateSeaterLayout(tripId = "default", bookedCount = 8) {
  const seats = [];
  const rows = 10;
  for (let r = 1; r <= rows; r += 1) {
    ["A", "B", "C", "D"].forEach((col, ci) => {
      const id = `S${r}${col}`;
      seats.push({
        id,
        row: r,
        col: ci,
        side: ci < 2 ? "left" : "right",
        deck: "lower",
        type: "seater",
        priceKey: "seater"
      });
    });
  }
  return markBookedSeats(seats, tripId, bookedCount);
}

/** Standard sleeper — lower + upper berths. */
export function generateSleeperLayout(tripId = "default", bookedCount = 12) {
  const seats = [];
  const rows = 6;
  for (let r = 1; r <= rows; r += 1) {
    ["L", "U"].forEach((deck) => {
      ["A", "B", "C"].forEach((col, ci) => {
        const id = `${deck}${r}${col}`;
        seats.push({
          id,
          row: r,
          col: ci,
          side: ci < 2 ? "left" : "right",
          deck: deck === "L" ? "lower" : "upper",
          type: deck === "L" ? "lower-berth" : "upper-berth",
          priceKey: deck === "L" ? "lowerBerth" : "upperBerth"
        });
      });
    });
  }
  return markBookedSeats(seats, tripId, bookedCount);
}

function markBookedSeats(seats, tripId, count) {
  const seed = hashSeed(String(tripId));
  const booked = new Set();
  for (let i = 0; i < count; i += 1) {
    booked.add(seats[(seed + i * 7) % seats.length].id);
  }
  return seats.map((s) => ({
    ...s,
    status: booked.has(s.id) ? "booked" : "available"
  }));
}

export function layoutForBusType(busType, tripId) {
  const t = String(busType || "").toLowerCase();
  if (t.includes("sleeper") || t.includes("volvo")) {
    return generateSleeperLayout(tripId, 10 + (hashSeed(tripId) % 8));
  }
  return generateSeaterLayout(tripId, 6 + (hashSeed(tripId) % 10));
}

export function parseStops(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, time = "", landmark = ""] = line.split("|").map((s) => s.trim());
      return { name, time, landmark };
    });
}

export function stopsToLines(stops) {
  if (!Array.isArray(stops)) return "";
  return stops.map((s) => [s.name, s.time, s.landmark].filter(Boolean).join(" | ")).join("\n");
}

export function seatPrice(seat, fares) {
  const key = seat?.priceKey || "seater";
  return Number(fares?.[key] ?? fares?.seater ?? 0);
}

export function calcBusTotal(seats, fares) {
  return seats.reduce((sum, s) => sum + seatPrice(s, fares), 0);
}

export function filterBuses(trips, filters = {}) {
  let out = [...trips];
  if (filters.busTypes?.length) {
    out = out.filter((t) => filters.busTypes.some((bt) => String(t.busType).toLowerCase().includes(bt)));
  }
  if (filters.operators?.length) {
    out = out.filter((t) => filters.operators.includes(t.operator?.code || t.operator));
  }
  if (filters.maxPrice) out = out.filter((t) => t.fares.seater <= filters.maxPrice);
  if (filters.departureWindow === "morning") out = out.filter((t) => parseInt(t.departure.time, 10) < 12);
  if (filters.departureWindow === "afternoon") {
    out = out.filter((t) => {
      const h = parseInt(t.departure.time, 10);
      return h >= 12 && h < 17;
    });
  }
  if (filters.departureWindow === "evening") out = out.filter((t) => parseInt(t.departure.time, 10) >= 17);

  const sort = filters.sort || "cheapest";
  if (sort === "earliest") out.sort((a, b) => a.departure.time.localeCompare(b.departure.time));
  else if (sort === "latest") out.sort((a, b) => b.departure.time.localeCompare(a.departure.time));
  else if (sort === "fastest") out.sort((a, b) => a.durationMin - b.durationMin);
  else out.sort((a, b) => a.fares.seater - b.fares.seater);
  return out;
}

export function normalizeBusTrip(raw) {
  if (!raw) return null;
  const id = raw._id || raw.id;
  const busType = raw.busType || "AC Seater";
  const layout = raw.seatLayout?.length
    ? raw.seatLayout.map((s) => ({ ...s, status: s.status || "available" }))
    : layoutForBusType(busType, id);

  const bookedSet = new Set(Array.isArray(raw.bookedSeats) ? raw.bookedSeats : []);
  const layoutWithBooked = layout.map((s) =>
    bookedSet.has(s.id) ? { ...s, status: "booked" } : s
  );

  const booked = layoutWithBooked.filter((s) => s.status === "booked").length;
  const available = layoutWithBooked.length - booked;

  return {
    id: String(id),
    operator: typeof raw.operator === "string" ? { name: raw.operator, code: raw.operator.slice(0, 3).toUpperCase() } : raw.operator,
    fromCity: raw.fromCity || raw.from || "",
    toCity: raw.toCity || raw.to || "",
    departure: raw.departure || { time: raw.departureTime || "06:00", city: raw.fromCity },
    arrival: raw.arrival || { time: raw.arrivalTime || "14:00", city: raw.toCity },
    duration: raw.duration || "8h",
    durationMin: raw.durationMin || 480,
    busType,
    amenities: raw.amenities || ["Water bottle", "Charging point"],
    rating: raw.rating ?? 4.2,
    reviewCount: raw.reviewCount ?? 120,
    fares: {
      seater: Number(raw.seaterPrice ?? raw.fares?.seater ?? raw.price ?? 599),
      sleeper: Number(raw.sleeperPrice ?? raw.fares?.sleeper ?? 899),
      lowerBerth: Number(raw.lowerBerthPrice ?? raw.fares?.lowerBerth ?? 999),
      upperBerth: Number(raw.upperBerthPrice ?? raw.fares?.upperBerth ?? 799)
    },
    boardingPoints: Array.isArray(raw.boardingPoints) ? raw.boardingPoints : parseStops(raw.boardingPointsText),
    droppingPoints: Array.isArray(raw.droppingPoints) ? raw.droppingPoints : parseStops(raw.droppingPointsText),
    seatLayout: layoutWithBooked,
    availableSeats: raw.availableSeats ?? available,
    totalSeats: raw.totalSeats ?? layoutWithBooked.length,
    status: raw.status || "active"
  };
}
