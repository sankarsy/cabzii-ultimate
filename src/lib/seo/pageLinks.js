import { cityCabLandingPath, actingDriverLandingPath } from "../cityCabPaths";
import { cityBySlug } from "./cities";
import { relatedLinksForPage, routeLinksForCity } from "./internalLinks";
import { normalizePageLinkGroups } from "./pageLinksCore";

export {
  PAGE_LINK_LAYOUTS,
  emptyPageLinkGroup,
  emptyPageLink,
  pageLinkGroupCount
} from "./pageLinksCore";
export { normalizePageLinkGroups };

function dest(href, label) {
  return { label, href, hint: "", children: [] };
}

/** Unique nested destinations per city — no copied route lists across hubs. */
const HOME_CITY_HUBS = [
  {
    slug: "chennai",
    hint: "Maduravoyal HQ · city-wide pickup",
    children: [
      dest("/routes/chennai-to-pondicherry-cab", "Pondicherry"),
      dest("/routes/chennai-to-tirupati-cab", "Tirupati"),
      dest("/routes/chennai-to-bangalore-cab", "Bangalore"),
      dest("/routes/chennai-to-madurai-cab", "Madurai"),
      dest("/routes/chennai-to-trichy-cab", "Trichy"),
      dest("/routes/chennai-to-vellore-cab", "Vellore")
    ]
  },
  {
    slug: "coimbatore",
    hint: "Hill and west Tamil Nadu taxi booking",
    children: [
      dest("/routes/coimbatore-to-ooty-cab", "Ooty"),
      dest("/routes/coimbatore-to-kodaikanal-cab", "Kodaikanal"),
      dest("/routes/coimbatore-to-madurai-cab", "Madurai"),
      dest("/routes/coimbatore-to-bengaluru-cab", "Bengaluru"),
      dest("/routes/coimbatore-to-tirupati-cab", "Tirupati")
    ]
  },
  {
    slug: "madurai",
    hint: "Temple city outstation and local cabs",
    children: [
      dest("/routes/madurai-to-rameswaram-cab", "Rameswaram"),
      dest("/routes/madurai-to-kodaikanal-cab", "Kodaikanal"),
      dest("/routes/madurai-to-chennai-cab", "Chennai"),
      dest("/routes/madurai-to-trichy-cab", "Trichy"),
      dest("/routes/madurai-to-tirupati-cab", "Tirupati")
    ]
  },
  {
    slug: "trichy",
    hint: "Central Tamil Nadu taxi booking",
    children: [
      dest("/routes/trichy-to-chennai-cab", "Chennai"),
      dest("/routes/trichy-to-tirupati-cab", "Tirupati"),
      dest("/services/outstation-cab/trichy", "Outstation cab"),
      dest("/services/hourly-rental/trichy", "Local package")
    ]
  },
  {
    slug: "salem",
    hint: "North Tamil Nadu taxi booking",
    children: [
      dest("/routes/salem-to-chennai-cab", "Chennai"),
      dest("/routes/salem-to-tirupati-cab", "Tirupati"),
      dest("/services/outstation-cab/salem", "Outstation cab"),
      dest("/services/hourly-rental/salem", "Local package")
    ]
  },
  {
    slug: "pondicherry",
    hint: "Puducherry taxi and outstation cabs",
    children: [
      dest("/routes/pondicherry-to-chennai-cab", "Chennai"),
      dest("/routes/pondicherry-to-tirupati-cab", "Tirupati"),
      dest("/services/outstation-cab/pondicherry", "Outstation cab"),
      dest("/car-rental/chennai-city-cabs", "Chennai city cabs")
    ]
  },
  {
    slug: "tirupati",
    hint: "Pilgrimage taxi from Tirupati",
    children: [
      dest("/routes/tirupati-to-chennai-cab", "Chennai"),
      dest("/routes/bengaluru-to-tirupati-cab", "Bengaluru"),
      dest("/routes/kanchipuram-to-tirupati-cab", "Kanchipuram"),
      dest("/services/outstation-cab/tirupati", "Outstation cab")
    ]
  },
  {
    slug: "bengaluru",
    hint: "Karnataka taxi booking",
    children: [
      dest("/routes/bengaluru-to-mysore-cab", "Mysore"),
      dest("/routes/bengaluru-to-chennai-cab", "Chennai"),
      dest("/routes/bengaluru-to-tirupati-cab", "Tirupati"),
      dest("/routes/bengaluru-to-coimbatore-cab", "Coimbatore"),
      dest("/routes/bengaluru-to-pondicherry-cab", "Pondicherry")
    ]
  }
];

