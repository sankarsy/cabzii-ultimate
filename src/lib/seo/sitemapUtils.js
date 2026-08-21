/** Normalize sitemap URLs and drop duplicates (keeps highest priority entry). */
export function dedupeSitemapEntries(entries = []) {
  const seen = new Map();

  for (const entry of entries) {
    if (!entry?.url) continue;
    const key = entry.url.replace(/\?.*$/, "").replace(/\/+$/, "") || entry.url;
    const existing = seen.get(key);
    if (!existing || Number(entry.priority || 0) > Number(existing.priority || 0)) {
      seen.set(key, entry);
    }
  }

  return [...seen.values()];
}

export function isPublishedCatalogItem(item) {
  if (!item) return false;
  if (item.published === false) return false;
  if (item.isDeleted) return false;
  if (item.status === "draft" || item.status === "archived" || item.status === "inactive") return false;
  return Boolean(item.slug || item._id || item.id);
}

export function isPublishedBlogPost(post) {
  if (!post?.slug) return false;
  if (post.published === false) return false;
  if (post.status && post.status !== "published") return false;
  return true;
}
