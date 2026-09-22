"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { captureAttribution, hasMarketingConsent } from "../lib/analytics";

const GA4 = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "";
const GTM = process.env.NEXT_PUBLIC_GTM_ID || "";
const META = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const ADS = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";

function hasConfiguredTags() {
  return Boolean(GA4 || GTM || META || ADS);
}

export default function AnalyticsTags() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    captureAttribution();
    const sync = () => setConsent(hasMarketingConsent());
    sync();
    window.addEventListener("cabzii-cookie-consent", sync);
    return () => window.removeEventListener("cabzii-cookie-consent", sync);
  }, []);

  if (!consent || !hasConfiguredTags()) return null;

  return (
    <>
      {GTM ? (
        <Script id="cabzii-gtm" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':Date.now(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM}');
          `}
        </Script>
      ) : null}
      {!GTM && GA4 ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`} strategy="afterInteractive" />
          <Script id="cabzii-ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              gtag('js', new Date());
              gtag('config', '${GA4}', { anonymize_ip: true });
              ${ADS ? `gtag('config', '${ADS}');` : ""}
            `}
          </Script>
        </>
      ) : null}
      {!GTM && !GA4 && ADS ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ADS}`} strategy="afterInteractive" />
          <Script id="cabzii-ads" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              gtag('js', new Date());
              gtag('config', '${ADS}');
            `}
          </Script>
        </>
      ) : null}
      {META ? (
        <Script id="cabzii-meta" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}
    </>
  );
}
