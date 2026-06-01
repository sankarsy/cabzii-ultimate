"use client";

import { useEffect, useRef, useState } from "react";

const TOP_THRESHOLD = 12;
const DELTA_THRESHOLD = 6;

/**
 * Hide header when user scrolls down; reveal on scroll up or near top.
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

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  const forceVisible = () => setVisible(true);

  return { visible, forceVisible };
}
