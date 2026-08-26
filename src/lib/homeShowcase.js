/** Homepage card fallbacks — keep in sync with backend src/data/defaultHomeCards.js */

const IMG = {
  outstation: "/images/showcase/outstation.webp",
  airport: "/images/showcase/airport.webp",
  chennai: "/images/showcase/chennai.webp",
  bengaluru: "/images/showcase/bengaluru.webp",
  temple: "/images/showcase/temple.webp",
  driver: "/images/showcase/driver.webp",
  tempo: "/images/showcase/tempo.webp",
  route: "/images/showcase/route.webp"
};

export const HOME_CARD_COPY = {
  offers: {
    title: "Exclusive Offers",
    viewAllHref: "/cabs",
    viewAllLabel: "View all →",
    ariaLabel: "Exclusive offers",
    noun: "offer",
    hint: "These cards appear in the homepage Exclusive Offers row. Promo code is optional."
  },
  services: {
    title: "Cab services in all cities",
    viewAllHref: "/cabs",
    viewAllLabel: "View all →",
    ariaLabel: "Cab services in all cities",
    noun: "city service",
    hint: "City cards on the homepage. Use fare like From ₹899 instead of a promo code."
  },
  routes: {
    title: "Popular routes & services",
    viewAllHref: "/cabs",
    viewAllLabel: "View all →",
    ariaLabel: "Popular routes and services",
    noun: "route",
    hint: "Route cards on the homepage. Use fare like From ₹3,500 instead of a promo code."
  }
};

export const DOMESTIC_OFFERS = [
  {
    tag: "OUTSTATION",
    title: "Outstation cab packages",
    desc: "Book Sedan, SUV, Innova & Tempo Traveller cabs for every outstation trip.",
    iconKey: "car",
    color: "from-[var(--cabzii-brand)] to-blue-500",
    image: "/images/offers/offer-outstation.webp",
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
    image: "/images/offers/offer-tirupati.webp",
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
    image: "/images/offers/offer-oneway.webp",
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
    image: "/images/offers/offer-airport.webp",
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
    image: "/images/offers/offer-airport-chennai.webp",
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
    image: "/images/offers/offer-driver.webp",
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
    image: "/images/offers/offer-rameswaram.webp",
    href: "/holidays?category=pilgrimage",
    code: "TEMPLE",
    validTill: "31st Jul, 2026"
  }
];

export const CITY_SERVICE_CARDS = [
  { tag: "CHENNAI", title: "Cab services in Chennai", desc: "Airport taxi, local hire and outstation cabs with upfront fares.", iconKey: "car", color: "from-[var(--cabzii-brand)] to-blue-500", image: IMG.chennai, href: "/cab-booking/chennai", fare: "From ₹899" },
  { tag: "BENGALURU", title: "Cab services in Bengaluru", desc: "Airport pickup, city taxi and outstation cabs across Bengaluru.", iconKey: "car", color: "from-indigo-500 to-violet-400", image: IMG.bengaluru, href: "/cab-booking/bengaluru", fare: "From ₹999" },
  { tag: "HYDERABAD", title: "Cab services in Hyderabad", desc: "Airport, local and intercity cabs with verified drivers.", iconKey: "airport", color: "from-emerald-500 to-teal-400", image: IMG.airport, href: "/cab-booking/hyderabad", fare: "From ₹899" },
  { tag: "COIMBATORE", title: "Cab services in Coimbatore", desc: "Outstation and local taxi hire for Coimbatore and hill stations.", iconKey: "car", color: "from-amber-500 to-orange-400", image: IMG.outstation, href: "/cab-booking/coimbatore", fare: "From ₹799" },
  { tag: "MADURAI", title: "Cab services in Madurai", desc: "Temple tours, airport taxi and outstation cabs in Madurai.", iconKey: "holiday", color: "from-rose-500 to-pink-400", image: IMG.temple, href: "/cab-booking/madurai", fare: "From ₹799" },
  { tag: "TRICHY", title: "Cab services in Trichy", desc: "Airport drop, local taxi and one-way cabs from Trichy.", iconKey: "route", color: "from-slate-700 to-slate-500", image: IMG.route, href: "/cab-booking/trichy", fare: "From ₹749" },
  { tag: "PONDICHERRY", title: "Cab services in Pondicherry", desc: "Chennai–Pondy one-way, local sightseeing and airport transfers.", iconKey: "car", color: "from-[var(--cabzii-brand)] to-blue-500", image: IMG.chennai, href: "/cab-booking/pondicherry", fare: "From ₹999" },
  { tag: "TIRUPATI", title: "Cab services in Tirupati", desc: "Darshan cabs, airport taxi and outstation returns from Tirupati.", iconKey: "holiday", color: "from-rose-500 to-pink-400", image: IMG.temple, href: "/cab-booking/tirupati", fare: "From ₹899" },
  { tag: "VELLORE", title: "Cab services in Vellore", desc: "Local taxi, hospital drops and outstation cabs from Vellore.", iconKey: "driver", color: "from-slate-700 to-slate-500", image: IMG.driver, href: "/cab-booking/vellore", fare: "From ₹699" },
  { tag: "SALEM", title: "Cab services in Salem", desc: "Tempo Traveller, SUV and sedan hire for Salem trips.", iconKey: "car", color: "from-amber-500 to-orange-400", image: IMG.tempo, href: "/cab-booking/salem", fare: "From ₹749" },
  { tag: "RAMESWARAM", title: "Cab services in Rameswaram", desc: "Temple tour cabs and Madurai–Rameswaram one-way packages.", iconKey: "holiday", color: "from-rose-500 to-pink-400", image: IMG.temple, href: "/cab-booking/rameswaram", fare: "From ₹999" },
  { tag: "OOTY", title: "Cab services in Ooty", desc: "Hill-station cabs, sightseeing and Coimbatore–Ooty transfers.", iconKey: "car", color: "from-emerald-500 to-teal-400", image: IMG.tempo, href: "/cab-booking/ooty", fare: "From ₹1,499" },
  { tag: "KODAIKANAL", title: "Cab services in Kodaikanal", desc: "Scenic hill cabs and Madurai–Kodai taxi packages.", iconKey: "car", color: "from-indigo-500 to-violet-400", image: IMG.outstation, href: "/cab-booking/kodaikanal", fare: "From ₹1,499" },
  { tag: "MYSORE", title: "Cab services in Mysore", desc: "Palace city taxi, Bengaluru–Mysore one-way and local hire.", iconKey: "car", color: "from-[var(--cabzii-brand)] to-blue-500", image: IMG.bengaluru, href: "/cab-booking/mysore", fare: "From ₹899" },
  { tag: "KOCHI", title: "Cab services in Kochi", desc: "Airport taxi, city cabs and Kerala outstation packages.", iconKey: "airport", color: "from-indigo-500 to-violet-400", image: IMG.airport, href: "/cab-booking/kochi", fare: "From ₹899" }
];

