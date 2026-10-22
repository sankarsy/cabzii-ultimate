function cabNameBlob(cab = {}) {
  return `${cab.type || ""} ${cab.title || ""} ${cab.name || ""} ${cab.vehicleModel || ""} ${cab.vehicleName || ""} ${cab.vehicle || ""}`;
}

function inferPassengerSeatsFromName(cab = {}) {
  const t = cabNameBlob(cab).toLowerCase();
  const seater = t.match(/(\d{1,2})\s*(?:seater|seat(?:s)?\b)/);
  if (seater) return Number(seater[1]);
  if (/urbania/.test(t)) return 16;
  if (/tempo|traveller|van|bus|coach/.test(t)) return 12;
  if (/innova|crysta|hycross|fortuner/.test(t)) return 7;
  if (/ertiga|suv|xuv|creta|seltos|carens|harrier/.test(t)) return 6;
  if (/sedan|dzire|etios|amaze|xcent|verna|hatch|wagon|swift|alto|aura|\bcity\b/.test(t)) return 4;
  return 0;
}

/** Passenger seat count from catalog data (excludes driver). */
export function inferPassengerSeats(cab = {}) {
  const t = cabNameBlob(cab).toLowerCase();
  const namedExact = t.match(/(\d{1,2})\s*(?:seater|seat(?:s)?\b)/);
  if (namedExact) return Number(namedExact[1]);
  const named = inferPassengerSeatsFromName(cab);
  const n = Number(cab.seats ?? cab.capacity);
  if (Number.isFinite(n) && n > 0) {
    /* Catalog sometimes stores 4 seats on Innova / Tempo rows — prefer the vehicle name. */
    if (named >= 6 && n <= 4) return named;
    return Math.round(n);
  }
  return named || 4;
}

/** Display as Indian cab convention: passenger seats + driver — e.g. 4+1, 6+1. Vans/buses use seater count. */
export function formatCabSeatLabel(cab = {}) {
  const seats = inferPassengerSeats(cab);
  if (seats >= 12) return `${seats} Seater`;
  return `${seats}+1`;
}

export function formatCabSeatText(cab = {}, { word = "seats" } = {}) {
  const base = formatCabSeatLabel(cab);
  return word ? `${base} ${word}` : base;
}

export function formatCabSeatPill(cab = {}) {
  return `${formatCabSeatLabel(cab)} Seats`;
}
