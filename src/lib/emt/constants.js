import { BRAND } from "../brand";

/** Home hero tabs — live services only (flights / hotels / trains are paused). */
export const HERO_TABS = [
  { id: "cabs", label: "Cabs", iconKey: "car" },
  { id: "drivers", label: "Call Driver", iconKey: "driver" },
  { id: "buses", label: "Buses", iconKey: "bus" },
  { id: "holidays", label: "Holidays", iconKey: "holiday" }
];

export const TRENDING_SEARCHES = [
  { label: "Cab Booking Chennai", href: "/cab-booking/chennai" },
  { label: "Airport Taxi Chennai", href: "/services/airport-taxi/chennai" },
  { label: "Chennai → Bengaluru", slug: "chennai-to-bangalore-cab" },
  { label: "Chennai → Pondicherry", slug: "chennai-to-pondicherry-cab" },
  { label: "Outstation Cab Chennai", href: "/services/outstation-cab/chennai" },
  { label: "One Way Taxi Chennai", href: "/services/one-way-cab/chennai" },
  { label: "Chennai → Tirupati", slug: "chennai-to-tirupati-cab" },
  { label: "Chennai → Trichy", slug: "chennai-to-trichy-cab" },
  { label: "Pilgrimage Tours", href: "/holidays?category=pilgrimage" }
];

export { BRAND } from "../brand";
export { WHY_STATS } from "../marketingStats";
