import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/seo/JsonLd";
import Breadcrumbs from "../../../components/seo/Breadcrumbs";
import CityCabFaqAccordion from "../../../components/city-cabs/CityCabFaqAccordion";
import { fetchBlogBySlug } from "../../../lib/serverCatalog";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
  faqFromPairs,
  formatSerpTitle
} from "../../../lib/seo";
import { formatBlogAuthor, formatBlogDate } from "../../../lib/seo/serpRichData";
import { resolveMediaUrl } from "../../../lib/media";
import BlogCommercialLinks from "../../../components/seo/BlogCommercialLinks";
import { SEO_REVALIDATE_SECONDS } from "../../../lib/revalidation/constants";
import {
  CHENNAI_GUIDE_FAQS,
  CHENNAI_GUIDE_H1,
  CHENNAI_GUIDE_LEAD,
  CHENNAI_GUIDE_SLUG,
  chennaiCabGuideHtml
} from "../../../lib/seo/chennaiCabGuide";

export const revalidate = SEO_REVALIDATE_SECONDS;

function faqsFromPairs(pairs) {
  return pairs.map(([question, answer]) => ({ question, answer }));
}

export async function generateMetadata({ params }) {
  const post = await fetchBlogBySlug(params.slug);
  if (!post) {
    return buildPageMetadata({
      title: "Blog Post Not Found",
      description: "This blog post could not be found on Cabzii.",
      path: `/blog/${params.slug}`,
      noindex: true
    });
  }
  if (params.slug === CHENNAI_GUIDE_SLUG) {
    return buildPageMetadata({
      title: formatSerpTitle("Chennai cab booking guide", "Local, airport & outstation 2026"),
      description: CHENNAI_GUIDE_LEAD,
      path: `/blog/${params.slug}`,
      keywords: ["chennai cab booking", "chennai taxi guide", "cabzii chennai", "airport taxi chennai"],
      image: "/images/hero-banner.png",
      imageAlt: "Chennai cab booking guide on Cabzii"
    });
  }

  return buildPageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${params.slug}`,
    keywords: (post.seo || "").split(",").map((s) => s.trim()).filter(Boolean),
    image: resolveMediaUrl(post.image) || "/images/hero-banner.png",
    imageAlt: post.title,
    type: "article"
  });
}

export default async function BlogPostPage({ params }) {
  const post = await fetchBlogBySlug(params.slug);
  if (!post) notFound();

  const slug = params.slug;
  const isChennaiGuide = slug === CHENNAI_GUIDE_SLUG;
  const keywords = (post.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const h1 = isChennaiGuide ? CHENNAI_GUIDE_H1 : post.title;
  const lead = isChennaiGuide ? CHENNAI_GUIDE_LEAD : post.excerpt;
  const bodyHtml = isChennaiGuide ? chennaiCabGuideHtml() : post.body;
  const faqRows = isChennaiGuide ? faqsFromPairs(CHENNAI_GUIDE_FAQS) : [];
  const authorLabel = formatBlogAuthor(post.author);
  const dateLabel = formatBlogDate(post.date || post.publishedAt);
  const heroImage = resolveMediaUrl(post.image) || "https://www.cabzii.in/images/hero-banner.png";

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blogs" },
      { name: h1, path: `/blog/${slug}` }
    ]),
    articleJsonLd({
      title: h1,
      description: lead || post.seoDescription || post.excerpt,
      urlPath: `/blog/${slug}`,
      author: authorLabel,
      datePublished: post.date || post.publishedAt || undefined,
      image: heroImage
    }),
    ...(isChennaiGuide ? [faqFromPairs(CHENNAI_GUIDE_FAQS)] : [])
  ];

  return (
    <div>
      <JsonLd data={jsonLd} />
      <div className="border-b border-slate-200 bg-white">
        <div className="section-shell py-5 sm:py-7">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blogs" },
              { name: h1, path: `/blog/${slug}` }
            ]}
          />
          <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[var(--cabzii-brand)] sm:text-[11px]">
            Cabzii blog
          </p>
          <h1 className="mt-2 text-lg font-bold leading-tight tracking-tight text-slate-900 sm:text-xl md:text-2xl">
            {h1}
          </h1>
          <p className="mt-2 text-xs text-slate-500 sm:text-sm">
            By {authorLabel}
            {dateLabel ? ` · ${dateLabel}` : ""}
          </p>
          {lead ? <p className="mx-auto mt-3 max-w-2xl text-xs text-slate-600 sm:text-sm">{lead}</p> : null}
        </div>
      </div>

      <article className="section-shell cabzii-seo-landing py-5 sm:py-8">
        {bodyHtml ? (
          <div
            className="cabzii-seo-block prose prose-slate max-w-none text-sm text-slate-700 [&_a]:font-semibold [&_a]:text-[var(--cabzii-brand)] [&_a]:no-underline hover:[&_a]:underline [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_li]:ml-5 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_p]:mt-2 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : null}

        {keywords.length && !isChennaiGuide ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <li key={kw}>
                <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800">
                  {kw}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {faqRows.length ? (
          <section className="mt-8">
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">Frequently asked questions</h2>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">Booking, fares and acting driver in Chennai.</p>
            <div className="mt-4">
              <CityCabFaqAccordion faqs={faqRows} />
            </div>
          </section>
        ) : null}

        <BlogCommercialLinks title={h1} slug={slug} excerpt={lead || post.excerpt || post.seoDescription || ""} />

        <p className="mt-8">
          <Link href="/blogs" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
            ← All articles
          </Link>
        </p>
      </article>
    </div>
  );
}
