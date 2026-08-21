import { SEO_SERVICES } from "./seo/services";
import { SEO_ROUTES } from "./seo/routes";

/** Payloads to upsert built-in service pages into MongoDB. */
export function builtInSeoServicePayloads() {
  return SEO_SERVICES.map((s) => ({
    slug: s.slug,
    name: s.name,
    primaryKeyword: s.primaryKeyword || s.name,
    searchQuery: s.searchQuery || s.primaryKeyword || s.name,
    priceFrom: Number(s.priceFrom) || 0,
    highlights: Array.isArray(s.highlights) ? s.highlights : [],
    body: s.body || "",
    seoTitle: `${s.name} — Book Online | Cabzii`,
    seoDescription: `Book ${String(s.name || "").toLowerCase()} online on Cabzii. Transparent fares, verified drivers, instant confirmation.`,
    seo: [s.primaryKeyword, s.searchQuery, s.slug?.replace(/-/g, " "), "cabzii"]
      .filter(Boolean)
      .join(","),
    published: true,
    showInMenu: false,
    menuCitySlug: "chennai",
    allCities: true,
    citySlugs: []
  }));
}

/** Payloads to upsert built-in route pages into MongoDB. */
export function builtInSeoRoutePayloads() {
  return SEO_ROUTES.map((r) => {
    const from = r.from || r.fromCitySlug;
    const to = r.to || r.toCitySlug;
    const title = `${String(from || "").replace(/\b\w/g, (c) => c.toUpperCase())} to ${String(to || "").replace(/\b\w/g, (c) => c.toUpperCase())} Cab`;
    return {
      slug: r.slug,
      title,
      seoTitle: `${title} | Book Online | Cabzii`,
      seoDescription: `Book one way cab from ${from} to ${to}${r.distance ? ` (${r.distance})` : ""}. Sedan, SUV & Innova with upfront fare on Cabzii.`,
      seo: [`${from} to ${to} cab`, `${from} ${to} taxi`, "one way cab", "cabzii"].join(","),
      fromCitySlug: from,
      toCitySlug: to,
      distance: r.distance || "",
      duration: r.duration || "",
      sedanFrom: Number(r.sedanFrom) || 0,
      suvFrom: Number(r.suvFrom) || 0,
      highlights: Array.isArray(r.highlights) ? r.highlights : [],
      body: r.body || "",
      published: true,
      showInMenu: false
    };
  });
}

export function staticServiceToCreatePayload(item) {
  const slug = String(item?.slug || "").replace(/^static:/, "");
  return {
    slug,
    name: item.name || slug,
    primaryKeyword: item.primaryKeyword || item.name || slug,
    searchQuery: item.searchQuery || item.primaryKeyword || item.name || slug,
    priceFrom: Number(item.priceFrom) || 0,
    highlights: Array.isArray(item.highlights) ? item.highlights : [],
    body: item.body || "",
    seoTitle: item.seoTitle || item.name || slug,
    seoDescription: item.seoDescription || "",
    seo: item.seo || "",
    published: item.published !== false,
    showInMenu: Boolean(item.showInMenu),
    menuCitySlug: item.menuCitySlug || "chennai",
    allCities: item.allCities !== false,
    citySlugs: Array.isArray(item.citySlugs) ? item.citySlugs : []
  };
}

export function staticRouteToCreatePayload(item) {
  const slug = String(item?.slug || "").replace(/^static:/, "");
  return {
    slug,
    title: item.title || item.seoTitle || slug,
    seoTitle: item.seoTitle || item.title || slug,
    seoDescription: item.seoDescription || "",
    seo: item.seo || "",
    fromCitySlug: item.fromCitySlug || item.from || "",
    toCitySlug: item.toCitySlug || item.to || "",
    distance: item.distance || "",
    duration: item.duration || "",
    sedanFrom: Number(item.sedanFrom) || 0,
    suvFrom: Number(item.suvFrom) || 0,
    highlights: Array.isArray(item.highlights) ? item.highlights : [],
    body: item.body || "",
    published: item.published !== false,
    showInMenu: Boolean(item.showInMenu)
  };
}

