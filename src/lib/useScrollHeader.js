"use client";

import { useEffect, useState } from "react";

const DELTA_THRESHOLD = 6;
const MOBILE_QUERY = "(max-width: 1023px)";

function headerClearance() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--cabzii-home-header-h").trim();
  const value = parseFloat(raw);
  if (!Number.isFinite(value)) return 72;
  return raw.endsWith("rem") ? value * 16 + 4 : value + 4;
}

/**
 * Mobile only: slide the header away while the page moves down,
 * and bring it back on a small scroll up or near the top.
 * Desktop stays visible.
 */
export function useScrollHeader(enabled = true) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setVisible(true);
      return undefined;
    }

    const media = window.matchMedia(MOBILE_QUERY);
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!media.matches || reduced) {
        setVisible(true);
        lastY = window.scrollY;
        return;
      }

      const y = window.scrollY;
      const delta = y - lastY;

      if (y <= headerClearance()) setVisible(true);
      else if (delta > DELTA_THRESHOLD) setVisible(false);
      else if (delta < -DELTA_THRESHOLD) setVisible(true);

      lastY = y;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const onViewportChange = () => {
      lastY = window.scrollY;
      setVisible(true);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    media.addEventListener("change", onViewportChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      media.removeEventListener("change", onViewportChange);
    };
  }, [enabled]);

  return { visible };
}
