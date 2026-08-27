import Link from "next/link";
import { CHENNAI_MONEY_LINKS } from "../../lib/seo/chennaiCluster";

/**
 * Contextual Chennai service graph — not a footer dump.
 * Use on Chennai commercial landings so cab, airport, driver, tariff and routes share authority.
 */
export default function ChennaiClusterLinks({
  title = "Book related Chennai services",
  excludeHref = ""
}) {
  const links = CHENNAI_MONEY_LINKS.filter((item) => item.href !== excludeHref);
  return (
    <section className="cabzii-seo-block rounded-xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4">
      <h2>{title}</h2>
      <p className="mt-1.5 text-[11px] text-slate-600 sm:text-xs">
        Cabzii’s Chennai bookings concentrate on airport transfers, local packages, outstation/one-way routes,
        Tempo Traveller groups, acting drivers for your own car, and pilgrimage/holiday packages.
      </p>
      <ul className="mt-2.5 flex flex-wrap gap-1.5">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-block rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-[var(--cabzii-brand)]/40 hover:text-[var(--cabzii-brand)]"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
