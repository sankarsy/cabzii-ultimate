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
        priceKey: "seater",
        ladiesOnly: hashSeed(`${tripId}-${id}`) % 7 === 0
      });
    });
  }
  return markBookedSeats(seats, tripId, bookedCount);
}

/** Standard sleeper — 2+1 lower + upper berths (RedBus style). */
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
          priceKey: deck === "L" ? "lowerBerth" : "upperBerth",
          ladiesOnly: hashSeed(`${tripId}-${id}`) % 7 === 0
        });
      });
    });
  }
  return markBookedSeats(seats, tripId, bookedCount);
}

function genderForSeat(id, tripId) {
  return hashSeed(`${tripId}-${id}`) % 2 === 0 ? "F" : "M";
}

function markBookedSeats(seats, tripId, count) {
  const seed = hashSeed(String(tripId));
  const booked = new Set();
  for (let i = 0; i < count; i += 1) {
    booked.add(seats[(seed + i * 7) % seats.length].id);
  }
  return seats.map((s) => ({
    ...s,
    status: booked.has(s.id) ? "booked" : "available",
    gender: booked.has(s.id) ? genderForSeat(s.id, tripId) : null
  }));
}

export function layoutForBusType(busType, tripId, bookedCount) {
  const t = String(busType || "").toLowerCase();
  const sleeper = t.includes("sleeper") || t.includes("volvo");
  const n = bookedCount == null ? (sleeper ? 10 + (hashSeed(tripId) % 8) : 6 + (hashSeed(tripId) % 10)) : bookedCount;
  if (sleeper) return generateSleeperLayout(tripId, n);
  return generateSeaterLayout(tripId, n);
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
  const types = filters.busTypes || [];
  if (types.length) {
    out = out.filter((t) => {
      const bt = String(t.busType || "").toLowerCase();
      return types.some((id) => {
        if (id === "ac") return bt.includes("ac") && !bt.includes("non");
        if (id === "non-ac" || id === "non ac") return bt.includes("non");
        if (id === "sleeper") return bt.includes("sleeper") || bt.includes("volvo");
        if (id === "seater") return bt.includes("seater") && !bt.includes("sleeper");
        if (id === "track") return t.liveTracking?.enabled !== false;
        if (id === "offers") return Number(t.exclusiveDiscount) > 0;
        return bt.includes(String(id).toLowerCase());
      });
    });
  }
  if (filters.operators?.length) {
    out = out.filter((t) => filters.operators.includes(t.operator?.name || t.operator?.code || t.operator));
  }
  if (filters.boardingPoint) {
    const q = String(filters.boardingPoint).toLowerCase();
    out = out.filter((t) => (t.boardingPoints || []).some((p) => String(p.name || "").toLowerCase().includes(q)));
  }
  if (filters.minPrice) out = out.filter((t) => t.fares.seater >= filters.minPrice);
  if (filters.maxPrice) out = out.filter((t) => t.fares.seater <= filters.maxPrice);
  const h = (t) => parseInt(t.departure?.time || t.departureTime || "0", 10);
  if (filters.departureWindow === "before10") out = out.filter((t) => h(t) < 10);
  if (filters.departureWindow === "10to5") out = out.filter((t) => h(t) >= 10 && h(t) < 17);
  if (filters.departureWindow === "5to11") out = out.filter((t) => h(t) >= 17 && h(t) < 23);
  if (filters.departureWindow === "after11") out = out.filter((t) => h(t) >= 23 || h(t) < 5);
  if (filters.departureWindow === "morning") out = out.filter((t) => h(t) < 12);
  if (filters.departureWindow === "afternoon") out = out.filter((t) => h(t) >= 12 && h(t) < 17);
  if (filters.departureWindow === "evening") out = out.filter((t) => h(t) >= 17);

  const sort = filters.sort || "cheapest";
  if (sort === "earliest" || sort === "departure") out.sort((a, b) => a.departure.time.localeCompare(b.departure.time));
  else if (sort === "latest") out.sort((a, b) => b.departure.time.localeCompare(a.departure.time));
  else if (sort === "arrival") out.sort((a, b) => String(a.arrival?.time || "").localeCompare(String(b.arrival?.time || "")));
  else if (sort === "fastest") out.sort((a, b) => a.durationMin - b.durationMin);
  else if (sort === "seats") out.sort((a, b) => (b.availableSeats || 0) - (a.availableSeats || 0));
  else if (sort === "ratings") out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else out.sort((a, b) => a.fares.seater - b.fares.seater);
  return out;
}

