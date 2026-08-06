# Cabzii SEO Audit Report

**Date:** 26 July 2026  
**Stack:** Next.js 14.2.5 (App Router), React 18, Express/MongoDB backend  
**Scope:** Public crawlability, indexing, structured data, service/city SEO, images, conversion, trust

This report does **not** guarantee rankings, traffic, or bookings. It documents technical SEO and UX improvements only.

---

## Executive summary

Cabzii already had a strong SEO foundation: App Router metadata helpers, dynamic sitemap, robots.txt, CMS-backed service/route landings, dynamic image SEO, and booking CTAs on service/route pages.

Critical gaps were **fake AggregateRating fallbacks**, **sample testimonials in schema**, **LocalBusiness NAP reused for every city**, **OfferShippingDetails on taxi Products**, **transactional pages missing meta noindex**, and a **SearchAction pointing at a robots-disallowed `/search` URL**.

Those critical items are addressed in this implementation pass. Remaining work is mostly content depth, GSC verification, and real photography.

---

## Critical issues

| Issue | Files | Status |
| --- | --- | --- |
| Hardcoded `SITE_REVIEW_STATS` (4.9 / 6) used as AggregateRating fallback | `constants.js`, `schema.js`, `serverReviewStats.js` | **Fixed** — ratings only when approved testimonials/reviews exist |
| Sample testimonials + fake rating schema on `/testimonials` | `testimonials/page.js` | **Fixed** — real items only; schema only with real stats |
| Route Product schema attached site AggregateRating without real reviews | `schema.js` `routeServiceJsonLd` | **Fixed** |
| LocalBusiness used Chennai postal address for every city | `schema.js` `localBusinessJsonLd` | **Fixed** — address only for Chennai HQ; `areaServed` for others |
| Taxi Product offers included fake `OfferShippingDetails` | `schema.js` `buildOffers` | **Fixed** — removed |
| Unverified “4.9 / 50K+” trust UI | `SocialProofTicker.js`, `TrustStrip.js`, chatbot | **Fixed** — honest trust copy |

---

## High-priority issues

| Issue | Files | Status |
| --- | --- | --- |
| `/payment`, `/search`, `/my-bookings`, `/booking` robots-disallow but missing meta `noindex` | layout files | **Fixed** |
| `SearchAction` → `/search` (disallowed) | `schema.js` `websiteJsonLd` | **Fixed** — removed SearchAction |
| Internal link `/search?q=offers` | `internalLinks.js`, `EmtOffersCarousel.js` | **Fixed** → `/cabs` |
| City hubs lacked Booking CTA / related links vs service pages | `CitySeoPage.js` | **Fixed** |
| `GOOGLE_SITE_VERIFICATION` often empty | env / GSC | **Manual** — see GSC doc |
| Thin programmatic city×service pages | CMS / content | **Ongoing** — noindex empty pages; enrich CMS |

---

## Medium-priority issues

| Issue | Recommendation |
| --- | --- |
| `car-rental` vs `cab-rental` overlap | Keep differentiated titles/body (already partially tuned); avoid identical paragraphs |
| Acting-driver / non-local city thin content | Prefer CMS body + unique FAQs; noindex if no availability |
| Homepage marketing counters (50K+) may be unverified | Prefer admin settings fed by real analytics; avoid inventing numbers |
| Hotels/flights noindex catalogs | Keep noindex until real inventory |
| Bundle / LCP / font tuning | Continue using Next/Image, priority cover only, lazy below-fold |

---

## Low-priority issues

| Issue | Recommendation |
| --- | --- |
| Footer link density | Keep curated; avoid city dumps |
| Blog internal links | Link guides ↔ city hubs ↔ popular routes |
| Image alt quality | Use dynamic SEO alts when replacing stock images |
| Duplicate H1 risk on nested layouts | Keep one H1 per landing template |

---

## What already worked well

- App Router + `buildPageMetadata` (title, description, canonical, OG, Twitter)
- `robots.js` + `sitemap.js` with public service/city/route/product URLs
- Dynamic image SEO (`dynamicImageSeo.js`) for cover → OG / Twitter / schema / sitemap
- Service & route landing pages with breadcrumbs, FAQs, BookingCtaBar
- Booking-linked Review model with moderation (no fake review generation)
- Admin SEO CMS for services/routes

---

## Recommended next work (manual / content)

1. Set `GOOGLE_SITE_VERIFICATION` and complete Search Console setup.
2. Replace generic images with real service photos (dynamic SEO already wired).
3. Publish unique CMS bodies for top city × service pages before expanding more cities.
4. Collect real approved reviews from completed bookings; ratings will then appear in schema automatically.
5. Expand only routes/cities with real availability and unique content.
6. Monitor GSC Coverage, CWV, and rich-result reports after deploy.

---

## Files changed in this pass (summary)

- `src/lib/seo/schema.js` — trust-safe JSON-LD
- `src/lib/serverReviewStats.js` — no fabricated fallback
- `src/lib/seo/constants.js` — clear SITE_REVIEW_STATS warning
- `src/lib/seo/internalLinks.js` — remove disallowed offer search link
- `src/app/{payment,search,my-bookings,booking}/layout.js` — noindex metadata
- `src/app/testimonials/page.js` — real reviews only
- `src/components/CitySeoPage.js` — CTAs + related links
- Trust / conversion copy: ticker, trust strip, chatbot, offers carousel
- Docs: this file, GSC setup, content & backlink plan
