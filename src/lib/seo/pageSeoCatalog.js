import { HOME_SEO_TITLE } from "./constants";
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
    seoDescription:
      "Book airport taxi, local taxi, outstation taxi and one-way cabs in Chennai. Instant confirmation, professional drivers and affordable fares. Book online with Cabzii.",
    seoKeywords:
      "cab booking chennai, taxi service chennai, airport taxi chennai, outstation cab chennai, cabzii, cabzii.in"
  },
  {
    id: "site:cabs",
    path: "/cabs",
    type: "site",
    typeLabel: "Cabs listing",
    productName: "Book Cabs Online",
    seoTitle: formatSerpTitle("Cab Booking Chennai", "Airport Taxi, Local & Outstation Cabs"),
    seoDescription:
      "Book Maruti Dzire, Ertiga, Toyota Innova and tempo traveller with transparent fares. Outstation, airport and local cab booking on cabzii.in.",
    seoKeywords:
      "cab booking chennai, airport taxi, outstation cab, Maruti Dzire cab, Innova taxi, cabzii cabs"
  },
  {
    id: "site:drivers",
    path: "/drivers",
    type: "site",
    typeLabel: "Drivers listing",
    productName: "Acting Drivers",
    seoTitle: formatSerpTitle("Hire Acting Drivers Online", "Dzire, Ertiga, Innova"),
    seoDescription:
      "Hire acting drivers for your Maruti Dzire, Ertiga, Toyota Innova or Tempo Traveller. Same 4hr/8hr & outstation packages as cab booking on cabzii.in.",
    seoKeywords: "acting driver chennai, driver on hire, chauffeur service, cabzii acting driver"
  },
  {
    id: "site:holidays",
    path: "/holidays",
    type: "site",
    typeLabel: "Holiday packages",
    productName: "Holiday Packages",
    seoTitle: "Holiday Packages — Pilgrimage, Beach & Hill Trips",
    seoDescription:
      "Book pilgrimage, beach, heritage and family holiday packages on cabzii.in. Choose cab type — sedan, SUV, Innova or tempo.",
    seoKeywords: "holiday packages India, pilgrimage tour, Tirupati package, cabzii holidays"
  },
  {
    id: "site:blogs",
    path: "/blogs",
    type: "site",
    typeLabel: "Blog listing",
    productName: "Travel Blog",
    seoTitle: "Travel Blog — Cabs, Pilgrimage & Holiday Tips",
    seoDescription: "Guides on cab booking, pilgrimage packages, airport transfers and holiday planning on cabzii.in.",
    seoKeywords: "cab booking tips, pilgrimage travel guide, cabzii blog"
  }
];

export const STATIC_PAGE_SEO_BY_PATH = Object.fromEntries(
  STATIC_PAGE_SEO_LIST.map((p) => [p.path, p])
);
