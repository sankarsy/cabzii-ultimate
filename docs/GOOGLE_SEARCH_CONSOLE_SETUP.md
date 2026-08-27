# Google Search Console setup — Cabzii

Use this checklist after deploying the live site. **Do not claim verification is complete until the meta tag or DNS/HTML file check succeeds in Search Console.**

Domain assumed: the production URL from `SITE_URL` / `NEXT_PUBLIC_SITE_URL` (typically `https://cabzii.in`).

---

## 1. Verify the Cabzii domain

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add a **Domain** property (preferred) or **URL-prefix** property for the production host.
3. Complete verification:
   - **DNS TXT** (best for Domain property), or
   - **HTML meta tag**: set `GOOGLE_SITE_VERIFICATION` in the frontend env to the token Google provides (wired via existing verification helpers), or
   - **HTML file** upload to `public/` if you choose that method.
4. Confirm status shows **Verified**.

---

## 2. Submit the sitemap

1. In GSC → **Sitemaps**.
2. Submit: `https://YOUR-DOMAIN/sitemap.xml`
3. Confirm the sitemap processes without fatal errors.
4. Robots already references the sitemap via `src/app/robots.js`.

---

## 3. Inspect the homepage

1. Use **URL Inspection** on `/`.
2. Confirm “URL is on Google” or request indexing if newly verified.
3. Check canonical, crawlability, and mobile rendering.

---

## 4. Inspect important service pages

Inspect representative URLs such as:

- `/cabs`
- `/cab-booking/chennai`
- `/services/airport-taxi/chennai`
- `/services/outstation-cab/chennai`
- `/acting-driver/chennai`
- A top route page under `/routes/...`
- `/holidays` and one published package SEO landing

---

## 5. Request indexing after major updates

After large SEO deploys (metadata, sitemap, schema):

1. Inspect key URLs.
2. Click **Request indexing** for priority pages only (avoid mass spam requests).
3. Prefer sitemap + natural crawl for the long tail.

---

## 6. Check Pages / Indexing reports

Monitor:

- Indexed vs not indexed
- Excluded by `noindex` (expected for `/admin`, `/payment`, `/booking`, `/search`, results pages)
- Soft 404 / crawled – currently not indexed
- Duplicate without user-selected canonical

---

## 7. Check sitemap status

- Discovered vs submitted
- Errors / warnings
- Remove any URLs that should stay private from the sitemap (already excluded in code for admin/transactional paths)

---

## 8. Monitor search queries

Performance → Queries:

- Brand vs non-brand
- City + service intents (airport taxi, acting driver, outstation)
- CTR and average position trends over weeks (not days)

---

## 9. Monitor clicks and impressions

- Compare service hubs vs route pages vs blog
- Improve titles/descriptions where impressions are high and CTR is low

---

## 10. Check mobile usability

- Fix any viewport / tap target issues GSC reports
- Re-test sticky booking CTAs on small screens after UI changes

---

## 11. Check Core Web Vitals

- LCP, INP, CLS for mobile and desktop
- Prefer Next/Image, priority for cover only, lazy below-fold
- Avoid layout shifts from unsized images

---

## 12. Monitor 404 pages

- Fix broken internal links
- Add redirects only when an old public URL permanently moves
- Do not create soft-404 thin location pages

---

## 13. Monitor rich results

- Enhancements / rich result reports for FAQ, Product, Breadcrumb where eligible
- **Do not** expect AggregateRating until real approved reviews exist
- Validate with [Rich Results Test](https://search.google.com/test/rich-results) after deploy

---

## Env reminder

```bash
GOOGLE_SITE_VERIFICATION=your_google_token_here
NEXT_PUBLIC_SITE_URL=https://www.cabzii.in
```

Restart / redeploy after setting verification so the meta tag is present on HTML responses.

---

## 14. Search Console API (backend, super-admin)

The Admin → SEO revenue report can pull impressions, clicks, CTR, position, and queries from the Search Console API. This is **not** GA4. Credentials stay on the API server.

Canonical origin in code: `https://www.cabzii.in`. The GSC **property** may still be `https://www.cabzii.in/`, `https://cabzii.in/`, or `sc-domain:cabzii.in` — use the string shown in Search Console.

Backend env (never frontend):

```bash
GSC_SITE_URL=https://www.cabzii.in/
GSC_CANONICAL_ORIGIN=https://www.cabzii.in
GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json
```

1. Enable **Search Console API** on a Google Cloud project.
2. Create a service account. Download JSON. Store it outside git.
3. In Search Console → Settings → Users, add the service account email.
4. Set `GSC_SITE_URL` to the exact property.
5. Restart the backend.
6. Super-admin: Admin → SEO revenue → **Sync Search Console**.

Manual CSV/JSON import remains available. API sync does not delete imported rows.

Until credentials + property + a successful sync for the selected dates exist, the report shows **GSC DATA NOT CONNECTED**. Empty GSC metrics are not shown as fake zeros.

