import Link from "next/link";
import BlogCard from "../../components/BlogCard";
import RelatedSeoLinks from "../../components/seo/RelatedSeoLinks";
import JsonLd from "../../components/seo/JsonLd";
import { fetchCatalogList } from "../../lib/serverCatalog";
import { SAMPLE_BLOGS } from "../../lib/sampleContent";
import { blogListingJsonLd } from "../../lib/seo";
import { cabBookingLinks } from "../../lib/seo/internalLinks";
import { SEO_REVALIDATE_SECONDS } from "../../lib/revalidation/constants";

export const revalidate = SEO_REVALIDATE_SECONDS;

export default async function BlogsPage() {
  const real = await fetchCatalogList("blogs", 24);
  const posts = real.length ? real : SAMPLE_BLOGS;

  return (
    <>
      <JsonLd data={blogListingJsonLd(posts)} />
      <div className="section-shell py-10">
        <h1 className="text-2xl font-bold text-slate-900">Travel blog</h1>
        <p className="mt-2 text-sm text-slate-600">
          Tips on cabs, acting drivers, airport transfers and outstation planning from cabzii.in.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={String(post._id ?? post.slug ?? post.title)} post={post} />
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-base font-bold text-slate-900">Book cabs by city</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {cabBookingLinks(8).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-sky-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <RelatedSeoLinks page="cabs" title="Related cab & tour pages" />

        <p className="mt-8">
          <Link href="/" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </>
  );
}
