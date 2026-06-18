"use client";

import { useId } from "react";

/** Zii — Cabzii AI assistant avatar (EVA-style robot face) */
export default function ZiiAvatar({ className = "h-10 w-10", ...props }) {
  const gradId = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <circle cx="24" cy="24" r="24" fill={`url(#${gradId})`} />
      <rect x="14" y="18" width="20" height="16" rx="6" fill="white" />
      <circle cx="19" cy="26" r="2.5" fill="#0056D2" />
      <circle cx="29" cy="26" r="2.5" fill="#0056D2" />
      <path d="M20 31c1.5 1.5 6.5 1.5 8 0" stroke="#0056D2" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 14l2-2 2 2-2 2-2-2z" fill="#FFD54F" stroke="#F9A825" strokeWidth="0.5" />
      <defs>
        <linearGradient id={gradId} x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A90E2" />
          <stop offset="1" stopColor="#0056D2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
