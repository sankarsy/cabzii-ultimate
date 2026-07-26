"use client";

const TICKER_ITEMS = [
  "🔥 12,480+ trips booked this month",
  "✅ Best price guaranteed on every route",
  "⚡ Instant booking confirmation",
  "⭐ 4.9 rated by 50K+ travellers",
  "🛡️ Verified drivers & OTP-secure rides"
];

/** Auto-scrolling social proof strip shown right below the hero search widget. */
export default function SocialProofTicker() {
  // Track is duplicated so the -50% translate loops seamlessly.
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="cabzii-proof-ticker" aria-hidden="true">
      <div className="cabzii-proof-ticker-track">
        {items.map((text, i) => (
          <span key={`${text}-${i}`} className="cabzii-proof-ticker-item">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
