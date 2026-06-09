import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cabzii — Online Cab Booking Chennai";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
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
          background: "linear-gradient(135deg, #0056D2 0%, #1a2744 100%)",
          color: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>Cabzii</div>
        <div style={{ fontSize: 34, fontWeight: 600, marginTop: 20, color: "#dbeafe" }}>
          Cab Booking Chennai · Taxi Service · Airport Transfer
        </div>
        <div style={{ fontSize: 22, marginTop: 28, color: "#e2e8f0" }}>Book online at cabzii.in</div>
      </div>
    ),
    { ...size }
  );
}
