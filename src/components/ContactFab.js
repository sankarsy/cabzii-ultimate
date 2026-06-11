"use client";

import { useSiteSettings } from "./SiteSettingsProvider";
import { Phone } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { telUrl, whatsappBookingUrl } from "../lib/conversion";

/** Desktop-only floating contact buttons — mobile uses StickyBookingBar instead. */
export default function ContactFab() {
  const settings = useSiteSettings();
  const whatsapp = settings.whatsappFab;
  const phone = settings.contact?.phone || "+91-9944197416";
  const whatsappNumber = String(whatsapp?.number || settings.contact?.whatsapp || "9944197416").replace(/\D/g, "");

  if (whatsapp?.enabled === false || !whatsappNumber) return null;

  const waHref = whatsappBookingUrl({
    phone: whatsappNumber,
    message: "Hi Cabzii, I want to book a cab. Please share fare and availability."
  });

  return (
    <div className="fixed bottom-5 right-5 z-40 hidden flex-col items-end gap-3 sm:flex">
      <a
        href={telUrl(phone)}
        className="cabzii-tap inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_4px_20px_rgba(0,86,210,0.35)] transition hover:shadow-[0_6px_24px_rgba(0,86,210,0.45)]"
        style={{ background: "var(--cabzii-gradient-brand)" }}
        aria-label="Call Cabzii to book a cab"
      >
        <Phone className="h-5 w-5" strokeWidth={2} aria-hidden />
      </a>
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        className="cabzii-tap inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.35)] transition hover:bg-[#20BA5A] hover:shadow-[0_6px_24px_rgba(37,211,102,0.45)]"
        aria-label="Book cab on WhatsApp"
      >
        <WhatsAppIcon className="h-6 w-6 text-white" />
      </a>
    </div>
  );
}
