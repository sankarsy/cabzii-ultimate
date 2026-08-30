import { SITE_STATS } from "./siteStats";

/** Homepage trust labels — only statements Cabzii can support without invented counts. */
export const MARKETING_STATS = {
  happyCustomers: SITE_STATS.happyCustomers ?? 0,
  happyCustomersLabel: "Upfront",
  tripsCompleted: SITE_STATS.tripsCompleted ?? 0,
  verifiedDrivers: SITE_STATS.verifiedDrivers ?? 0,
  citiesCovered: SITE_STATS.citiesCovered ?? 0,
  rating: SITE_STATS.rating || ""
};

export const WHY_STATS = [
  { value: "Upfront", label: "Fares shown" },
  { value: "Partner", label: "Vehicles" },
  { value: "Chennai", label: "Home market" },
  { value: "WhatsApp", label: "Trip updates" }
];

export const TRUST_COUNTERS = [
  {
    label: "Published tariff",
    value: 0,
    display: "Upfront",
    suffix: "",
    iconKey: "price",
    color: "text-sky-400",
    bg: "bg-blue-50"
  },
  {
    label: "Partner vehicles",
    value: 0,
    display: "Assigned",
    suffix: "",
    iconKey: "verified",
    color: "text-emerald-400",
    bg: "bg-emerald-50"
  },
  {
    label: "Driver for your own car",
    value: 0,
    display: "Call Driver",
    suffix: "",
    iconKey: "trips",
    color: "text-amber-400",
    bg: "bg-amber-50"
  },
  {
    label: "Trip help on WhatsApp",
    value: 0,
    display: "WhatsApp",
    suffix: "",
    iconKey: "support",
    color: "text-violet-400",
    bg: "bg-violet-50"
  }
];
