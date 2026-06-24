import { CATALOG_TABS } from "../adminCatalogConfig";

const API_MAP = {
  cab: "cabs",
  driver: "drivers",
  tour: "packages",
  blog: "blogs",
  service: "seoServices",
  route: "seoRoutes",
  city: "seoCityPages",
  "acting-driver": "seoCityPages"
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

function seoPayload(form, row) {
  const base = {
    seoTitle: form.seoTitle?.trim() || "",
    seoDescription: form.seoDescription?.trim() || "",
    seo: form.seoKeywords?.trim() || ""
  };

  if (row.type === "cab") return { ...base, title: form.productName?.trim() || undefined };
  if (row.type === "driver") return { ...base, name: form.productName?.trim() || undefined };
  if (row.type === "tour") return { ...base, name: form.productName?.trim() || undefined };
  if (row.type === "blog") return { ...base, title: form.productName?.trim() || undefined };
  if (row.type === "city" || row.type === "acting-driver") {
    return { ...base, h1: form.productName?.trim() || undefined };
  }
  if (row.type === "service" || row.type === "route") {
    return {
      ...base,
      name: form.productName?.trim() || undefined,
      title: form.productName?.trim() || undefined
    };
  }
  return base;
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
      published: true
    };
  }
  return seo;
}

export async function saveSeoSnippet({ row, form, token, pageSeo = {} }) {
  if (row.type === "site") {
    const nextPageSeo = {
      ...pageSeo,
      [row.path]: {
        productName: form.productName?.trim() || "",
        seoTitle: form.seoTitle?.trim() || "",
        seoDescription: form.seoDescription?.trim() || "",
        seoKeywords: form.seoKeywords?.trim() || ""
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
    return parseJson(res);
  }

  const existing = await fetchRecord(row, token);
  if (!existing) throw new Error("Could not load record to update.");

  const merged = { ...existing, ...seoPayload(form, row) };
  const res = await fetch(`${tab.base}/${row.editId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(merged)
  });
  return parseJson(res);
}

export async function deleteSeoSnippet({ row, token }) {
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
  return parseJson(res);
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
