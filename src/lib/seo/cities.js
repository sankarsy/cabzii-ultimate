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
