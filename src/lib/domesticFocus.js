/** Domestic taxi & pilgrimage focus — nav, hero, SEO, and chatbot copy. */
export { DOMESTIC_OFFERS } from "./homeShowcase";
export const DOMESTIC_TAGLINE =
  "Premium taxi, airport transfer, outstation and acting driver booking across South India";

export const DOMESTIC_NAV_LINKS = [
  { href: "/cabs", label: "Book Cab" },
  { href: "/buses", label: "Bus tickets" },
  { href: "/chennai/airport-cab-booking", label: "Airport Taxi" },
  { href: "/chennai/outstation/chennai-to-tirupati", label: "Chennai to Tirupati" },
  { href: "/call-driver", label: "Call Driver" }
];

/** Hero category tabs — domestic services only (no flights/hotels/trains/buses). */
export const DOMESTIC_HERO_TABS = [
  { id: "cabs", label: "Cabs", iconKey: "car" },
  { id: "drivers", label: "Call Driver", iconKey: "driver" }
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
  { label: "Chennai to Tirupati", type: "message", text: "Chennai to Tirupati cab fare" },
  { label: "Airport taxi", type: "message", text: "Chennai airport taxi fare" },
  { label: "Bangalore airport 12 hr", type: "message", text: "Bangalore Kempegowda airport pickup 12 hour cab package" },
  { label: "One way taxi", type: "message", text: "One way cab Chennai to Bangalore" }
];
