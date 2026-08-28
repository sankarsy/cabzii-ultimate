"use client";

import Link from "next/link";
import CabziiLogo from "../brand/CabziiLogo";
import FooterSeoHub from "../seo/FooterSeoHub";
import SocialLinks from "../ui/SocialLinks";
import { getTrustIcon, TRUST_ICON_STYLES } from "../icons/heroIcons";
import { BRAND } from "../../lib/brand";

function footerRouteLink(slug, label) {
  return { label, href: `/routes/${slug}` };
}

const FOOTER_TRUST = [
  { label: "OTP secure", iconKey: "secure" },
  { label: "Verified drivers", iconKey: "verified" },
  { label: "Upfront fares", iconKey: "price" }
];

const COLUMNS = [
  {
    title: "Book on Cabzii",
    links: [
      { label: "Outstation Cabs", href: "/cabs" },
      { label: "Airport Taxi Chennai", href: "/services/airport-taxi/chennai" },
      { label: "Bus tickets", href: "/buses" },
      { label: "Call Driver", href: "/call-driver" },
      { label: "Holiday Packages", href: "/holidays" },
      { label: "Cab Booking Chennai", href: "/cab-booking/chennai" },
      { label: "Cab rental tariff", href: "/tariff" }
    ]
  },
  {
    title: "Popular routes",
    links: [
      footerRouteLink("chennai-to-bangalore-cab", "Chennai → Bangalore"),
      footerRouteLink("chennai-to-trichy-cab", "Chennai → Trichy"),
      footerRouteLink("chennai-to-pondicherry-cab", "Chennai → Pondicherry"),
      footerRouteLink("chennai-to-tirupati-cab", "Chennai → Tirupati"),
      footerRouteLink("chennai-to-rameswaram-cab", "Chennai → Rameswaram")
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Cabzii", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Service locations", href: "/locations" },
      { label: "Travel blog", href: "/blogs" },
      { label: "Customer reviews", href: "/testimonials" }
    ]
  },
  {
    title: "Help",
    links: [
      { label: "Contact & support", href: "/contact" },
      { label: "Cancellation policy", href: "/cancellation-policy" },
      { label: "Terms & conditions", href: "/terms-and-conditions" },
      { label: "Legal", href: "/legal-declaration" }
    ]
  }
];

export default function MmtFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[var(--cabzii-bg-subtle)] pb-[4.5rem] sm:pb-0">
      <div className="section-shell py-6 sm:py-10">
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <CabziiLogo className="text-lg sm:text-2xl" showTagline />
            <p className="mt-1.5 max-w-sm text-[11px] leading-relaxed text-slate-600 sm:mt-2 sm:text-sm">
              Premium cab booking for airport transfers, outstation trips, and local hire across South India.
            </p>
            <SocialLinks className="mt-3 sm:mt-4" />
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {FOOTER_TRUST.map(({ label, iconKey }) => {
              const Icon = getTrustIcon(iconKey);
              const style = TRUST_ICON_STYLES[iconKey];
              return (
                <span key={label} className="cabzii-trust-pill gap-1 text-[10px] sm:gap-1.5 sm:text-xs">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full sm:h-6 sm:w-6 ${style.iconBg} ${style.iconColor}`}
                    aria-hidden
                  >
                    <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </span>
                  {label}
                </span>
              );
            })}
          </div>
        </div>

        <FooterSeoHub />

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-slate-200/80 pt-5 sm:mt-8 sm:gap-8 sm:pt-8 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-800 sm:mb-3 sm:text-xs sm:tracking-wider sm:text-slate-900">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-1.5 sm:gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block text-[11px] leading-snug text-slate-600 transition-colors hover:text-[var(--cabzii-cta)] sm:text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-slate-200/80 pt-4 text-center sm:mt-8 sm:flex-row sm:gap-3 sm:pt-6 sm:text-left">
          <p className="text-[10px] text-slate-500 sm:text-xs" suppressHydrationWarning>
            © {new Date().getFullYear()} {BRAND.name} · {BRAND.domain}
          </p>
          <p className="text-[10px] text-slate-400 sm:text-xs">Cabs, taxis, tours &amp; travel across India</p>
        </div>
      </div>
    </footer>
  );
}
