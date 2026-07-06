"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import WhatsAppIcon from "../WhatsAppIcon";
import { telUrl, whatsappBookingUrl } from "../../lib/conversion";
import { useSiteSettings } from "../SiteSettingsProvider";

export default function HeroHeadline({
  title = "Book Trusted Cabs & Drivers Across India",
  subtitle = "Airport transfers, outstation trips, local rentals & driver services — instant quotes on cabzii.in"
}) {
  const settings = useSiteSettings();
  const phone = settings.contact?.phone || "+91-9944197416";
  const whatsappNumber = String(settings.whatsappFab?.number || settings.contact?.whatsapp || "9944197416").replace(/\D/g, "");
  const waHref = whatsappBookingUrl({
    phone: whatsappNumber,
    message: "Hi Cabzii, I need a cab quote. Pickup: ___. Drop: ___. Date: ___."
  });

  return (
    <div className="section-shell pb-4 pt-6 sm:pb-5 sm:pt-8">
      <h1 className="max-w-3xl text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">{subtitle}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="cabzii-tap inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:brightness-105"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp booking
        </a>
        <a
          href={telUrl(phone)}
          className="cabzii-tap inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-[var(--cabzii-brand)] shadow-sm hover:bg-sky-50"
        >
          <Phone className="h-4 w-4" strokeWidth={2} />
          Call to book
        </a>
        <Link
          href="/cabs"
          className="cabzii-tap inline-flex items-center rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-sm"
          style={{ background: "var(--cabzii-gradient-cta)" }}
        >
          Search cabs
        </Link>
      </div>
    </div>
  );
}
