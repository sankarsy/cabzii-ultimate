export default function BlogCard({ post }) {
  return (
    <article className="flex h-full min-h-[240px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-md transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-xl">
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900">{post.title}</h3>
        <p className="text-sm text-slate-600">{post.excerpt}</p>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{post.author}</span>
        <span>{post.date}</span>
      </div>
    </article>
  );
}
