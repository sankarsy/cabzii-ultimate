/** Live vs paused services — single source for hero tabs, nav, and landing pages. */
export const ACTIVE_SERVICE_IDS = ["cabs", "drivers", "buses", "holidays"];

export const INACTIVE_SERVICES = [
  {
    id: "hotels",
    label: "Hotels",
    href: "/hotels",
    title: "Hotel booking is paused",
    blurb: "Hotel booking is inactive on Cabzii for now. Book cabs, buses, acting drivers or holiday packages instead."
  },
  {
    id: "flights",
    label: "Flights",
    href: "/flights",
    title: "Flight booking is paused",
    blurb: "Flight booking is inactive on Cabzii for now. Pair your trip with a cab, bus or holiday package instead."
  },
  {
    id: "trains",
    label: "Trains",
    href: "/trains",
    title: "Train booking is paused",
    blurb: "Train booking is inactive on Cabzii for now. Book an outstation cab or bus for the same route."
  }
];

export const INACTIVE_SERVICE_IDS = INACTIVE_SERVICES.map((s) => s.id);

export function isActiveService(id) {
  return ACTIVE_SERVICE_IDS.includes(id);
}

export function inactiveServiceById(id) {
  return INACTIVE_SERVICES.find((s) => s.id === id) || null;
}

export function inactiveServiceByPath(pathname = "") {
  const path = String(pathname).split("?")[0];
  return INACTIVE_SERVICES.find((s) => path === s.href || path.startsWith(`${s.href}/`)) || null;
}
