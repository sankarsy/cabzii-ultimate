export default function Loading() {
  return (
    <div className="section-shell py-16" aria-busy="true" aria-live="polite">
      <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  );
}
