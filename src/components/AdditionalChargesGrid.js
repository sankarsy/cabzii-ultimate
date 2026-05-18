export default function AdditionalChargesGrid({ items, compact = false, className = "" }) {
  if (!items?.length) return null;

  return (
    <div
      className={`rounded-xl border border-slate-100 bg-slate-50/90 ${compact ? "mt-2 p-2" : "mt-4 p-3"} ${className}`}
    >
      <h2 className={`font-bold text-slate-900 ${compact ? "mb-1 text-[10px]" : "mb-2 text-xs"}`}>
        Additional charges
      </h2>
      <div className={`grid grid-cols-1 ${compact ? "gap-1" : "gap-2 sm:grid-cols-2"}`}>
        {items.map((item) => (
          <p
            key={item.label}
            className={`text-slate-600 ${compact ? "flex justify-between gap-2 text-[9px]" : "flex items-start gap-1.5 text-xs"}`}
          >
            {compact ? (
              <>
                <span className="font-medium text-slate-700">{item.label}</span>
                <span className="shrink-0 text-right text-slate-500">{item.value}</span>
              </>
            ) : (
              <span>
                <span className="font-medium text-slate-800">{item.label}</span>
                <br />
                <span className="text-slate-500">{item.value}</span>
              </span>
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
