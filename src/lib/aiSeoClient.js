/**
 * Client helper for Enterprise AI SEO APIs.
 */

import { computeRankingSeoScore } from "./seo/rankingSeoScore";

const inflight = new Map();

export async function callAiSeo(task, payload = {}, { token, signal } = {}) {
  const key = `${task}:${JSON.stringify(payload)}`;
  if (inflight.has(key)) return inflight.get(key);

  const promise = (async () => {
    const res = await fetch(`/api/ai/${encodeURIComponent(task)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload),
      signal
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.success) {
      const err = new Error(json?.message || `AI ${task} failed`);
      err.status = res.status;
      err.openaiConfigured = json?.openaiConfigured;
      throw err;
    }
    return json;
  })();

  inflight.set(key, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(key);
  }
}

function titleCaseSlug(slug) {
  return String(slug || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export function buildAiPayload(form = {}, pathPrefix = "/cabs") {
  return {
    vehicleName: form.vehicleName || form.title || form.name || form.operator || "",
    title: form.title || form.name || form.operator || "",
    name: form.name || form.operator || "",
    brand: form.brand || form.brandName || form.operator || "",
    brandName: form.brandName || form.brand || form.operator || "",
    city: form.city || form.fromCity || "",
    state: form.state || "Tamil Nadu",
    seats: form.seats || "",
    category: form.category || form.type || form.busType || "",
    type: form.type || form.category || form.busType || "",
    fuelType: form.fuelType || "",
    transmission: form.transmission || "",
    pricePerKm: form.pricePerKm,
    startingPrice: form.startingPrice || form.price || form.seaterPrice,
    price: form.price || form.seaterPrice,
    seoTitle: form.seoTitle || "",
    seoDescription: form.seoDescription || "",
    longSeoContent: form.longSeoContent || "",
    content: form.longSeoContent || form.shortDescription || "",
    customPrompt: form.customPrompt || form.aiPrompt || "",
    pathPrefix,
    images: form.images || []
  };
}

export function buildRankingAiPayload(form = {}, row = {}, customPrompt = "") {
  const city = titleCaseSlug(row.citySlug) || "Tamil Nadu";
  const name = form.productName || row.productName || row.h1 || row.typeLabel || "Cabzii page";
  const rank = computeRankingSeoScore({ form, path: row.path || "", citySlug: row.citySlug || "" });
  const gaps = rank.checks
    .filter((check) => check.status !== "pass")
    .map((check) => `${check.label}: ${check.message}`)
    .join("; ");
  return {
    pageKind: "ranking",
    pageType: row.typeLabel || row.type || "ranking page",
    path: row.path || "",
    pathPrefix: row.path || "/",
    vehicleName: name,
    title: name,
    name,
    h1: name,
    city,
    state: "Tamil Nadu",
    category: row.typeLabel || row.type || "",
    type: row.type || "",
    seoTitle: form.seoTitle || "",
    seoDescription: form.seoDescription || "",
    keywords: form.seoKeywords || "",
    seoKeywords: form.seoKeywords || "",
    intro: form.intro || "",
    html: form.html || "",
    faqs: Array.isArray(form.faqs) ? form.faqs : [],
    content: form.html || form.intro || form.seoDescription || "",
    longSeoContent: form.html || "",
    rankGaps: gaps,
    customPrompt: [customPrompt, gaps ? `Current score ${rank.score}/100. Fix: ${gaps}` : ""].filter(Boolean).join("\n")
  };
}
