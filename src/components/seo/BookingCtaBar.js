import Link from "next/link";
import { airportTaxiWhatsappUrl, routeQuoteWhatsappUrl, telUrl, whatsappBookingUrl } from "../../lib/conversion";
import WhatsAppIcon from "../WhatsAppIcon";

/**
 * Crawlable booking CTAs — Book Now, WhatsApp, Call, Get Quote, Check Availability.
 */
export default function BookingCtaBar({
  bookHref = "/cabs",
  bookLabel = "Book Now",
  quoteLabel = "Get Quote on WhatsApp",
  callLabel = "Call Now",
  availabilityLabel = "Check Availability",
  variant = "default",
  routeFrom,
  routeTo,
  airportDirection
}) {
  const whatsappHref = routeFrom && routeTo
    ? routeQuoteWhatsappUrl(routeFrom, routeTo)
    : airportDirection
      ? airportTaxiWhatsappUrl(airportDirection)
      : whatsappBookingUrl();

  const isCompact = variant === "compact";
  const btn = isCompact
    ? "cabzii-btn cabzii-btn-sm cabzii-tap justify-center max-sm:w-full"
    : "cabzii-btn cabzii-tap justify-center max-sm:w-full";
  const iconClass = isCompact ? "h-3.5 w-3.5 shrink-0 text-white" : "h-4 w-4 shrink-0 text-white";

  return (
    <nav
      className={`cabzii-btn-stack ${isCompact ? "mt-4 gap-1.5 sm:gap-2" : "mt-6"}`}
      aria-label="Book cab online"
    >
      <Link href={bookHref} className={`${btn} cabzii-btn-primary min-w-0`}>
        <span className="truncate">{bookLabel}</span>
      </Link>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btn} cabzii-btn-whatsapp`}
      >
        <WhatsAppIcon className={iconClass} />
        <span className="min-w-0 text-center">{isCompact ? "WhatsApp" : "WhatsApp Booking"}</span>
      </a>
      <a href={telUrl()} className={`${btn} cabzii-btn-secondary`}>
        {isCompact ? "Call" : callLabel}
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btn} cabzii-btn-secondary ${isCompact ? "max-sm:hidden" : ""}`}
      >
        {isCompact ? "Get quote" : quoteLabel}
      </a>
      <Link
        href={bookHref}
        className={`${btn} cabzii-btn-secondary ${isCompact ? "max-sm:hidden" : ""}`}
      >
        {isCompact ? "Availability" : availabilityLabel}
      </Link>
    </nav>
  );
}
