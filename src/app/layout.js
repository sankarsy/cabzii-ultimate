import "./globals.css";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope"
});

export const metadata = {
  metadataBase: new URL("https://cabzii.in"),
  title: {
    default: "cabzii.in | Online Taxi, Tour & Driver Booking",
    template: "%s | cabzii.in"
  },
  description:
    "Book cabs, drivers, and tour packages online with transparent fares, verified service, and instant confirmation across popular routes.",
  alternates: {
    canonical: "/"
  },
  category: "travel",
  keywords: [
    "cabzii.in",
    "cab booking",
    "taxi booking online",
    "outstation cab booking",
    "airport transfer booking",
    "bus booking",
    "travel packages",
    "tour booking online",
    "driver on rent",
    "one way cab",
    "round trip cab",
    "intercity taxi"
  ],
  openGraph: {
    title: "cabzii.in",
    description:
      "Online taxi, driver, and tour booking platform with transparent fares and quick confirmation.",
    url: "/",
    siteName: "cabzii.in",
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "cabzii.in",
    description:
      "Book cabs, tours, and drivers online with fair pricing and reliable support."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={manrope.variable}>{children}</body>
    </html>
  );
}
