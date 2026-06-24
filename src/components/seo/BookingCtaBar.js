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
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${isCompact ? "" : "mt-6"}`}>
      <Link href={bookHref} className="cabzii-btn cabzii-btn-primary cabzii-tap w-full justify-center sm:w-auto">
        {bookLabel}
      </Link>
      <a href={whatsappHref} target="_blank" rel="noreferrer" className="cabzii-btn cabzii-btn-whatsapp cabzii-tap w-full justify-center sm:w-auto">
        <WhatsAppIcon className="h-4 w-4 shrink-0 text-white" />
        <span className="min-w-0 text-center">{quoteLabel}</span>
      </a>
      <a href={telUrl()} className="cabzii-btn cabzii-btn-secondary cabzii-tap w-full justify-center sm:w-auto">
        {callLabel}
      </a>
    </div>
  );
}
