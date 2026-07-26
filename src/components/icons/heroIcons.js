/**
 * Light Lucide icons for home hero, category tabs, themes, and feature chips.
 */
import {
  Binoculars,
  BookOpen,
  Bus,
  Car,
  Church,
  CircleUser,
  Gem,
  MapPin,
  Palmtree,
  Plane,
  Building2,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  TrainFront,
  Umbrella,
  UsersRound
} from "lucide-react";

function wrapLucide(Icon, defaultStroke = 1.5) {
  return function LucideIcon({ className = "h-5 w-5", strokeWidth = defaultStroke, ...props }) {
    return <Icon className={className} strokeWidth={strokeWidth} aria-hidden {...props} />;
  };
}

/** Category tabs: Cabs, Drivers, Buses, Hotels, Trains, Flights, Holidays */
export const HERO_TAB_ICONS = {
  flights: wrapLucide(Plane),
  hotels: wrapLucide(Building2),
  trains: wrapLucide(TrainFront),
  buses: wrapLucide(Bus),
  holidays: wrapLucide(Umbrella),
  cabs: wrapLucide(Car),
  drivers: wrapLucide(CircleUser)
};

/** Bottom hero feature row */
export const HERO_FEATURE_ICONS = {
  deals: wrapLucide(Sparkles),
  locations: wrapLucide(MapPin),
  airport: wrapLucide(Plane),
  packages: wrapLucide(Umbrella),
  routes: wrapLucide(Route),
  blog: wrapLucide(BookOpen)
};

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
  holiday: wrapLucide(Umbrella),
  route: wrapLucide(Route),
  airport: wrapLucide(Plane),
  driver: wrapLucide(CircleUser)
};

export function getOfferIcon(iconKey) {
  return OFFER_ICONS[iconKey] || OFFER_ICONS.car;
}

/** Holiday theme tiles — square icon chips */
export const HOLIDAY_THEME_ICONS = {
  beach: wrapLucide(Palmtree),
  pilgrimage: wrapLucide(Church),
  safari: wrapLucide(Binoculars),
  family: wrapLucide(UsersRound),
  luxury: wrapLucide(Gem)
};

export const HOLIDAY_THEME_CHIP_STYLES = {
  beach: "bg-sky-50 text-sky-400 ring-1 ring-sky-100",
  pilgrimage: "bg-amber-50 text-amber-400 ring-1 ring-amber-100",
  safari: "bg-emerald-50 text-emerald-400 ring-1 ring-emerald-100",
  family: "bg-violet-50 text-violet-400 ring-1 ring-violet-100",
  luxury: "bg-rose-50 text-rose-400 ring-1 ring-rose-100"
};

export const HOLIDAY_THEME_CHIP_STYLES_ON_DARK = {
  beach: "bg-white/15 text-sky-100 ring-1 ring-white/25 backdrop-blur-sm",
  pilgrimage: "bg-white/15 text-amber-100 ring-1 ring-white/25 backdrop-blur-sm",
  safari: "bg-white/15 text-emerald-100 ring-1 ring-white/25 backdrop-blur-sm",
  family: "bg-white/15 text-violet-100 ring-1 ring-white/25 backdrop-blur-sm",
  luxury: "bg-white/15 text-rose-100 ring-1 ring-white/25 backdrop-blur-sm"
};

export const HOLIDAY_THEME_ICON_COLORS = {
  beach: "text-sky-400",
  pilgrimage: "text-amber-400",
  safari: "text-emerald-400",
  family: "text-violet-400",
  luxury: "text-rose-400"
};

export const HOLIDAY_THEME_ICON_COLORS_ON_DARK = {
  beach: "text-sky-100",
  pilgrimage: "text-amber-100",
  safari: "text-emerald-100",
  family: "text-violet-100",
  luxury: "text-rose-100"
};

/** @deprecated use HOLIDAY_THEME_ICON_COLORS — kept for any legacy imports */
export const HOLIDAY_THEME_ICON_STYLES = {
  beach: "text-sky-400",
  pilgrimage: "text-amber-400",
  safari: "text-emerald-400",
  family: "text-violet-400",
  luxury: "text-rose-400"
};

/** @deprecated */
export const HOLIDAY_THEME_ICON_STYLES_ON_DARK = {
  beach: "text-sky-200",
  pilgrimage: "text-amber-200",
  safari: "text-emerald-200",
  family: "text-violet-200",
  luxury: "text-rose-200"
};

export function getHolidayThemeIcon(iconKey) {
  return HOLIDAY_THEME_ICONS[iconKey] || HOLIDAY_THEME_ICONS.beach;
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
