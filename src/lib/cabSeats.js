/** Passenger seat count from catalog data (excludes driver). */
export function inferPassengerSeats(cab = {}) {
  const n = Number(cab.seats ?? cab.capacity);
  if (Number.isFinite(n) && n > 0) return Math.round(n);

  const t = `${cab.type || ""} ${cab.title || ""} ${cab.vehicleModel || ""}`.toLowerCase();
  if (/tempo|traveller|van|bus|coach/.test(t)) return 12;
  if (/innova|crysta|hycross|fortuner/.test(t)) return 7;
  if (/ertiga|suv|xuv|creta|seltos/.test(t)) return 6;
  if (/sedan|dzire|etios|amaze|xcent|verna|hatch|wagon|swift|alto/.test(t)) return 4;
  return 4;
}

/** Display as Indian cab convention: passenger seats + driver — e.g. 4+1, 6+1, 12+1. */
export function formatCabSeatLabel(cab = {}) {
  return `${inferPassengerSeats(cab)}+1`;
}

export function formatCabSeatText(cab = {}, { word = "seats" } = {}) {
  const base = formatCabSeatLabel(cab);
  return word ? `${base} ${word}` : base;
}

export function formatCabSeatPill(cab = {}) {
  return `${formatCabSeatLabel(cab)} Seats`;
}
