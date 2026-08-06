import "./globals.css";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import SiteSettingsProvider from "../components/SiteSettingsProvider";
import ContactFab from "../components/ContactFab";
import CabziiChatbot from "../components/chatbot/CabziiChatbot";
import StickyBookingBar from "../components/StickyBookingBar";
import CookieConsent from "../components/CookieConsent";
import ExitIntentPopup from "../components/conversion/ExitIntentPopup";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister";
import { fetchSiteSettings } from "../lib/serverSiteSettings";
import { fetchSiteReviewStats } from "../lib/serverReviewStats";
import { SITE_ICONS } from "../lib/brandAssets";
import { DEFAULT_KEYWORDS, HOME_SEO_TITLE, SITE_URL, organizationJsonLd, taxiServiceJsonLd, websiteJsonLd } from "../lib/seo";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
  preload: true
});

const siteVerification = {
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
  ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {}),
  ...(process.env.YANDEX_SITE_VERIFICATION ? { yandex: process.env.YANDEX_SITE_VERIFICATION } : {})
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_SEO_TITLE,
    template: "%s | Cabzii"
  },
  description:
    "Book cabs, taxis, airport transfers, outstation trips, acting drivers and tour packages across India. Instant confirmation on Cabzii.in.",
  category: "travel",
  keywords: DEFAULT_KEYWORDS,
  icons: SITE_ICONS,
  applicationName: "Cabzii",
  authors: [{ name: "Cabzii", url: SITE_URL }],
  creator: "Cabzii",
  publisher: "Cabzii",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: true, email: true, address: false },
  ...(Object.keys(siteVerification).length ? { verification: siteVerification } : {}),
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Cabzii Cabs",
    "apple-mobile-web-app-status-bar-style": "default",
    "mobile-web-app-capable": "yes"
  }
};

export const viewport = {
  themeColor: "#0EA5E9",
  width: "device-width",
  initialScale: 1
};

/** Sitewide schema only — page-level FAQ/Product markup lives on individual routes. */
async function sitewideStructuredData() {
  const reviewStats = await fetchSiteReviewStats();
  return [organizationJsonLd(reviewStats), websiteJsonLd(), taxiServiceJsonLd()];
}

export default async function RootLayout({ children }) {
  const siteSettings = await fetchSiteSettings();
  const structuredData = await sitewideStructuredData();

  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} ${jakarta.variable}`}>
        <SiteSettingsProvider initialSettings={siteSettings}>
          {children}
          <StickyBookingBar />
          <ContactFab />
          <CabziiChatbot />
          <ExitIntentPopup />
          <CookieConsent />
        </SiteSettingsProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
