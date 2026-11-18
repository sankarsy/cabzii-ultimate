import "./globals.css";
import { Figtree, Sora } from "next/font/google";
import { fetchSiteReviewStats } from "../lib/serverReviewStats";
import { SITE_ICONS } from "../lib/brandAssets";
import { DEFAULT_KEYWORDS, HOME_SEO_TITLE, SITE_URL, organizationJsonLd, taxiServiceJsonLd, websiteJsonLd } from "../lib/seo";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
  preload: true
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
  display: "swap"
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
    "Book cabs, airport taxi, outstation trips and acting drivers from Chennai across South India. Fares shown before you confirm on Cabzii.in.",
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
  themeColor: "#1E40AF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

/** Sitewide schema only — page-level FAQ/Product markup lives on individual routes. */
async function sitewideStructuredData() {
  const reviewStats = await fetchSiteReviewStats();
  return [organizationJsonLd(reviewStats), websiteJsonLd(), taxiServiceJsonLd()];
}

export default async function RootLayout({ children }) {
  const structuredData = await sitewideStructuredData();

  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV !== "production" ? (
          <script
            dangerouslySetInnerHTML={{
              __html:
                "try{navigator.serviceWorker&&navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(x){x.unregister()})});caches&&caches.keys().then(function(k){k.forEach(function(x){caches.delete(x)})});}catch(e){}"
            }}
          />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${figtree.variable} ${sora.variable} cabzii-theme-blue`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
