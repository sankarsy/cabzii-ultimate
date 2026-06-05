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
        icon: "paytm",
        offer:
          "Flat ₹25 Cashback | Min. payment ₹25 | Once per user | Valid on first Paytm UPI payment in 60 days."
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

export function isPayLaterMethod(methodId) {
  return isPaymentMethodEnabled(methodId) && methodId === "cash";
}
