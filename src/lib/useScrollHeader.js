"use client";

import { useEffect, useRef, useState } from "react";

const TOP_THRESHOLD = 12;
const DELTA_THRESHOLD = 6;

function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 1279px)").matches;
}

/**
 * Hide header when user scrolls down; reveal on scroll up or near top.
 * Always visible on mobile — auto-hide removes the only nav affordance.
 */
export function useScrollHeader(enabled = true) {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setVisible(true);
      return undefined;
    }

    lastY.current = window.scrollY;

    const update = () => {
      if (isMobileViewport()) {
        setVisible(true);
        lastY.current = window.scrollY;
        ticking.current = false;
        return;
      }

      const y = window.scrollY;
      const delta = y - lastY.current;

      if (y <= TOP_THRESHOLD) {
        setVisible(true);
      } else if (delta > DELTA_THRESHOLD) {
        setVisible(false);
      } else if (delta < -DELTA_THRESHOLD) {
        setVisible(true);
      }

      lastY.current = y;
      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    const onResize = () => {
      if (isMobileViewport()) setVisible(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [enabled]);

  const forceVisible = () => setVisible(true);

  return { visible, forceVisible };
}
