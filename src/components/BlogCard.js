import Link from "next/link";
import { avatarHue, getInitials } from "../lib/avatar";

export default function BlogCard({ post }) {
  const slug = post.slug;
  const href = slug ? `/blog/${slug}` : "/blogs";
  const author = post.author || "Cabzii Editorial";
  const hue = avatarHue(author);
  const initials = getInitials(author);

  return (
    <article className="group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="h-1 bg-gradient-to-r from-[#0056D2] via-sky-500 to-cyan-400" />

      <div className="flex flex-1 flex-col p-4">
        <span className="inline-flex w-fit rounded-full bg-[#0056D2]/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0056D2]">
          Travel guide
        </span>

        <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-slate-900">
          <Link href={href} className="transition group-hover:text-[#0056D2]">
            {post.title}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-3 flex-1 text-xs leading-relaxed text-slate-600">{post.excerpt}</p>

        <div className="mt-3 flex items-center gap-2.5 border-t border-slate-100 pt-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
            style={{
              background: `linear-gradient(135deg, hsl(${hue} 65% 48%), hsl(${hue} 55% 38%))`
            }}
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-800">{author}</p>
            {post.date ? <p className="text-[10px] text-slate-500">{post.date}</p> : null}
          </div>
        </div>

        <Link
          href={href}
          className="mt-3 text-xs font-semibold text-[#0056D2] hover:underline"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}
