const DRIVER_PATH = /(?:^|\/)(call-driver|acting-driver|drivers)(?:\/|$)/;
const VALID_TABS = new Set(["cabs", "drivers", "buses"]);

export function resolveProductTab(tabParam) {
  const tab = String(tabParam || "").toLowerCase();
  return VALID_TABS.has(tab) ? tab : "cabs";
}

export function productTabFromPath(pathname, heroTab = "cabs") {
  const path = String(pathname || "").split("?")[0];
  if (path === "/" || path === "") return resolveProductTab(heroTab);
  if (DRIVER_PATH.test(path)) return "drivers";
  if (path.startsWith("/buses")) return "buses";
  if (path.startsWith("/earn")) return "";
  return "cabs";
}

export function productTabHref(tabId, citySlug = "") {
  if (tabId === "drivers") {
    const slug = String(citySlug || "").toLowerCase();
    if (slug && slug !== "chennai") return `/call-driver/${slug}`;
    return "/call-driver";
  }
  if (tabId === "buses") return "/buses";
  return "/";
}
