import { BRAND } from "../brand";

/** Home hero tabs — Cabzii.in travel booking */
/** Cabs & drivers first — core Cabzii products; all tabs scroll horizontally on small screens */
export const HERO_TABS = [
  { id: "cabs", label: "Cabs", icon: "🚗" },
  { id: "drivers", label: "Drivers", icon: "👤" },
  { id: "flights", label: "Flights", icon: "✈️" },
  { id: "hotels", label: "Hotels", icon: "🏨" },
  { id: "holidays", label: "Holidays", icon: "🎒" },
  { id: "buses", label: "Buses", icon: "🚌" },
  { id: "trains", label: "Trains", icon: "🚆" }
];

export const TRENDING_SEARCHES = [
  { label: "Chennai → Bengaluru", href: "/cabs/results?serviceTripType=outstation&from=Chennai&to=Bengaluru" },
  { label: "DEL → BOM Flights", href: "/flights?from=DEL&to=BOM&date=2026-06-15&adults=1&tripType=oneway" },
  { label: "Goa Hotels", href: "/hotels?city=Goa" },
  { label: "Pilgrimage", href: "/holidays?category=pilgrimage" },
  { label: "Airport Cab Chennai", href: "/cabs/results?serviceTripType=airport&from=Chennai%20Airport&to=Chennai" },
  {
    label: "Acting Driver Chennai",
    href: "/drivers/results?serviceTripType=local&from=Chennai&packageId=local_4hr&date=2026-06-01&time=09:00"
  }
];

export const WHY_STATS = [
  { value: "50K+", label: "Happy customers" },
  { value: "Best Price", label: "Guarantee" },
  { value: "24×7", label: "Support" },
  { value: "Secure", label: "OTP booking" }
];

export { BRAND };
