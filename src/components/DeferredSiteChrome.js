"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CabziiChatbot = dynamic(() => import("./chatbot/CabziiChatbot"), { ssr: false });
const ExitIntentPopup = dynamic(() => import("./conversion/ExitIntentPopup"), { ssr: false });

/**
 * Chat + exit-intent are below-the-fold chrome. Load them after first paint
 * so they do not add to Total Blocking Time on the homepage Lighthouse run.
 */
export default function DeferredSiteChrome() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 2200 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const t = window.setTimeout(enable, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <CabziiChatbot />
      <ExitIntentPopup />
    </>
  );
}
