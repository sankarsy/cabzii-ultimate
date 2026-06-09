import { SEO_CITIES } from "./cities";

/**
 * Distance/duration/fare matrix for programmatic route pages.
 * Fares are indicative one-way sedan/SUV starting prices (INR).
 */
const CITY_DISTANCE_FROM_CHENNAI = {
  bengaluru: { km: 350, duration: "6–7 hours", sedan: 4500, suv: 6500 },
  hyderabad: { km: 625, duration: "10–11 hours", sedan: 8200, suv: 10200 },
  coimbatore: { km: 505, duration: "8–9 hours", sedan: 6500, suv: 8500 },
  mysore: { km: 480, duration: "8–9 hours", sedan: 6200, suv: 8200 },
  pondicherry: { km: 160, duration: "3–4 hours", sedan: 2800, suv: 3800 },
  tirupati: { km: 135, duration: "3–4 hours", sedan: 3200, suv: 4200 },
  vellore: { km: 140, duration: "3 hours", sedan: 2600, suv: 3600 },
  salem: { km: 340, duration: "5–6 hours", sedan: 4300, suv: 5900 },
  madurai: { km: 460, duration: "7–8 hours", sedan: 6000, suv: 8000 },
  trichy: { km: 330, duration: "5–6 hours", sedan: 4200, suv: 5800 },
  kodaikanal: { km: 520, duration: "9–10 hours", sedan: 6800, suv: 8800 },
  erode: { km: 400, duration: "6–7 hours", sedan: 4800, suv: 6600 },
  hosur: { km: 320, duration: "5–6 hours", sedan: 4200, suv: 5800 },
  tirunelveli: { km: 625, duration: "9–10 hours", sedan: 7800, suv: 9800 },
  mumbai: { km: 1330, duration: "18–20 hours", sedan: 14500, suv: 18500 },
  delhi: { km: 2200, duration: "30+ hours", sedan: 22000, suv: 28000 },
  pune: { km: 1150, duration: "16–18 hours", sedan: 12800, suv: 16500 },
  kolkata: { km: 1670, duration: "22–24 hours", sedan: 17500, suv: 22000 },
  kochi: { km: 690, duration: "10–11 hours", sedan: 8500, suv: 10500 },
  visakhapatnam: { km: 800, duration: "12–13 hours", sedan: 9800, suv: 11800 },
  goa: { km: 910, duration: "14–15 hours", sedan: 10500, suv: 13500 },
  jaipur: { km: 2100, duration: "30+ hours", sedan: 21000, suv: 27000 },
  ahmedabad: { km: 1850, duration: "26–28 hours", sedan: 19500, suv: 25000 },
  chandigarh: { km: 2400, duration: "32+ hours", sedan: 24000, suv: 30000 }
};

const CITY_DISTANCE_FROM_BENGALURU = {
  chennai: { km: 350, duration: "6–7 hours", sedan: 4500, suv: 6500 },
  hyderabad: { km: 575, duration: "9–10 hours", sedan: 7500, suv: 9500 },
  coimbatore: { km: 365, duration: "6–7 hours", sedan: 4800, suv: 6800 },
  mysore: { km: 145, duration: "3–4 hours", sedan: 2500, suv: 3500 },
  pondicherry: { km: 310, duration: "5–6 hours", sedan: 4200, suv: 5800 },
  tirupati: { km: 255, duration: "4–5 hours", sedan: 3500, suv: 4800 },
  salem: { km: 200, duration: "4 hours", sedan: 3200, suv: 4400 },
  madurai: { km: 435, duration: "7–8 hours", sedan: 5600, suv: 7600 },
  trichy: { km: 340, duration: "6 hours", sedan: 4500, suv: 6200 },
  kochi: { km: 530, duration: "9–10 hours", sedan: 7000, suv: 9000 },
  hosur: { km: 40, duration: "1 hour", sedan: 1200, suv: 1800 }
};

const CITY_DISTANCE_FROM_COIMBATORE = {
  chennai: { km: 505, duration: "8–9 hours", sedan: 6500, suv: 8500 },
  bengaluru: { km: 365, duration: "6–7 hours", sedan: 4800, suv: 6800 },
  madurai: { km: 215, duration: "4–5 hours", sedan: 3200, suv: 4400 },
  kodaikanal: { km: 170, duration: "4–5 hours", sedan: 3500, suv: 4800 },
  pondicherry: { km: 380, duration: "6–7 hours", sedan: 5000, suv: 6800 },
  tirupati: { km: 420, duration: "7–8 hours", sedan: 5500, suv: 7200 },
  salem: { km: 165, duration: "3–4 hours", sedan: 2800, suv: 3800 },
  trichy: { km: 195, duration: "4 hours", sedan: 3000, suv: 4200 }
};

const CITY_DISTANCE_FROM_HYDERABAD = {
  chennai: { km: 625, duration: "10–11 hours", sedan: 8200, suv: 10200 },
  bengaluru: { km: 575, duration: "9–10 hours", sedan: 7500, suv: 9500 },
  tirupati: { km: 560, duration: "8–9 hours", sedan: 7200, suv: 9200 },
  coimbatore: { km: 950, duration: "14–15 hours", sedan: 11000, suv: 14000 },
  madurai: { km: 980, duration: "15–16 hours", sedan: 11500, suv: 14500 },
  visakhapatnam: { km: 620, duration: "10–11 hours", sedan: 8000, suv: 10000 }
};

