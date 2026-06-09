import { BRAND } from "../brand";

/** Home hero tabs — Cabzii.in travel booking */
/** Cabs & drivers first — core Cabzii products; all tabs scroll horizontally on small screens */
export const HERO_TABS = [
  { id: "cabs", label: "Cabs", iconKey: "car" },
  { id: "drivers", label: "Drivers", iconKey: "driver" },
  { id: "flights", label: "Flights", iconKey: "plane" },
  { id: "hotels", label: "Hotels", iconKey: "hotel" },
  { id: "holidays", label: "Holidays", iconKey: "holiday" },
  { id: "buses", label: "Buses", iconKey: "bus" },
  { id: "trains", label: "Trains", iconKey: "train" }
];

export const TRENDING_SEARCHES = [
  { label: "Cab Booking Chennai", href: "/cab-booking/chennai" },
  { label: "Airport Taxi Chennai", href: "/services/airport-taxi/chennai" },
  { label: "Chennai → Bengaluru", slug: "chennai-to-bangalore-cab" },
  { label: "Chennai → Pondicherry", slug: "chennai-to-pondicherry-cab" },
  { label: "Outstation Cab Chennai", href: "/services/outstation-cab/chennai" },
  { label: "One Way Taxi Chennai", href: "/services/one-way-cab/chennai" },
  { label: "Chennai → Tirupati", slug: "chennai-to-tirupati-cab" },
  { label: "Pilgrimage Tours", href: "/holidays?category=pilgrimage" }
];

export const WHY_STATS = [
  { value: "50K+", label: "Happy customers" },
  { value: "Best Price", label: "Guarantee" },
  { value: "24×7", label: "Support" },
  { value: "Secure", label: "OTP booking" }
];

export { BRAND };
