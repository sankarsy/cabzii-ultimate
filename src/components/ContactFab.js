"use client";

import { useSiteSettings } from "./SiteSettingsProvider";
import WhatsAppIcon from "./WhatsAppIcon";

export default function ContactFab() {
  const settings = useSiteSettings();
  const whatsapp = settings.whatsappFab;
  const whatsappNumber = String(whatsapp?.number || settings.contact?.whatsapp || "9944197416").replace(/\D/g, "");

  if (whatsapp?.enabled === false || !whatsappNumber) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl transition hover:scale-105 hover:bg-emerald-600"
      aria-label="Contact on WhatsApp"
    >
      <WhatsAppIcon className="h-6 w-6 text-white" />
    </a>
  );
}
