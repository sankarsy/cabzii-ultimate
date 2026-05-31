/** Airport / city list for flight autocomplete (IATA codes). */
export const AIRPORTS = [
  { code: "DEL", city: "New Delhi", airport: "Indira Gandhi Intl" },
  { code: "BOM", city: "Mumbai", airport: "Chhatrapati Shivaji Intl" },
  { code: "BLR", city: "Bengaluru", airport: "Kempegowda Intl" },
  { code: "MAA", city: "Chennai", airport: "Chennai Intl" },
  { code: "HYD", city: "Hyderabad", airport: "Rajiv Gandhi Intl" },
  { code: "CCU", city: "Kolkata", airport: "Netaji Subhash Chandra Bose Intl" },
  { code: "GOI", city: "Goa", airport: "Manohar Intl" },
  { code: "COK", city: "Kochi", airport: "Cochin Intl" },
  { code: "PNQ", city: "Pune", airport: "Pune Airport" },
  { code: "AMD", city: "Ahmedabad", airport: "Sardar Vallabhbhai Patel Intl" },
  { code: "JAI", city: "Jaipur", airport: "Jaipur Intl" },
  { code: "DXB", city: "Dubai", airport: "Dubai Intl" },
  { code: "SIN", city: "Singapore", airport: "Changi" },
  { code: "BKK", city: "Bangkok", airport: "Suvarnabhumi" }
];

export function airportByCode(code) {
  return AIRPORTS.find((a) => a.code === String(code || "").toUpperCase());
}

export function filterAirports(query, limit = 8) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return AIRPORTS.slice(0, limit);
  return AIRPORTS.filter(
    (a) =>
      a.code.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.airport.toLowerCase().includes(q)
  ).slice(0, limit);
}
