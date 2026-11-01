"use client";

import { useEffect, useState } from "react";
import { captureAttribution, hasMarketingConsent } from "../lib/analytics";

const GA4 = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "";
const GTM = process.env.NEXT_PUBLIC_GTM_ID || "";
const META = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const ADS = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";

function hasConfiguredTags() {
  return Boolean(GA4 || GTM || META || ADS);
}

function injectInline(id, source) {
  if (document.getElementById(id)) return;
  const el = document.createElement("script");
  el.id = id;
  el.text = source;
  document.head.appendChild(el);
}

function injectSrc(id, src) {
  if (document.getElementById(id)) return;
  const el = document.createElement("script");
  el.id = id;
  el.async = true;
  el.src = src;
  document.head.appendChild(el);
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

  useEffect(() => {
    if (!consent || !hasConfiguredTags()) return;

    if (GTM) {
      injectInline(
        "cabzii-gtm",
        `window.dataLayer=window.dataLayer||[];(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':Date.now(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`
      );
    } else if (GA4) {
      injectSrc("cabzii-ga4-src", `https://www.googletagmanager.com/gtag/js?id=${GA4}`);
      injectInline(
        "cabzii-ga4",
        `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('js',new Date());gtag('config','${GA4}',{anonymize_ip:true});${ADS ? `gtag('config','${ADS}');` : ""}`
      );
    } else if (ADS) {
      injectSrc("cabzii-ads-src", `https://www.googletagmanager.com/gtag/js?id=${ADS}`);
      injectInline(
        "cabzii-ads",
        `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('js',new Date());gtag('config','${ADS}');`
      );
    }

    if (META) {
      injectInline(
        "cabzii-meta",
        `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META}');fbq('track','PageView');`
      );
    }
  }, [consent]);

  return null;
}
