"use client";

import { Phone } from "../icons/rscIcons";
import WhatsAppIcon from "../WhatsAppIcon";
import { trackLead } from "../../lib/analytics";

export default function CallDriversCtaBar({
  telHref,
  whatsappHref,
  phoneDisplay,
  sourcePage = "/acting-driver/chennai"
}) {
  function onCall() {
    trackLead("phone", { source_page: sourcePage, cta_location: "acting_driver_landing" });
  }

  function onWhatsapp() {
    trackLead("whatsapp", { source_page: sourcePage, cta_location: "acting_driver_landing" });
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <a
          href={telHref}
          onClick={onCall}
          className="cabzii-btn cabzii-btn-cta cabzii-tap inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 sm:flex-none"
        >
          <Phone className="h-4 w-4" aria-hidden />
          Call {phoneDisplay}
        </a>
        <a
          href={whatsappHref}
          onClick={onWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-emerald-50 px-4 text-sm font-semibold text-emerald-800 sm:flex-none"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp Call Driver
        </a>
      </div>
      <div className="h-14 sm:hidden" aria-hidden />
      <nav
        aria-label="Call or WhatsApp Cabzii"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-2 sm:hidden"
      >
        <a
          href={telHref}
          onClick={onCall}
          className="cabzii-btn cabzii-btn-cta cabzii-tap inline-flex min-h-11 items-center justify-center"
        >
          Call now
        </a>
        <a
          href={whatsappHref}
          onClick={onWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white"
        >
          WhatsApp now
        </a>
      </nav>
    </>
  );
}
