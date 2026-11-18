/** Chennai → Tirupati route mark from the brand-blue hero template. Fare is the published sedan rate. */
export default function HeroRouteArt() {
  return (
    <svg
      className="hero-route-art mx-auto w-full max-w-[340px] lg:ml-auto"
      viewBox="0 0 400 250"
      aria-hidden="true"
    >
      <path
        id="hero-route-path"
        d="M52 196C128 196 120 128 205 128S292 58 338 54"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.6"
        strokeWidth="3"
        strokeDasharray="2 9"
        strokeLinecap="round"
      />
      <circle cx="52" cy="196" r="9" fill="#ffffff" />
      <circle cx="52" cy="196" r="3.5" fill="#1E40AF" />
      <text x="52" y="228" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="15">
        Chennai
      </text>
      <circle cx="338" cy="54" r="11" fill="#FF7A1A" stroke="#1E40AF" strokeWidth="3" />
      <text x="338" y="14" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="15">
        Tirupati
      </text>
      <g className="hero-route-fare">
        <rect x="240" y="134" width="124" height="34" rx="10" fill="#fff" stroke="#C9D8FF" />
        <text x="302" y="156" textAnchor="middle" fill="#0A1640" fontWeight="700" fontSize="14">
          ₹3,299 · 135 km
        </text>
      </g>
      <g>
        <g transform="translate(-30 -46) scale(0.55)">
          <path d="M12 56V28c0-8 6-12 14-12h36l16 16h18c6 2 10 8 8 16v8H12z" fill="#ffffff" />
          <path d="M22 42V22h28v20z" fill="#7EAEDE" />
          <path d="M54 22h12l14 16H54z" fill="#A9C8F0" />
          <path d="M16 36h6v3H16z" fill="#E23B32" />
          <path d="M90 34h8v3H90z" fill="#F7F9FC" />
          <circle cx="32" cy="52" r="8" fill="#141820" />
          <circle cx="32" cy="52" r="3.2" fill="#d7dee9" />
          <circle cx="78" cy="52" r="8" fill="#141820" />
          <circle cx="78" cy="52" r="3.2" fill="#d7dee9" />
        </g>
        <animateMotion dur="4s" fill="freeze" rotate="0" calcMode="spline" keyTimes="0;1" keySplines=".4 0 .2 1">
          <mpath href="#hero-route-path" />
        </animateMotion>
      </g>
    </svg>
  );
}
