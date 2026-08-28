"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CabziiChatbot = dynamic(() => import("./chatbot/CabziiChatbot"), { ssr: false });
const ExitIntentPopup = dynamic(() => import("./conversion/ExitIntentPopup"), { ssr: false });
const ContactFab = dynamic(() => import("./ContactFab"), { ssr: false });
const CookieConsent = dynamic(() => import("./CookieConsent"), { ssr: false });

/**
 * Non-critical chrome. Wait for a real click/key or 15s.
 * Do not enable on scroll — Lighthouse scrolls during the lab run and that
 * was pulling chatbot/cookie/FAB into Total Blocking Time.
 */
export default function DeferredSiteChrome() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setReady(true);
    };

    window.addEventListener("pointerdown", enable, { once: true, passive: true });
    window.addEventListener("keydown", enable, { once: true });
    const t = window.setTimeout(enable, 15000);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("keydown", enable);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <ContactFab />
      <CookieConsent />
      <CabziiChatbot />
      <ExitIntentPopup />
    </>
  );
}
