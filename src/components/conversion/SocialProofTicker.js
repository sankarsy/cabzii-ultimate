const TICKER_ITEMS = [
  "✅ Transparent fares before you confirm",
  "⚡ Instant booking confirmation",
  "🛡️ Verified drivers & OTP-secure rides",
  "💬 WhatsApp support for trip changes",
  "🚗 Airport, local & outstation cabs"
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