export function normalizeBusTrip(raw) {
  if (!raw) return null;
  const id = raw._id || raw.id;
  const busType = raw.busType || raw.layoutPreset || "AC Seater";
  const bookedRaw = Array.isArray(raw.bookedSeats) ? raw.bookedSeats.map(String) : [];
  const allOpen = bookedRaw.some((id) => ["none", "available", "*"].includes(id.toLowerCase()));
  const realBooked = bookedRaw.filter((id) => !["none", "available", "*"].includes(id.toLowerCase()));
  const layout = raw.seatLayout?.length
    ? raw.seatLayout.map((s) => ({ ...s, status: s.status || "available" }))
    : layoutForBusType(busType, id, 0);

  const demoBooked = allOpen ? [] : layoutForBusType(busType, id).filter((s) => s.status === "booked").map((s) => s.id);
  const bookedSet = new Set([...demoBooked, ...realBooked]);
  const genders = raw.bookedSeatGenders && typeof raw.bookedSeatGenders === "object" ? raw.bookedSeatGenders : {};
  const layoutWithBooked = layout.map((s) => {
    const sold = bookedSet.has(String(s.id));
    return {
      ...s,
      status: sold ? "booked" : s.status || "available",
      gender: sold ? genders[s.id] || s.gender || (hashSeed(`${id}-${s.id}`) % 2 === 0 ? "F" : "M") : null,
      ladiesOnly: Boolean(s.ladiesOnly)
    };
  });

  const booked = layoutWithBooked.filter((s) => s.status === "booked").length;
  const available = layoutWithBooked.length - booked;

  return {
    id: String(id),
    operator: typeof raw.operator === "string" ? { name: raw.operator, code: raw.operator.slice(0, 3).toUpperCase(), logo: raw.operatorLogo } : raw.operator,
    vendor: raw.vendor || "Cabzii Partner",
    fromCity: raw.fromCity || raw.from || "",
    toCity: raw.toCity || raw.to || "",
    departure: raw.departure || { time: raw.departureTime || "06:00", city: raw.fromCity },
    arrival: raw.arrival || { time: raw.arrivalTime || "14:00", city: raw.toCity },
    duration: raw.duration || "8h",
    durationMin: raw.durationMin || 480,
    busType,
    amenities: raw.amenities?.length ? raw.amenities : ["Water bottle", "Charging point", "Blanket", "Pillow"],
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
    status: raw.status || "active",
    exclusiveDiscount: Number(raw.exclusiveDiscount ?? 0),
    tripGuaranteePrice: Number(raw.tripGuaranteePrice ?? 24),
    distanceKm: Number(raw.distanceKm) || 0,
    onTimePercent: raw.onTimePercent ?? 86,
    onTimeTrips: raw.onTimeTrips ?? 957,
    onTimeTotal: raw.onTimeTotal ?? 1113,
    cancellationPolicy: Array.isArray(raw.cancellationPolicy) ? raw.cancellationPolicy : [],
    restStops: Array.isArray(raw.restStops) ? raw.restStops : [],
    routeStops: Array.isArray(raw.routeStops) ? raw.routeStops : [],
    policies: raw.policies || {},
    liveTracking: raw.liveTracking || {}
  };
}
