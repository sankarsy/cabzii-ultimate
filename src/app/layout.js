import "./globals.css";
import { Manrope } from "next/font/google";
import SiteSettingsProvider from "../components/SiteSettingsProvider";
import ContactFab from "../components/ContactFab";
import { fetchSiteSettings } from "../lib/serverSiteSettings";
import { DEFAULT_KEYWORDS, SITE_URL, faqJsonLd, organizationJsonLd, taxiServiceJsonLd, websiteJsonLd } from "../lib/seo";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope"
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cabzii — Online Cab, Taxi & Acting Driver Booking",
    template: "%s | Cabzii"
  },
  description:
    "Cabzii (cabzii.in) — book cabs, taxis, acting drivers and tour packages online in Chennai, Bengaluru, Mumbai and across India. Transparent fares and instant confirmation.",
  alternates: {
    canonical: "/"
  },
  category: "travel",
  keywords: DEFAULT_KEYWORDS,
  openGraph: {
    title: "Cabzii — cabzii.in",
    description:
      "India's online platform for cab booking, acting driver hire and tour packages with transparent pricing.",
    url: "/",
    siteName: "Cabzii",
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Cabzii",
    description: "Book cabs, acting drivers and tours on cabzii.in."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" }
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {})
};

const structuredData = [organizationJsonLd(), websiteJsonLd(), taxiServiceJsonLd(), faqJsonLd()];

export default async function RootLayout({ children }) {
  const siteSettings = await fetchSiteSettings();

  return (
    <html lang="en-IN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={manrope.variable}>
        <SiteSettingsProvider initialSettings={siteSettings}>
          {children}
          <ContactFab />
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
