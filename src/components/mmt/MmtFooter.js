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
  { label: "Partner vehicles", Icon: ShieldCheck, iconBg: "bg-emerald-50", iconColor: "text-emerald-400" },
  { label: "Upfront fares", Icon: Sparkles, iconBg: "bg-orange-50", iconColor: "text-orange-400" },
  { label: "WhatsApp updates", Icon: UserRound, iconBg: "bg-violet-50", iconColor: "text-violet-400" }
];

const COLUMNS = [
  {
    title: "Book on Cabzii",
    links: [
      { label: "Outstation Cabs", href: "/cabs" },
      { label: "Airport Taxi Chennai", href: "/chennai/airport-cab-booking" },
      { label: "Bus tickets", href: "/buses" },
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
      { label: "Service locations", href: "/locations" },
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
      { label: "Legal", href: "/legal-declaration" },
      { label: "Vendor login", href: "/login?role=partner" },
      { label: "Admin login", href: "/login?role=admin" }
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
    <footer className="border-t border-slate-200 bg-[var(--cabzii-bg-subtle)] pb-[5.5rem] sm:pb-0">
      <div className="section-shell py-6 sm:py-10">
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <CabziiLogo className="text-lg sm:text-2xl" showTagline />
            <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-600 sm:mt-2">
              Premium cab booking for airport transfers, outstation trips, and local hire across South India.
            </p>
            <address className="mt-3 not-italic text-sm leading-relaxed text-slate-600">
              <a
                href={NAP.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-800 hover:text-[var(--cabzii-brand)]"
              >
                {NAP.line}
              </a>
              <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                <a href={`tel:${NAP.phone}`} className="hover:text-[var(--cabzii-brand)]">
                  {NAP.phone}
                </a>
                <a href={`mailto:${NAP.email}`} className="hover:text-[var(--cabzii-brand)]">
                  {NAP.email}
                </a>
              </span>
            </address>
            <SocialLinks className="mt-3 sm:mt-4" />
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {FOOTER_TRUST.map(({ label, Icon, iconBg, iconColor }) => (
                <span key={label} className="cabzii-trust-pill gap-1 text-[10px] sm:gap-1.5 sm:text-xs">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full sm:h-6 sm:w-6 ${iconBg} ${iconColor}`}
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

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-slate-200/80 pt-5 sm:mt-8 sm:gap-8 sm:pt-8 md:grid-cols-4">
          {columns.map((col) => (
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
            © {new Date().getFullYear()} {BRAND.copyrightHolder}. All rights reserved.
          </p>
          <p className="text-[10px] text-slate-400 sm:text-xs">Cabs, taxis &amp; travel across India</p>
        </div>
      </div>
    </footer>
  );
}
