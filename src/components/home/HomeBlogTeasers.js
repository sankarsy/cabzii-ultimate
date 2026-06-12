"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, CalendarDays, ArrowRight } from "lucide-react";
import SectionIntro from "../ui/SectionIntro";
import { SAMPLE_BLOGS, estimateReadMinutes } from "../../lib/sampleContent";
import { fetchJson } from "../../lib/apiClient";

function BlogTile({ post }) {
  const href = post.slug ? `/blog/${post.slug}` : "/blogs";
  return (
    <Link
      href={href}
      className="cabzii-tap group flex h-full w-[18rem] shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--cabzii-brand)]/30 hover:shadow-md sm:w-auto"
    >
      <span className="inline-flex w-fit rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[var(--cabzii-brand)]">
        {post.category || "Travel guide"}
      </span>
      <h3 className="mt-2.5 line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition group-hover:text-[var(--cabzii-brand)]">
        {post.title}
      </h3>
      <p className="mt-1.5 line-clamp-3 flex-1 text-xs leading-relaxed text-slate-600">{post.excerpt}</p>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-2.5">
          {post.date ? (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3" strokeWidth={2} aria-hidden /> {post.date}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" strokeWidth={2} aria-hidden /> {estimateReadMinutes(post)} min read
          </span>
        </span>
        <span className="inline-flex items-center gap-0.5 font-bold text-[var(--cabzii-brand)]">
          Read
          <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" strokeWidth={2.5} aria-hidden />
        </span>
      </div>
    </Link>
  );
}

/** Latest blog teasers — real posts when published, sample guides otherwise. */
export default function HomeBlogTeasers() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchJson("/api/blogs?limit=3&page=1")
      .then((json) => {
        if (cancelled) return;
        const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
        setPosts(list.length ? list : SAMPLE_BLOGS);
      })
      .catch(() => {
        if (!cancelled) setPosts(SAMPLE_BLOGS);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = (posts || SAMPLE_BLOGS).slice(0, 3);

  return (
    <section className="border-t border-slate-200 bg-white py-8 sm:py-10">
      <div className="section-shell">
        <div className="flex items-end justify-between gap-3">
          <SectionIntro
            eyebrow="Blog"
            title="Travel guides & tips"
            subtitle="Route guides, fare breakdowns and booking tips from the Cabzii team."
          />
          <Link
            href="/blogs"
            className="hidden shrink-0 text-sm font-semibold text-[var(--cabzii-brand)] hover:underline sm:block"
          >
            All articles →
          </Link>
        </div>
        <div className="scroll-x-touch -mx-4 mt-5 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0">
          {visible.map((post) => (
            <BlogTile key={String(post._id ?? post.slug ?? post.title)} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
