/** Commercial passenger airports for SEO cities. Never invent an airport. */
export const AIRPORT_BY_CITY = {
  chennai: { code: "MAA", name: "Chennai International Airport" },
  bengaluru: { code: "BLR", name: "Kempegowda International Airport", label: "Bangalore" },
  hyderabad: { code: "HYD", name: "Rajiv Gandhi International Airport" },
  coimbatore: { code: "CJB", name: "Coimbatore International Airport" },
  madurai: { code: "IXM", name: "Madurai Airport" },
  trichy: { code: "TRZ", name: "Tiruchirappalli International Airport" },
  kochi: { code: "COK", name: "Cochin International Airport" },
  goa: { code: "GOI", name: "Goa International Airport" },
  mumbai: { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport" },
  delhi: { code: "DEL", name: "Indira Gandhi International Airport" },
  pune: { code: "PNQ", name: "Pune Airport" },
  kolkata: { code: "CCU", name: "Netaji Subhash Chandra Bose International Airport" },
  visakhapatnam: { code: "VTZ", name: "Visakhapatnam Airport" },
  ahmedabad: { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport" },
  jaipur: { code: "JAI", name: "Jaipur International Airport" },
  chandigarh: { code: "IXC", name: "Chandigarh International Airport" },
  tirupati: { code: "TIR", name: "Tirupati Airport" },
  mysore: { code: "MYQ", name: "Mysore Airport" },
  pondicherry: { code: "PNY", name: "Pondicherry Airport" },
  salem: { code: "SXV", name: "Salem Airport" },
  thoothukudi: { code: "TCR", name: "Tuticorin Airport", label: "Thoothukudi" }
};

/**
 * Cities in SEO_CITIES with no commercial passenger airport.
 * Copy must describe a transfer to the nearest real airport — not a local terminal.
 */
export const NEAREST_AIRPORT_BY_CITY = {
  vellore: {
    code: "MAA",
    name: "Chennai International Airport",
    also: "Tirupati Airport (TIR)",
    note: "Vellore has no commercial passenger airport. Book a cab to Chennai (MAA) or Tirupati (TIR)."
  },
  erode: {
    code: "CJB",
    name: "Coimbatore International Airport",
    note: "Erode has no commercial passenger airport. Most riders transfer via Coimbatore (CJB)."
  },
  hosur: {
    code: "BLR",
    name: "Kempegowda International Airport",
    note: "Hosur has no commercial passenger airport. Riders typically use Bengaluru (BLR)."
  },
  tirunelveli: {
    code: "TCR",
    name: "Tuticorin Airport",
    also: "Madurai Airport (IXM)",
    note: "Tirunelveli has no commercial passenger airport. Nearest is Tuticorin (TCR); Madurai (IXM) is the other common option."
  },
  rameswaram: {
    code: "IXM",
    name: "Madurai Airport",
    note: "Rameswaram has no airport. The nearest commercial airport is Madurai (IXM)."
  },
  ooty: {
    code: "CJB",
    name: "Coimbatore International Airport",
    note: "Ooty has no commercial airport. The usual transfer is Coimbatore (CJB)."
  },
  kodaikanal: {
    code: "IXM",
    name: "Madurai Airport",
    note: "Kodaikanal has no airport. The nearest commercial airport is Madurai (IXM)."
  },
  kanchipuram: {
    code: "MAA",
    name: "Chennai International Airport",
    note: "Kanchipuram has no commercial passenger airport. Temple visitors typically transfer via Chennai (MAA)."
  },
  tiruvannamalai: {
    code: "MAA",
    name: "Chennai International Airport",
    also: "Tirupati Airport (TIR)",
    note: "Tiruvannamalai has no commercial passenger airport. Common air gateways are Chennai (MAA) and Tirupati (TIR)."
  },
  thanjavur: {
    code: "TRZ",
    name: "Tiruchirappalli International Airport",
    note: "Thanjavur has no regular commercial passenger airport. Most riders use Trichy (TRZ)."
  },
  kumbakonam: {
    code: "TRZ",
    name: "Tiruchirappalli International Airport",
    note: "Kumbakonam has no commercial passenger airport. The usual air gateway is Trichy (TRZ)."
  },
  palani: {
    code: "CJB",
    name: "Coimbatore International Airport",
    also: "Madurai Airport (IXM)",
    note: "Palani has no airport. Coimbatore (CJB) and Madurai (IXM) are the usual transfers."
  },
  chidambaram: {
    code: "PNY",
    name: "Pondicherry Airport",
    also: "Tiruchirappalli International Airport (TRZ)",
    note: "Chidambaram has no commercial passenger airport. Riders typically use Pondicherry (PNY) or Trichy (TRZ)."
  },
  kanyakumari: {
    code: "TCR",
    name: "Tuticorin Airport",
    also: "Madurai Airport (IXM)",
    note: "Kanyakumari has no airport. Nearest commercial options are Tuticorin (TCR) and Madurai (IXM)."
  },
  velankanni: {
    code: "TRZ",
    name: "Tiruchirappalli International Airport",
    note: "Velankanni has no airport. The usual air gateway is Trichy (TRZ)."
  },
  tiruppur: {
    code: "CJB",
    name: "Coimbatore International Airport",
    note: "Tiruppur has no commercial passenger airport. Most riders transfer via Coimbatore (CJB)."
  },
  nagercoil: {
    code: "TCR",
    name: "Tuticorin Airport",
    also: "Trivandrum International Airport (TRV)",
    note: "Nagercoil has no commercial passenger airport. Tuticorin (TCR) and Trivandrum (TRV) are the usual options."
  },
  dindigul: {
    code: "IXM",
    name: "Madurai Airport",
    note: "Dindigul has no commercial passenger airport. The nearest is Madurai (IXM)."
  },
  karur: {
    code: "TRZ",
    name: "Tiruchirappalli International Airport",
    also: "Coimbatore International Airport (CJB)",
    note: "Karur has no commercial passenger airport. Trichy (TRZ) and Coimbatore (CJB) are the usual transfers."
  },
  villupuram: {
    code: "PNY",
    name: "Pondicherry Airport",
    also: "Chennai International Airport (MAA)",
    note: "Villupuram has no commercial passenger airport. Pondicherry (PNY) and Chennai (MAA) are the usual gateways."
  },
  karaikudi: {
    code: "IXM",
    name: "Madurai Airport",
    also: "Tiruchirappalli International Airport (TRZ)",
    note: "Karaikudi has no commercial passenger airport. Madurai (IXM) and Trichy (TRZ) are the usual options."
  },
  theni: {
    code: "IXM",
    name: "Madurai Airport",
    note: "Theni has no commercial passenger airport. The nearest is Madurai (IXM)."
  },
  nagapattinam: {
    code: "TRZ",
    name: "Tiruchirappalli International Airport",
    note: "Nagapattinam has no commercial passenger airport. The usual air gateway is Trichy (TRZ)."
  },
  thiruchendur: {
    code: "TCR",
    name: "Tuticorin Airport",
    also: "Madurai Airport (IXM)",
    note: "Thiruchendur has no airport. Tuticorin (TCR) and Madurai (IXM) are the usual transfers."
  }
};

export function cityHasCommercialAirport(slug) {
  return Boolean(AIRPORT_BY_CITY[slug]);
}

/** @returns {{ type: "local"|"nearest", code: string, name: string, label?: string, also?: string, note?: string } | null} */
export function airportInfoForCity(slug) {
  const local = AIRPORT_BY_CITY[slug];
  if (local) return { type: "local", ...local };
  const nearest = NEAREST_AIRPORT_BY_CITY[slug];
  if (nearest) return { type: "nearest", ...nearest };
  return null;
}

export function airportDropHint(city) {
  const info = airportInfoForCity(city.slug);
  if (info?.type === "local") return info.name;
  if (info?.type === "nearest") return `${info.name} from ${city.name}`;
  return `${city.name} airport transfer`;
}
