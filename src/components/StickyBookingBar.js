"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { useSiteSettings } from "./SiteSettingsProvider";
import { HERO_TAB_ICONS } from "./icons/heroIcons";
import { telUrl, whatsappBookingUrl, contactPhoneFromSettings, whatsappDigitsFromSettings } from "../lib/conversion";
import { shouldHideStickyBookingBar } from "../lib/floatingUi";
import { trackEvent } from "../lib/analytics";

const CabIcon = HERO_TAB_ICONS.cabs;

/** Mobile-only sticky bottom bar — Call · WhatsApp · Book now. */
export default function StickyBookingBar() {
  const pathname = usePathname();
  const settings = useSiteSettings();
  const [search, setSearch] = useState("");
  const phone = contactPhoneFromSettings(settings);
  const whatsappNumber = whatsappDigitsFromSettings(settings);

  useEffect(() => {
    setSearch(typeof window !== "undefined" ? window.location.search : "");
  }, [pathname]);

  if (shouldHideStickyBookingBar(pathname)) return null;

  const waHref = whatsappBookingUrl({
    phone: whatsappNumber,
    pathname,
    searchParams: search,
    city: "Chennai"
  });

  return (
    <>
      <div className="h-[3rem] sm:hidden" aria-hidden />
      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 gap-px border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:hidden"
        aria-label="Quick booking"
      >
        <a
          href={telUrl(phone)}
          className="cabzii-sticky-bar-item cabzii-tap text-[var(--cabzii-brand)]"
          aria-label="Call Cabzii now"
          onClick={() => trackEvent("call_clicked", { source_page: pathname, cta_location: "sticky_bar" })}
        >
          <Phone className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          <span>Call Now</span>
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="cabzii-sticky-bar-item cabzii-tap text-[#1da851]"
          aria-label="Get instant quote on WhatsApp"
          onClick={() => trackEvent("whatsapp_clicked", { source_page: pathname, cta_location: "sticky_bar" })}
        >
          <WhatsAppIcon className="h-3.5 w-3.5" />
          <span>WhatsApp</span>
        </a>
        <Link
          href="/cabs"
          className="cabzii-sticky-bar-item cabzii-tap text-white"
          style={{ background: "var(--cabzii-gradient-brand)" }}
          aria-label="Book a cab now"
          onClick={() => trackEvent("book_clicked", { source_page: pathname, cta_location: "sticky_bar" })}
        >
          <CabIcon className="h-3.5 w-3.5" aria-hidden />
          <span>Book</span>
        </Link>
      </nav>
    </>
  );
}
