import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared Open Graph card. Keep copy city/service-specific at the call site —
 * the default site image must not say “Cab Booking Chennai”.
 */
export function cabziiOgImage({
  headline,
  subline = "Airport taxi · Outstation · Acting driver · Holidays",
  footer = "Transparent fares · Professional drivers · Book online"
}) {
  const long = String(headline || "").length > 32;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #1a2744 0%, #0056D2 55%, #003d99 100%)",
          color: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 600, opacity: 0.9 }}>cabzii.in</div>
        <div
          style={{
            fontSize: long ? 48 : 60,
            fontWeight: 800,
            lineHeight: 1.12,
            marginTop: 24,
            maxWidth: 980
          }}
        >
          {headline}
        </div>
        <div style={{ fontSize: 30, fontWeight: 600, marginTop: 16, color: "#dbeafe", maxWidth: 920 }}>
          {subline}
        </div>
        <div style={{ fontSize: 22, marginTop: 28, maxWidth: 860, lineHeight: 1.4, color: "#e2e8f0" }}>
          {footer}
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
