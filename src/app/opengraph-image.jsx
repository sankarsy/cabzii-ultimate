import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cabzii — Cab Booking Chennai | Airport Taxi & Outstation Cabs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, marginTop: 24, maxWidth: 900 }}>
          Cab Booking Chennai
        </div>
        <div style={{ fontSize: 36, fontWeight: 600, marginTop: 16, color: "#dbeafe" }}>
          Airport Taxi &amp; Outstation Cabs
        </div>
        <div style={{ fontSize: 24, marginTop: 32, maxWidth: 820, lineHeight: 1.4, color: "#e2e8f0" }}>
          Affordable fares · Professional drivers · Transparent pricing · Instant online booking
        </div>
      </div>
    ),
    { ...size }
  );
}
