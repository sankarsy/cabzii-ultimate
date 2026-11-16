"use client";

import { cabIllustrationKey, CAB_ILLUSTRATION_TONE } from "../../lib/cabIllustration";

function HatchSvg() {
  return (
    <svg viewBox="0 0 160 64" className="h-full w-full" aria-hidden>
      <ellipse cx="80" cy="60" rx="66" ry="3.5" fill="#0A1640" opacity=".15" />
      <path d="M14 52V34L22 20c1-2 3-3 6-3h54c8 0 14 3 20 9l12 8 22 4c8 2 12 5 12 11v3z" fill="currentColor" stroke="#0A1640" strokeOpacity=".25" />
      <path d="M27 22h24l-1 11H23zM57 22h24c6 0 11 3 16 11H57z" fill="#CFE0FF" />
      <path d="M54 34v14M100 34v12" stroke="#fff" strokeOpacity=".45" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="143" y="40" width="6" height="4" rx="2" fill="#FFD66B" />
      <rect x="11" y="40" width="5" height="4" rx="2" fill="#E5322D" />
      <circle cx="38" cy="52" r="10" fill="#0A1640" />
      <circle cx="38" cy="52" r="4" fill="#C9D3EE" />
      <circle cx="118" cy="52" r="10" fill="#0A1640" />
      <circle cx="118" cy="52" r="4" fill="#C9D3EE" />
    </svg>
  );
}

function SedanSvg() {
  return (
    <svg viewBox="0 0 160 64" className="h-full w-full" aria-hidden>
      <ellipse cx="80" cy="60" rx="66" ry="3.5" fill="#0A1640" opacity=".15" />
      <path d="M8 52V43c0-4 3-6 8-7l26-4c6-9 14-14 26-14h24c12 0 20 8 28 16l20 4c8 2 12 5 12 11v3z" fill="currentColor" stroke="#0A1640" strokeOpacity=".25" />
      <path d="M48 32c5-7 10-10 20-10h10v10zM84 22h8c9 0 15 6 21 12H84z" fill="#CFE0FF" />
      <path d="M82 34v14M10 44h140" stroke="#fff" strokeOpacity=".45" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="143" y="40" width="6" height="4" rx="2" fill="#FFD66B" />
      <rect x="11" y="40" width="5" height="4" rx="2" fill="#E5322D" />
      <circle cx="42" cy="52" r="10" fill="#0A1640" />
      <circle cx="42" cy="52" r="4" fill="#C9D3EE" />
      <circle cx="122" cy="52" r="10" fill="#0A1640" />
      <circle cx="122" cy="52" r="4" fill="#C9D3EE" />
    </svg>
  );
}

function MpvSvg() {
  return (
    <svg viewBox="0 0 160 64" className="h-full w-full" aria-hidden>
      <ellipse cx="80" cy="60" rx="66" ry="3.5" fill="#0A1640" opacity=".15" />
      <path d="M8 52V36c0-4 1-7 3-10l6-9c1-1 3-1 5-1h66c8 0 13 4 18 10l12 12 16 3c8 2 14 5 14 9v3z" fill="currentColor" stroke="#0A1640" strokeOpacity=".25" />
      <path d="M17 22h17l-2 12H14zM39 22h20v12H39zM64 22h22c6 0 10 4 14 12H64z" fill="#CFE0FF" />
      <path d="M62 34v14M36 34v14M10 44h136" stroke="#fff" strokeOpacity=".45" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="143" y="40" width="6" height="4" rx="2" fill="#FFD66B" />
      <rect x="11" y="40" width="5" height="4" rx="2" fill="#E5322D" />
      <circle cx="36" cy="52" r="10" fill="#0A1640" />
      <circle cx="36" cy="52" r="4" fill="#C9D3EE" />
      <circle cx="116" cy="52" r="10" fill="#0A1640" />
      <circle cx="116" cy="52" r="4" fill="#C9D3EE" />
    </svg>
  );
}

