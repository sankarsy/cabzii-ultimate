"use client";

import { SOCIAL_LINKS } from "../../lib/socialLinks";

function InstagramIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const ITEMS = [
  { ...SOCIAL_LINKS.instagram, Icon: InstagramIcon },
  { ...SOCIAL_LINKS.facebook, Icon: FacebookIcon }
];

/**
 * Instagram & Facebook profile links for cabzii.in
 * @param {"light" | "dark"} variant - light = on dark footer bg; dark = on white bg
 */
export default function SocialLinks({ variant = "dark", className = "" }) {
  const isLight = variant === "light";
  const btnClass = isLight
    ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
    : "border-slate-200 bg-white text-slate-700 hover:border-[var(--cabzii-brand)]/30 hover:text-[var(--cabzii-brand)]";

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`} aria-label="Follow Cabzii on social media">
      {ITEMS.map(({ href, label, handle, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer external"
          referrerPolicy="no-referrer-when-downgrade"
          className={`cabzii-tap inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${btnClass}`}
          aria-label={`Follow Cabzii on ${label}`}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span>{handle}</span>
        </a>
      ))}
    </div>
  );
}
