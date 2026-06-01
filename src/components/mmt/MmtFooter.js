import Link from "next/link";
import CabziiLogo from "../brand/CabziiLogo";
import { BRAND } from "../../lib/brand";

const COLUMNS = [
  {
    title: "Book on Cabzii",
    links: [
      { label: "Flights", href: "/flights" },
      { label: "Hotels", href: "/hotels" },
      { label: "Outstation Cabs", href: "/cabs" },
      { label: "Holiday Packages", href: "/holidays" },
      { label: "Acting Drivers", href: "/drivers" }
    ]
  },
  {
    title: "Popular routes",
    links: [
      { label: "Chennai → Bangalore", href: "/routes/chennai-to-bangalore-cab" },
      { label: "Chennai → Pondicherry", href: "/routes/chennai-to-pondicherry-cab" },
      { label: "Chennai → Tirupati", href: "/routes/chennai-to-tirupati-cab" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Cabzii", href: "/locations" },
      { label: "Blog", href: "/blogs" },
      { label: "Reviews", href: "/testimonials" }
    ]
  },
  {
    title: "Help",
    links: [
      { label: "Contact", href: "/locations" },
      { label: "Cancellation Policy", href: "/cancellation-policy" },
      { label: "Terms", href: "/terms-and-conditions" },
      { label: "Legal", href: "/legal-declaration" }
    ]
  }
];

export default function MmtFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="section-shell py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 min-[420px]:grid-cols-2 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-bold text-slate-900">{col.title}</h3>
              <ul className="flex flex-col gap-2">
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
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
          <CabziiLogo className="text-xl" />
          <p className="text-center text-xs text-slate-500">
            © {new Date().getFullYear()} {BRAND.name} · {BRAND.domain} — cabs, taxis, tours &amp; travel across India
          </p>
        </div>
      </div>
    </footer>
  );
}
