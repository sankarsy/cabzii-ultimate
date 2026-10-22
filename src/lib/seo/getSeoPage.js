/**
 * CMS page resolver: Manual SEO → SeoCityPage CMS → generated city/service defaults.
 * Never overwrites stored CMS values; this is read-time merge only.
 */
import { applyCityCabCms, getCityCabData } from "../../data/city-cabs";
import { getActingDriverHubData } from "../../data/acting-driver-hubs";
import { seoCityPublicPath } from "../cityCabPaths";
import { fetchSeoCityPage } from "../serverCatalog";
import { fetchSiteSettings } from "../serverSiteSettings";
import { cityBySlug } from "./cities";
import { classifyCityHub } from "./indexation";
import { isKeepActingDriverCity, isKeepSeoCity } from "./keepLivePages";

function clampText(value, max) {
  const text = String(value || "").trim();
  if (!max || text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 1)).trim()}…`;
}

function parseRobots(robots) {
  const raw = String(robots || "").toLowerCase().trim();
  if (!raw) return null;
  return {
    noindex: raw.includes("noindex"),
    follow: !raw.includes("nofollow")
  };
}

function firstText(...values) {
  for (const value of values) {
    const text = String(value || "").trim();
    if (text) return text;
  }
  return "";
}

function overlaySeoMeta(data, cms) {
  if (!data || !cms) return data;
  const meta = cms.seoMeta && typeof cms.seoMeta === "object" ? cms.seoMeta : {};
  const title = firstText(meta.metaTitle, cms.seoTitle, data.title);
  const description = firstText(meta.metaDescription, cms.seoDescription, data.description);
  return {
    ...data,
    title: title || data.title,
    description: description || data.description,
    keywords: firstText(meta.keywords, cms.seo, data.keywords) || data.keywords,
    canonicalPath: firstText(meta.canonicalUrl) || data.path,
    ogTitle: firstText(meta.ogTitle) || title || data.title,
    ogDescription: firstText(meta.ogDescription) || description || data.description,
    ogImage: firstText(meta.ogImage, cms.image, cms.banner) || data.ogImage,
    twitterTitle: firstText(meta.twitterTitle, meta.ogTitle) || title || data.title,
    twitterDescription: firstText(meta.twitterDescription, meta.ogDescription) || description || data.description,
    schemaJson: firstText(cms.schemaJson, meta.schemaJson),
    robotsOverride: parseRobots(meta.robots)
  };
}

function overlaySnippet(data, snippet) {
  if (!data || !snippet || typeof snippet !== "object") return data;
  const faqs = Array.isArray(snippet.faqs)
    ? snippet.faqs.filter((row) => String(row?.question || "").trim() && String(row?.answer || "").trim())
    : [];
  const title = firstText(snippet.seoTitle, data.title);
  const description = firstText(snippet.seoDescription, data.description);
  return {
    ...data,
    title: title || data.title,
    description: description || data.description,
    keywords: firstText(snippet.seoKeywords, data.keywords) || data.keywords,
    h1: firstText(snippet.h1, data.h1) || data.h1,
    lead: firstText(snippet.intro, data.lead) || data.lead,
    extraBody: firstText(snippet.html, data.extraBody),
    faqs: faqs.length ? faqs : data.faqs,
    ogTitle: firstText(snippet.ogTitle, title) || data.ogTitle || data.title,
    ogDescription: firstText(snippet.ogDescription, description) || data.ogDescription || data.description
  };
}

function pickSnippet(pageSeo, path, legacyPath) {
  if (!pageSeo || typeof pageSeo !== "object") return null;
  if (path && pageSeo[path] && Object.keys(pageSeo[path]).length) return pageSeo[path];
  if (legacyPath && pageSeo[legacyPath] && Object.keys(pageSeo[legacyPath]).length) return pageSeo[legacyPath];
  return null;
}

/**
 * @param {{ type?: string, city?: string, service?: string, route?: string }} input
 */
export async function getSeoPage({ type, city, service } = {}) {
  const citySlug = String(city || "").toLowerCase();
  const cityRow = cityBySlug(citySlug);
  const pageType =
    type ||
    (service === "acting-driver" ? "acting-driver" : service === "airport-taxi" ? "airport-cab-booking" : "cab-booking");

  const generated = pageType === "acting-driver" ? getActingDriverHubData(citySlug) : getCityCabData(citySlug);
  const [cms, settings] = await Promise.all([
    citySlug ? fetchSeoCityPage(pageType, citySlug) : Promise.resolve(null),
    fetchSiteSettings()
  ]);

  const unpublished = Boolean(cms) && cms.published === false;
  const keepLive = pageType === "acting-driver" ? isKeepActingDriverCity(citySlug) : isKeepSeoCity(citySlug);
  const live = Boolean(cityRow) && Boolean(generated) && keepLive && !unpublished;

  const path = seoCityPublicPath(pageType, citySlug);
  const legacyPath = pageType === "acting-driver" ? `/${citySlug}/acting-driver` : `/${citySlug}`;
  const snippet = pickSnippet(settings?.pageSeo, path, legacyPath);

  let data = applyCityCabCms(generated, cms);
  data = overlaySeoMeta(data, cms);
  data = overlaySnippet(data, snippet);
  if (data) {
    data.path = path;
    data.title = clampText(data.title, 70);
    data.description = clampText(data.description, 160);
  }

  const indexPolicy = classifyCityHub(citySlug, pageType === "acting-driver" ? "acting-driver" : "cab-booking");
  const robots = data?.robotsOverride;
  const noindex = !keepLive || unpublished || (robots ? robots.noindex : !indexPolicy.indexable);
  const follow = robots ? robots.follow : indexPolicy.follow !== false;

  return {
    live,
    unpublished,
    city: cityRow,
    pageType,
    path,
    cms,
    data,
    noindex,
    follow,
    indexPolicy,
    canonicalIsAbsolute: /^https?:\/\//i.test(String(data?.canonicalPath || ""))
  };
}
