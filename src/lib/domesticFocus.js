/** Domestic taxi & pilgrimage focus — single source for nav, hero, SEO, and offers. */
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

export const POPULAR_DOMESTIC_ROUTES = [
  { label: "Chennai → Tirupati", href: "/routes/chennai-to-tirupati-cab", fare: "From ₹3,500" },
  { label: "Chennai → Trichy", href: "/routes/chennai-to-trichy-cab", fare: "From ₹4,200" },
  { label: "Chennai → Bangalore", href: "/routes/chennai-to-bangalore-cab", fare: "From ₹4,500" },
  { label: "Chennai → Rameswaram", href: "/routes/chennai-to-rameswaram-cab", fare: "From ₹5,200" },
  { label: "Bangalore → Tirupati", href: "/routes/bengaluru-to-tirupati-cab", fare: "From ₹4,800" },
  { label: "Chennai Airport Taxi", href: "/services/airport-taxi/chennai", fare: "From ₹899" },
  { label: "Bangalore Airport · 12 hr", href: "/cabs/results?serviceTripType=hourly&from=Kempegowda+International+Airport%2C+Bengaluru&to=Bengaluru&city=Bengaluru&packageHours=12", fare: "From ₹1,400" },
  { label: "Madurai Temple Tour", href: "/holidays?category=pilgrimage&q=madurai", fare: "From ₹3,999" }
];

export const SEO_CITY_TARGETS = [
  { city: "Chennai", slug: "chennai", href: "/cab-booking/chennai" },
  { city: "Madurai", slug: "madurai", href: "/cab-booking/madurai" },
  { city: "Bangalore", slug: "bengaluru", href: "/cab-booking/bengaluru" },
  { city: "Tirupati", slug: "tirupati", href: "/cab-booking/tirupati" },
  { city: "Rameswaram", slug: "rameswaram", href: "/cab-booking/rameswaram" }
];

export const DOMESTIC_OFFERS = [
  {
    tag: "OUTSTATION",
    title: "Outstation cab packages",
    desc: "Book Sedan, SUV, Innova & Tempo Traveller cabs for every outstation trip.",
    iconKey: "car",
    color: "from-[var(--cabzii-brand)] to-blue-500",
    image: "/images/offers/offer-outstation.png",
    href: "/cabs",
    code: "CABOUT20",
    validTill: "31st Jul, 2026"
  },
  {
    tag: "TEMPLE TOURS",
    title: "Tirupati package from ₹4,999",
    desc: "Darshan trips with verified drivers, pickup from home & flexible timings.",
    iconKey: "holiday",
    color: "from-rose-500 to-pink-400",
    image: "/images/offers/offer-tirupati.png",
    href: "/holidays?category=pilgrimage&q=tirupati",
    code: "TIRUPATI",
    validTill: "31st Jul, 2026"
  },
  {
    tag: "ONE WAY",
    title: "Chennai → Bangalore one-way",
    desc: "Pay only for one side — transparent upfront fares with no hidden charges.",
    iconKey: "route",
    color: "from-emerald-500 to-teal-400",
    image: "/images/offers/offer-oneway.png",
    href: "/routes/chennai-to-bangalore-cab",
    code: "ONEWAY",
    validTill: "31st Jul, 2026"
  },
  {
    tag: "AIRPORT",
    title: "Bangalore airport · 12 hr cab",
    desc: "Kempegowda pickup with a 12 hour / 120 km package for the full day.",
    iconKey: "airport",
    color: "from-indigo-500 to-violet-400",
    image: "/images/offers/offer-airport.png",
    href: "/cabs/results?serviceTripType=hourly&from=Kempegowda+International+Airport%2C+Bengaluru&to=Bengaluru&city=Bengaluru&packageHours=12",
    code: "BLRAIR12",
    validTill: "31st Jul, 2026"
  },
  {
    tag: "AIRPORT",
    title: "Chennai airport taxi",
    desc: "24×7 airport pickup & drop at fixed local fares with instant confirmation.",
    iconKey: "airport",
    color: "from-indigo-500 to-violet-400",
    image: "/images/offers/offer-airport-chennai.png",
    href: "/services/airport-taxi/chennai",
    code: "CHNAIR",
    validTill: "31st Jul, 2026"
  },
  {
    tag: "DRIVERS",
    title: "Acting driver from ₹900",
    desc: "Hire verified acting drivers for local, outstation & corporate trips.",
    iconKey: "driver",
    color: "from-slate-700 to-slate-500",
    image: "/images/offers/offer-driver.png",
    href: "/call-driver",
    code: "DRIVER900",
    validTill: "31st Jul, 2026"
  },
  {
    tag: "PILGRIMAGE",
    title: "Rameswaram & Madurai tours",
    desc: "South India temple tour packages with comfortable cabs & planned halts.",
    iconKey: "holiday",
    color: "from-amber-500 to-orange-400",
    image: "/images/offers/offer-rameswaram.png",
    href: "/holidays?category=pilgrimage",
    code: "TEMPLE",
    validTill: "31st Jul, 2026"
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
