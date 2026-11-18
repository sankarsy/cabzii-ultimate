import { cityCabLandingPath, actingDriverLandingPath } from "../cityCabPaths";
import { cityBySlug } from "./cities";
import { relatedLinksForPage, routeLinksForCity } from "./internalLinks";
import { normalizePageLinkGroups } from "./pageLinksCore";
import { routePublicPath } from "./outstationPaths";

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

function routeDest(slug, label) {
  return dest(routePublicPath(slug), label);
}

/** Unique nested destinations per city — no copied route lists across hubs. */
const HOME_CITY_HUBS = [
  {
    slug: "chennai",
    hint: "Maduravoyal HQ · city-wide pickup",
    children: [
      routeDest("chennai-to-tirupati-cab", "Tirupati"),
      dest("/services/outstation-cab/chennai", "Outstation cab"),
      dest("/chennai/airport-cab-booking", "Airport taxi"),
      dest("/acting-driver/chennai", "Acting driver")
    ]
  },
  {
    slug: "madurai",
    hint: "Temple city local and outstation cabs",
    children: [
      dest("/services/outstation-cab/madurai", "Outstation cab"),
      dest("/services/airport-taxi/madurai", "Airport taxi"),
      dest("/acting-driver/madurai", "Acting driver")
    ]
  },
  {
    slug: "tirupati",
    hint: "Pilgrimage taxi from Tirupati",
    children: [
      routeDest("chennai-to-tirupati-cab", "From Chennai"),
      dest("/services/outstation-cab/tirupati", "Outstation cab"),
      dest("/services/airport-taxi/tirupati", "Airport taxi")
    ]
  },
  {
    slug: "trichy",
    hint: "Central Tamil Nadu taxi booking",
    children: [
      dest("/services/outstation-cab/trichy", "Outstation cab"),
      dest("/services/airport-taxi/trichy", "Airport taxi"),
      dest("/acting-driver/trichy", "Acting driver")
    ]
  },
  {
    slug: "coimbatore",
    hint: "West Tamil Nadu taxi booking",
    children: [
      dest("/services/outstation-cab/coimbatore", "Outstation cab"),
      dest("/services/airport-taxi/coimbatore", "Airport taxi"),
      dest("/acting-driver/coimbatore", "Acting driver")
    ]
  },
  {
    slug: "vellore",
    hint: "CMC, Katpadi and outstation cabs",
    children: [
      dest("/services/outstation-cab/vellore", "Outstation cab"),
      dest("/services/airport-taxi/vellore", "Airport transfer"),
      dest("/acting-driver/vellore", "Acting driver")
    ]
  },
  {
    slug: "kanchipuram",
    hint: "Temple town — no airport taxi",
    children: [
      dest("/services/outstation-cab/kanchipuram", "Outstation cab"),
      dest("/acting-driver/kanchipuram", "Acting driver")
    ]
  },
  {
    slug: "kodaikanal",
    hint: "Hill station — Madurai ghat, no airport",
    children: [
      dest("/services/outstation-cab/kodaikanal", "Outstation cab"),
      dest("/acting-driver/kodaikanal", "Acting driver")
    ]
  },
  {
    slug: "ooty",
    hint: "Nilgiris — Coimbatore ghat, no airport",
    children: [
      dest("/services/outstation-cab/ooty", "Outstation cab"),
      dest("/acting-driver/ooty", "Acting driver")
    ]
  },
  {
    slug: "pondicherry",
    hint: "White Town, Auroville and PNY",
    children: [
      dest("/services/outstation-cab/pondicherry", "Outstation cab"),
      dest("/services/airport-taxi/pondicherry", "Airport taxi"),
      dest("/acting-driver/pondicherry", "Acting driver")
    ]
  },
  {
    slug: "sabarimala",
    hint: "Ayyappa shrine — Pamba drop, no airport",
    children: [
      dest("/services/outstation-cab/sabarimala", "Outstation cab"),
      dest("/acting-driver/sabarimala", "Acting driver"),
      dest("/cab-booking/ayyappankovil", "Ayyappan Kovil")
    ]
  },
  {
    slug: "ayyappankovil",
    hint: "Idukki Ayyappa temple — no airport",
    children: [
      dest("/services/outstation-cab/ayyappankovil", "Outstation cab"),
      dest("/acting-driver/ayyappankovil", "Acting driver"),
      dest("/cab-booking/sabarimala", "Sabarimala")
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

function liveOutstationRouteLinks(citySlug = "chennai", limit = 8) {
  return routeLinksForCity(citySlug, limit).map((item) => ({
    ...item,
    hint: "",
    children: []
  }));
}

function withLiveOutstationRoutes(groups, citySlug = "chennai") {
  const routes = liveOutstationRouteLinks(citySlug, 8);
  if (!routes.length) return groups;
  return groups.map((group) => {
    const id = String(group.id || "").toLowerCase();
    const title = String(group.title || "").toLowerCase();
    if (id === "top-routes" || title.includes("outstation route")) {
      return { ...group, links: routes };
    }
    return group;
  });
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
      { label: "Airport taxi Chennai", href: "/chennai/airport-cab-booking", hint: "Pickup and drop", children: [] },
        { label: "Outstation cab Chennai", href: "/services/outstation-cab/chennai", hint: "One-way and round-trip", children: [] },
        { label: "Local package Chennai", href: "/cab-booking/chennai", hint: "4 hr / 8 hr hire", children: [] },
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
      links: liveOutstationRouteLinks("chennai", 8)
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
      intro: "More ways to book cabs, drivers and routes on Cabzii.",
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
  const groups = custom.length ? custom : defaultPageLinkGroups(path, pageKind, citySlug);
  if (path === "/" || pageKind === "home") return withLiveOutstationRoutes(groups, "chennai");
  return groups;
}
