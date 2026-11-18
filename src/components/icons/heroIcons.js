/**
 * Light Lucide icons for trust badges, offer cards, and search fields.
 */
import {
  Car,
  CircleUser,
  MapPin,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  Star
} from "./rscIcons";

function wrapLucide(Icon, defaultStroke = 1.5) {
  return function LucideIcon({ className = "h-5 w-5", strokeWidth = defaultStroke, ...props }) {
    return <Icon className={className} strokeWidth={strokeWidth} fill="none" aria-hidden {...props} />;
  };
}

/** Trust strip + hero trust badges */
export const TRUST_ICONS = {
  rated: wrapLucide(Star, 1.75),
  verified: wrapLucide(ShieldCheck),
  price: wrapLucide(Sparkles),
  secure: wrapLucide(ShieldCheck),
  support: wrapLucide(CircleUser),
  cancel: wrapLucide(Route),
  trips: wrapLucide(Route),
  locations: wrapLucide(MapPin)
};

export const TRUST_ICON_STYLES = {
  rated: { iconBg: "bg-amber-50", iconColor: "text-amber-400" },
  verified: { iconBg: "bg-emerald-50", iconColor: "text-emerald-400" },
  price: { iconBg: "bg-orange-50", iconColor: "text-orange-400" },
  secure: { iconBg: "bg-sky-50", iconColor: "text-sky-400" },
  support: { iconBg: "bg-violet-50", iconColor: "text-violet-400" },
  cancel: { iconBg: "bg-blue-50", iconColor: "text-blue-400" },
  trips: { iconBg: "bg-blue-50", iconColor: "text-sky-400" },
  locations: { iconBg: "bg-violet-50", iconColor: "text-violet-400" }
};

export function getTrustIcon(iconKey) {
  return TRUST_ICONS[iconKey] || TRUST_ICONS.verified;
}

/** Exclusive offers carousel */
export const OFFER_ICONS = {
  car: wrapLucide(Car),
  route: wrapLucide(Route),
  airport: wrapLucide(Plane),
  driver: wrapLucide(CircleUser)
};

export function getOfferIcon(iconKey) {
  return OFFER_ICONS[iconKey] || OFFER_ICONS.car;
}

/** Cab search FROM / TO field icons */
export const SEARCH_FIELD_ICONS = {
  pickup: wrapLucide(MapPin),
  drop: wrapLucide(MapPin),
  airport: wrapLucide(Plane)
};

export const SEARCH_FIELD_ICON_CHIPS = {
  pickup: "flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-300 ring-1 ring-emerald-100",
  drop: "flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-300 ring-1 ring-rose-100",
  airport: "flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 text-sky-300 ring-1 ring-sky-100"
};
