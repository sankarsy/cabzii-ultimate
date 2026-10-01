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
    viewAllHref: "/cab-booking",
    viewAllLabel: "View all →",
    ariaLabel: "Cab services in all cities",
    noun: "city service",
    hint: "City cards on the homepage. Use fare like From ₹899 instead of a promo code."
  },
  routes: {
    title: "Popular routes & services",
    viewAllHref: "/routes",
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
    code: "CABOUT20"
  },
  {
    tag: "TEMPLE TOURS",
    title: "Tirupati package from ₹4,999",
    desc: "Darshan trips with pickup from home and flexible timings.",
    iconKey: "holiday",
    color: "from-rose-500 to-pink-400",
    image: "/images/offers/offer-tirupati.webp",
    href: "/tour-packages/tirupati-balaji-darshan-tirupati",
    code: "TIRUPATI"
  },
  {
    tag: "ONE WAY",
    title: "Chennai → Bangalore one-way",
    desc: "Pay only for one side — transparent upfront fares with no hidden charges.",
    iconKey: "route",
    color: "from-emerald-500 to-teal-400",
    image: "/images/offers/offer-oneway.webp",
    href: "/chennai/outstation/chennai-to-bangalore",
    code: "ONEWAY"
  },
  {
    tag: "AIRPORT",
    title: "Bangalore airport · 12 hr cab",
    desc: "Kempegowda pickup with a 12 hour / 120 km package for the full day.",
    iconKey: "airport",
    color: "from-indigo-500 to-violet-400",
    image: "/images/offers/offer-airport.webp",
    href: "/cabs/results?serviceTripType=hourly&from=Kempegowda+International+Airport%2C+Bengaluru&to=Bengaluru&city=Bengaluru&packageHours=12",
    code: "BLRAIR12"
  },
  {
    tag: "AIRPORT",
    title: "Chennai airport taxi",
    desc: "Airport pickup and drop with local packages from the published Chennai tariff.",
    iconKey: "airport",
    color: "from-indigo-500 to-violet-400",
    image: "/images/offers/offer-airport-chennai.webp",
    href: "/chennai/airport-cab-booking",
    code: "CHNAIR"
  },
  {
    tag: "DRIVERS",
    title: "Acting driver from ₹900",
    desc: "Hire an acting driver for local, outstation and corporate trips in your car.",
    iconKey: "driver",
    color: "from-slate-700 to-slate-500",
    image: "/images/offers/offer-driver.webp",
    href: "/call-driver",
    code: "DRIVER900"
  },
  {
    tag: "PILGRIMAGE",
    title: "Rameswaram & Madurai tours",
    desc: "South India temple tour packages with comfortable cabs & planned halts.",
    iconKey: "holiday",
    color: "from-amber-500 to-orange-400",
    image: "/images/offers/offer-rameswaram.webp",
    href: "/holidays?category=pilgrimage",
    code: "TEMPLE"
  }
];

export const CITY_SERVICE_CARDS = [
  { tag: "CHENNAI", title: "Cab services in Chennai", desc: "Airport taxi, local hire and outstation cabs with upfront fares.", iconKey: "car", color: "from-[var(--cabzii-brand)] to-blue-500", image: IMG.chennai, href: "/chennai", fare: "From ₹1,200" },
  { tag: "BENGALURU", title: "Cab services in Bengaluru", desc: "Airport pickup, city taxi and outstation cabs across Bengaluru.", iconKey: "car", color: "from-indigo-500 to-violet-400", image: IMG.bengaluru, href: "/bengaluru", fare: "From ₹999" },
  { tag: "HYDERABAD", title: "Cab services in Hyderabad", desc: "Airport, local and intercity cabs with fares shown before you confirm.", iconKey: "airport", color: "from-emerald-500 to-teal-400", image: IMG.airport, href: "/hyderabad", fare: "From ₹899" },
  { tag: "COIMBATORE", title: "Cab services in Coimbatore", desc: "Outstation and local taxi hire for Coimbatore and hill stations.", iconKey: "car", color: "from-amber-500 to-orange-400", image: IMG.outstation, href: "/coimbatore", fare: "From ₹799" },
  { tag: "MADURAI", title: "Cab services in Madurai", desc: "Temple tours, airport taxi and outstation cabs in Madurai.", iconKey: "holiday", color: "from-rose-500 to-pink-400", image: IMG.temple, href: "/madurai", fare: "From ₹799" },
  { tag: "TRICHY", title: "Cab services in Trichy", desc: "Airport drop, local taxi and one-way cabs from Trichy.", iconKey: "route", color: "from-slate-700 to-slate-500", image: IMG.route, href: "/trichy", fare: "From ₹749" },
  { tag: "PONDICHERRY", title: "Cab services in Pondicherry", desc: "Chennai–Pondy one-way, local sightseeing and airport transfers.", iconKey: "car", color: "from-[var(--cabzii-brand)] to-blue-500", image: IMG.chennai, href: "/pondicherry", fare: "From ₹999" },
  { tag: "TIRUPATI", title: "Cab services in Tirupati", desc: "Darshan cabs, airport taxi and outstation returns from Tirupati.", iconKey: "holiday", color: "from-rose-500 to-pink-400", image: IMG.temple, href: "/tirupati", fare: "From ₹899" },
  { tag: "VELLORE", title: "Cab services in Vellore", desc: "Local taxi, hospital drops and outstation cabs from Vellore.", iconKey: "driver", color: "from-slate-700 to-slate-500", image: IMG.driver, href: "/vellore", fare: "From ₹699" },
  { tag: "SALEM", title: "Cab services in Salem", desc: "Tempo Traveller, SUV and sedan hire for Salem trips.", iconKey: "car", color: "from-amber-500 to-orange-400", image: IMG.tempo, href: "/salem", fare: "From ₹749" },
  { tag: "RAMESWARAM", title: "Cab services in Rameswaram", desc: "Temple tour cabs and Madurai–Rameswaram one-way packages.", iconKey: "holiday", color: "from-rose-500 to-pink-400", image: IMG.temple, href: "/rameswaram", fare: "From ₹999" },
  { tag: "OOTY", title: "Cab services in Ooty", desc: "Hill-station cabs, sightseeing and Coimbatore–Ooty transfers.", iconKey: "car", color: "from-emerald-500 to-teal-400", image: IMG.tempo, href: "/ooty", fare: "From ₹1,499" },
  { tag: "KODAIKANAL", title: "Cab services in Kodaikanal", desc: "Scenic hill cabs and Madurai–Kodai taxi packages.", iconKey: "car", color: "from-indigo-500 to-violet-400", image: IMG.outstation, href: "/kodaikanal", fare: "From ₹1,499" },
  { tag: "MYSORE", title: "Cab services in Mysore", desc: "Palace city taxi, Bengaluru–Mysore one-way and local hire.", iconKey: "car", color: "from-[var(--cabzii-brand)] to-blue-500", image: IMG.bengaluru, href: "/mysore", fare: "From ₹899" },
  { tag: "KOCHI", title: "Cab services in Kochi", desc: "Airport taxi, city cabs and Kerala outstation packages.", iconKey: "airport", color: "from-indigo-500 to-violet-400", image: IMG.airport, href: "/kochi", fare: "From ₹899" }
];

