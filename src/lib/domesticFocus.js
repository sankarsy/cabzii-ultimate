/** Domestic taxi & pilgrimage focus — nav, hero, SEO, and chatbot copy. */
export { DOMESTIC_OFFERS } from "./homeShowcase";
export const DOMESTIC_TAGLINE =
  "Premium taxi, airport transfer, outstation & temple tour packages across South India";

export const DOMESTIC_NAV_LINKS = [
  { href: "/cabs", label: "Book Cab" },
  { href: "/buses", label: "Bus tickets" },
  { href: "/cabs/results?serviceTripType=airport", label: "Airport Taxi" },
  { href: "/holidays?category=pilgrimage", label: "Temple Tours" },
  { href: "/call-driver", label: "Call Driver" },
  { href: "/holidays", label: "Tour Packages" }
];

/** Hero category tabs — domestic services only (no flights/hotels/trains/buses). */
export const DOMESTIC_HERO_TABS = [
  { id: "cabs", label: "Cabs", iconKey: "car" },
  { id: "holidays", label: "Temple Tours", iconKey: "holiday" },
  { id: "drivers", label: "Call Driver", iconKey: "driver" }
];

export const PILGRIMAGE_PACKAGES = [
  {
    name: "Tirupati Darshan",
    slug: "tirupati",
    href: "/holidays?category=pilgrimage&q=tirupati",
    image: "/images/hero-banner.png",
    fromPrice: "₹4,999",
    tag: "Most booked"
  },
  {
    name: "Rameswaram Temple",
    slug: "rameswaram",
    href: "/holidays?category=pilgrimage&q=rameswaram",
    fromPrice: "₹5,499",
    tag: "Popular"
  },
  {
    name: "Madurai Temple Tour",
    slug: "madurai",
    href: "/holidays?category=pilgrimage&q=madurai",
    fromPrice: "₹3,999",
    tag: "Family favourite"
  },
  {
    name: "Navagraha Temple Tour",
    slug: "navagraha",
    href: "/holidays?category=pilgrimage&q=navagraha",
    fromPrice: "₹6,999",
    tag: "Spiritual"
  },
  {
    name: "South India Pilgrimage",
    slug: "south-india",
    href: "/holidays?category=pilgrimage",
    fromPrice: "₹8,999",
    tag: "Multi-city"
  },
  {
    name: "Kashi Yatra Package",
    slug: "kashi",
    href: "/holidays?category=pilgrimage&q=kashi",
    fromPrice: "₹12,999",
    tag: "Premium"
  }
];

export const SEO_CITY_TARGETS = [
  { city: "Chennai", slug: "chennai", href: "/cab-booking/chennai" },
  { city: "Madurai", slug: "madurai", href: "/cab-booking/madurai" },
  { city: "Bangalore", slug: "bengaluru", href: "/cab-booking/bengaluru" },
  { city: "Tirupati", slug: "tirupati", href: "/cab-booking/tirupati" },
  { city: "Rameswaram", slug: "rameswaram", href: "/cab-booking/rameswaram" }
];

export const CRM_PIPELINE_STAGES = [
  { id: "new", label: "New Lead", color: "bg-blue-100 text-blue-700" },
  { id: "contacted", label: "Contacted", color: "bg-sky-100 text-sky-700" },
  { id: "quotation_sent", label: "Quotation Sent", color: "bg-violet-100 text-violet-700" },
  { id: "follow_up", label: "Follow Up", color: "bg-amber-100 text-amber-700" },
  { id: "confirmed", label: "Confirmed", color: "bg-emerald-100 text-emerald-700" },
  { id: "completed", label: "Booking Completed", color: "bg-green-100 text-green-800" },
  { id: "lost", label: "Lost", color: "bg-slate-100 text-slate-600" }
];

export const CHATBOT_QUICK_ACTIONS = [
  { label: "WhatsApp quote", type: "whatsapp", icon: "whatsapp" },
  { label: "Call now", type: "call", icon: "phone" },
  { label: "Book a cab", type: "message", text: "I want to book a cab" },
  { label: "Tirupati package", type: "message", text: "Tirupati tour package fare" },
  { label: "Airport taxi", type: "message", text: "Chennai airport taxi fare" },
  { label: "Bangalore airport 12 hr", type: "message", text: "Bangalore Kempegowda airport pickup 12 hour cab package" },
  { label: "One way taxi", type: "message", text: "One way cab Chennai to Bangalore" }
];
