import Link from "next/link";
import BlogCard from "../../components/BlogCard";
import { fetchCatalogList } from "../../lib/serverCatalog";
import { SAMPLE_BLOGS } from "../../lib/sampleContent";

export default async function BlogsPage() {
  const real = await fetchCatalogList("blogs", 24);
  /* Never show an empty wall — sample guides until real posts are published */
  const posts = real.length ? real : SAMPLE_BLOGS;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Travel blog</h1>
      <p className="mt-2 text-sm text-slate-600">
        Tips on cabs, acting drivers, airport transfers and outstation planning from cabzii.in.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={String(post._id ?? post.slug ?? post.title)} post={post} />
        ))}
      </div>
      <p className="mt-8">
        <Link href="/" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