const CITY_DISTANCE_FROM_MADURAI = {
  chennai: { km: 460, duration: "7–8 hours", sedan: 6000, suv: 8000 },
  bengaluru: { km: 435, duration: "7–8 hours", sedan: 5600, suv: 7600 },
  trichy: { km: 135, duration: "2–3 hours", sedan: 2200, suv: 3200 },
  kodaikanal: { km: 120, duration: "3–4 hours", sedan: 2800, suv: 3800 },
  tirunelveli: { km: 160, duration: "3 hours", sedan: 2600, suv: 3600 },
  coimbatore: { km: 215, duration: "4–5 hours", sedan: 3200, suv: 4400 }
};

function estimateFromKm(km) {
  const sedan = Math.max(1200, Math.round((km * 12.5) / 100) * 100);
  const suv = Math.round((sedan * 1.35) / 100) * 100;
  const hours = Math.max(1, Math.round(km / 55));
  const duration =
    hours <= 2 ? `${hours}–${hours + 1} hours` : `${hours}–${hours + 1} hours`;
  return { km, duration, sedan, suv };
}

function makeRoute(fromSlug, toSlug, data) {
  const km = data.km;
  return {
    slug: `${fromSlug}-to-${toSlug}-cab`,
    from: fromSlug,
    to: toSlug,
    distance: `${km} km`,
    duration: data.duration,
    sedanFrom: data.sedan,
    suvFrom: data.suv
  };
}

function hubRoutes(hubSlug, matrix, { includeReverse = true } = {}) {
  const routes = [];
  const seen = new Set();

  for (const [toSlug, data] of Object.entries(matrix)) {
    if (toSlug === hubSlug) continue;
    const forward = makeRoute(hubSlug, toSlug, data);
    if (!seen.has(forward.slug)) {
      routes.push(forward);
      seen.add(forward.slug);
    }
    if (includeReverse) {
      const reverse = makeRoute(toSlug, hubSlug, data);
      if (!seen.has(reverse.slug)) {
        routes.push(reverse);
        seen.add(reverse.slug);
      }
    }
  }
  return routes;
}

/** Cross-hub routes between major TN/KA cities not covered by single hub. */
function regionalRoutes() {
  const pairs = [
    ["salem", "coimbatore", { km: 165, duration: "3–4 hours", sedan: 2800, suv: 3800 }],
    ["salem", "bengaluru", { km: 200, duration: "4 hours", sedan: 3200, suv: 4400 }],
    ["trichy", "coimbatore", { km: 195, duration: "4 hours", sedan: 3000, suv: 4200 }],
    ["pondicherry", "bengaluru", { km: 310, duration: "5–6 hours", sedan: 4200, suv: 5800 }],
    ["tirupati", "bengaluru", { km: 255, duration: "4–5 hours", sedan: 3500, suv: 4800 }],
    ["vellore", "bengaluru", { km: 215, duration: "4 hours", sedan: 3200, suv: 4400 }],
    ["hosur", "chennai", { km: 320, duration: "5–6 hours", sedan: 4200, suv: 5800 }]
  ];

  const routes = [];
  const seen = new Set();
  for (const [from, to, data] of pairs) {
    for (const r of [makeRoute(from, to, data), makeRoute(to, from, data)]) {
      if (!seen.has(r.slug)) {
        routes.push(r);
        seen.add(r.slug);
      }
    }
  }
  return routes;
}

/** Fill Chennai ↔ any SEO city missing from matrix using estimates. */
function chennaiFullMesh() {
  const routes = [];
  const chennai = "chennai";
  for (const city of SEO_CITIES) {
    if (city.slug === chennai) continue;
    const data = CITY_DISTANCE_FROM_CHENNAI[city.slug] || estimateFromKm(400);
    routes.push(makeRoute(chennai, city.slug, data));
    routes.push(makeRoute(city.slug, chennai, data));
  }
  return routes;
}

/** Merge route lists — later entries do not override earlier (manual overrides win). */
export function buildExpandedRoutes(manualRoutes = []) {
  const bySlug = new Map();

  const add = (route) => {
    if (route?.slug && !bySlug.has(route.slug)) bySlug.set(route.slug, route);
  };

  for (const r of manualRoutes) add(r);
  for (const r of hubRoutes("chennai", CITY_DISTANCE_FROM_CHENNAI)) add(r);
  for (const r of hubRoutes("bengaluru", CITY_DISTANCE_FROM_BENGALURU)) add(r);
  for (const r of hubRoutes("coimbatore", CITY_DISTANCE_FROM_COIMBATORE, { includeReverse: true })) add(r);
  for (const r of hubRoutes("madurai", CITY_DISTANCE_FROM_MADURAI, { includeReverse: true })) add(r);
  for (const r of hubRoutes("hyderabad", CITY_DISTANCE_FROM_HYDERABAD, { includeReverse: true })) add(r);
  for (const r of regionalRoutes()) add(r);
  for (const r of chennaiFullMesh()) add(r);

  return Array.from(bySlug.values()).sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Alternate slug (-taxi) → canonical -cab slug for 301 redirects. */
export function routeTaxiAliases(routes) {
  const aliases = {};
  for (const r of routes) {
    if (r.slug.endsWith("-cab")) {
      const taxiSlug = r.slug.replace(/-cab$/, "-taxi");
      aliases[taxiSlug] = `/routes/${r.slug}`;
    }
  }
  return aliases;
}
