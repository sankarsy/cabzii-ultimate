import Link from "next/link";
import { airportTaxiWhatsappUrl, routeQuoteWhatsappUrl, telUrl, whatsappBookingUrl } from "../../lib/conversion";
import WhatsAppIcon from "../WhatsAppIcon";

/**
 * High-conversion CTA strip — book online, WhatsApp quote, click-to-call.
 */
export default function BookingCtaBar({
  bookHref = "/cabs",
  bookLabel = "Book online now",
  quoteLabel = "Get instant quote on WhatsApp",
  callLabel = "Call to book",
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
    <div className={`flex flex-wrap gap-3 ${isCompact ? "" : "mt-6"}`}>
      <Link href={bookHref} className="cabzii-btn cabzii-btn-primary cabzii-tap">
        {bookLabel}
      </Link>
      <a href={whatsappHref} target="_blank" rel="noreferrer" className="cabzii-btn cabzii-btn-whatsapp cabzii-tap">
        <WhatsAppIcon className="h-4 w-4 text-white" />
        {quoteLabel}
      </a>
      <a href={telUrl()} className="cabzii-btn cabzii-btn-secondary cabzii-tap">
        {callLabel}
      </a>
    </div>
  );
}
