/** Inline SVG mark — no external image, crisp at all sizes. */
export default function CabziiLogoMark({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      role="img"
    >
      <rect width="512" height="512" rx="112" fill="#0056D2" />
      <path
        d="M104 300c0-22 14-40 38-46l30-66c8-18 26-30 46-30h84c20 0 38 12 46 30l30 66c24 6 38 24 38 46v60c0 11-9 20-20 20h-16c-11 0-20-9-20-20v-12H160v12c0 11-9 20-20 20h-16c-11 0-20-9-20-20v-60z"
        fill="#ffffff"
      />
      <path
        d="M176 178l-22 48h204l-22-48c-3-7-10-12-18-12h-124c-8 0-15 5-18 12z"
        fill="#0056D2"
      />
      <circle cx="172" cy="292" r="20" fill="#0056D2" />
      <circle cx="340" cy="292" r="20" fill="#0056D2" />
    </svg>
  );
}
