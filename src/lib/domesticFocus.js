/** Domestic taxi & pilgrimage focus — single source for nav, hero, SEO, and offers. */
export const DOMESTIC_TAGLINE =
  "Premium taxi, airport transfer, outstation & temple tour packages across South India";

export const DOMESTIC_NAV_LINKS = [
  { href: "/cabs", label: "Book Cab" },
  { href: "/cabs/results?serviceTripType=airport", label: "Airport Taxi" },
  { href: "/holidays?category=pilgrimage", label: "Temple Tours" },
  { href: "/drivers", label: "Drivers" },
  { href: "/holidays", label: "Tour Packages" }
];

/** Hero category tabs — domestic services only (no flights/hotels/trains/buses). */
export const DOMESTIC_HERO_TABS = [
  { id: "cabs", label: "Cabs", iconKey: "car" },
  { id: "holidays", label: "Temple Tours", iconKey: "holiday" },
  { id: "drivers", label: "Drivers", iconKey: "driver" }
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

export const POPULAR_DOMESTIC_ROUTES = [
  { label: "Chennai → Tirupati", href: "/routes/chennai-to-tirupati-cab", fare: "From ₹3,500" },
  { label: "Chennai → Trichy", href: "/routes/chennai-to-trichy-cab", fare: "From ₹4,200" },
  { label: "Chennai → Bangalore", href: "/routes/chennai-to-bangalore-cab", fare: "From ₹4,500" },
  { label: "Chennai → Rameswaram", href: "/routes/chennai-to-rameswaram-cab", fare: "From ₹5,200" },
  { label: "Bangalore → Tirupati", href: "/search?q=tirupati&city=Bengaluru", fare: "From ₹4,800" },
  { label: "Chennai Airport Taxi", href: "/services/airport-taxi/chennai", fare: "From ₹899" },
  { label: "Bangalore Airport · 12 hr", href: "/cabs/results?serviceTripType=hourly&from=Kempegowda+International+Airport%2C+Bengaluru&to=Bengaluru&city=Bengaluru&packageHours=12", fare: "From ₹1,400" },
  { label: "Madurai Temple Tour", href: "/holidays?category=pilgrimage&q=madurai", fare: "From ₹3,999" }
];

export const SEO_CITY_TARGETS = [
  { city: "Chennai", slug: "chennai", href: "/cab-booking/chennai" },
  { city: "Madurai", slug: "madurai", href: "/cab-booking/madurai" },
  { city: "Bangalore", slug: "bengaluru", href: "/cab-booking/bengaluru" },
  { city: "Tirupati", slug: "tirupati", href: "/search?q=tirupati" },
  { city: "Rameswaram", slug: "rameswaram", href: "/search?q=rameswaram" }
];

export const DOMESTIC_OFFERS = [
  {
    tag: "OUTSTATION",
    title: "20% OFF outstation cabs",
    desc: "Sedan, SUV, Innova & Tempo Traveller.",
    iconKey: "car",
    color: "from-[var(--cabzii-brand)] to-blue-500",
    href: "/cabs"
  },
  {
    tag: "TEMPLE TOURS",
    title: "Tirupati package from ₹4,999",
    desc: "Darshan trips with verified drivers.",
    iconKey: "holiday",
    color: "from-rose-500 to-pink-400",
    href: "/holidays?category=pilgrimage&q=tirupati"
  },
  {
    tag: "ONE WAY",
    title: "Chennai → Bangalore one-way",
    desc: "Transparent upfront fares.",
    iconKey: "route",
    color: "from-emerald-500 to-teal-400",
    href: "/routes/chennai-to-bangalore-cab"
  },
  {
    tag: "AIRPORT",
    title: "Bangalore airport · 12 hr cab",
    desc: "Kempegowda pickup · 120 km package.",
    iconKey: "airport",
    color: "from-indigo-500 to-violet-400",
    href: "/cabs/results?serviceTripType=hourly&from=Kempegowda+International+Airport%2C+Bengaluru&to=Bengaluru&city=Bengaluru&packageHours=12"
  },
  {
    tag: "AIRPORT",
    title: "Chennai airport taxi",
    desc: "24×7 pickup · fixed local fares.",
    iconKey: "airport",
    color: "from-indigo-500 to-violet-400",
    href: "/services/airport-taxi/chennai"
  },
  {
    tag: "DRIVERS",
    title: "Acting driver from ₹900",
    desc: "Local, outstation & corporate hire.",
    iconKey: "driver",
    color: "from-slate-700 to-slate-500",
    href: "/drivers"
  },
  {
    tag: "PILGRIMAGE",
    title: "Rameswaram & Madurai tours",
    desc: "South India temple packages.",
    iconKey: "holiday",
    color: "from-amber-500 to-orange-400",
    href: "/holidays?category=pilgrimage"
  }
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
