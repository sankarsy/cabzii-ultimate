"use client";

import { useMemo } from "react";
import Link from "next/link";
import CabziiLogo from "../brand/CabziiLogo";
import SocialLinks from "../ui/SocialLinks";
import { ShieldCheck, Sparkles, UserRound } from "../icons/rscIcons";
import { BRAND } from "../../lib/brand";
import { popularRouteLinks } from "../../lib/cityOutstationRoutes";
import { resolveScopedCity } from "../../lib/cityShowcase";
import { useSelectedCity } from "../../lib/useSelectedCity";

const NAP = {
  phone: "+91-9944197416",
  email: "support@cabzii.com",
  maps: "https://www.google.com/maps/search/?api=1&query=Cabzii+Maduravoyal+Chennai+600095",
  line: "Maduravoyal, Chennai, Tamil Nadu 600095"
};

const FOOTER_TRUST = [
  { label: "Partner vehicles", Icon: ShieldCheck },
  { label: "Upfront fares", Icon: Sparkles },
  { label: "WhatsApp updates", Icon: UserRound }
];

const COLUMNS = [
  {
    title: "Book on Cabzii",
    links: [
      { label: "Outstation Cabs", href: "/cabs" },
      { label: "Airport Taxi Chennai", href: "/chennai/airport-cab-booking" },
      { label: "Hire a Driver", href: "/call-driver" },
      { label: "Cab Booking Chennai", href: "/chennai" },
      { label: "Cab rental tariff", href: "/tariff" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Cabzii", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Travel blog", href: "/blogs" },
      { label: "Leave a review", href: "/testimonials#write-review" },
      { label: "Earn with Cabzii", href: "/earn" }
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
  const { city } = useSelectedCity();
  const scoped = useMemo(() => resolveScopedCity(city), [city]);
  const columns = useMemo(() => {
    let routeLinks = [];
    try {
      const next = popularRouteLinks(scoped.slug, 8);
      if (Array.isArray(next)) routeLinks = next;
    } catch {
      routeLinks = [];
    }
    const popular = {
      title: "Popular routes",
      links: routeLinks
    };
    return [COLUMNS[0], popular, ...COLUMNS.slice(1)];
  }, [scoped.slug]);

  return (
    <footer className="bg-[var(--cabzii-ink)] pb-[5.5rem] text-[#b9c6ee] sm:pb-0">
      <div className="section-shell py-6 sm:py-10">
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <CabziiLogo className="text-lg sm:text-2xl" showTagline onDark />
            <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-[#b9c6ee] sm:mt-2">
              Cabs, taxis and drivers across South India. Fares shown before you confirm.
            </p>
            <address className="mt-3 not-italic text-sm leading-relaxed text-[#b9c6ee]">
              <a
                href={NAP.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-[var(--cabzii-cta)]"
              >
                {NAP.line}
              </a>
              <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                <a href={`tel:${NAP.phone}`} className="hover:text-white">
                  {NAP.phone}
                </a>
                <a href={`mailto:${NAP.email}`} className="hover:text-white">
                  {NAP.email}
                </a>
              </span>
            </address>
            <SocialLinks className="mt-3 sm:mt-4" />
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {FOOTER_TRUST.map(({ label, Icon }) => (
                <span key={label} className="inline-flex items-center gap-1 rounded-xl bg-white/8 px-2 py-1 text-[10px] text-white sm:gap-1.5 sm:text-xs">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-white/12 text-[var(--cabzii-cta)] sm:h-6 sm:w-6"
                    aria-hidden
                  >
                    <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </span>
                  {label}
                </span>
            ))}
          </div>
        </div>

        {null}

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-white/10 pt-5 sm:mt-8 sm:gap-8 sm:pt-8 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title} className={col.title === "Popular routes" ? "hidden sm:block" : undefined}>
              <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-white sm:mb-3 sm:text-xs sm:tracking-wider">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-1.5 sm:gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block py-0.5 text-[11px] leading-snug text-[#b9c6ee] transition-colors hover:text-white sm:text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-4 text-center sm:mt-8 sm:flex-row sm:gap-3 sm:pt-6 sm:text-left">
          <p className="text-[10px] text-[#b9c6ee] sm:text-xs" suppressHydrationWarning>
            © {new Date().getFullYear()} {BRAND.copyrightHolder}. All rights reserved.
          </p>
          <p className="text-[10px] text-[#8fa0d0] sm:text-xs">Cabs, taxis &amp; drivers across South India</p>
        </div>
      </div>
    </footer>
  );
}
