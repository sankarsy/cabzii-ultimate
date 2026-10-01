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
      routeDest("chennai-to-pondicherry-cab", "Pondicherry"),
      routeDest("chennai-to-tirupati-cab", "Tirupati"),
      routeDest("chennai-to-bangalore-cab", "Bangalore"),
      routeDest("chennai-to-madurai-cab", "Madurai"),
      routeDest("chennai-to-trichy-cab", "Trichy"),
      routeDest("chennai-to-vellore-cab", "Vellore")
    ]
  },
  {
    slug: "coimbatore",
    hint: "Hill and west Tamil Nadu taxi booking",
    children: [
      routeDest("coimbatore-to-ooty-cab", "Ooty"),
      routeDest("coimbatore-to-kodaikanal-cab", "Kodaikanal"),
      routeDest("coimbatore-to-madurai-cab", "Madurai"),
      routeDest("coimbatore-to-bengaluru-cab", "Bengaluru"),
      routeDest("coimbatore-to-tirupati-cab", "Tirupati")
    ]
  },
  {
    slug: "madurai",
    hint: "Temple city outstation and local cabs",
    children: [
      routeDest("madurai-to-rameswaram-cab", "Rameswaram"),
      routeDest("madurai-to-kodaikanal-cab", "Kodaikanal"),
      routeDest("madurai-to-chennai-cab", "Chennai"),
      routeDest("madurai-to-trichy-cab", "Trichy"),
      routeDest("madurai-to-tirupati-cab", "Tirupati")
    ]
  },
  {
    slug: "trichy",
    hint: "Central Tamil Nadu taxi booking",
    children: [
      routeDest("trichy-to-chennai-cab", "Chennai"),
      routeDest("trichy-to-tirupati-cab", "Tirupati"),
      dest("/services/outstation-cab/trichy", "Outstation cab"),
      dest("/trichy", "Local package")
    ]
  },
  {
    slug: "salem",
    hint: "North Tamil Nadu taxi booking",
    children: [
      routeDest("salem-to-chennai-cab", "Chennai"),
      routeDest("salem-to-tirupati-cab", "Tirupati"),
      dest("/services/outstation-cab/salem", "Outstation cab"),
      dest("/salem", "Local package")
    ]
  },
  {
    slug: "pondicherry",
    hint: "Puducherry taxi and outstation cabs",
    children: [
      routeDest("pondicherry-to-chennai-cab", "Chennai"),
      routeDest("pondicherry-to-tirupati-cab", "Tirupati"),
      dest("/services/outstation-cab/pondicherry", "Outstation cab"),
      dest("/chennai", "Chennai city cabs")
    ]
  },
  {
    slug: "tirupati",
    hint: "Pilgrimage taxi from Tirupati",
    children: [
      routeDest("tirupati-to-chennai-cab", "Chennai"),
      routeDest("bengaluru-to-tirupati-cab", "Bengaluru"),
      routeDest("kanchipuram-to-tirupati-cab", "Kanchipuram"),
      dest("/services/outstation-cab/tirupati", "Outstation cab")
    ]
  },
  {
    slug: "bengaluru",
    hint: "Karnataka taxi booking",
    children: [
      routeDest("bengaluru-to-mysore-cab", "Mysore"),
      routeDest("bengaluru-to-chennai-cab", "Chennai"),
      routeDest("bengaluru-to-tirupati-cab", "Tirupati"),
      routeDest("bengaluru-to-coimbatore-cab", "Coimbatore"),
      routeDest("bengaluru-to-pondicherry-cab", "Pondicherry")
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
      { label: "Airport taxi Chennai", href: "/chennai/airport-cab-booking", hint: "Pickup and drop", children: [] },
        { label: "Outstation cab Chennai", href: "/services/outstation-cab/chennai", hint: "One-way and round-trip", children: [] },
        { label: "Local package Chennai", href: "/chennai", hint: "4 hr / 8 hr hire", children: [] },
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
