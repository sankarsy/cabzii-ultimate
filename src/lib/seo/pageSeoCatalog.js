import { HOME_SEO_DESCRIPTION, HOME_SEO_KEYWORDS, HOME_SEO_TITLE } from "./constants";
import { formatSerpTitle } from "./programmaticMeta";

/** Admin-managed static pages for Google / Meta ads campaigns. */
export const STATIC_PAGE_SEO_LIST = [
  {
    id: "site:home",
    path: "/",
    type: "site",
    typeLabel: "Homepage",
    productName: "Cabzii Home",
    seoTitle: HOME_SEO_TITLE,
    seoDescription: HOME_SEO_DESCRIPTION,
    seoKeywords: HOME_SEO_KEYWORDS.join(", ")
  },
  {
    id: "site:cabs",
    path: "/cabs",
    type: "site",
    typeLabel: "Cabs listing",
    productName: "Book Cabs Online",
    seoTitle: formatSerpTitle("Book Cabs Online", "Sedan, MPV, SUV, Van"),
    seoDescription:
      "Book a cab by category on Cabzii: hatchback, sedan, MPV, SUV, van and bus. Airport, local and outstation fares from the published tariff before you confirm.",
    seoKeywords: "book cabs online, sedan cab, hatchback cab, mpv cab, suv cab, van hire, bus hire, cabzii cabs"
  },
  {
    id: "site:acting-driver",
    path: "/acting-driver",
    type: "site",
    typeLabel: "Acting driver hub",
    productName: "Acting Driver",
    seoTitle: "Acting Driver | Hire a Driver for Your Own Car | Cabzii",
    seoDescription:
      "Choose a city acting-driver page, then book Call Driver for your own car. Local, outstation, airport chauffeur, monthly quote, corporate and valet.",
    seoKeywords: "acting driver by city, chauffeur on hire, driver for own car, cabzii acting driver"
  },
  {
    id: "site:services",
    path: "/services",
    type: "site",
    typeLabel: "Services hub",
    productName: "Services",
    seoTitle: "Cab & Driver Services by City | Cabzii",
    seoDescription:
      "Cab rental, car rental, airport taxi, outstation and one-way services by city on Cabzii. Open the city you travel from.",
    seoKeywords: "cab rental, airport taxi, outstation cab, car rental, cabzii services"
  },
  {
    id: "site:routes",
    path: "/routes",
    type: "site",
    typeLabel: "Routes hub",
    productName: "Routes",
    seoTitle: "Popular Cab Routes — One-Way & Outstation | Cabzii",
    seoDescription:
      "High-value cab routes such as Chennai–Tirupati and Chennai–Trichy with distance, fare context and WhatsApp support on Cabzii.",
    seoKeywords: "chennai to tirupati cab, one way cab, outstation routes, cabzii routes"
  },
  {
    id: "site:call-driver",
    path: "/call-driver",
    type: "site",
    typeLabel: "Call Driver",
    productName: "Call Driver Service",
    seoTitle: "Book Call Driver | Driver for Your Own Car | Cabzii",
    seoDescription:
      "Book a Cabzii Call Driver for your own car — local hours, outstation days, airport chauffeur, monthly quote and valet. Fares shown before you confirm.",
    seoKeywords:
      "book call driver, hire driver for own car, acting driver booking, airport chauffeur booking, monthly driver quote, cabzii call driver"
  },
  {
    id: "site:blogs",
    path: "/blogs",
    type: "site",
    typeLabel: "Blog listing",
    productName: "Cabzii Blog",
    seoTitle: "Cabzii Blog — Cabs, Airport Taxi & Acting Driver Tips",
    seoDescription: "Guides on cab booking, airport transfers, outstation trips and acting drivers on cabzii.in.",
    seoKeywords: "cab booking tips, airport taxi guide, acting driver tips, cabzii blog"
  },
  {
    id: "site:about",
    path: "/about",
    type: "site",
    typeLabel: "About page",
    productName: "About Cabzii",
    seoTitle: "About Cabzii — Cabs & Acting Driver in South India",
    seoDescription:
      "Cabzii is an UrbanWolf Technologies brand for chauffeur-driven cabs, airport taxi, outstation trips, acting drivers and bus tickets from Chennai across South India.",
    seoKeywords: "about cabzii, urbanwolf technologies, cab booking south india, cabzii.in about"
  },
  {
    id: "site:contact",
    path: "/contact",
    type: "site",
    typeLabel: "Contact page",
    productName: "Contact Cabzii",
    seoTitle: "Contact Cabzii — Call 9944197416, WhatsApp & Email",
    seoDescription:
      "Reach Cabzii for cab quotes, Call Driver and bus booking help. Call +91-9944197416, WhatsApp or email support@cabzii.com.",
    seoKeywords: "contact cabzii, cabzii phone 9944197416, cab booking support"
  },
  {
    id: "site:faq",
    path: "/faq",
    type: "site",
    typeLabel: "FAQ page",
    productName: "Cabzii FAQ",
    seoTitle: "FAQ — Cabs, Acting Driver & Bus Tickets | Cabzii",
    seoDescription:
      "Answers about cab booking on cabzii.in — fares, airport pickup, outstation trips, acting drivers, bus tickets, payment and cancellation.",
    seoKeywords: "cab booking faq, acting driver faq, bus booking faq, cabzii help"
  },
  {
    id: "site:testimonials",
    path: "/testimonials",
    type: "site",
    typeLabel: "Reviews page",
    productName: "Customer Reviews",
    seoTitle: "Customer Reviews & Ratings | Cabzii",
    seoDescription:
      "Read verified Cabzii customer reviews for cab booking, airport taxi, outstation trips and acting drivers across South India. Write a review after your trip.",
    seoKeywords: "cabzii reviews, cab booking reviews, taxi service ratings"
  },
  {
    id: "site:earn",
    path: "/earn",
    type: "site",
    typeLabel: "Earn with Cabzii",
    productName: "Earn with Cabzii",
    seoTitle: "Earn with Cabzii | Driver Attach, Vehicle Attach & Partner",
    seoDescription:
      "Attach your cab or join as a Cabzii driver in Chennai, Madurai, Trichy, Coimbatore, Vellore and more. Share city, vehicle, name and mobile on WhatsApp.",
    seoKeywords:
      "earn with cabzii, attach cab, driver attach, vehicle attach, lease vehicle, acting driver partner, cab partner login"
  },
  {
    id: "site:tariff",
    path: "/tariff",

    type: "site",
    typeLabel: "Tariff page",
    productName: "Cab Rental Tariff",
    seoTitle: "Cab Rental Tariff in Chennai | Car, Tempo Traveller & Mini Bus Rates | Cabzii",
    seoDescription:
      "Cabzii Chennai cab rental tariff — Swift Dzire from ₹1,200, Innova Crysta from ₹2,200, Tempo Traveller from ₹3,000, mini bus from ₹8,500. Extra km, extra hour and driver batta.",
    seoKeywords:
      "cab rental tariff chennai, tempo traveller rental chennai price, innova crysta rental chennai, mini bus rental chennai, cabzii tariff"
  },
  {
    id: "site:buses",
    path: "/buses",
    type: "site",
    typeLabel: "Bus booking",
    productName: "Book Bus Tickets",
    seoTitle: "Bus Tickets Online — AC Seater & Sleeper | Cabzii",
    seoDescription:
      "Search intercity bus tickets from Chennai and South India on Cabzii. Compare AC seater and sleeper, pick seats and boarding, then confirm. Fares shown before you pay.",
    seoKeywords: "bus booking, bus tickets online, chennai bus, ac sleeper, cabzii buses"
  }
];

export const STATIC_PAGE_SEO_BY_PATH = Object.fromEntries(
  STATIC_PAGE_SEO_LIST.map((p) => [p.path, p])
);
