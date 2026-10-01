const DRIVER_PATH = /(?:^|\/)(call-driver|acting-driver|drivers)(?:\/|$)/;
const VALID_TABS = new Set(["cabs", "drivers", "buses", "holidays"]);

export function resolveProductTab(tabParam) {
  const tab = String(tabParam || "").toLowerCase();
  return VALID_TABS.has(tab) ? tab : "cabs";
}

export function productTabFromPath(pathname, heroTab = "cabs") {
  const path = String(pathname || "").split("?")[0];
  if (path === "/" || path === "") return resolveProductTab(heroTab);
  if (DRIVER_PATH.test(path)) return "drivers";
  if (path.startsWith("/buses")) return "buses";
  if (path.startsWith("/holidays") || path.startsWith("/tour-packages") || path.startsWith("/packages")) {
    return "holidays";
  }
  return "cabs";
}

export function productTabHref(tabId) {
  if (tabId === "drivers") return "/?tab=drivers";
  if (tabId === "buses") return "/?tab=buses";
  if (tabId === "holidays") return "/?tab=holidays";
  return "/";
}
