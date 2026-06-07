/** Public URL segment for catalog items — prefers SEO slug over Mongo id */
export function catalogPublicPath(item, basePath) {
  const key = item?.slug || item?._id || item?.id;
  if (!key) return basePath;
  const segment = String(key);
  return `${basePath.replace(/\/$/, "")}/${segment}`;
}

export function slugifyCatalogTitle(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function previewCatalogSlug(form, titleKey = "title", cityKey = "city") {
  const manual = String(form?.slug || "").trim();
  if (manual) return slugifyCatalogTitle(manual);
  const title = String(form?.[titleKey] || "").trim();
  const city = String(form?.[cityKey] || "").trim();
  return slugifyCatalogTitle([title, city].filter(Boolean).join("-"));
}
