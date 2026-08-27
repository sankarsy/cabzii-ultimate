import Link from "next/link";
import { cabBookingLinks, actingDriverLinks } from "../../lib/seo/internalLinks";

/** Homepage discovery links — not a keyword dump. */
export default function HomeSeoDiscover() {
  return (
    <section className="border-t border-slate-200 bg-slate-50 py-8 sm:py-10">
      <div className="section-shell">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">Explore Cabzii</h2>
        <p className="mt-1 text-sm text-slate-600">Cabs, drivers, holidays and city pages — then book with OTP.</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {[
            { href: "/cabs", label: "Cabs" },
            { href: "/drivers", label: "Driver hire" },
            { href: "/call-driver", label: "Call Driver" },
            { href: "/acting-driver", label: "Acting driver" },
            { href: "/tariff", label: "Chennai tariff" },
            { href: "/holidays", label: "Tours" },
            { href: "/routes", label: "Routes" },
            { href: "/services", label: "Services" },
            { href: "/blogs", label: "Blog" }
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-block rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-sky-300"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <h3 className="mt-6 text-sm font-bold text-slate-900">City hubs</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {cabBookingLinks(8).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-2 flex flex-wrap gap-2">
          {actingDriverLinks(8).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
