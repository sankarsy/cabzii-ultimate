"use client";

import CabziiChatbot from "./chatbot/CabziiChatbot";
import ExitIntentPopup from "./conversion/ExitIntentPopup";
import ContactFab from "./ContactFab";
import CookieConsent from "./CookieConsent";

/**
 * Non-critical chrome. Static imports only — next/dynamic ssr:false was
 * requesting /_next/undefined and Fast Refresh then threw factory.call.
 */
export default function SiteChrome() {
  return (
    <>
      <ContactFab />
      <CookieConsent />
      <CabziiChatbot />
      <ExitIntentPopup />
    </>
  );
}
