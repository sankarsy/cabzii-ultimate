/** Popular bus corridors — Chennai-first for Cabzii customers. */
export const POPULAR_BUS_ROUTES = [
  { from: "Chennai", to: "Bengaluru" },
  { from: "Chennai", to: "Madurai" },
  { from: "Chennai", to: "Tirupati" },
  { from: "Chennai", to: "Coimbatore" },
  { from: "Chennai", to: "Pondicherry" },
  { from: "Chennai", to: "Trichy" },
  { from: "Bengaluru", to: "Chennai" },
  { from: "Chennai", to: "Hyderabad" }
];

export function busResultsHref(from, to, date = "") {
  const q = new URLSearchParams();
  if (from) q.set("from", from);
  if (to) q.set("to", to);
  if (date) q.set("date", date);
  return `/buses/results?${q.toString()}`;
}
