import Link from "next/link";
import TravelLayoutClient from "../mmt/TravelLayoutClient";
import FaqSection from "../seo/FaqSection";
import JsonLd from "../seo/JsonLd";
import { breadcrumbJsonLd, buildPageMetadata } from "../../lib/seo";

export function marketingMetadata({ title, description, path, keywords = [] }) {
  return buildPageMetadata({ title, description, path, keywords });
}

export default function MarketingPageShell({
  title,
  subtitle,
  path,
  breadcrumbs = [],
  children,
  faqs = [],
  jsonLdExtra = []
}) {
  const crumbs = [{ name: "Home", path: "/" }, ...breadcrumbs];
  const jsonLd = [breadcrumbJsonLd(crumbs), ...jsonLdExtra];

  return (
    <TravelLayoutClient>
      <JsonLd data={jsonLd} />
      <div className="border-b border-slate-200 bg-gradient-to-br from-sky-50 via-white to-emerald-50/30">
        <div className="section-shell py-10 sm:py-14">
          <nav className="text-xs font-medium text-slate-500" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={c.path}>
                {i > 0 ? " / " : ""}
                {i === crumbs.length - 1 ? (
                  <span className="text-slate-700">{c.name}</span>
                ) : (
                  <Link href={c.path} className="text-sky-700 hover:underline">
                    {c.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
          {subtitle ? <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">{subtitle}</p> : null}
        </div>
      </div>
      <div className="section-shell py-10 sm:py-12">
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-sky-700">{children}</div>
      </div>
      {faqs.length ? (
        <section className="border-t border-slate-200 bg-white py-10">
          <div className="section-shell">
            <FaqSection title="Frequently asked questions" faqs={faqs} />
          </div>
        </section>
      ) : null}
    </TravelLayoutClient>
  );
}
