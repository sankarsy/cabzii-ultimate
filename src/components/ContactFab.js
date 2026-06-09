"use client";

import { useEffect, useState } from "react";
import { useSiteSettings } from "./SiteSettingsProvider";
import { Phone } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { telUrl, whatsappBookingUrl } from "../lib/conversion";

export default function ContactFab() {
  const settings = useSiteSettings();
  const whatsapp = settings.whatsappFab;
  const phone = settings.contact?.phone || "+91-9944197416";
  const whatsappNumber = String(whatsapp?.number || settings.contact?.whatsapp || "9944197416").replace(/\D/g, "");
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setPastHero(window.scrollY > 280);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (whatsapp?.enabled === false || !whatsappNumber) return null;

  const waHref = whatsappBookingUrl({
    phone: whatsappNumber,
    message: "Hi Cabzii, I want to book a cab. Please share fare and availability."
  });

  return (
    <div
      className={`fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2.5 sm:bottom-5 sm:left-auto sm:right-5 sm:items-end sm:gap-3 ${
        pastHero ? "opacity-100" : "max-sm:pointer-events-none max-sm:opacity-0"
      }`}
    >
      <a
        href={telUrl(phone)}
        className="cabzii-tap inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-[0_4px_20px_rgba(0,86,210,0.35)] transition hover:shadow-[0_6px_24px_rgba(0,86,210,0.45)] sm:h-12 sm:w-12"
        style={{ background: "var(--cabzii-gradient-brand)" }}
        aria-label="Call Cabzii to book a cab"
      >
        <Phone className="h-5 w-5" strokeWidth={2} aria-hidden />
      </a>
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        className="cabzii-tap inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.35)] transition hover:bg-[#20BA5A] hover:shadow-[0_6px_24px_rgba(37,211,102,0.45)] sm:h-12 sm:w-12"
        aria-label="Book cab on WhatsApp"
      >
        <WhatsAppIcon className="h-6 w-6 text-white" />
      </a>
    </div>
  );
}
