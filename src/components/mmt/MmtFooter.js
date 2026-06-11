import Link from "next/link";
import { BadgeCheck, IndianRupee, Lock } from "lucide-react";
import CabziiLogo from "../brand/CabziiLogo";
import { BRAND } from "../../lib/brand";
import { routeToCabSearchHref } from "../../lib/routeTrip";
import { routeBySlug } from "../../lib/seo/routes";

function footerRouteLink(slug, label) {
  const route = routeBySlug(slug);
  return { label, href: route ? routeToCabSearchHref(route) : `/routes/${slug}` };
}

const COLUMNS = [
  {
    title: "Book on Cabzii",
    links: [
      { label: "Outstation Cabs", href: "/cabs" },
      { label: "Airport Taxi Chennai", href: "/services/airport-taxi/chennai" },
      { label: "Acting Drivers", href: "/drivers" },
      { label: "Holiday Packages", href: "/holidays" },
      { label: "Cab Booking Chennai", href: "/cab-booking/chennai" }
    ]
  },
  {
    title: "Popular routes",
    links: [
      footerRouteLink("chennai-to-bangalore-cab", "Chennai → Bangalore"),
      footerRouteLink("chennai-to-pondicherry-cab", "Chennai → Pondicherry"),
      footerRouteLink("chennai-to-tirupati-cab", "Chennai → Tirupati")
    ]
  },
  {
    title: "Company",
    links: [
      { label: "Service locations", href: "/locations" },
      { label: "Travel blog", href: "/blogs" },
      { label: "Customer reviews", href: "/testimonials" }
    ]
  },
  {
    title: "Help",
    links: [
      { label: "Contact & support", href: "/locations" },
      { label: "Cancellation policy", href: "/cancellation-policy" },
      { label: "Terms & conditions", href: "/terms-and-conditions" },
      { label: "Legal", href: "/legal-declaration" }
    ]
  }
];

export default function MmtFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[var(--cabzii-bg-subtle)]">
      <div className="section-shell py-10 sm:py-12">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200/80 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CabziiLogo className="text-xl sm:text-2xl" />
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
              Premium cab booking for airport transfers, outstation trips, and local hire across South India.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="cabzii-trust-pill gap-1.5 text-xs">
              <Lock className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} aria-hidden /> OTP secure
            </span>
            <span className="cabzii-trust-pill gap-1.5 text-xs">
              <BadgeCheck className="h-3.5 w-3.5 text-[var(--cabzii-brand)]" strokeWidth={2} aria-hidden /> Verified drivers
            </span>
            <span className="cabzii-trust-pill gap-1.5 text-xs">
              <IndianRupee className="h-3.5 w-3.5 text-amber-600" strokeWidth={2} aria-hidden /> Upfront fares
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-900">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 transition hover:text-[var(--cabzii-brand)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200/80 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {BRAND.name} · {BRAND.domain}
          </p>
          <p className="text-xs text-slate-400">Cabs, taxis, tours &amp; travel across India</p>
        </div>
      </div>
    </footer>
  );
}