/** Deterministic sample bus trips for admin import — Chennai-first, both directions. */
export function sampleBusTripPayloads() {
  const rows = [
    { operator: "Orange Travels", operatorCode: "OT", fromCity: "Chennai", toCity: "Bengaluru", departureTime: "22:00", arrivalTime: "05:30", duration: "7h 30m", durationMin: 450, busType: "Volvo AC Sleeper", seaterPrice: 699, sleeperPrice: 999 },
    { operator: "KPN Travels", operatorCode: "KPN", fromCity: "Chennai", toCity: "Bengaluru", departureTime: "23:00", arrivalTime: "06:15", duration: "7h 15m", durationMin: 435, busType: "AC Sleeper", seaterPrice: 749, sleeperPrice: 1049 },
    { operator: "Parveen Travels", operatorCode: "PT", fromCity: "Chennai", toCity: "Madurai", departureTime: "21:30", arrivalTime: "05:00", duration: "7h 30m", durationMin: 450, busType: "AC Sleeper", seaterPrice: 650, sleeperPrice: 899 },
    { operator: "KPN Travels", operatorCode: "KPN", fromCity: "Chennai", toCity: "Coimbatore", departureTime: "22:15", arrivalTime: "06:15", duration: "8h", durationMin: 480, busType: "AC Seater", seaterPrice: 799, sleeperPrice: 1099 },
    { operator: "VRL Travels", operatorCode: "VRL", fromCity: "Chennai", toCity: "Tirupati", departureTime: "06:00", arrivalTime: "09:30", duration: "3h 30m", durationMin: 210, busType: "AC Seater", seaterPrice: 449, sleeperPrice: 649 },
    { operator: "APS RTC", operatorCode: "APS", fromCity: "Chennai", toCity: "Tirupati", departureTime: "14:00", arrivalTime: "17:45", duration: "3h 45m", durationMin: 225, busType: "AC Seater", seaterPrice: 399, sleeperPrice: 599 },
    { operator: "YBM Travels", operatorCode: "YBM", fromCity: "Chennai", toCity: "Pondicherry", departureTime: "07:00", arrivalTime: "10:00", duration: "3h", durationMin: 180, busType: "AC Seater", seaterPrice: 399, sleeperPrice: 599 },
    { operator: "SRM Travels", operatorCode: "SRM", fromCity: "Chennai", toCity: "Trichy", departureTime: "22:30", arrivalTime: "04:30", duration: "6h", durationMin: 360, busType: "Volvo AC Sleeper", seaterPrice: 599, sleeperPrice: 849 },
    { operator: "Orange Travels", operatorCode: "OT", fromCity: "Chennai", toCity: "Hyderabad", departureTime: "19:30", arrivalTime: "07:00", duration: "11h 30m", durationMin: 690, busType: "Volvo AC Sleeper", seaterPrice: 1099, sleeperPrice: 1499 },
    { operator: "Parveen Travels", operatorCode: "PT", fromCity: "Chennai", toCity: "Salem", departureTime: "23:00", arrivalTime: "04:30", duration: "5h 30m", durationMin: 330, busType: "AC Sleeper", seaterPrice: 549, sleeperPrice: 799 },
    { operator: "SRS Travels", operatorCode: "SRS", fromCity: "Bengaluru", toCity: "Chennai", departureTime: "22:30", arrivalTime: "06:00", duration: "7h 30m", durationMin: 450, busType: "Volvo AC Sleeper", seaterPrice: 729, sleeperPrice: 1029 },
    { operator: "VRL Travels", operatorCode: "VRL", fromCity: "Tirupati", toCity: "Chennai", departureTime: "17:00", arrivalTime: "20:30", duration: "3h 30m", durationMin: 210, busType: "AC Seater", seaterPrice: 449, sleeperPrice: 649 },
    { operator: "KPN Travels", operatorCode: "KPN", fromCity: "Madurai", toCity: "Chennai", departureTime: "21:00", arrivalTime: "04:45", duration: "7h 45m", durationMin: 465, busType: "AC Sleeper", seaterPrice: 679, sleeperPrice: 929 },
    { operator: "YBM Travels", operatorCode: "YBM", fromCity: "Pondicherry", toCity: "Chennai", departureTime: "18:00", arrivalTime: "21:00", duration: "3h", durationMin: 180, busType: "AC Seater", seaterPrice: 399, sleeperPrice: 599 }
  ];

  return rows.map((row) => ({
    ...row,
    vendor: "Cabzii Partner",
    lowerBerthPrice: Math.round((row.sleeperPrice || 900) * 1.1),
    upperBerthPrice: Math.round((row.sleeperPrice || 900) * 0.9),
    boardingPoints: [
      { name: `${row.fromCity} CMBT`, time: row.departureTime, landmark: "Main bus terminus" },
      { name: `${row.fromCity} Central`, time: row.departureTime, landmark: "Near railway" }
    ],
    droppingPoints: [
      { name: `${row.toCity} Bus Stand`, time: row.arrivalTime, landmark: "City center" }
    ],
    amenities: ["Water bottle", "Charging point", "Blanket"],
    bookedSeats: [],
    rating: 4.3,
    reviewCount: 120,
    status: "active",
    seoTitle: `${row.operator} ${row.fromCity} to ${row.toCity} bus`,
    seoDescription: `Book ${row.operator} bus from ${row.fromCity} to ${row.toCity} on Cabzii.`,
    seo: `${row.fromCity} to ${row.toCity} bus,${row.operator}`
  }));
}