function cityHubLink(hub) {
  const city = cityBySlug(hub.slug);
  if (!city) return null;
  return {
    label: `Cab booking in ${city.name}`,
    href: cityCabLandingPath(city.slug),
    hint: hub.hint,
    children: hub.children || []
  };
}

/** FastTrack-style home hubs — unique cities, nested destinations, no duplicate headings. */
export function defaultHomePageLinkGroups() {
  return [
    {
      id: "chennai-services",
      title: "Our services",
      intro: "Airport, outstation, local packages and acting driver from Chennai.",
      layout: "cards",
      links: [
        { label: "Airport taxi Chennai", href: "/services/airport-taxi/chennai", hint: "Pickup and drop", children: [] },
        { label: "Outstation cab Chennai", href: "/services/outstation-cab/chennai", hint: "One-way and round-trip", children: [] },
        { label: "Local package Chennai", href: "/services/hourly-rental/chennai", hint: "4 hr / 8 hr hire", children: [] },
        { label: "Acting driver Chennai", href: actingDriverLandingPath("chennai"), hint: "Driver for your car", children: [] }
      ]
    },
    {
      id: "top-cities",
      title: "Our top cities",
      intro: "City cab booking pages with unique outstation destinations under each hub.",
      layout: "city-routes",
      links: HOME_CITY_HUBS.map(cityHubLink).filter(Boolean)
    },
    {
      id: "top-routes",
      title: "Top outstation routes",
      intro: "One-way and round-trip cabs from Chennai.",
      layout: "cards",
      links: routeLinksForCity("chennai", 8).map((item) => ({
        ...item,
        hint: "Fares shown before you confirm",
        children: []
      }))
    },
    {
      id: "more",
      title: "More on Cabzii",
      intro: "",
      layout: "pills",
      links: [
        { label: "Chennai tariff", href: "/tariff", hint: "", children: [] },
        { label: "All cabs", href: "/cabs", hint: "", children: [] },
        { label: "Call Driver", href: "/call-driver", hint: "", children: [] },
        { label: "Tours", href: "/holidays", hint: "", children: [] },
        { label: "All routes", href: "/routes", hint: "", children: [] },
        { label: "Services", href: "/services", hint: "", children: [] },
        { label: "Blog", href: "/blogs", hint: "", children: [] }
      ]
    }
  ];
}

export function defaultRelatedPageLinkGroups(pageKind = "cabs", citySlug = "") {
  return [
    {
      id: "related",
      title: "Related pages",
      intro: "More ways to book cabs, drivers and tours on Cabzii.",
      layout: "pills",
      links: relatedLinksForPage(pageKind, citySlug).map((item) => ({
        ...item,
        hint: "",
        children: []
      }))
    }
  ];
}

export function defaultPageLinkGroups(path = "/", pageKind = "", citySlug = "") {
  if (path === "/" || pageKind === "home") return defaultHomePageLinkGroups();
  return defaultRelatedPageLinkGroups(pageKind || "cabs", citySlug);
}

export function resolvePageLinkGroups(stored, path = "/", pageKind = "", citySlug = "") {
  const custom = normalizePageLinkGroups(stored);
  if (custom.length) return custom;
  return defaultPageLinkGroups(path, pageKind, citySlug);
}
