"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { useSiteSettings } from "./SiteSettingsProvider";
import { telUrl, whatsappBookingUrl } from "../lib/conversion";
import { shouldHideFloatingUi } from "../lib/floatingUi";
import { useSelectedCity } from "../lib/useSelectedCity";

/** Floating Call + WhatsApp — desktop/tablet; mobile uses StickyBookingBar. */
export default function ContactFab() {
  const pathname = usePathname();
  const settings = useSiteSettings();
  const { city } = useSelectedCity();
  const [search, setSearch] = useState("");
  const whatsapp = settings.whatsappFab;
  const phone = settings.contact?.phone || "+91-9944197416";
  const whatsappNumber = String(whatsapp?.number || settings.contact?.whatsapp || "9944197416").replace(/\D/g, "");

  useEffect(() => {
    setSearch(typeof window !== "undefined" ? window.location.search : "");
  }, [pathname]);

  if (shouldHideFloatingUi(pathname)) return null;

  const waHref = whatsappBookingUrl({
    phone: whatsappNumber,
    pathname,
    searchParams: search,
    city: city || "Chennai"
  });

  const showWa = whatsapp?.enabled !== false && whatsappNumber;

  return (
    <div className="fixed bottom-5 left-5 z-[55] hidden flex-col items-start gap-3 sm:flex">
      <a
        href={telUrl(phone)}
        className="cabzii-tap inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_4px_20px_rgba(0,86,210,0.35)] transition hover:scale-105 hover:shadow-[0_6px_24px_rgba(0,86,210,0.45)]"
        style={{ background: "var(--cabzii-gradient-brand)" }}
        aria-label="Call Cabzii to book a cab"
        title="Call us"
      >
        <Phone className="h-5 w-5" strokeWidth={2} aria-hidden />
      </a>
      {showWa ? (
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="cabzii-tap inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.35)] transition hover:scale-105 hover:bg-[#20BA5A]"
          aria-label="Book cab on WhatsApp"
          title="WhatsApp"
        >
          <WhatsAppIcon className="h-6 w-6 text-white" />
        </a>
      ) : null}
    </div>
  );
}
