"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { useSiteSettings } from "./SiteSettingsProvider";
import { HERO_TAB_ICONS } from "./icons/heroIcons";
import { telUrl, whatsappBookingUrl } from "../lib/conversion";
import { shouldHideFloatingUi } from "../lib/floatingUi";

const CabIcon = HERO_TAB_ICONS.cabs;

/**
 * Mobile-only sticky bottom booking bar — Call · WhatsApp · Book Now.
 */
export default function StickyBookingBar() {
  const pathname = usePathname();
  const settings = useSiteSettings();
  const phone = settings.contact?.phone || "+91-9944197416";
  const whatsappNumber = String(
    settings.whatsappFab?.number || settings.contact?.whatsapp || "9944197416"
  ).replace(/\D/g, "");

  if (shouldHideFloatingUi(pathname)) return null;

  const waHref = whatsappBookingUrl({
    phone: whatsappNumber,
    message: "Hi Cabzii, I want to book a cab. Please share fare and availability."
  });

  return (
    <>
      <div className="h-[4.25rem] sm:hidden" aria-hidden />
      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 gap-px border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(15,23,42,0.08)] sm:hidden"
        aria-label="Quick booking"
      >
        <a
          href={telUrl(phone)}
          className="cabzii-tap flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 text-[var(--cabzii-brand)]"
          aria-label="Call Cabzii now"
        >
          <Phone className="h-5 w-5" strokeWidth={2} aria-hidden />
          <span className="text-[11px] font-bold leading-none">Call now</span>
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="cabzii-tap flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 text-[#1da851]"
          aria-label="Get instant quote on WhatsApp"
        >
          <WhatsAppIcon className="h-5 w-5" />
          <span className="text-[11px] font-bold leading-none">WhatsApp</span>
        </a>
        <Link
          href="/cabs"
          className="cabzii-tap flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 text-white"
          style={{ background: "var(--cabzii-gradient-brand)" }}
          aria-label="Book a cab now"
        >
          <CabIcon className="h-5 w-5" aria-hidden />
          <span className="text-[11px] font-bold leading-none">Book now</span>
        </Link>
      </nav>
    </>
  );
}
