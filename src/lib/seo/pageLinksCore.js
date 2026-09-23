export const PAGE_LINK_LAYOUTS = [
  { id: "cards", label: "Service cards" },
  { id: "city-routes", label: "City + destinations" },
  { id: "pills", label: "Compact chips" }
];

function uid(prefix = "g") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function cleanHref(href) {
  const raw = String(href || "").trim();
  if (!raw) return "";
  if (raw.startsWith("/") || /^https?:\/\//i.test(raw)) return raw;
  return `/${raw.replace(/^\/+/, "")}`;
}

function normalizeLink(item) {
  if (!item) return null;
  const href = cleanHref(item.href);
  const label = String(item.label || "").trim();
  if (!href || !label) return null;
  const children = Array.isArray(item.children) ? item.children.map(normalizeLink).filter(Boolean) : [];
  return {
    label,
    href,
    hint: String(item.hint || "").trim(),
    children
  };
}

export function normalizePageLinkGroups(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((group, index) => {
      const links = Array.isArray(group?.links) ? group.links.map(normalizeLink).filter(Boolean) : [];
      const title = String(group?.title || "").trim();
      if (!title && !links.length) return null;
      const layout = PAGE_LINK_LAYOUTS.some((l) => l.id === group?.layout) ? group.layout : "cards";
      return {
        id: String(group?.id || `group-${index + 1}`),
        title: title || "Related pages",
        intro: String(group?.intro || "").trim(),
        layout,
        links
      };
    })
    .filter(Boolean);
}

export function emptyPageLinkGroup() {
  return {
    id: uid("group"),
    title: "Our top cities",
    intro: "",
    layout: "city-routes",
    links: []
  };
}

export function emptyPageLink() {
  return { label: "", href: "", hint: "", children: [] };
}

export function pageLinkGroupCount(groups) {
  return normalizePageLinkGroups(groups).reduce((sum, group) => sum + group.links.length, 0);
}
