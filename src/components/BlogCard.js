import Link from "next/link";
import { getInitials } from "../lib/avatar";
import { typo } from "../lib/typography";

export default function BlogCard({ post }) {
  const slug = post.slug;
  const href = slug ? `/blog/${slug}` : "/blogs";
  const author = post.author || "Cabzii Editorial";
  const initials = getInitials(author);

  return (
    <article className="group relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="h-1 bg-[#0056D2]" />

      <div className="flex flex-1 flex-col p-4">
        <span className={`inline-flex w-fit rounded-full bg-[#0056D2]/10 px-2 py-0.5 ${typo.eyebrow}`}>
          Travel guide
        </span>

        <h3 className={`mt-2 line-clamp-2 ${typo.h3}`}>
          <Link href={href} className="transition group-hover:text-[#0056D2]">
            {post.title}
          </Link>
        </h3>

        <p className={`mt-1.5 line-clamp-3 flex-1 ${typo.bodySm}`}>{post.excerpt}</p>

        <div className="mt-3 flex items-center gap-2.5 border-t border-slate-100 pt-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-800">{author}</p>
            {post.date ? <p className={typo.caption}>{post.date}</p> : null}
          </div>
        </div>

        <Link href={href} className={`mt-3 ${typo.link}`}>
          Read more →
        </Link>
      </div>
    </article>
  );
}
