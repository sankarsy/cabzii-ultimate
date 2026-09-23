export const PAYMENT_SECTIONS = [
  {
    id: "wallets",
    title: "Wallets",
    items: [
      {
        id: "cabzii_wallet",
        label: "Cabzii Wallet",
        sublabel: "Low Balance: ₹0",
        icon: "wallet",
        action: "add_money"
      },
      {
        id: "amazonpay",
        label: "AmazonPay",
        icon: "amazonpay",
        action: "link"
      }
    ]
  },
  {
    id: "upi",
    title: "Pay by any UPI app",
    showUpiBadge: true,
    items: [
      {
        id: "paytm",
        label: "Paytm",
        icon: "paytm"
      },
      { id: "gpay", label: "GPay", icon: "gpay" },
      { id: "phonepe", label: "PhonePe", icon: "phonepe" },
      {
        id: "upi_any",
        label: "Pay by any UPI app",
        icon: "upi",
        action: "choose"
      }
    ]
  },
  {
    id: "pay_later",
    title: "Pay Later",
    items: [
      {
        id: "pay_at_drop",
        label: "Pay at drop",
        icon: "qr",
        hint: "Go cashless — after ride pay by scanning QR code"
      }
    ]
  },
  {
    id: "others",
    title: "Others",
    items: [
      { id: "cash", label: "Cash", icon: "cash" },
      { id: "card", label: "Credit / Debit Card", icon: "card" }
    ]
  }
];

export const OFFER_COUPONS = [
  {
    code: "CABZII500",
    title: "CABZII500",
    desc: "Get ₹500 OFF on your first outstation cab booking!",
    save: "Save ₹500 on this ride."
  },
  {
    code: "FIRST100",
    title: "FIRST100",
    desc: "Flat ₹100 OFF for new users on local packages.",
    save: "Save ₹100 on this ride."
  },
  {
    code: "WEEKEND10",
    title: "WEEKEND10",
    desc: "10% OFF on weekend airport transfers.",
    save: "Save 10% on this ride."
  }
];

/** Only Cash is enabled for now — other methods shown as coming soon */
export const ENABLED_PAYMENT_METHODS = new Set(["cash"]);

export function isPaymentMethodEnabled(methodId) {
  return ENABLED_PAYMENT_METHODS.has(methodId);
}

export function getPaymentLabel(methodId) {
  if (!isPaymentMethodEnabled(methodId)) return "Cash";
  for (const section of PAYMENT_SECTIONS) {
    const item = section.items.find((i) => i.id === methodId);
    if (item) return item.label;
  }
  return "Cash";
}

export function couponDiscountAmount(code, baseFare, trip = {}) {
  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) return 0;

  const tripType = String(trip?.tripType || "").toLowerCase();
  if (tripType && !couponsForTrip(trip).some((c) => c.code === normalized)) return 0;

  const fare = Math.max(0, Number(baseFare) || 0);
  if (normalized === "CABZII500") {
    if (tripType && tripType !== "outstation") return 0;
    if (fare < 1500) return 0;
    return Math.min(500, fare);
  }
  if (normalized === "FIRST100") {
    if (tripType && tripType !== "local" && tripType !== "hourly") return 0;
    return Math.min(100, fare);
  }
  if (normalized === "WEEKEND10") {
    if (tripType && tripType !== "airport") return 0;
    if (trip?.date && !isWeekendIso(trip.date)) return 0;
    return Math.min(Math.round(fare * 0.1) || 0, 400, fare);
  }
  return 0;
}

function isWeekendIso(iso) {
  const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return false;
  const d = new Date(`${m[1]}-${m[2]}-${m[3]}T12:00:00+05:30`);
  if (Number.isNaN(d.getTime())) return false;
  const wd = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "Asia/Kolkata" }).format(d);
  return wd === "Sat" || wd === "Sun";
}

/** Coupons that actually apply to this trip — no leftover airport/weekend codes on outstation. */
export function couponsForTrip(trip) {
  const type = trip?.tripType;
  const list = [];
  if (type === "outstation") list.push(OFFER_COUPONS.find((c) => c.code === "CABZII500"));
  if (type === "local" || type === "hourly") list.push(OFFER_COUPONS.find((c) => c.code === "FIRST100"));
  if (type === "airport" && isWeekendIso(trip?.date)) list.push(OFFER_COUPONS.find((c) => c.code === "WEEKEND10"));
  return list.filter(Boolean);
}
