"use client";

import { cabIllustrationKey, CAB_ILLUSTRATION_TONE } from "../../lib/cabIllustration";

const INK = "#0A1640";

function Ground() {
  return <ellipse cx="120" cy="100" rx="92" ry="4.5" fill={INK} opacity="0.12" />;
}

function Wheel({ x, y = 86, r = 14 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#1c2230" />
      <circle cx={x} cy={y} r={r - 4.5} fill="#d7dee9" />
      <circle cx={x} cy={y} r={r - 7.2} fill="#8d97a8" />
      <circle cx={x} cy={y} r="2.2" fill="#f5f7fb" />
    </g>
  );
}

function Glass({ d }) {
  return (
    <g>
      <path d={d} fill="#7EAEDE" />
      <path d={d} fill="#fff" opacity="0.28" />
    </g>
  );
}

function HatchSvg() {
  return (
    <svg viewBox="0 0 240 108" className="h-full w-full" aria-hidden>
      <Ground />
      <path
        d="M38 90V46c0-10 6-18 16-20h92c14 0 24 6 32 16l22 18c6 4 10 8 12 16v14H38z"
        fill="#F7F9FC"
        stroke={INK}
        strokeOpacity="0.18"
      />
      <path d="M38 72h176v6H38z" fill="#E7EDF5" />
      <path d="M54 68h118" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" />
      <Glass d="M58 64V34h46v30z" />
      <Glass d="M112 64 124 32h28l18 32z" />
      <path d="M108 32v48" stroke={INK} strokeOpacity="0.2" />
      <path d="M46 58h7l2 4H46z" fill="#E23B32" />
      <path d="M198 56h10c2 0 3 2 3 4h-13z" fill="#F3F6FB" />
      <path d="M200 62h12" stroke="#F5C451" strokeWidth="2" strokeLinecap="round" />
      <path d="M104 46h7v3h-7z" fill={INK} opacity="0.35" />
      <Wheel x="78" />
      <Wheel x="176" />
    </svg>
  );
}

function SedanSvg() {
  return (
    <svg viewBox="0 0 240 108" className="h-full w-full" aria-hidden>
      <Ground />
      <path
        d="M22 90c2-12 6-20 16-24h52l12-22c6-10 16-16 28-16h28c12 0 20 6 26 16l22 20h14c6 2 10 8 10 16v10H22z"
        fill="#2450C8"
        stroke={INK}
        strokeOpacity="0.2"
      />
      <path d="M22 74h198v5H22z" fill="#16388F" />
      <path d="M40 70h150" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.6" />
      <Glass d="M96 70 108 36h22l-6 34z" />
      <Glass d="M132 36h22c8 0 14 6 18 16l6 18h-46z" />
      <path d="M128 36v40" stroke="#16388F" strokeOpacity="0.45" />
      <path d="M30 60h8v5H30z" fill="#E23B32" />
      <path d="M204 58h12c2 0 4 2 4 4h-16z" fill="#EAF1FF" />
      <path d="M208 66h10" stroke="#F5C451" strokeWidth="2" strokeLinecap="round" />
      <path d="M118 50h6v2.5h-6z" fill="#D6E2FF" />
      <Wheel x="72" />
      <Wheel x="178" />
    </svg>
  );
}

function PremiumSvg() {
  return (
    <svg viewBox="0 0 240 108" className="h-full w-full" aria-hidden>
      <Ground />
      <path
        d="M16 90c2-10 8-18 18-22h48l14-24c6-10 16-16 28-16h34c14 0 22 6 30 18l24 22h16c6 2 10 8 10 14v8H16z"
        fill="#D5DCE6"
        stroke={INK}
        strokeOpacity="0.18"
      />
      <path d="M16 72h208v4H16z" fill="#B7C0CE" />
      <path d="M28 68h176" stroke="#fff" strokeOpacity="0.85" strokeWidth="1.6" />
      <Glass d="M88 68 100 34h26l-8 34z" />
      <Glass d="M128 34h28c10 0 16 6 22 16l8 18h-58z" />
      <path d="M124 34v40" stroke={INK} strokeOpacity="0.18" />
      <path d="M24 58h9v4H24z" fill="#C43732" />
      <path d="M208 56h14c2 0 4 2 4 4h-18z" fill="#F7F9FC" />
      <path d="M212 64h12" stroke="#F5C451" strokeWidth="2" strokeLinecap="round" />
      <path d="M112 48h8v2.4h-8z" fill={INK} opacity="0.28" />
      <path d="M70 46h46" stroke="#C9A24A" strokeWidth="1.4" strokeLinecap="round" />
      <Wheel x="68" r="14.5" />
      <Wheel x="184" r="14.5" />
    </svg>
  );
}

