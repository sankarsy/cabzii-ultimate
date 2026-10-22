import {
  LayoutDashboard,
  MapPin,
  Car,
  Plane,
  UserCircle,
  Route,
  Palmtree,
  Search,
  Newspaper,
  HelpCircle,
  Star,
  Tag,
  CalendarCheck,
  Building2,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  Shield,
  Bus,
  Layers
} from "lucide-react";

/**
 * City-based CMS sidebar. Every item maps to a live Mongo-backed screen.
 */
export const ADMIN_NAV_GROUPS = [
  {
    label: "CMS",
    items: [
      { key: "ops", label: "Dashboard", tab: "ops", icon: LayoutDashboard, vendorAllowed: true },
      { key: "cities", label: "Cities", tab: "cities", icon: MapPin },
      { key: "seoServices", label: "Cab Services", tab: "seoServices", icon: Car },
      { key: "cmsServices", label: "Services", tab: "cmsServices", icon: Layers },
      { key: "airportTaxi", label: "Airport Taxi", tab: "airportTaxi", icon: Plane },
      { key: "actingDriverCms", label: "Acting Driver Services", tab: "actingDriverCms", icon: UserCircle },
      { key: "seoRoutes", label: "Routes", tab: "seoRoutes", icon: Route },
      { key: "routeFares", label: "Route fares", tab: "routeFares", icon: Tag },
      { key: "packages", label: "Holiday Trips", tab: "packages", icon: Palmtree, vendorAllowed: true },
      { key: "seoPagesHub", label: "SEO Pages", tab: "seoPagesHub", icon: Search },
      { key: "blogs", label: "Blog", tab: "blogs", icon: Newspaper },
      { key: "faqs", label: "FAQs", tab: "enterprise", section: "faqs", icon: HelpCircle },
      { key: "reviewsHub", label: "Reviews & Testimonials", tab: "reviewsHub", icon: Star },
      { key: "offers", label: "Offers", tab: "master", section: "offers", icon: Tag }
    ]
  },
  {
    label: "Operations",
    items: [
      { key: "bookings", label: "Bookings", tab: "bookings", icon: CalendarCheck, vendorAllowed: true },
      { key: "vendors", label: "Cab Vendors", tab: "master", section: "vendors", icon: Building2 },
      { key: "cabs", label: "Vehicles", tab: "cabs", icon: Bus, vendorAllowed: true },
      { key: "actingDriversOps", label: "Acting Drivers", tab: "actingDriversOps", icon: UserCircle, vendorAllowed: true },
      { key: "customers", label: "Clients", tab: "customers", icon: Users },
      { key: "assignments", label: "Assignments", tab: "assignments", icon: ClipboardList, vendorAllowed: true },
      { key: "reports", label: "Reports", tab: "reports", icon: BarChart3, vendorAllowed: true }
    ]
  },
  {
    label: "Settings",
    items: [
      { key: "settingsGeneral", label: "General Settings", tab: "settings", section: "general", icon: Settings },
      { key: "settingsService", label: "Service Settings", tab: "settings", section: "callDriver", icon: Car },
      { key: "settingsSeo", label: "SEO Settings", tab: "settings", section: "homeSections", icon: Search },
      { key: "settingsRoles", label: "Roles & Permissions", tab: "settingsRoles", icon: Shield }
    ]
  }
];

export const ADMIN_TAB_KEYS = new Set(
  ADMIN_NAV_GROUPS.flatMap((group) => group.items.map((item) => item.tab)).concat([
    "master",
    "enterprise",
    "assignments",
    "reviews",
    "testimonials",
    "callDriverPage",
    "crm"
  ])
);

export const VENDOR_ALLOWED_TABS = new Set([
  "ops",
  "bookings",
  "cabs",
  "assignments",
  "packages",
  "reports",
  "actingDriversOps",
  "master"
]);

export function resolveNavTarget(item, isVendor) {
  if (isVendor && item.vendorTab) {
    return { tab: item.vendorTab, section: item.vendorSection || "" };
  }
  return { tab: item.tab || item.key, section: item.section || "" };
}

export function filterNavGroups(isSuperAdmin) {
  return ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => (isSuperAdmin ? true : item.vendorAllowed))
  })).filter((group) => group.items.length);
}
