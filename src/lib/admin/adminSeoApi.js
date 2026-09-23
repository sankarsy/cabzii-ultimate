import { CATALOG_TABS } from "../adminCatalogConfig";
import { actingDriverLandingPath, cityCabLandingPath } from "../cityCabPaths";
import { normalizePageLinkGroups } from "../seo/pageLinksCore";

const API_MAP = {
  cab: "cabs",
  driver: "drivers",
  tour: "packages",
  blog: "blogs",
  service: "seoServices",
  route: "seoRoutes",
  city: "seoCityPages",
  "acting-driver": "seoCityPages",
  landing: "seoLandings"
};

function authHeaders(token) {
  return { authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || data?.error || "Request failed");
  }
  return data;
}

export function normalizeFaqs(faqs) {
  if (!Array.isArray(faqs)) return [];
  return faqs
    .map((row) => ({
      question: String(row?.question || "").trim(),
      answer: String(row?.answer || "").trim()
    }))
    .filter((row) => row.question);
}

/** Fetch full record before partial SEO update. */
async function fetchRecord(row, token) {
  const tabKey = API_MAP[row.type] || row.adminTab;
  const tab = CATALOG_TABS[tabKey];
  if (!tab?.base || !row.editId || String(row.editId).startsWith("static:")) return null;

  const res = await fetch(`${tab.base}/${row.editId}?admin=1`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  const data = await parseJson(res);
  return data?.data || data;
}

function rankingFields(form) {
  return {
    seoTitle: form.seoTitle?.trim() || "",
    seoDescription: form.seoDescription?.trim() || "",
    seo: form.seoKeywords?.trim() || "",
    h1: form.productName?.trim() || form.h1?.trim() || "",
    intro: form.intro?.trim() || "",
    body: form.html || form.body || "",
    faqs: normalizeFaqs(form.faqs)
  };
}

function seoPayload(form, row) {
  const base = rankingFields(form);

  if (row.type === "cab") return { seoTitle: base.seoTitle, seoDescription: base.seoDescription, seo: base.seo, title: base.h1 || undefined };
  if (row.type === "driver") return { seoTitle: base.seoTitle, seoDescription: base.seoDescription, seo: base.seo, name: base.h1 || undefined };
  if (row.type === "tour") return { seoTitle: base.seoTitle, seoDescription: base.seoDescription, seo: base.seo, name: base.h1 || undefined };
  if (row.type === "blog") return { seoTitle: base.seoTitle, seoDescription: base.seoDescription, seo: base.seo, title: base.h1 || undefined };
  if (row.type === "city" || row.type === "acting-driver") {
    return {
      seoTitle: base.seoTitle,
      seoDescription: base.seoDescription,
      seo: base.seo,
      h1: base.h1 || undefined,
      body: base.body,
      faqs: base.faqs
    };
  }
  if (row.type === "service") {
    return {
      seoTitle: base.seoTitle,
      seoDescription: base.seoDescription,
      seo: base.seo,
      name: base.h1 || undefined,
      title: base.h1 || undefined,
      body: base.body
    };
  }
  if (row.type === "route") {
    return {
      seoTitle: base.seoTitle,
      seoDescription: base.seoDescription,
      seo: base.seo,
      title: base.h1 || undefined,
      body: base.body,
      faqs: base.faqs
    };
  }
  if (row.type === "landing") {
    return {
      slug: row.landingSlug || row.path?.split("/").pop() || "",
      h1: base.h1,
      intro: base.intro,
      body: base.body,
      seoTitle: base.seoTitle,
      seoDescription: base.seoDescription,
      seo: base.seo,
      faqs: base.faqs,
      ctaHref: form.ctaHref?.trim() || "/cabs",
      ctaLabel: form.ctaLabel?.trim() || "Book now",
      published: form.published !== false
    };
  }
  return { seoTitle: base.seoTitle, seoDescription: base.seoDescription, seo: base.seo };
}

function createPayload(form, row) {
  const seo = seoPayload(form, row);
  if (row.type === "service") {
    const slug = row.serviceSlug || row.path?.split("/")[2] || "";
    return {
      slug,
      name: form.productName?.trim() || row.productName,
      seoTitle: seo.seoTitle,
      seoDescription: seo.seoDescription,
      seo: seo.seo,
      body: seo.body || "",
      published: true,
      allCities: true
    };
  }
  if (row.type === "route") {
    const slug = row.routeSlug || row.path?.split("/")[2] || "";
    return {
      slug,
      title: form.productName?.trim() || row.productName,
      seoTitle: seo.seoTitle,
      seoDescription: seo.seoDescription,
      seo: seo.seo,
      body: seo.body || "",
      faqs: seo.faqs || [],
      published: true
    };
  }
  if (row.type === "city" || row.type === "acting-driver") {
    return {
      pageType: row.pageType || (row.type === "acting-driver" ? "acting-driver" : "cab-booking"),
      citySlug: row.citySlug || "",
      h1: form.productName?.trim() || row.productName,
      seoTitle: seo.seoTitle,
      seoDescription: seo.seoDescription,
      seo: seo.seo,
      body: seo.body || "",
      faqs: seo.faqs || [],
      published: true
    };
  }
  return seo;
}

function pageSeoFields(form, extra = {}) {
  return {
    productName: form.productName?.trim() || extra.productName || "",
    h1: form.productName?.trim() || form.h1?.trim() || extra.h1 || "",
    seoTitle: form.seoTitle?.trim() || extra.seoTitle || "",
    seoDescription: form.seoDescription?.trim() || extra.seoDescription || "",
    seoKeywords: form.seoKeywords?.trim() || extra.seoKeywords || "",
    intro: form.intro?.trim() || extra.intro || "",
    html: form.html || form.body || extra.html || "",
    faqs: normalizeFaqs(form.faqs),
    pageLinks: normalizePageLinkGroups(form.pageLinks)
  };
}

async function savePageSeoMap({ token, pageSeo, path, fields }) {
  const nextPageSeo = {
    ...pageSeo,
    [path]: {
      ...(pageSeo[path] || {}),
      ...fields
    }
  };
  const res = await fetch("/api/site-settings", {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ pageSeo: nextPageSeo })
  });
  const data = await parseJson(res);
  return { data: data?.data, pageSeo: nextPageSeo };
}

