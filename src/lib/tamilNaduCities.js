/** Tamil Nadu cities for filters and autocomplete (display label includes state). */
export const TAMIL_NADU_STATE = "Tamil Nadu";

export const TAMIL_NADU_CITIES = [
  { name: "Chennai", aliases: ["Madras"] },
  { name: "Coimbatore", aliases: ["Kovai"] },
  { name: "Madurai" },
  { name: "Tiruchirappalli", aliases: ["Trichy", "Tiruchy"] },
  { name: "Salem" },
  { name: "Tirunelveli" },
  { name: "Tiruppur" },
  { name: "Erode" },
  { name: "Vellore" },
  { name: "Thoothukudi", aliases: ["Tuticorin"] },
  { name: "Dindigul" },
  { name: "Thanjavur", aliases: ["Tanjore"] },
  { name: "Ranipet" },
  { name: "Sivakasi" },
  { name: "Karur" },
  { name: "Udhagamandalam", aliases: ["Ooty", "Udhagai"] },
  { name: "Hosur" },
  { name: "Nagercoil" },
  { name: "Kanchipuram", aliases: ["Kancheepuram"] },
  { name: "Kumarapalayam" },
  { name: "Karaikudi" },
  { name: "Neyveli" },
  { name: "Cuddalore" },
  { name: "Kumbakonam" },
  { name: "Tiruvannamalai" },
  { name: "Pollachi" },
  { name: "Rajapalayam" },
  { name: "Gudiyatham" },
  { name: "Pudukkottai" },
  { name: "Vaniyambadi" },
  { name: "Ambur" },
  { name: "Nagapattinam" },
  { name: "Tirupati" },
  { name: "Krishnagiri" },
  { name: "Dharmapuri" },
  { name: "Namakkal" },
  { name: "Sathyamangalam" },
  { name: "Virudhunagar" },
  { name: "Ramanathapuram" },
  { name: "Theni" },
  { name: "Arakkonam" },
  { name: "Chengalpattu" },
  { name: "Villupuram" },
  { name: "Cumbum" },
  { name: "Palani" }
];

export function cityLabel(name) {
  return `${name}, ${TAMIL_NADU_STATE}, India`;
}

export function tamilNaduCityLabels() {
  return TAMIL_NADU_CITIES.map((c) => cityLabel(c.name));
}

export function filterTamilNaduCities(query) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return tamilNaduCityLabels();
  return TAMIL_NADU_CITIES.filter((c) => {
    const names = [c.name, ...(c.aliases || [])].map((x) => x.toLowerCase());
    return names.some((n) => n.includes(q) || q.includes(n));
  }).map((c) => cityLabel(c.name));
}

export function normalizeCityName(value) {
  const raw = String(value || "")
    .split(",")[0]
    .trim()
    .toLowerCase();
  if (!raw) return "";
  for (const c of TAMIL_NADU_CITIES) {
    const names = [c.name, ...(c.aliases || [])].map((x) => x.toLowerCase());
    if (names.includes(raw)) return c.name;
    if (names.some((n) => raw.includes(n) || n.includes(raw))) return c.name;
  }
  return String(value || "")
    .split(",")[0]
    .trim();
}