export const ROUTE_CARDS = [
  { tag: "ONE WAY", title: "Chennai → Tirupati", desc: "Darshan one-way cab with verified drivers and flexible pickup.", iconKey: "holiday", color: "from-rose-500 to-pink-400", image: IMG.temple, href: "/routes/chennai-to-tirupati-cab", fare: "From ₹3,500" },
  { tag: "ONE WAY", title: "Chennai → Trichy", desc: "Comfortable intercity sedan and SUV one-way packages.", iconKey: "route", color: "from-emerald-500 to-teal-400", image: IMG.route, href: "/routes/chennai-to-trichy-cab", fare: "From ₹4,200" },
  { tag: "ONE WAY", title: "Chennai → Bangalore", desc: "Pay only for one side — transparent fares, no hidden charges.", iconKey: "route", color: "from-[var(--cabzii-brand)] to-blue-500", image: IMG.outstation, href: "/routes/chennai-to-bangalore-cab", fare: "From ₹4,500" },
  { tag: "TEMPLE", title: "Chennai → Rameswaram", desc: "Pilgrimage cab with planned halts and round-trip options.", iconKey: "holiday", color: "from-amber-500 to-orange-400", image: IMG.temple, href: "/routes/chennai-to-rameswaram-cab", fare: "From ₹5,200" },
  { tag: "ONE WAY", title: "Bangalore → Tirupati", desc: "Early-morning darshan pickups from Bengaluru and airport.", iconKey: "holiday", color: "from-rose-500 to-pink-400", image: IMG.bengaluru, href: "/routes/bengaluru-to-tirupati-cab", fare: "From ₹4,800" },
  { tag: "AIRPORT", title: "Chennai Airport Taxi", desc: "24×7 airport pickup & drop at fixed local fares.", iconKey: "airport", color: "from-indigo-500 to-violet-400", image: IMG.airport, href: "/services/airport-taxi/chennai", fare: "From ₹899" },
  { tag: "AIRPORT", title: "Bangalore Airport · 12 hr", desc: "Kempegowda pickup with a 12 hour / 120 km full-day package.", iconKey: "airport", color: "from-indigo-500 to-violet-400", image: IMG.bengaluru, href: "/cabs/results?serviceTripType=hourly&from=Kempegowda+International+Airport%2C+Bengaluru&to=Bengaluru&city=Bengaluru&packageHours=12", fare: "From ₹1,400" },
  { tag: "TOUR", title: "Madurai Temple Tour", desc: "Meenakshi temple circuit with a comfortable cab and driver.", iconKey: "holiday", color: "from-amber-500 to-orange-400", image: IMG.temple, href: "/holidays?category=pilgrimage&q=madurai", fare: "From ₹3,999" },
  { tag: "ONE WAY", title: "Chennai → Pondicherry", desc: "Coastal one-way cab — sedan, Innova and Tempo Traveller.", iconKey: "route", color: "from-emerald-500 to-teal-400", image: IMG.chennai, href: "/routes/chennai-to-pondicherry-cab", fare: "From ₹2,800" },
  { tag: "ONE WAY", title: "Bengaluru → Mysore", desc: "Palace city day trip or one-way drop with upfront fare.", iconKey: "route", color: "from-[var(--cabzii-brand)] to-blue-500", image: IMG.bengaluru, href: "/routes/bengaluru-to-mysore-cab", fare: "From ₹2,499" }
];

export const SHOWCASE_FALLBACKS = {
  offers: DOMESTIC_OFFERS,
  services: CITY_SERVICE_CARDS,
  routes: ROUTE_CARDS
};