export const ROUTE_CARDS = [
  { tag: "ONE WAY", title: "Chennai → Tirupati", desc: "Darshan one-way cab with flexible pickup.", iconKey: "holiday", color: "from-rose-500 to-pink-400", image: IMG.temple, href: "/chennai/outstation/chennai-to-tirupati", fare: "From ₹3,250" },
  { tag: "ONE WAY", title: "Chennai → Trichy", desc: "Comfortable intercity sedan and SUV one-way packages.", iconKey: "route", color: "from-emerald-500 to-teal-400", image: IMG.route, href: "/chennai/outstation/chennai-to-trichy", fare: "From ₹4,200" },
  { tag: "ONE WAY", title: "Chennai → Bangalore", desc: "Pay only for one side — transparent fares, no hidden charges.", iconKey: "route", color: "from-[var(--cabzii-brand)] to-blue-500", image: IMG.outstation, href: "/chennai/outstation/chennai-to-bangalore", fare: "From ₹4,500" },
  { tag: "TEMPLE", title: "Chennai → Rameswaram", desc: "Pilgrimage cab with planned halts and round-trip options.", iconKey: "holiday", color: "from-amber-500 to-orange-400", image: IMG.temple, href: "/chennai/outstation/chennai-to-rameswaram", fare: "From ₹5,200" },
  { tag: "ONE WAY", title: "Bangalore → Tirupati", desc: "Early-morning darshan pickups from Bengaluru and airport.", iconKey: "holiday", color: "from-rose-500 to-pink-400", image: IMG.bengaluru, href: "/bengaluru/outstation/bengaluru-to-tirupati", fare: "From ₹4,800" },
  { tag: "AIRPORT", title: "Chennai Airport Taxi", desc: "Airport pickup and drop — share terminal and flight time.", iconKey: "airport", color: "from-indigo-500 to-violet-400", image: IMG.airport, href: "/chennai/airport-cab-booking", fare: "From ₹1,200" },
  { tag: "AIRPORT", title: "Bangalore Airport · 12 hr", desc: "Kempegowda pickup with a 12 hour / 120 km full-day package.", iconKey: "airport", color: "from-indigo-500 to-violet-400", image: IMG.bengaluru, href: "/cabs/results?serviceTripType=hourly&from=Kempegowda+International+Airport%2C+Bengaluru&to=Bengaluru&city=Bengaluru&packageHours=12", fare: "From ₹1,400" },
  { tag: "TOUR", title: "Madurai Temple Tour", desc: "Meenakshi temple circuit with a comfortable cab and driver.", iconKey: "holiday", color: "from-amber-500 to-orange-400", image: IMG.temple, href: "/holidays?category=pilgrimage&q=madurai", fare: "From ₹3,999" },
  { tag: "ONE WAY", title: "Chennai → Pondicherry", desc: "Coastal one-way cab — sedan, Innova and Tempo Traveller.", iconKey: "route", color: "from-emerald-500 to-teal-400", image: IMG.chennai, href: "/chennai/outstation/chennai-to-pondicherry", fare: "From ₹2,800" },
  { tag: "ONE WAY", title: "Bengaluru → Mysore", desc: "Palace city day trip or one-way drop with upfront fare.", iconKey: "route", color: "from-[var(--cabzii-brand)] to-blue-500", image: IMG.bengaluru, href: "/bengaluru/outstation/bengaluru-to-mysore", fare: "From ₹2,499" }
];

export const SHOWCASE_FALLBACKS = {
  offers: DOMESTIC_OFFERS,
  services: CITY_SERVICE_CARDS,
  routes: ROUTE_CARDS
};