function MpvSvg() {
  return (
    <svg viewBox="0 0 240 108" className="h-full w-full" aria-hidden>
      <Ground />
      <path
        d="M24 90V52c0-12 8-22 20-24h108c12 0 20 5 28 14l24 20c6 4 10 10 10 16v12H24z"
        fill="#F7F8FA"
        stroke={INK}
        strokeOpacity="0.18"
      />
      <path d="M24 74h190v5H24z" fill="#E4E9F1" />
      <Glass d="M48 68V36h34v32z" />
      <Glass d="M88 68V36h36v32z" />
      <Glass d="M130 68 142 34h28l16 34z" />
      <path d="M84 36v44M126 36v44" stroke={INK} strokeOpacity="0.16" />
      <path d="M32 58h8v5H32z" fill="#E23B32" />
      <path d="M202 56h12c2 0 3 2 3 4h-15z" fill="#F4F7FB" />
      <path d="M204 64h11" stroke="#F5C451" strokeWidth="2" strokeLinecap="round" />
      <path d="M78 50h6v2.5h-6zM116 50h6v2.5h-6z" fill={INK} opacity="0.3" />
      <Wheel x="70" />
      <Wheel x="176" />
    </svg>
  );
}

function InnovaSvg() {
  return (
    <svg viewBox="0 0 240 108" className="h-full w-full" aria-hidden>
      <Ground />
      <path d="M52 22h104" stroke="#6E788A" strokeWidth="3" strokeLinecap="round" />
      <path d="M58 18h10M96 18h10M140 18h10" stroke="#6E788A" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M20 90V40c0-10 6-16 16-16h112c8 0 14 3 20 10l22 18 22 6c8 2 12 8 12 16v16H20z"
        fill="#9AA3B2"
        stroke={INK}
        strokeOpacity="0.22"
      />
      <path d="M20 70h198v6H20z" fill="#7E8798" />
      <Glass d="M40 66V32h36v34z" />
      <Glass d="M82 66V32h38v34z" />
      <Glass d="M126 66 138 32h30l16 34z" />
      <path d="M78 32v46M124 32v46" stroke={INK} strokeOpacity="0.2" />
      <path d="M24 52h8v6H24z" fill="#D6453D" />
      <path d="M204 52h14v6h-14z" fill="#F3F5F8" />
      <path d="M206 62h12" stroke="#F5C451" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M70 48h7v2.6h-7zM112 48h7v2.6h-7z" fill="#F4F6F9" opacity="0.7" />
      <Wheel x="64" r="15" />
      <Wheel x="180" r="15" />
    </svg>
  );
}

function VanSvg() {
  return (
    <svg viewBox="0 0 240 108" className="h-full w-full" aria-hidden>
      <Ground />
      <path
        d="M12 90V30c0-6 4-10 10-10h132l18 8h28c10 0 16 6 20 14l10 16c4 4 6 8 6 14v18H12z"
        fill="#F7F9FC"
        stroke={INK}
        strokeOpacity="0.18"
      />
      <path d="M12 68h214v8H12z" fill="#1E40AF" />
      <path d="M12 76h214" stroke="#FF7A1A" strokeWidth="2" />
      <Glass d="M24 62V28h22v34z" />
      <Glass d="M52 62V28h22v34z" />
      <Glass d="M80 62V28h22v34z" />
      <Glass d="M108 62V28h22v34z" />
      <Glass d="M148 62 160 28h18l14 18 6 16z" />
      <path d="M18 58h7v4H18z" fill="#E23B32" />
      <path d="M214 52h12v5h-12z" fill="#F4F7FB" />
      <path d="M216 60h10" stroke="#F5C451" strokeWidth="2" strokeLinecap="round" />
      <Wheel x="58" r="13" />
      <Wheel x="186" r="13" />
    </svg>
  );
}

const CABS = {
  hatch: HatchSvg,
  sedan: SedanSvg,
  premium: PremiumSvg,
  mpv: MpvSvg,
  innova: InnovaSvg,
  van: VanSvg
};

/**
 * Side-view cab art used on listing and detail cards.
 */
export default function CabSilhouette({ product, iconKey, className = "", label = "", size = "card" }) {
  const key = iconKey || cabIllustrationKey(product);
  const Icon = CABS[key] || SedanSvg;
  const tone = CAB_ILLUSTRATION_TONE[key] || CAB_ILLUSTRATION_TONE.sedan;
  const name = label || product?.vehicleModel || product?.title || "Cab";
  const frame = size === "hero" ? "w-full max-w-[28rem] px-2" : "w-full max-w-[240px]";

  return (
    <div
      className={`flex justify-center bg-[var(--cabzii-sky)] px-3 ${size === "hero" ? "items-center py-4 sm:py-6" : "items-end pb-1 pt-3"} ${className}`}
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
