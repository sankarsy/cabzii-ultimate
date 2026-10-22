import { pageLinkGroupCount } from "./pageLinksCore";

function stripHtml(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value) {
  const text = stripHtml(value);
  if (!text) return 0;
  return text.split(" ").filter(Boolean).length;
}

function parseKeywords(value) {
  return String(value || "")
    .split(/[,|\n]+/)
    .map((k) => k.trim())
    .filter(Boolean);
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsPhrase(haystack, phrase) {
  const needle = normalize(phrase);
  if (!needle || needle.length < 3) return false;
  return normalize(haystack).includes(needle);
}

function containsAny(haystack, phrases) {
  return phrases.some((phrase) => containsPhrase(haystack, phrase));
}

function cityLabel(citySlug) {
  return String(citySlug || "")
    .replace(/-/g, " ")
    .trim();
}

function countTags(html, tag) {
  const re = new RegExp(`<${tag}\\b`, "gi");
  return String(html || "").match(re)?.length || 0;
}

function countAnchors(html) {
  return String(html || "").match(/<a\s[^>]*href=/gi)?.length || 0;
}

function gradeFor(score) {
  if (score >= 90) return { label: "Rank-ready", tone: "emerald" };
  if (score >= 75) return { label: "Strong", tone: "sky" };
  if (score >= 55) return { label: "Needs polish", tone: "amber" };
  return { label: "Weak", tone: "rose" };
}

/**
 * Live on-page rank calculator for Google SEO pages.
 * Scores only fields this editor actually saves.
 */
export function computeRankingSeoScore({ form = {}, path = "", citySlug = "" } = {}) {
  const title = String(form.seoTitle || "").trim();
  const description = String(form.seoDescription || "").trim();
  const h1 = String(form.productName || form.h1 || "").trim();
  const intro = String(form.intro || "").trim();
  const html = String(form.html || form.body || "");
  const keywords = parseKeywords(form.seoKeywords);
  const primary = keywords[0] || "";
  const city = cityLabel(citySlug);
  const focusPhrases = [primary, city].filter((p) => p && p.length >= 3);
  const faqs = (Array.isArray(form.faqs) ? form.faqs : []).filter(
    (faq) => String(faq?.question || "").trim() && String(faq?.answer || "").trim()
  );
  const hubLinks = pageLinkGroupCount(form.pageLinks);
  const bodyLinks = countAnchors(html);
  const links = hubLinks + bodyLinks;
  const words = wordCount(`${intro} ${html}`);
  const h2s = countTags(html, "h2");
  const titleLen = title.length;
  const descLen = description.length;
  const introWords = wordCount(intro);

  const checks = [];
  const add = (id, label, weight, status, message) => {
    checks.push({ id, label, weight, status, message });
  };

  add(
    "title",
    "Meta title",
    15,
    titleLen >= 50 && titleLen <= 60 ? "pass" : titleLen >= 40 && titleLen <= 70 ? "warn" : "fail",
    titleLen ? `${titleLen} chars · aim 50–60` : "Missing meta title"
  );
  add(
    "description",
    "Meta description",
    15,
    descLen >= 120 && descLen <= 155 ? "pass" : descLen >= 90 && descLen <= 170 ? "warn" : "fail",
    descLen ? `${descLen} chars · aim 120–155` : "Missing meta description"
  );
  add("h1", "Visible H1", 10, h1 ? "pass" : "fail", h1 ? "H1 is set" : "Add a visible H1");
  add(
    "keyword-title",
    "Keyword in title",
    10,
    containsAny(title, focusPhrases) ? "pass" : "fail",
    primary || city ? (containsAny(title, focusPhrases) ? "Focus term in title" : "Put city or keyword in the title") : "Add a focus keyword first"
  );
  add(
    "keyword-h1",
    "Keyword in H1",
    8,
    containsAny(h1, focusPhrases) ? "pass" : "fail",
    containsAny(h1, focusPhrases) ? "Focus term in H1" : "Repeat the search term in the H1"
  );
  add(
    "keyword-url",
    "Keyword in URL",
    7,
    containsAny(path.replace(/-/g, " "), focusPhrases) ? "pass" : "warn",
    containsAny(path.replace(/-/g, " "), focusPhrases) ? "URL matches the topic" : "URL does not include the city or keyword"
  );
  add(
    "keywords",
    "Keyword list",
    5,
    keywords.length >= 3 ? "pass" : keywords.length ? "warn" : "fail",
    keywords.length ? `${keywords.length} keywords` : "Add comma-separated keywords"
  );
  add(
    "intro",
    "Intro paragraph",
    8,
    introWords >= 40 ? "pass" : introWords >= 20 ? "warn" : "fail",
    introWords ? `${introWords} intro words · aim 40+` : "Write a lead under the H1"
  );
  add(
    "body",
    "Body length",
    12,
    words >= 400 ? "pass" : words >= 200 ? "warn" : "fail",
    words ? `${words} words · aim 400+` : "Add body HTML"
  );
  add(
    "h2",
    "Subheadings",
    5,
    h2s >= 2 ? "pass" : h2s === 1 ? "warn" : "fail",
    h2s ? `${h2s} H2 heading${h2s === 1 ? "" : "s"}` : "Add H2s in the body"
  );
  add(
    "faq",
    "FAQs",
    8,
    faqs.length >= 4 ? "pass" : faqs.length >= 2 ? "warn" : "fail",
    faqs.length ? `${faqs.length} complete FAQ${faqs.length === 1 ? "" : "s"} · aim 4` : "Add question + answer FAQs"
  );
  add(
    "links",
    "Internal links",
    7,
    links >= 6 ? "pass" : links >= 2 ? "warn" : "fail",
    links ? `${links} links (hub + body)` : "Add hub links or in-content links"
  );

  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earned = checks.reduce((sum, c) => {
    if (c.status === "pass") return sum + c.weight;
    if (c.status === "warn") return sum + c.weight * 0.5;
    return sum;
  }, 0);
  const score = totalWeight ? Math.round((earned / totalWeight) * 100) : 0;
  const grade = gradeFor(score);
  const passed = checks.filter((c) => c.status === "pass").length;

  return {
    score,
    grade,
    checks,
    passed,
    total: checks.length,
    stats: {
      titleLen,
      descLen,
      words,
      introWords,
      faqs: faqs.length,
      links,
      keywords: keywords.length,
      h2s,
      primary: primary || city || ""
    }
  };
}
