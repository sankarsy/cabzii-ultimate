const IMG = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;

export const MOCK_HOTELS = [
  {
    id: "htl-1",
    name: "The Leela Palace Chennai",
    stars: 5,
    rating: { score: 4.8, count: 1240, label: "Excellent" },
    location: { city: "Chennai", address: "Adyar, Chennai", lat: 13.0, lng: 80.25 },
    images: [IMG("1566073771259-6a8506099945")],
    amenities: ["wifi", "pool", "parking", "spa"],
    pricePerNight: 12500,
    freeCancellation: true,
    breakfastIncluded: true
  },
  {
    id: "htl-2",
    name: "Taj Lands End Mumbai",
    stars: 5,
    rating: { score: 4.7, count: 2100, label: "Excellent" },
    location: { city: "Mumbai", address: "Bandra West", lat: 19.05, lng: 72.82 },
    images: [IMG("1551882547-ff40c63fe5fa")],
    amenities: ["wifi", "pool", "parking"],
    pricePerNight: 15800,
    freeCancellation: true,
    breakfastIncluded: false
  },
  {
    id: "htl-3",
    name: "Novotel Bengaluru Tech Park",
    stars: 4,
    rating: { score: 4.4, count: 890, label: "Very Good" },
    location: { city: "Bengaluru", address: "Outer Ring Road", lat: 12.97, lng: 77.69 },
    images: [IMG("1520250497591-112b2f0a3bfe")],
    amenities: ["wifi", "parking", "gym"],
    pricePerNight: 6200,
    freeCancellation: true,
    breakfastIncluded: true
  },
  {
    id: "htl-4",
    name: "Goa Marriott Resort",
    stars: 5,
    rating: { score: 4.6, count: 1560, label: "Excellent" },
    location: { city: "Goa", address: "Miramar Beach", lat: 15.49, lng: 73.82 },
    images: [IMG("1571896349845-7c09d0b3da41")],
    amenities: ["wifi", "pool", "parking", "beach"],
    pricePerNight: 9800,
    freeCancellation: false,
    breakfastIncluded: true
  },
  {
    id: "htl-5",
    name: "Hyatt Regency Delhi",
    stars: 5,
    rating: { score: 4.5, count: 1780, label: "Excellent" },
    location: { city: "New Delhi", address: "Bhim Nagar", lat: 28.63, lng: 77.22 },
    images: [IMG("1582719478250-c89cae4dc85b")],
    amenities: ["wifi", "pool", "parking", "spa"],
    pricePerNight: 11200,
    freeCancellation: true,
    breakfastIncluded: false
  },
  {
    id: "htl-6",
    name: "Fort Kochi Heritage Inn",
    stars: 3,
    rating: { score: 4.2, count: 420, label: "Good" },
    location: { city: "Kochi", address: "Fort Kochi", lat: 9.96, lng: 76.24 },
    images: [IMG("1564501043769-606d005b1d85")],
    amenities: ["wifi", "parking"],
    pricePerNight: 3400,
    freeCancellation: true,
    breakfastIncluded: true
  }
];

export function searchMockHotels({ city }) {
  const q = String(city || "").trim().toLowerCase();
  if (!q) return MOCK_HOTELS;
  return MOCK_HOTELS.filter((h) => h.location.city.toLowerCase().includes(q));
}

export function filterHotels(hotels, { maxPrice, stars, freeCancellation }) {
  let out = [...hotels];
  if (maxPrice) out = out.filter((h) => h.pricePerNight <= maxPrice);
  if (stars) out = out.filter((h) => h.stars >= stars);
  if (freeCancellation) out = out.filter((h) => h.freeCancellation);
  return out.sort((a, b) => a.pricePerNight - b.pricePerNight);
}
