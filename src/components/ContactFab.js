"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone } from "./icons/rscIcons";
import WhatsAppIcon from "./WhatsAppIcon";
import { useSiteSettings } from "./SiteSettingsProvider";
import { telUrl, whatsappBookingUrl, contactPhoneFromSettings, whatsappDigitsFromSettings } from "../lib/conversion";
import { isCatalogDetailPage, shouldHideFloatingUi } from "../lib/floatingUi";
import { useSelectedCity } from "../lib/useSelectedCity";
import { trackLead } from "../lib/analytics";
import { usePastHero } from "../lib/usePastHero";

/** Floating Call + WhatsApp — desktop/tablet; mobile uses StickyBookingBar. */
export default function ContactFab() {
  const pathname = usePathname();
  const settings = useSiteSettings();
  const { city } = useSelectedCity();
  const [search, setSearch] = useState("");
  const whatsapp = settings.whatsappFab;
  const phone = contactPhoneFromSettings(settings);
  const whatsappNumber = whatsappDigitsFromSettings(settings);

  useEffect(() => {
    setSearch(typeof window !== "undefined" ? window.location.search : "");
  }, [pathname]);

  const pastHero = usePastHero();
  if (shouldHideFloatingUi(pathname) || !pastHero) return null;
  const onCatalogDetail = isCatalogDetailPage(pathname);

  const waHref = whatsappBookingUrl({
    phone: whatsappNumber,
    pathname,
    searchParams: search,
    city: city || "Chennai"
  });

  const showWa = whatsapp?.enabled !== false && whatsappNumber;

  return (
    <div
      className={`fixed bottom-5 left-5 z-[55] hidden flex-col items-start gap-3 ${
        onCatalogDetail ? "lg:flex" : "sm:flex"
      }`}
    >
      <a
        href={telUrl(phone)}
        className="cabzii-tap inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[0_4px_20px_rgba(30,64,175,0.35)] transition hover:scale-105 hover:shadow-[0_6px_24px_rgba(30,64,175,0.45)]"
        style={{ background: "var(--cabzii-gradient-brand)" }}
        aria-label="Call Cabzii to book a cab"
        title="Call us"
        onClick={() => trackLead("phone", { source_page: pathname, cta_location: "contact_fab" })}
      >
        <Phone className="h-5 w-5" strokeWidth={2} aria-hidden />
      </a>
      {showWa ? (
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="cabzii-tap inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#128C4A] text-white shadow-[0_4px_20px_rgba(18,140,74,0.35)] transition hover:scale-105 hover:bg-[#0f7a40]"
          aria-label="Book cab on WhatsApp"
          title="WhatsApp"
          onClick={() => trackLead("whatsapp", { source_page: pathname, cta_location: "contact_fab" })}
        >
          <WhatsAppIcon className="h-6 w-6 text-white" />
        </a>
      ) : null}
    </div>
  );
}
