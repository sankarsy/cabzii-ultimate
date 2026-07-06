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

  return (
    <nav
      className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${isCompact ? "" : "mt-6"}`}
      aria-label="Book cab online"
    >
      <Link href={bookHref} className="cabzii-btn cabzii-btn-primary cabzii-tap w-full justify-center sm:w-auto">
        {bookLabel}
      </Link>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="cabzii-btn cabzii-btn-whatsapp cabzii-tap w-full justify-center sm:w-auto"
      >
        <WhatsAppIcon className="h-4 w-4 shrink-0 text-white" />
        <span className="min-w-0 text-center">WhatsApp Booking</span>
      </a>
      <a href={telUrl()} className="cabzii-btn cabzii-btn-secondary cabzii-tap w-full justify-center sm:w-auto">
        {callLabel}
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="cabzii-btn cabzii-btn-secondary cabzii-tap w-full justify-center sm:w-auto"
      >
        {quoteLabel}
      </a>
      <Link href={bookHref} className="cabzii-btn cabzii-btn-secondary cabzii-tap w-full justify-center sm:w-auto">
        {availabilityLabel}
      </Link>
    </nav>
  );
}
