import Link from "next/link";

export default function Breadcrumbs({ items, variant = "default" }) {
  if (!items?.length) return null;

  const light = variant === "light";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`mb-0 text-sm ${light ? "mb-3 text-white/70" : "mb-6 text-slate-500"}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {index > 0 ? (
                <span aria-hidden className={light ? "text-white/40" : "text-slate-300"}>
                  /
                </span>
              ) : null}
              {isLast || !item.path ? (
                <span
                  className={`font-medium ${light ? "text-white" : "text-slate-700"}`}
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className={
                    light
                      ? "text-white/90 hover:text-white hover:underline"
                      : "hover:text-[#0056D2] hover:underline"
                  }
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
