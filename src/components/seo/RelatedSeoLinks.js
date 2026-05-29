import Link from "next/link";
import { relatedLinksForPage } from "../../lib/seo/internalLinks";

export default function RelatedSeoLinks({ page = "cabs", title = "Related pages" }) {
  const links = relatedLinksForPage(page);

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h2>
      <p className="mt-1 text-xs text-slate-600">More ways to book cabs, drivers and tours on Cabzii.</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-block rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-sky-50"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
