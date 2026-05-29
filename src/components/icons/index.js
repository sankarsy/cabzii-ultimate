/**
 * Shared stroke icons (Lucide-style, 24×24).
 * Use getIcon(key) for CMS-driven iconKey fields.
 */

function Svg({ className, children, strokeWidth = 2, fill = "none", ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill}
      className={className}
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function ShieldCheckIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  );
}

export function MapPinIcon(props) {
  return (
    <Svg {...props}>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

export function TagIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <path d="M7 7h.01" />
    </Svg>
  );
}

export function HeadsetIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 11h3a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H3v-4Z" />
      <path d="M21 11h-3a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h3v-4Z" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

export function CarIcon(props) {
  return (
    <Svg {...props}>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 5c-.3-.8-1-1.3-1.8-1.3H7.8c-.8 0-1.5.5-1.8 1.3L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
      <path d="M7 17h10" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </Svg>
  );
}

export function LockIcon(props) {
  return (
    <Svg {...props}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

export function UsersIcon(props) {
  return (
    <Svg {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

export function UserCheckIcon(props) {
  return (
    <Svg {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="m16 11 2 2 4-4" />
    </Svg>
  );
}

export function StarIcon(props) {
  return (
    <Svg {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Svg>
  );
}

export function StarFilledIcon({ className, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function RefreshIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </Svg>
  );
}

export function ShieldIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

export function CheckIcon(props) {
  return (
    <Svg {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

export function ArrowRightIcon(props) {
  return (
    <Svg {...props} strokeWidth={2.5}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}

export function SeatIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 18v-5a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v5" />
      <path d="M8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
      <path d="M4 18h16" />
    </Svg>
  );
}

export function PersonIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </Svg>
  );
}

export function SnowflakeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 2v20M12 2l3 4M12 2 9 6M12 22l3-4M12 22l-3-4M2 12h20M2 12l4 3M2 12l4-3M22 12l-4 3M22 12l-4-3" />
    </Svg>
  );
}

export function BriefcaseIcon(props) {
  return (
    <Svg {...props}>
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </Svg>
  );
}

export function RouteIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7H11a3.5 3.5 0 0 1 0-7H17" />
      <circle cx="18" cy="5" r="3" />
    </Svg>
  );
}

export function ClockIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </Svg>
  );
}

export function CalendarIcon(props) {
  return (
    <Svg {...props}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </Svg>
  );
}

export function UsersGroupIcon(props) {
  return (
    <Svg {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

export function AlertIcon(props) {
  return (
    <Svg {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4M12 17h.01" />
    </Svg>
  );
}

/** Side-view plane — used on cards/meta */
export function PlaneIcon(props) {
  return (
    <Svg {...props}>
      <path d="M17.8 19.2 16 11 22 2 13 21 11 13 3 11" />
    </Svg>
  );
}

/** Takeoff plane + runway — clearer for airport transfer tab */
export function PlaneTakeoffIcon(props) {
  return (
    <Svg {...props}>
      <path d="M2 22h20" />
      <path d="M6 12V2h4v3.97l7.49 3.74a1 1 0 0 1 .51.87V14h-4.49L10 22h-4l1.03-8H2V12l4-1.5V2h4v8.5L6 12z" />
    </Svg>
  );
}

/** Local city trips */
export function NavigationIcon(props) {
  return (
    <Svg {...props}>
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </Svg>
  );
}

/** Tour packages */
export function LandmarkIcon(props) {
  return (
    <Svg {...props}>
      <line x1="3" x2="21" y1="22" y2="22" />
      <line x1="6" x2="6" y1="18" y2="11" />
      <line x1="10" x2="10" y1="18" y2="11" />
      <line x1="14" x2="14" y1="18" y2="11" />
      <line x1="18" x2="18" y1="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </Svg>
  );
}

export function SearchIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Svg>
  );
}

/** Drop / destination pin */
export function MapPinnedIcon(props) {
  return (
    <Svg {...props}>
      <path d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.612 6 8a6 6 0 0 1 12 0Z" />
      <circle cx="12" cy="8" r="2" />
      <path d="M8.714 14.7 5 21h14l-3.714-6.3" />
    </Svg>
  );
}

export function MapIcon(props) {
  return (
    <Svg {...props}>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" x2="9" y1="3" y2="18" />
      <line x1="15" x2="15" y1="6" y2="21" />
    </Svg>
  );
}

export function PhoneIcon(props) {
  return (
    <Svg {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );
}

export function UserIcon(props) {
  return (
    <Svg {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

export function ChevronDownIcon(props) {
  return (
    <Svg {...props}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function ChevronRightIcon(props) {
  return (
    <Svg {...props}>
      <path d="m9 18 6-6-6-6" />
    </Svg>
  );
}

export function RupeeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 3h12M6 8h12M6 13c6.627 0 12 2.239 12 5s-5.373 5-12 5" />
    </Svg>
  );
}

export function RoadIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 19l4-14M16 5l4 14M9 19h6M10 12h4" />
    </Svg>
  );
}

export function LangIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  );
}

export function TwoWayIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18" />
    </Svg>
  );
}

/** Registry for CMS iconKey strings */
export const ICON_REGISTRY = {
  shield: ShieldCheckIcon,
  shieldCheck: ShieldCheckIcon,
  tracking: MapPinIcon,
  mapPin: MapPinIcon,
  tag: TagIcon,
  headset: HeadsetIcon,
  support: HeadsetIcon,
  pickup: CarIcon,
  car: CarIcon,
  lock: LockIcon,
  secure: LockIcon,
  users: UsersIcon,
  driver: UserCheckIcon,
  pin: MapPinIcon,
  star: StarIcon,
  verified: UserCheckIcon,
  price: RupeeIcon,
  cancel: RefreshIcon,
  navigation: NavigationIcon,
  landmark: LandmarkIcon,
  search: SearchIcon,
  mapPinned: MapPinnedIcon,
  refresh: RefreshIcon,
  check: CheckIcon,
  seat: SeatIcon,
  person: PersonIcon,
  snowflake: SnowflakeIcon,
  briefcase: BriefcaseIcon,
  route: RouteIcon,
  clock: ClockIcon,
  calendar: CalendarIcon,
  alert: AlertIcon,
  plane: PlaneIcon,
  planeTakeoff: PlaneTakeoffIcon,
  airport: PlaneTakeoffIcon,
  map: MapIcon,
  phone: PhoneIcon,
  user: UserIcon,
  arrowRight: ArrowRightIcon,
  rupee: RupeeIcon,
  road: RoadIcon,
  lang: LangIcon,
  twoWay: TwoWayIcon
};

export function getIcon(iconKey) {
  return ICON_REGISTRY[iconKey] || null;
}

/** Why Choose Us — pastel circle colors */
export const WHY_ICON_STYLES = {
  shield: { iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  tracking: { iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  tag: { iconBg: "bg-orange-50", iconColor: "text-orange-600" },
  headset: { iconBg: "bg-violet-50", iconColor: "text-violet-600" },
  pickup: { iconBg: "bg-rose-50", iconColor: "text-rose-600" },
  lock: { iconBg: "bg-sky-50", iconColor: "text-sky-600" }
};

/** Hero stats — soft brand-tinted circles */
export const STAT_ICON_STYLES = {
  users: { iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  car: { iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  driver: { iconBg: "bg-violet-50", iconColor: "text-violet-600" },
  pin: { iconBg: "bg-rose-50", iconColor: "text-rose-600" },
  star: { iconBg: "bg-amber-50", iconColor: "text-amber-600" }
};

/** Trust badges in hero search */
export const TRUST_ICON_STYLES = {
  verified: { iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  price: { iconBg: "bg-orange-50", iconColor: "text-orange-600" },
  support: { iconBg: "bg-violet-50", iconColor: "text-violet-600" },
  secure: { iconBg: "bg-sky-50", iconColor: "text-sky-600" },
  cancel: { iconBg: "bg-emerald-50", iconColor: "text-emerald-600" }
};

export const HERO_TAB_ICON_KEYS = {
  outstation: "route",
  local: "navigation",
  airport: "planeTakeoff",
  rental: "calendar",
  tour: "landmark"
};

/** Active / inactive colors for hero search tabs */
export const HERO_TAB_ICON_STYLES = {
  outstation: { active: "bg-violet-100 text-violet-700", idle: "bg-slate-100 text-slate-600" },
  local: { active: "bg-emerald-100 text-emerald-700", idle: "bg-slate-100 text-slate-600" },
  airport: { active: "bg-sky-100 text-sky-700", idle: "bg-slate-100 text-slate-600" },
  rental: { active: "bg-amber-100 text-amber-700", idle: "bg-slate-100 text-slate-600" },
  tour: { active: "bg-rose-100 text-rose-700", idle: "bg-slate-100 text-slate-600" }
};