export async function saveSeoSnippet({ row, form, token, pageSeo = {} }) {
  const fields = pageSeoFields(form);

  if (row.type === "site") {
    return savePageSeoMap({ token, pageSeo, path: row.path, fields });
  }

  if (row.type === "landing") {
    const tab = CATALOG_TABS.seoLandings;
    const payload = seoPayload(form, row);
    const isNew = !row.editId || String(row.editId).startsWith("static:");
    const res = await fetch(isNew ? tab.base : `${tab.base}/${row.editId}`, {
      method: isNew ? "POST" : "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(payload)
    });
    const saved = await parseJson(res);
    const path = saved?.data?.publicPath || row.path;
    const links = await savePageSeoMap({ token, pageSeo, path, fields });
    return { ...saved, pageSeo: links.pageSeo };
  }

  const tabKey = API_MAP[row.type] || row.adminTab;
  const tab = CATALOG_TABS[tabKey];
  if (!tab?.base) throw new Error("Unknown page type.");

  const isStatic = !row.editId || String(row.editId).startsWith("static:");
  if (isStatic && (row.type === "service" || row.type === "route" || row.type === "city" || row.type === "acting-driver")) {
    const res = await fetch(tab.base, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(createPayload(form, row))
    });
    const created = await parseJson(res);
    const links = await savePageSeoMap({ token, pageSeo, path: row.path, fields });
    return { ...created, pageSeo: links.pageSeo };
  }

  const existing = await fetchRecord(row, token);
  if (!existing) throw new Error("Could not load record to update.");

  const merged = { ...existing, ...seoPayload(form, row) };
  const res = await fetch(`${tab.base}/${row.editId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(merged)
  });
  const updated = await parseJson(res);
  const links = await savePageSeoMap({ token, pageSeo, path: row.path, fields });
  return { ...updated, pageSeo: links.pageSeo };
}

export async function createRankingSeoPage({ kind, form, token, pageSeo = {} }) {
  const h1 = form.productName?.trim() || form.h1?.trim() || "";
  const seoTitle = form.seoTitle?.trim() || "";
  const seoDescription = form.seoDescription?.trim() || "";
  const seoKeywords = form.seoKeywords?.trim() || "";
  const faqs = normalizeFaqs(form.faqs);
  const body = form.html || form.body || "";
  const intro = form.intro?.trim() || "";

  if (kind === "landing") {
    const res = await fetch("/api/seo-landings", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        slug: form.slug?.trim() || "",
        h1,
        intro,
        body,
        seoTitle,
        seoDescription,
        seo: seoKeywords,
        faqs,
        ctaHref: form.ctaHref?.trim() || "/cabs",
        ctaLabel: form.ctaLabel?.trim() || "Book now",
        published: true
      })
    });
    const created = await parseJson(res);
    const path = created?.data?.publicPath;
    if (!path) return created;
    const links = await savePageSeoMap({
      token,
      pageSeo,
      path,
      fields: pageSeoFields(form, { productName: h1, h1, seoTitle, seoDescription, seoKeywords })
    });
    return { ...created, pageSeo: links.pageSeo, path };
  }

  if (kind === "city" || kind === "acting-driver") {
    const citySlug = String(form.citySlug || "").trim().toLowerCase();
    const pageType = kind === "acting-driver" ? "acting-driver" : "cab-booking";
    const res = await fetch("/api/seo-city-pages", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        pageType,
        citySlug,
        h1,
        seoTitle,
        seoDescription,
        seo: seoKeywords,
        body,
        faqs,
        published: true
      })
    });
    const created = await parseJson(res);
    const path = created?.data?.publicPath || (kind === "acting-driver" ? actingDriverLandingPath(citySlug) : cityCabLandingPath(citySlug));
    const links = await savePageSeoMap({
      token,
      pageSeo,
      path,
      fields: pageSeoFields(form, { productName: h1, h1, seoTitle, seoDescription, seoKeywords })
    });
    return { ...created, pageSeo: links.pageSeo, path };
  }

  if (kind === "service") {
    const res = await fetch("/api/seo-services", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        slug: form.slug?.trim() || "",
        name: h1,
        seoTitle,
        seoDescription,
        seo: seoKeywords,
        body,
        published: true,
        allCities: true
      })
    });
    const created = await parseJson(res);
    const slug = created?.data?.slug || form.slug;
    const path = `/services/${slug}/chennai`;
    const links = await savePageSeoMap({
      token,
      pageSeo,
      path,
      fields: pageSeoFields(form, { productName: h1, h1, seoTitle, seoDescription, seoKeywords })
    });
    return { ...created, pageSeo: links.pageSeo, path };
  }

  if (kind === "route") {
    const res = await fetch("/api/seo-routes", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        slug: form.slug?.trim() || "",
        title: h1,
        fromCitySlug: form.fromCitySlug?.trim() || "",
        toCitySlug: form.toCitySlug?.trim() || "",
        seoTitle,
        seoDescription,
        seo: seoKeywords,
        body,
        faqs,
        published: true
      })
    });
    const created = await parseJson(res);
    const slug = created?.data?.slug || form.slug;
    const path = `/routes/${slug}`;
    const links = await savePageSeoMap({
      token,
      pageSeo,
      path,
      fields: pageSeoFields(form, { productName: h1, h1, seoTitle, seoDescription, seoKeywords })
    });
    return { ...created, pageSeo: links.pageSeo, path };
  }

  throw new Error("Unknown page type.");
}

export async function deleteSeoSnippet({ row, token, pageSeo = {} }) {
  if (row.type === "site") {
    throw new Error("Homepage and listing pages cannot be deleted — clear SEO fields to use defaults.");
  }
  if (!row.canDelete || !row.editId || String(row.editId).startsWith("static:")) {
    throw new Error("This page uses a built-in template. Edit SEO to override, or delete only saved CMS rows.");
  }

  const tabKey = API_MAP[row.type] || row.adminTab;
  const tab = CATALOG_TABS[tabKey];
  if (!tab?.base) throw new Error("Unknown page type.");

  const res = await fetch(`${tab.base}/${row.editId}`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${token}` }
  });
  const deleted = await parseJson(res);
  if (row.path && pageSeo[row.path]) {
    const next = { ...pageSeo };
    delete next[row.path];
    await fetch("/api/site-settings", {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({ pageSeo: next })
    });
    return { ...deleted, pageSeo: next };
  }
  return deleted;
}

export async function clearSitePageSeo({ row, token, pageSeo = {} }) {
  if (row.type !== "site") return null;
  const next = { ...pageSeo };
  delete next[row.path];
  const res = await fetch("/api/site-settings", {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ pageSeo: next })
  });
  const data = await parseJson(res);
  return { data: data?.data, pageSeo: next };
}
