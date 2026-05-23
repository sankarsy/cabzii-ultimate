export function SectionViewAll({ href, label = "View all" }) {
  return (
    <a
      href={href}
      className="shrink-0 text-sm font-semibold text-[#0056D2] transition hover:underline"
    >
      {label} →
    </a>
  );
}

export function PreviewCardGrid({ children, emptyMessage, isEmpty }) {
  if (isEmpty) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
        {emptyMessage}
      </p>
    );
  }

  return <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