function InnovaSvg() {
  return (
    <svg viewBox="0 0 160 64" className="h-full w-full" aria-hidden>
      <ellipse cx="80" cy="60" rx="66" ry="3.5" fill="#0A1640" opacity=".15" />
      <path d="M6 52V22c0-4 3-8 8-8h78c8 0 13 4 18 9l12 11 14 4c10 2 16 6 16 12v2z" fill="currentColor" stroke="#0A1640" strokeOpacity=".25" />
      <path d="M12 19h20v13H11zM37 19h22v13H37zM64 19h24c6 0 10 3 15 13H64z" fill="#CFE0FF" />
      <path d="M14 11h76" stroke="#0A1640" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M34 32v16M62 32v16" stroke="#fff" strokeOpacity=".45" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M138 42h12" stroke="#E8EFFF" strokeWidth="3" strokeLinecap="round" />
      <rect x="146" y="38" width="6" height="4" rx="2" fill="#FFD66B" />
      <rect x="5" y="38" width="5" height="5" rx="2" fill="#E5322D" />
      <circle cx="34" cy="52" r="11" fill="#0A1640" />
      <circle cx="34" cy="52" r="5" fill="#C9D3EE" />
      <circle cx="122" cy="52" r="11" fill="#0A1640" />
      <circle cx="122" cy="52" r="5" fill="#C9D3EE" />
    </svg>
  );
}

function VanSvg() {
  return (
    <svg viewBox="0 0 160 64" className="h-full w-full" aria-hidden>
      <ellipse cx="80" cy="60" rx="66" ry="3.5" fill="#0A1640" opacity=".15" />
      <path d="M6 52V16c0-4 2-6 6-6h100c6 0 10 2 14 8l12 16c8 2 14 5 14 12v6z" fill="#fff" stroke="#0A1640" strokeOpacity=".25" />
      <g fill="#CFE0FF">
        <rect x="14" y="16" width="16" height="14" rx="3" />
        <rect x="34" y="16" width="16" height="14" rx="3" />
        <rect x="54" y="16" width="16" height="14" rx="3" />
        <rect x="74" y="16" width="16" height="14" rx="3" />
        <path d="M110 16h4c4 0 6 2 8 5l8 12h-20z" />
      </g>
      <path d="M6 38h146v5H6z" fill="currentColor" />
      <path d="M6 44h146" stroke="#FF7A1A" strokeWidth="2.5" />
      <rect x="146" y="40" width="7" height="4" rx="2" fill="#FFD66B" />
      <circle cx="32" cy="52" r="10" fill="#0A1640" />
      <circle cx="32" cy="52" r="4" fill="#C9D3EE" />
      <circle cx="120" cy="52" r="10" fill="#0A1640" />
      <circle cx="120" cy="52" r="4" fill="#C9D3EE" />
    </svg>
  );
}

const CABS = {
  hatch: HatchSvg,
  sedan: SedanSvg,
  mpv: MpvSvg,
  innova: InnovaSvg,
  van: VanSvg
};

/**
 * Line-art cab used instead of stock photos on listing and detail cards.
 */
export default function CabSilhouette({ product, iconKey, className = "", label = "", size = "card" }) {
  const key = iconKey || cabIllustrationKey(product);
  const Icon = CABS[key] || SedanSvg;
  const tone = CAB_ILLUSTRATION_TONE[key] || CAB_ILLUSTRATION_TONE.sedan;
  const name = label || product?.vehicleModel || product?.title || "Cab";
  const frame = size === "hero" ? "w-full max-w-[28rem] px-2" : "w-full max-w-[220px]";

  return (
    <div
      className={`flex justify-center bg-[var(--cabzii-sky)] px-4 ${size === "hero" ? "items-center py-4 sm:py-6" : "items-end pb-1 pt-4"} ${className}`}
      style={{ color: tone }}
      role="img"
      aria-label={name}
    >
      <div className={frame}>
        <Icon />
      </div>
    </div>
  );
}
