/**
 * Flat Remix icons for home hero, category tabs, and header shortcuts.
 * Line style matches EaseMyTrip-style travel UI.
 */
import {
  RiAncientGateLine,
  RiArticleLine,
  RiBookOpenLine,
  RiBus2Line,
  RiCoupon3Line,
  RiCustomerService2Line,
  RiFlightTakeoffLine,
  RiHotelLine,
  RiLockPasswordLine,
  RiLuggageCartLine,
  RiMapPin2Line,
  RiMapPinLine,
  RiMoneyRupeeCircleLine,
  RiRefreshLine,
  RiRoadsterLine,
  RiRouteLine,
  RiShieldCheckLine,
  RiStarFill,
  RiSteering2Line,
  RiSuitcaseLine,
  RiSunLine,
  RiTaxiLine,
  RiTeamLine,
  RiTrainLine,
  RiUmbrellaLine,
  RiVipDiamondLine
} from "react-icons/ri";

function wrapFlat(Icon) {
  return function FlatIcon({ className = "h-5 w-5", ...props }) {
    return <Icon className={className} aria-hidden {...props} />;
  };
}

/** Category tabs: Flights, Hotels, Trains, Bus, Holidays, Cabs, Drivers */
export const HERO_TAB_ICONS = {
  flights: wrapFlat(RiFlightTakeoffLine),
  hotels: wrapFlat(RiHotelLine),
  trains: wrapFlat(RiTrainLine),
  buses: wrapFlat(RiBus2Line),
  holidays: wrapFlat(RiUmbrellaLine),
  cabs: wrapFlat(RiTaxiLine),
  drivers: wrapFlat(RiSteering2Line)
};

/** Bottom hero feature row */
export const HERO_FEATURE_ICONS = {
  deals: wrapFlat(RiCoupon3Line),
  locations: wrapFlat(RiMapPinLine),
  airport: wrapFlat(RiFlightTakeoffLine),
  packages: wrapFlat(RiSuitcaseLine),
  routes: wrapFlat(RiRouteLine),
  blog: wrapFlat(RiArticleLine)
};

/** Trust strip + hero trust badges */
export const TRUST_ICONS = {
  rated: wrapFlat(RiStarFill),
  verified: wrapFlat(RiShieldCheckLine),
  price: wrapFlat(RiMoneyRupeeCircleLine),
  secure: wrapFlat(RiLockPasswordLine),
  support: wrapFlat(RiCustomerService2Line),
  cancel: wrapFlat(RiRefreshLine),
  trips: wrapFlat(RiRouteLine),
  locations: wrapFlat(RiMapPinLine)
};

export const TRUST_ICON_STYLES = {
  rated: { iconBg: "bg-amber-50", iconColor: "text-amber-500" },
  verified: { iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
  price: { iconBg: "bg-orange-50", iconColor: "text-orange-500" },
  secure: { iconBg: "bg-sky-50", iconColor: "text-sky-500" },
  support: { iconBg: "bg-violet-50", iconColor: "text-violet-500" },
  cancel: { iconBg: "bg-blue-50", iconColor: "text-blue-500" },
  trips: { iconBg: "bg-blue-50", iconColor: "text-[var(--cabzii-brand)]" },
  locations: { iconBg: "bg-violet-50", iconColor: "text-violet-500" }
};

export function getTrustIcon(iconKey) {
  return TRUST_ICONS[iconKey] || TRUST_ICONS.verified;
}

/** Exclusive offers carousel — flat Remix on gradient cards */
export const OFFER_ICONS = {
  car: wrapFlat(RiTaxiLine),
  holiday: wrapFlat(RiUmbrellaLine),
  route: wrapFlat(RiRouteLine),
  airport: wrapFlat(RiFlightTakeoffLine),
  driver: wrapFlat(RiSteering2Line)
};

export function getOfferIcon(iconKey) {
  return OFFER_ICONS[iconKey] || OFFER_ICONS.car;
}

/** Holiday theme carousel — flat Remix with pastel chips */
export const HOLIDAY_THEME_ICONS = {
  beach: wrapFlat(RiSunLine),
  pilgrimage: wrapFlat(RiAncientGateLine),
  safari: wrapFlat(RiRoadsterLine),
  family: wrapFlat(RiTeamLine),
  luxury: wrapFlat(RiVipDiamondLine)
};

export const HOLIDAY_THEME_ICON_STYLES = {
  beach: "bg-sky-50 text-sky-500 ring-1 ring-sky-100",
  pilgrimage: "bg-amber-50 text-amber-500 ring-1 ring-amber-100",
  safari: "bg-emerald-50 text-emerald-500 ring-1 ring-emerald-100",
  family: "bg-violet-50 text-violet-500 ring-1 ring-violet-100",
  luxury: "bg-rose-50 text-rose-500 ring-1 ring-rose-100"
};

export function getHolidayThemeIcon(iconKey) {
  return HOLIDAY_THEME_ICONS[iconKey] || HOLIDAY_THEME_ICONS.beach;
}

/** Cab search FROM / TO field icons — flat Remix, light pastel chips */
export const SEARCH_FIELD_ICONS = {
  pickup: wrapFlat(RiMapPinLine),
  drop: wrapFlat(RiMapPin2Line),
  airport: wrapFlat(RiFlightTakeoffLine)
};

export const SEARCH_FIELD_ICON_CHIPS = {
  pickup: "flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-400 ring-1 ring-emerald-100",
  drop: "flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-400 ring-1 ring-rose-100",
  airport: "flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 text-sky-400 ring-1 ring-sky-100"
};
