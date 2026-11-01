import { inferCitySlugFromText, isSeoScopeCity } from "../../config/seo-scope";
import { mergeStaticSeoRoutes, mergeStaticSeoServices } from "../adminCatalogConfig";
import { programmaticPageSeoDefaults } from "./adminSeoDefaults";
import { STATIC_PAGE_SEO_LIST } from "./pageSeoCatalog";
import { listProgrammaticSeoPages } from "./seoPagesCatalog";
import { resolveDroppedSeoRedirect } from "./keepLivePages";
import { isRankingService } from "./packageDoorways";

function isLiveRankingRow(row) {
  if (!row?.path) return false;
  if (resolveDroppedSeoRedirect(row.path)) return false;
  if (row.type === "service" && row.serviceSlug && !isRankingService(row.serviceSlug)) return false;
  if (
    row.citySlug &&
    (row.type === "city" || row.type === "acting-driver" || row.type === "service") &&
    !isSeoScopeCity(row.citySlug)
  ) {
    return false;
  }
  return true;
}

function truncate(text, max = 72) {
  const t = String(text || "").trim();
  if (!t) return "—";
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function seoStatus(row) {
  const hasTitle = Boolean(String(row.seoTitle || "").trim());
  const hasDesc = Boolean(String(row.seoDescription || "").trim());
  const hasKw = Boolean(String(row.seoKeywords || row.seo || "").trim());
  if (hasTitle && hasDesc && hasKw) return "complete";
  if (hasTitle || hasDesc || hasKw) return "partial";
  return "auto";
}

function sourceLabel(source) {
  if (source === "cms") return "CMS override";
  if (source === "catalog") return "Product SEO";
  if (source === "static") return "Built-in template";
  return "Auto-generated";
}

function adminEditHref(tab, editId, createHref) {
  if (editId && !String(editId).startsWith("static:")) {
    return `/admin?tab=${tab}&mode=edit&edit=${encodeURIComponent(editId)}`;
  }
  return createHref;
}

/** @param {{ cabs?, drivers?, packages?, blogs?, seoServices?, seoRoutes?, seoCityPages?, seoLandings?, pageSeo? }} data */
export function buildSeoPageIndex(data = {}) {
  const rows = [];
  const cityPageMap = new Map(
    (data.seoCityPages || []).map((p) => [`${p.pageType}:${String(p.citySlug || "").toLowerCase()}`, p])
  );

  const serviceRows = mergeStaticSeoServices(data.seoServices || []);
  const serviceBySlug = new Map(serviceRows.map((s) => [s.slug, s]));

  const routeRows = mergeStaticSeoRoutes(data.seoRoutes || []);
  const routeBySlug = new Map(routeRows.map((r) => [r.slug, r]));

  for (const blog of data.blogs || []) {
    const id = String(blog._id || blog.id || "");
    const slug = blog.slug || id;
    rows.push({
      id: `blog:${id}`,
      type: "blog",
      typeLabel: "Blog",
      productName: blog.title || "Blog post",
      seoTitle: blog.seoTitle || blog.title || "",
      seoDescription: blog.seoDescription || blog.excerpt || "",
      seoKeywords: blog.seo || "",
      path: `/blog/${slug}`,
      citySlug: inferCitySlugFromText(blog.city || blog.title || slug),
      source: blog.seoTitle ? "catalog" : "auto",
      adminTab: "blogs",
      editId: id,
      createHref: `/admin?tab=blogs&mode=create`,
      canDelete: true,
      seoStatus: seoStatus(blog),
      sourceLabel: sourceLabel(blog.seoTitle ? "catalog" : "auto")
    });
  }

  for (const page of listProgrammaticSeoPages()) {
    let cms = null;
    let cmsEditId = "";
    let source = "auto";
    let createHref = `/admin?tab=${page.adminTab}&mode=create`;

    if (page.type === "city" || page.type === "acting-driver") {
      cms = cityPageMap.get(page.cmsKey);
      createHref = `/admin?tab=seoPagesHub`;
      if (cms) {
        cmsEditId = cms._id || cms.id;
        source = "cms";
      }
    } else if (page.type === "service") {
      const svc = serviceBySlug.get(page.serviceSlug);
      if (svc) {
        if (svc.isStatic) source = "static";
        else if (svc.seoTitle || svc.seo) source = "cms";
        if (!svc.isStatic) cmsEditId = svc._id || svc.id;
      }
      createHref =
        page.serviceSlug === "airport-taxi"
          ? "/admin?tab=airportTaxi"
          : `/admin?tab=cmsServices`;
    } else if (page.type === "route") {
      const route = routeBySlug.get(page.routeSlug);
      if (route) {
        if (route.isStatic) source = "static";
        else if (route.seoTitle || route.seo) source = "cms";
        if (!route.isStatic) cmsEditId = route._id || route.id;
      }
      createHref = `/admin?tab=seoRoutes&mode=create&prefillSlug=${page.routeSlug}`;
    }

    const generated = programmaticPageSeoDefaults(page);
    const cityCmsTitle = page.type === "city" || page.type === "acting-driver" ? cms?.seoTitle || "" : "";
    const cityCmsDesc = page.type === "city" || page.type === "acting-driver" ? cms?.seoDescription || "" : "";
    const cityCmsKw = page.type === "city" || page.type === "acting-driver" ? cms?.seo || "" : "";
    const seoTitle = cityCmsTitle || generated.seoTitle || page.title;
    const seoDescription = cityCmsDesc || generated.seoDescription;
    const seoKeywords = cityCmsKw || generated.seoKeywords;
    const cmsProductName =
      cms?.h1 ||
      (page.type === "service" ? serviceBySlug.get(page.serviceSlug)?.name || serviceBySlug.get(page.serviceSlug)?.menuLabel : "") ||
      (page.type === "route" ? routeBySlug.get(page.routeSlug)?.title : "") ||
      page.title;

    const row = {
      id: page.id,
      type: page.type,
      typeLabel: page.typeLabel,
      productName: cmsProductName,
      h1: cms?.h1 || cmsProductName,
      seoTitle: seoTitle || page.title,
      seoDescription,
      seoKeywords,
      intro: cms?.intro || "",
      html: cms?.body || "",
      faqs: cms?.faqs || [],
      body: cms?.body || "",
      path: page.path,
      citySlug: page.citySlug || "",
      pageType: page.pageType || "",
      serviceSlug: page.serviceSlug || "",
      routeSlug: page.routeSlug || "",
      fromCitySlug: page.fromCitySlug || "",
      toCitySlug: page.toCitySlug || "",
      source,
      adminTab: page.adminTab,
      editId: cmsEditId,
      createHref,
      canDelete: source === "cms" && Boolean(cmsEditId),
      seoStatus: source === "cms" ? seoStatus({ seoTitle, seoDescription, seo: seoKeywords }) : "auto",
      generatedDefault: source !== "cms",
      sourceLabel: sourceLabel(source)
    };
    row.editHref =
      page.adminTab === "seoPagesHub"
        ? `/admin?tab=seoPagesHub`
        : adminEditHref(page.adminTab, row.editId, createHref);
    rows.push(row);
  }

  for (const sitePage of STATIC_PAGE_SEO_LIST) {
    const stored = data.pageSeo?.[sitePage.path] || {};
    const seoTitle = stored.seoTitle || sitePage.seoTitle;
    const seoDescription = stored.seoDescription || sitePage.seoDescription;
    const seoKeywords = stored.seoKeywords || sitePage.seoKeywords;
    const productName = stored.productName || sitePage.productName;
    const source = stored.seoTitle || stored.seoDescription ? "cms" : "static";

    rows.push({
      id: sitePage.id,
      type: "site",
      typeLabel: sitePage.typeLabel,
      productName,
      seoTitle,
      seoDescription,
      seoKeywords,
      path: sitePage.path,
      source,
      adminTab: "seoPagesHub",
      editId: sitePage.path,
      createHref: `/admin?tab=seoPagesHub`,
      canDelete: false,
      canClearOverride: Boolean(stored.seoTitle || stored.seoDescription || stored.seoKeywords || stored.pageLinks?.length || stored.h1 || stored.html),
      seoStatus: seoStatus({ seoTitle, seoDescription, seo: seoKeywords }),
      sourceLabel: sourceLabel(source),
      h1: stored.h1 || productName,
      intro: stored.intro || "",
      html: stored.html || "",
      faqs: stored.faqs || [],
      editHref: `/admin?tab=seoPagesHub&editSeo=${encodeURIComponent(sitePage.path)}`
    });
  }

  for (const landing of data.seoLandings || []) {
    const id = String(landing._id || landing.id || landing.slug || "");
    const path = landing.publicPath || `/pages/${landing.slug}`;
    rows.push({
      id: `landing:${id}`,
      type: "landing",
      typeLabel: "Custom landing",
      productName: landing.h1 || landing.seoTitle || landing.slug,
      h1: landing.h1 || "",
      seoTitle: landing.seoTitle || "",
      seoDescription: landing.seoDescription || "",
      seoKeywords: landing.seo || "",
      intro: landing.intro || "",
      html: landing.body || "",
      body: landing.body || "",
      faqs: landing.faqs || [],
      ctaHref: landing.ctaHref || "/cabs",
      ctaLabel: landing.ctaLabel || "Book now",
      landingSlug: landing.slug,
      citySlug: inferCitySlugFromText(landing.slug || landing.h1 || path),
      path,
      source: "cms",
      adminTab: "seoLandings",
      editId: id,
      createHref: `/admin?tab=seoPagesHub`,
      canDelete: true,
      seoStatus: seoStatus(landing),
      sourceLabel: sourceLabel("cms"),
      editHref: `/admin?tab=seoPagesHub`
    });
  }

  return rows.filter(isLiveRankingRow).map((row) => {
    const stored = data.pageSeo?.[row.path] || {};
    const storedLinks = stored.pageLinks;
    const seoTitle = stored.seoTitle || row.seoTitle;
    const seoDescription = stored.seoDescription || row.seoDescription;
    const seoKeywords = stored.seoKeywords || row.seoKeywords;
    const productName = stored.productName || stored.h1 || row.productName;
    const savedOverride = Boolean(
      stored.seoTitle || stored.seoDescription || stored.seoKeywords || stored.h1 || stored.intro
    );
    const filled = seoStatus({ seoTitle, seoDescription, seo: seoKeywords });
    const unsavedTemplate = row.source === "auto" || row.source === "static";
    const seoStatusValue = unsavedTemplate && !savedOverride ? "auto" : filled;
    return {
      ...row,
      productName,
      h1: stored.h1 || row.h1 || productName,
      seoTitle,
      seoDescription,
      seoKeywords,
      intro: stored.intro || row.intro || "",
      html: stored.html || row.html || row.body || "",
      faqs: Array.isArray(stored.faqs) && stored.faqs.length ? stored.faqs : row.faqs || [],
      pageLinks: storedLinks || row.pageLinks || [],
      editHref: row.editHref || adminEditHref(row.adminTab, row.editId, row.createHref),
      seoTitleDisplay: truncate(seoTitle, 56),
      seoDescriptionDisplay: truncate(seoDescription, 80),
      seoKeywordsDisplay: truncate(seoKeywords, 48),
      seoStatus: seoStatusValue
    };
  });
}

export function seoIndexStats(rows) {
  const total = rows.length;
  const complete = rows.filter((r) => r.seoStatus === "complete").length;
  const partial = rows.filter((r) => r.seoStatus === "partial").length;
  const auto = rows.filter((r) => r.seoStatus === "auto").length;
  return { total, complete, partial, auto };
}
