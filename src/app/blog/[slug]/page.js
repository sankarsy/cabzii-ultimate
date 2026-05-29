import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import JsonLd from "../../../components/seo/JsonLd";
import { fetchBlogBySlug } from "../../../lib/serverCatalog";
import { buildPageMetadata, articleJsonLd } from "../../../lib/seo";

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
  return buildPageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${params.slug}`,
    keywords: (post.seo || "").split(",").map((s) => s.trim()).filter(Boolean)
  });
}

export default async function BlogPostPage({ params }) {
  const post = await fetchBlogBySlug(params.slug);
  if (!post) notFound();

  const keywords = (post.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const articleLd = articleJsonLd({
    title: post.title,
    description: post.seoDescription || post.excerpt,
    urlPath: `/blog/${params.slug}`,
    author: post.author,
    datePublished: post.date || undefined
  });

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-white">
      <JsonLd data={articleLd} />
      <Navbar />
      <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <nav className="mb-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#0056D2]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blogs" className="hover:text-[#0056D2]">
            Blog
          </Link>
        </nav>
        <p className="text-xs font-bold uppercase tracking-wider text-[#0056D2]">Cabzii Blog</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-slate-500">
          {post.author}
          {post.date ? ` · ${post.date}` : ""}
        </p>
        <p className="mt-6 text-base leading-relaxed text-slate-700">{post.excerpt}</p>
        {keywords.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {kw}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">
            Ready to book? Search cabs, acting drivers or tour packages on Cabzii with transparent fares.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/cabs"
              className="rounded-lg bg-[#0056D2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0047b3]"
            >
              Browse cabs
            </Link>
            <Link
              href="/packages"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Tour packages
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
