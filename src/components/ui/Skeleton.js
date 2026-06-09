/** Shimmer loading placeholder — use inside cards and lists. */
export function Skeleton({ className = "" }) {
  return <div className={`cabzii-skeleton ${className}`} aria-hidden="true" />;
}

export function CatalogCardSkeleton() {
  return (
    <div className="cabzii-card overflow-hidden p-0">
      <div className="flex flex-row sm:flex-col">
        <Skeleton className="h-24 w-28 shrink-0 rounded-none sm:h-36 sm:w-full" />
        <div className="flex flex-1 flex-col gap-3 p-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CatalogGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CatalogCardSkeleton key={i} />
      ))}
    </div>
  );
}
