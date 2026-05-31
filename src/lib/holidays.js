/** Holiday package categories (EasyMyTrip-style) */
export const HOLIDAY_CATEGORIES = [
  { id: "all", label: "All packages", icon: "✨" },
  { id: "pilgrimage", label: "Pilgrimage", icon: "🛕" },
  { id: "beach", label: "Beach", icon: "🏖️" },
  { id: "hill", label: "Hill station", icon: "⛰️" },
  { id: "heritage", label: "Heritage", icon: "🏰" },
  { id: "honeymoon", label: "Honeymoon", icon: "💑" },
  { id: "adventure", label: "Adventure", icon: "🧗" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦" }
];

/** Default cab types when package has no custom cabTypes */
export const DEFAULT_HOLIDAY_CAB_TYPES = [
  { id: "sedan", label: "Sedan", seats: 4, multiplier: 1 },
  { id: "suv", label: "SUV", seats: 6, multiplier: 1.12 },
  { id: "innova", label: "Innova", seats: 7, multiplier: 1.18 },
  { id: "tempo", label: "Tempo Traveller", seats: 12, multiplier: 1.35 }
];

export function categoryLabel(id) {
  return HOLIDAY_CATEGORIES.find((c) => c.id === id)?.label || id;
}

export function resolveHolidayCabTypes(pkg) {
  if (Array.isArray(pkg?.cabTypes) && pkg.cabTypes.length) {
    return pkg.cabTypes.map((c) => ({
      id: String(c.id || c.label || "sedan").toLowerCase().replace(/\s+/g, "_"),
      label: c.label || c.id || "Cab",
      seats: Number(c.seats) || 4,
      multiplier: Number(c.multiplier) > 0 ? Number(c.multiplier) : 1
    }));
  }
  return DEFAULT_HOLIDAY_CAB_TYPES;
}

export function cabTypeById(cabTypes, id) {
  return cabTypes.find((c) => c.id === id) || cabTypes[0];
}
