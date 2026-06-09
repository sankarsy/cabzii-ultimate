import "./globals.css";
import { Manrope } from "next/font/google";
import SiteSettingsProvider from "../components/SiteSettingsProvider";
import ContactFab from "../components/ContactFab";
import CookieConsent from "../components/CookieConsent";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister";
import { fetchSiteSettings } from "../lib/serverSiteSettings";
import { SITE_ICONS } from "../lib/brandAssets";
import { DEFAULT_KEYWORDS, DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE, SITE_URL, organizationJsonLd, taxiServiceJsonLd, websiteJsonLd } from "../lib/seo";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope"
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cab Booking Chennai | Airport Taxi, Local & Outstation Cabs | Cabzii",
    template: "%s | Cabzii"
  },
  description:
    "Book airport taxi, local taxi, outstation taxi and one-way cabs in Chennai. Instant confirmation, professional drivers and affordable fares. Book online with Cabzii.",
  alternates: {
    canonical: "/"
  },
  category: "travel",
  keywords: DEFAULT_KEYWORDS,
  icons: SITE_ICONS,
  openGraph: {
    title: "Cabzii — cabzii.in",
    description:
      "India's online platform for cab booking, acting driver hire and tour packages with transparent pricing.",
    url: "/",
    siteName: "Cabzii",
    locale: "en_IN",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Cabzii — online cab and taxi booking" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Cabzii",
    description: "Book cabs, acting drivers and tours on cabzii.in.",
    images: [DEFAULT_TWITTER_IMAGE]
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

export const viewport = {
  themeColor: "#0056D2",
  width: "device-width",
  initialScale: 1
};

/** Sitewide schema only — FAQ markup lives on the homepage to avoid duplicate/mismatched FAQ entities. */
const structuredData = [organizationJsonLd(), websiteJsonLd(), taxiServiceJsonLd()];

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
          <CookieConsent />
        </SiteSettingsProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
