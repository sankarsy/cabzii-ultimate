import { ORG_PHONE } from "./seo/constants";

export const CABZII_PHONE = ORG_PHONE;
export const CABZII_PHONE_DIGITS = "919944197416";
export const CABZII_WHATSAPP = "9944197416";

/** Pre-filled WhatsApp message for booking intent (URL-encoded). */
export function whatsappBookingUrl({
  message = "Hi Cabzii, I want to book a cab in Chennai. Please share fare and availability.",
  phone = CABZII_WHATSAPP
} = {}) {
  const digits = String(phone).replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function telUrl(phone = CABZII_PHONE) {
  const normalized = String(phone).replace(/[^\d+]/g, "");
  return `tel:${normalized.startsWith("+") ? normalized : `+91${normalized.replace(/^91/, "")}`}`;
}

export function airportTaxiWhatsappUrl(direction = "pickup") {
  const msg =
    direction === "drop"
      ? "Hi Cabzii, I need Chennai airport DROP taxi. Pickup area: ___. Flight time: ___. Please quote sedan/SUV fare."
      : "Hi Cabzii, I need Chennai airport PICKUP taxi. Terminal: ___. Flight landing: ___. Please quote sedan/SUV fare.";
  return whatsappBookingUrl({ message: msg });
}

export function routeQuoteWhatsappUrl(from, to) {
  return whatsappBookingUrl({
    message: `Hi Cabzii, I need a one-way cab from ${from} to ${to}. Date: ___. Passengers: ___. Please share fare for sedan and SUV.`
  });
}
