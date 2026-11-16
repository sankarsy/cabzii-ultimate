import { ORG_PHONE } from "./seo/constants";

export const SITE_NAV = [
  { id: "cabs", label: "Cabs", href: "/cabs" },
  { id: "airport", label: "Airport", href: "/chennai/airport-cab-booking" },
  { id: "driver", label: "Driver", href: "/call-driver" }
];

export function siteNavHref(item) {
  return item.href;
}

export function isSiteNavActive(item, pathname) {
  const path = String(pathname || "").split("?")[0];
  if (item.id === "cabs") {
    return path === "/cabs" || path.startsWith("/cabs/") || path.startsWith("/cab-booking");
  }
  if (item.id === "airport") return path.includes("airport");
  if (item.id === "driver") return path.includes("call-driver") || path.includes("acting-driver");
  return false;
}

export const SITE_NAV_PHONE = ORG_PHONE;
