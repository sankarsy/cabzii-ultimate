/** Homepage card fallbacks — keep in sync with backend src/data/defaultHomeCards.js */

import { SEO_SCOPE_CITIES } from "../config/seo-scope";

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
    title: "Popular routes from Chennai",
    viewAllHref: "/services/outstation-cab/chennai",
    viewAllLabel: "View all →",
    ariaLabel: "Popular routes from Chennai",
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
    title: "Chennai → Tirupati one-way",
    desc: "Pay only for one side — transparent upfront fares with no hidden charges.",
    iconKey: "route",
    color: "from-emerald-500 to-teal-400",
    image: "/images/offers/offer-oneway.webp",
    href: "/chennai/outstation/chennai-to-tirupati",
    code: "ONEWAY"
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

const CITY_SERVICE_EXTRAS = {
  chennai: { desc: "Airport taxi, local hire and outstation cabs with upfront fares.", fare: "From ₹1,200", image: IMG.chennai, iconKey: "car", color: "from-[var(--cabzii-brand)] to-blue-500" },
  madurai: { desc: "Temple tours, airport taxi and outstation cabs in Madurai.", fare: "From ₹799", image: IMG.temple, iconKey: "holiday", color: "from-rose-500 to-pink-400" },
  tirupati: { desc: "Darshan cabs, airport taxi and outstation returns from Tirupati.", fare: "From ₹899", image: IMG.temple, iconKey: "holiday", color: "from-rose-500 to-pink-400" },
  trichy: { desc: "Airport drop, local taxi and one-way cabs from Trichy.", fare: "From ₹749", image: IMG.route, iconKey: "route", color: "from-slate-700 to-slate-500" },
  coimbatore: { desc: "Outstation and local taxi hire for Coimbatore and hill stations.", fare: "From ₹799", image: IMG.outstation, iconKey: "car", color: "from-amber-500 to-orange-400" },
  vellore: { desc: "Local taxi, hospital drops and outstation cabs from Vellore.", fare: "From ₹699", image: IMG.driver, iconKey: "driver", color: "from-slate-700 to-slate-500" },
  pondicherry: { desc: "White Town, Auroville and ECR cabs with local and outstation hire.", fare: "From ₹899", image: IMG.chennai, iconKey: "car", color: "from-sky-500 to-cyan-400" },
  kanchipuram: { desc: "Temple town cabs, local hire and outstation from Kanchipuram.", fare: "From ₹699", image: IMG.temple, iconKey: "holiday", color: "from-rose-500 to-pink-400" },
  ooty: { desc: "Hill-station taxi, local hire and outstation cabs in Ooty.", fare: "From ₹999", image: IMG.outstation, iconKey: "car", color: "from-emerald-500 to-teal-400" },
  kodaikanal: { desc: "Hill-station taxi and outstation cabs in Kodaikanal.", fare: "From ₹999", image: IMG.outstation, iconKey: "car", color: "from-emerald-500 to-teal-400" }
};

export const CITY_SERVICE_CARDS = SEO_SCOPE_CITIES.map((city) => {
  const extra = CITY_SERVICE_EXTRAS[city.slug] || {
    desc: `Airport taxi, local hire and outstation cabs in ${city.name}.`,
    fare: "From ₹699",
    image: IMG.chennai,
    iconKey: "car",
    color: "from-[var(--cabzii-brand)] to-blue-500"
  };
  return {
    tag: city.name.toUpperCase(),
    title: `Cab services in ${city.name}`,
    desc: extra.desc,
    iconKey: extra.iconKey,
    color: extra.color,
    image: extra.image,
    href: `/cab-booking/${city.slug}`,
    fare: extra.fare
  };
});

export const ROUTE_CARDS = [
  { tag: "ONE WAY", title: "Chennai → Tirupati", desc: "Darshan one-way cab with flexible pickup.", iconKey: "holiday", color: "from-rose-500 to-pink-400", image: IMG.temple, href: "/chennai/outstation/chennai-to-tirupati", fare: "From ₹3,250" },
  { tag: "ONE WAY", title: "Chennai → Pondicherry", desc: "ECR one-way cab with flexible pickup.", iconKey: "route", color: "from-sky-500 to-cyan-400", image: IMG.chennai, href: "/chennai/outstation/chennai-to-pondicherry", fare: "From ₹2,899" },
  { tag: "ONE WAY", title: "Chennai → Bengaluru", desc: "Highway one-way cab with upfront fares.", iconKey: "route", color: "from-emerald-500 to-teal-400", image: IMG.bengaluru, href: "/chennai/outstation/chennai-to-bengaluru", fare: "From ₹5,499" },
  { tag: "ONE WAY", title: "Chennai → Madurai", desc: "Temple-city one-way cab from Chennai.", iconKey: "holiday", color: "from-amber-500 to-orange-400", image: IMG.temple, href: "/chennai/outstation/chennai-to-madurai", fare: "From ₹6,999" },
  { tag: "ONE WAY", title: "Chennai → Coimbatore", desc: "West Tamil Nadu one-way cab from Chennai.", iconKey: "route", color: "from-slate-700 to-slate-500", image: IMG.outstation, href: "/chennai/outstation/chennai-to-coimbatore", fare: "From ₹7,499" },
  { tag: "ONE WAY", title: "Chennai → Trichy", desc: "One-way cab from Chennai to Trichy.", iconKey: "route", color: "from-slate-700 to-slate-500", image: IMG.route, href: "/chennai/outstation/chennai-to-trichy", fare: "From ₹5,499" }
];

export const SHOWCASE_FALLBACKS = {
  offers: DOMESTIC_OFFERS,
  services: CITY_SERVICE_CARDS,
  routes: ROUTE_CARDS
};
