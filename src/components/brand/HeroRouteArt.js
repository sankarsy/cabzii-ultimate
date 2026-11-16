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
      <text x="338" y="28" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="15">
        Tirupati
      </text>
      <g className="hero-route-fare">
        <rect x="240" y="134" width="124" height="34" rx="10" fill="#fff" stroke="#C9D8FF" />
        <text x="302" y="156" textAnchor="middle" fill="#0A1640" fontWeight="700" fontSize="14">
          ₹3,299 · 135 km
        </text>
      </g>
      <g>
        <g transform="translate(-44 -35) scale(0.55)">
          <path d="M8 52V43c0-4 3-6 8-7l26-4c6-9 14-14 26-14h24c12 0 20 8 28 16l20 4c8 2 12 5 12 11v3z" fill="#ffffff" />
          <path d="M48 32c5-7 10-10 20-10h10v10zM84 22h8c9 0 15 6 21 12H84z" fill="#C5D8F5" />
          <circle cx="42" cy="52" r="10" fill="#111827" />
          <circle cx="42" cy="52" r="4" fill="#E8EEF8" />
          <circle cx="122" cy="52" r="10" fill="#111827" />
          <circle cx="122" cy="52" r="4" fill="#E8EEF8" />
        </g>
        <animateMotion dur="4s" fill="freeze" rotate="0" calcMode="spline" keyTimes="0;1" keySplines=".4 0 .2 1">
          <mpath href="#hero-route-path" />
        </animateMotion>
      </g>
    </svg>
  );
}
