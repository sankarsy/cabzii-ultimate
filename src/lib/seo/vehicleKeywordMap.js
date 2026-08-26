/**
 * Popular fleet names + common misspellings → existing Cabzii URLs.
 * Do not add new App Router paths; aliases 301 to hubs already in the sitemap.
 */

export const FLEET_MODELS = [
  {
    id: "dzire",
    name: "Swift Dzire / Tour S",
    tokens: ["dzire", "dezire", "swift-dzire", "tour-s", "dzire-tour-s"]
  },
  {
    id: "wagonr",
    name: "Wagon R",
    tokens: ["wagon-r", "wagonr", "wegon-r", "wegonr"]
  },
  {
    id: "bolero",
    name: "Mahindra Bolero",
    tokens: ["bolero", "boliro"]
  },
  {
    id: "ertiga",
    name: "Maruti Ertiga",
    tokens: ["ertiga"]
  },
  {
    id: "innova",
    name: "Innova Crysta",
    tokens: ["innova", "innova-crysta", "crysta"]
  },
  {
    id: "amaze",
    name: "Honda Amaze",
    tokens: ["amaze", "honda-amaze"]
  },
  {
    id: "tempo",
    name: "Tempo Traveller",
    tokens: ["tempo-traveller", "tempo"]
  }
];

const BOOKING = "/cab-booking/chennai";
const CAR_RENTAL = "/services/car-rental/chennai";
const CAB_RENTAL = "/services/cab-rental/chennai";
const CABS = "/cabs";

function add(map, slug, target) {
  const key = String(slug || "").toLowerCase();
  if (!key || map[key]) return;
  map[key] = target;
}

/** Keyword-style paths Google/users type → canonical pages. */
export function buildVehicleKeywordAliases() {
  const map = {};

  for (const model of FLEET_MODELS) {
    for (const token of model.tokens) {
      add(map, `${token}-taxi-booking-chennai`, BOOKING);
      add(map, `${token}-taxi-chennai`, BOOKING);
      add(map, `${token}-cab-booking-chennai`, BOOKING);
      add(map, `${token}-cab-chennai`, BOOKING);
      add(map, `${token}-car-rental-chennai`, CAR_RENTAL);
      add(map, `${token}-cab-rental-chennai`, CAB_RENTAL);
      add(map, `${token}-taxi-booking`, CABS);
      add(map, `${token}-car-rental`, CAR_RENTAL);
      add(map, `${token}-cab-rental`, CAB_RENTAL);
    }
  }

  add(map, "dezire-taxi-booking-chennai", BOOKING);
  add(map, "wegon-r-taxi-booking-chennai", BOOKING);
  add(map, "boliro-taxi-booking-chennai", BOOKING);
  add(map, "tour-s-car-rental-chennai", CAR_RENTAL);
  add(map, "tour-s-cab-rental-chennai", CAB_RENTAL);

  return map;
}

export const VEHICLE_KEYWORD_ALIASES = buildVehicleKeywordAliases();
