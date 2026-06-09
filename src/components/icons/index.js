/**
 * Lucide React icon system — consistent stroke, size, and visual weight sitewide.
 * Use getIcon(key) for CMS-driven iconKey fields.
 */
import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowRight,
  Armchair,
  Backpack,
  Briefcase,
  Building2,
  Bus,
  Calendar,
  Car,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Headphones,
  IndianRupee,
  Languages,
  Landmark,
  Lock,
  Luggage,
  Map,
  MapPin,
  MapPinned,
  Navigation,
  Phone,
  Plane,
  PlaneTakeoff,
  RefreshCw,
  Route,
  Search,
  Shield,
  ShieldCheck,
  Snowflake,
  Star,
  Tag,
  TrainFront,
  User,
  UserCheck,
  Users,
  Fuel
} from "lucide-react";

const STROKE = 1.75;

function wrapLucide(Icon, { fill } = {}) {
  return function LucideWrapped({ className = "h-5 w-5", strokeWidth = STROKE, ...props }) {
    return (
      <Icon
        className={className}
        strokeWidth={strokeWidth}
        fill={fill}
        aria-hidden="true"
        {...props}
      />
    );
  };
}

export const ShieldCheckIcon = wrapLucide(ShieldCheck);
export const MapPinIcon = wrapLucide(MapPin);
export const TagIcon = wrapLucide(Tag);
export const HeadsetIcon = wrapLucide(Headphones);
export const CarIcon = wrapLucide(Car);
export const LockIcon = wrapLucide(Lock);
export const UsersIcon = wrapLucide(Users);
export const UserCheckIcon = wrapLucide(UserCheck);
export const StarIcon = wrapLucide(Star);
export const StarFilledIcon = wrapLucide(Star, { fill: "currentColor" });
export const RefreshIcon = wrapLucide(RefreshCw);
export const ShieldIcon = wrapLucide(Shield);
export const CheckIcon = wrapLucide(Check);
export const ArrowRightIcon = wrapLucide(ArrowRight);
export const SeatIcon = wrapLucide(Armchair);
export const PersonIcon = wrapLucide(User);
export const SnowflakeIcon = wrapLucide(Snowflake);
export const BriefcaseIcon = wrapLucide(Briefcase);
export const RouteIcon = wrapLucide(Route);
export const ClockIcon = wrapLucide(Clock);
export const CalendarIcon = wrapLucide(Calendar);
export const UsersGroupIcon = wrapLucide(Users);
export const AlertIcon = wrapLucide(AlertTriangle);
export const PlaneIcon = wrapLucide(Plane);
export const PlaneTakeoffIcon = wrapLucide(PlaneTakeoff);
export const NavigationIcon = wrapLucide(Navigation);
export const LandmarkIcon = wrapLucide(Landmark);
export const SearchIcon = wrapLucide(Search);
export const MapPinnedIcon = wrapLucide(MapPinned);
export const MapIcon = wrapLucide(Map);
export const PhoneIcon = wrapLucide(Phone);
export const UserIcon = wrapLucide(User);
export const ChevronDownIcon = wrapLucide(ChevronDown);
export const ChevronRightIcon = wrapLucide(ChevronRight);
export const RupeeIcon = wrapLucide(IndianRupee);
export const RoadIcon = wrapLucide(Route);
export const HotelIcon = wrapLucide(Building2);
export const BusIcon = wrapLucide(Bus);
export const TrainIcon = wrapLucide(TrainFront);
export const BackpackIcon = wrapLucide(Backpack);
export const LuggageIcon = wrapLucide(Luggage);
export const FuelIcon = wrapLucide(Fuel);
export const LangIcon = wrapLucide(Languages);
export const TwoWayIcon = wrapLucide(ArrowLeftRight);

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
  twoWay: TwoWayIcon,
  hotel: HotelIcon,
  bus: BusIcon,
  train: TrainIcon,
  holiday: BackpackIcon,
  holidays: BackpackIcon,
  backpack: BackpackIcon,
  luggage: LuggageIcon,
  fuel: FuelIcon,
  ac: SnowflakeIcon
};

/** Home hero travel tabs */
export const HERO_TAB_ICONS = {
  cabs: CarIcon,
  drivers: UserCheckIcon,
  flights: PlaneIcon,
  hotels: HotelIcon,
  holidays: BackpackIcon,
  buses: BusIcon,
  trains: TrainIcon
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
