"use client";

import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import WhatsAppIcon from "../WhatsAppIcon";
import { useSiteSettings } from "../SiteSettingsProvider";
import {
  contactPhoneFromSettings,
  routeQuoteWhatsappUrl,
  telUrl,
  whatsappBookingUrl,
  whatsappDigitsFromSettings
} from "../../lib/conversion";
import { trackLead } from "../../lib/analytics";

export default function TrackedLeadCtas({
  from,
  to,
  message,
  source = "page",
  compact = false
}) {
  const pathname = usePathname();
  const settings = useSiteSettings();
  const phone = contactPhoneFromSettings(settings);
  const waNumber = whatsappDigitsFromSettings(settings);
  const waHref =
    from && to
      ? routeQuoteWhatsappUrl(from, to, { phone: waNumber })
      : whatsappBookingUrl({ phone: waNumber, message, pathname });

  const btn = compact
    ? "cabzii-btn cabzii-btn-sm cabzii-tap inline-flex items-center justify-center gap-1.5"
    : "cabzii-btn cabzii-tap inline-flex items-center justify-center gap-2";

  return (
    <div className={`flex w-full gap-2 ${compact ? "flex-col sm:flex-row sm:flex-wrap" : "flex-wrap"}`}>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btn} cabzii-btn-whatsapp w-full sm:w-auto`}
        onClick={() => trackLead("whatsapp", { source_page: pathname, cta_location: source, route: from && to ? `${from}-${to}` : "" })}
      >
        <WhatsAppIcon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        <span className="sm:hidden">WhatsApp</span>
        <span className="hidden sm:inline">Get Quote on WhatsApp</span>
      </a>
      <a
        href={telUrl(phone)}
        className={`${btn} cabzii-btn-secondary w-full sm:w-auto`}
        onClick={() => trackLead("phone", { source_page: pathname, cta_location: source })}
      >
        <Phone className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} strokeWidth={2} />
        Call Cabzii
      </a>
    </div>
  );
}
