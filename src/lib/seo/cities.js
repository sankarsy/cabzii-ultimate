/** South India + national cities for programmatic SEO landing pages. */
export const SEO_CITIES = [
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu", region: "IN-TN", langs: ["ta", "en"] },
  { slug: "bengaluru", name: "Bengaluru", state: "Karnataka", region: "IN-KA", langs: ["kn", "en"] },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", region: "IN-TG", langs: ["te", "en"] },
  { slug: "coimbatore", name: "Coimbatore", state: "Tamil Nadu", region: "IN-TN", langs: ["ta", "en"] },
  { slug: "mysore", name: "Mysore", state: "Karnataka", region: "IN-KA", langs: ["kn", "en"] },
  { slug: "pondicherry", name: "Pondicherry", state: "Puducherry", region: "IN-PY", langs: ["ta", "en"] },
  { slug: "tirupati", name: "Tirupati", state: "Andhra Pradesh", region: "IN-AP", langs: ["te", "en"] },
  { slug: "vellore", name: "Vellore", state: "Tamil Nadu", region: "IN-TN", langs: ["ta", "en"] },
  { slug: "salem", name: "Salem", state: "Tamil Nadu", region: "IN-TN", langs: ["ta", "en"] },
  { slug: "madurai", name: "Madurai", state: "Tamil Nadu", region: "IN-TN", langs: ["ta", "en"] },
  { slug: "trichy", name: "Trichy", state: "Tamil Nadu", region: "IN-TN", langs: ["ta", "en"] },
  { slug: "kodaikanal", name: "Kodaikanal", state: "Tamil Nadu", region: "IN-TN", langs: ["ta", "en"] },
  { slug: "erode", name: "Erode", state: "Tamil Nadu", region: "IN-TN", langs: ["ta", "en"] },
  { slug: "hosur", name: "Hosur", state: "Tamil Nadu", region: "IN-TN", langs: ["ta", "en"] },
  { slug: "tirunelveli", name: "Tirunelveli", state: "Tamil Nadu", region: "IN-TN", langs: ["ta", "en"] },
  { slug: "rameswaram", name: "Rameswaram", state: "Tamil Nadu", region: "IN-TN", langs: ["ta", "en"] },
  { slug: "ooty", name: "Ooty", state: "Tamil Nadu", region: "IN-TN", langs: ["ta", "en"] },
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", region: "IN-MH", langs: ["en"] },
  { slug: "delhi", name: "Delhi", state: "Delhi NCR", region: "IN-DL", langs: ["en"] },
  { slug: "pune", name: "Pune", state: "Maharashtra", region: "IN-MH", langs: ["en"] },
  { slug: "kolkata", name: "Kolkata", state: "West Bengal", region: "IN-WB", langs: ["en"] },
  { slug: "kochi", name: "Kochi", state: "Kerala", region: "IN-KL", langs: ["en"] },
  { slug: "visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh", region: "IN-AP", langs: ["te", "en"] },
  { slug: "goa", name: "Goa", state: "Goa", region: "IN-GA", langs: ["en"] },
  { slug: "jaipur", name: "Jaipur", state: "Rajasthan", region: "IN-RJ", langs: ["en"] },
  { slug: "ahmedabad", name: "Ahmedabad", state: "Gujarat", region: "IN-GJ", langs: ["en"] },
  { slug: "chandigarh", name: "Chandigarh", state: "Punjab", region: "IN-PB", langs: ["en"] }
];

export function cityBySlug(slug) {
  return SEO_CITIES.find((c) => c.slug === slug) ?? null;
}

export function cityNameLower(city) {
  return city.name.toLowerCase();
}

/** Approximate city centers for LocalBusiness geo in JSON-LD (omit when unknown). */
export const CITY_GEO = {
  chennai: { lat: "13.0827", lng: "80.2707" },
  bengaluru: { lat: "12.9716", lng: "77.5946" },
  hyderabad: { lat: "17.385", lng: "78.4867" },
  coimbatore: { lat: "11.0168", lng: "76.9558" },
  mysore: { lat: "12.2958", lng: "76.6394" },
  pondicherry: { lat: "11.9416", lng: "79.8083" },
  tirupati: { lat: "13.6288", lng: "79.4192" },
  vellore: { lat: "12.9165", lng: "79.1325" },
  salem: { lat: "11.6643", lng: "78.146" },
  madurai: { lat: "9.9252", lng: "78.1198" },
  trichy: { lat: "10.7905", lng: "78.7047" },
  kodaikanal: { lat: "10.2381", lng: "77.4892" },
  erode: { lat: "11.341", lng: "77.7172" },
  hosur: { lat: "12.7409", lng: "77.8253" },
  tirunelveli: { lat: "8.7139", lng: "77.7567" },
  rameswaram: { lat: "9.2876", lng: "79.3129" },
  ooty: { lat: "11.4064", lng: "76.6932" },
  mumbai: { lat: "19.076", lng: "72.8777" },
  delhi: { lat: "28.7041", lng: "77.1025" },
  pune: { lat: "18.5204", lng: "73.8567" },
  kolkata: { lat: "22.5726", lng: "88.3639" },
  kochi: { lat: "9.9312", lng: "76.2673" },
  visakhapatnam: { lat: "17.6868", lng: "83.2185" },
  goa: { lat: "15.2993", lng: "74.124" },
  jaipur: { lat: "26.9124", lng: "75.7873" },
  ahmedabad: { lat: "23.0225", lng: "72.5714" },
  chandigarh: { lat: "30.7333", lng: "76.7794" }
};

export function cityGeo(slug) {
  return CITY_GEO[slug] ?? null;
}
