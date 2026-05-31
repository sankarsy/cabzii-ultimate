import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import JsonLd from "../../../components/seo/JsonLd";
import { fetchBlogBySlug } from "../../../lib/serverCatalog";
import { articleJsonLd, breadcrumbJsonLd, buildPageMetadata, faqFromPairs } from "../../../lib/seo";

const CHENNAI_GUIDE_FAQS = [
  [
    "How do I book a cab in Chennai online?",
    "Open cabzii.in, enter pickup and drop in Chennai, choose Dzire/Ertiga/Innova/Tempo, login with mobile OTP and confirm. Fares are shown before payment."
  ],
  [
    "How much does an acting driver cost in Chennai?",
    "Acting driver packages in Chennai start from hourly local slabs (4hr/8hr) and daily outstation rates. Cabzii shows exact package price with allowance before you book."
  ],
  [
    "Can I book Tirupati taxi from Chennai?",
    "Yes. Book Chennai to Tirupati one way or round trip cab on Cabzii — sedan, Innova or tempo options with upfront fare on the Chennai–Tirupati route page."
  ],
  [
    "Is Cabzii good for taxi booking near me in Chennai?",
    "Cabzii prioritises vendors serving your Chennai locality — search from T. Nagar, OMR, Anna Nagar, airport or any area and compare near-me taxi fares instantly."
  ]
];

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
    keywords: (post.seo || "").split(",").map((s) => s.trim()).filter(Boolean),
    image: "/images/hero-banner.png",
    imageAlt: post.title
  });
}

export default async function BlogPostPage({ params }) {
  const post = await fetchBlogBySlug(params.slug);
  if (!post) notFound();

  const slug = params.slug;
  const keywords = (post.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const isChennaiGuide = slug.includes("chennai") && slug.includes("guide");
  const faqs = isChennaiGuide ? CHENNAI_GUIDE_FAQS : [];

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blogs" },
      { name: post.title, path: `/blog/${slug}` }
    ]),
    articleJsonLd({
      title: post.title,
      description: post.seoDescription || post.excerpt,
      urlPath: `/blog/${slug}`,
      author: post.author,
      datePublished: post.date || undefined,
      image: "https://cabzii.in/images/hero-banner.png"
    }),
    ...(faqs.length ? [faqFromPairs(faqs)] : [])
  ];

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-white">
      <JsonLd data={jsonLd} />
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

        {post.body ? (
          <div
            className="blog-prose mt-8 space-y-4 text-base leading-relaxed text-slate-700 [&_a]:font-semibold [&_a]:text-[#0056D2] [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_li]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_table]:mt-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-100 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_ul]:list-disc [&_ul]:space-y-1"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        ) : null}

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

        {faqs.length ? (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900">Frequently asked questions</h2>
            <dl className="mt-4 space-y-4">
              {faqs.map(([q, a]) => (
                <div key={q} className="rounded-lg border border-slate-200 bg-white p-4">
                  <dt className="font-semibold text-slate-900">{q}</dt>
                  <dd className="mt-1 text-sm text-slate-600">{a}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Book on Cabzii</p>
          <p className="mt-1 text-sm text-slate-600">
            Cab booking in Chennai, acting drivers, airport taxi and Tirupati routes — transparent fares online.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/cab-booking/chennai"
              className="rounded-lg bg-[#0056D2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0047b3]"
            >
              Cab booking Chennai
            </Link>
            <Link
              href="/acting-driver/chennai"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Acting driver Chennai
            </Link>
            <Link
              href="/routes/chennai-to-tirupati-cab"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Tirupati taxi Chennai
            </Link>
            <Link
              href="/cabs"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Browse all cabs
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
