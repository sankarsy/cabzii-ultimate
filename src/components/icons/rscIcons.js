/** Plain SVGs for server components. Do not import lucide-react here — Next 14 RSC
 * cannot call lucide's createContext (`createContext is not a function`). */

export function IconStub(props) {
  return (
    <OutlineIcon {...props}>
      <circle cx="12" cy="12" r="9" />
    </OutlineIcon>
  );
}

function OutlineIcon({ className = "h-5 w-5", strokeWidth = 1.6, children, ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function Clock3(props) {
  return (
    <OutlineIcon {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16.5 12" />
    </OutlineIcon>
  );
}

export function CalendarCheck(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </OutlineIcon>
  );
}

export function IndianRupee(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m6 13 8.5 8" />
      <path d="M6 13h3" />
      <path d="M9 13c6.667 0 6.667-10 0-10" />
    </OutlineIcon>
  );
}

export function MapPin(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </OutlineIcon>
  );
}

export function ShieldCheck(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </OutlineIcon>
  );
}

export function Smartphone(props) {
  return (
    <OutlineIcon {...props}>
      <rect width="14" height="20" x="5" y="2" rx="2" />
      <path d="M12 18h.01" />
    </OutlineIcon>
  );
}

export function CarFront(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M10 2h4" />
      <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8" />
      <path d="M7 14h.01" />
      <path d="M17 14h.01" />
      <rect width="18" height="8" x="3" y="10" rx="2" />
      <path d="M5 18v2" />
      <path d="M19 18v2" />
    </OutlineIcon>
  );
}

export function UserRound(props) {
  return (
    <OutlineIcon {...props}>
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </OutlineIcon>
  );
}

export function Mail(props) {
  return (
    <OutlineIcon {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </OutlineIcon>
  );
}

export function Phone(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </OutlineIcon>
  );
}

export function ChevronRight(props) {
  return (
    <OutlineIcon {...props}>
      <path d="m9 18 6-6-6-6" />
    </OutlineIcon>
  );
}

export function ChevronLeft(props) {
  return (
    <OutlineIcon {...props}>
      <path d="m15 18-6-6 6-6" />
    </OutlineIcon>
  );
}

export function Search(props) {
  return (
    <OutlineIcon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </OutlineIcon>
  );
}

export function Check(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M20 6 9 17l-5-5" />
    </OutlineIcon>
  );
}

export function Pencil(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </OutlineIcon>
  );
}

export function ArrowLeftRight(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M8 7 4 11l4 4" />
      <path d="M4 11h16" />
      <path d="m16 17 4-4-4-4" />
    </OutlineIcon>
  );
}

export function Building2(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </OutlineIcon>
  );
}

export function GraduationCap(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.084a1 1 0 0 0 0 1.838l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </OutlineIcon>
  );
}

export function Plane(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </OutlineIcon>
  );
}

export function Route(props) {
  return (
    <OutlineIcon {...props}>
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" />
    </OutlineIcon>
  );
}

export function Car(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </OutlineIcon>
  );
}

export function Briefcase(props) {
  return (
    <OutlineIcon {...props}>
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </OutlineIcon>
  );
}

export function Clock(props) {
  return (
    <OutlineIcon {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </OutlineIcon>
  );
}

export function Calendar(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </OutlineIcon>
  );
}

export function LocateFixed(props) {
  return (
    <OutlineIcon {...props}>
      <line x1="2" x2="5" y1="12" y2="12" />
      <line x1="19" x2="22" y1="12" y2="12" />
      <line x1="12" x2="12" y1="2" y2="5" />
      <line x1="12" x2="12" y1="19" y2="22" />
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3" />
    </OutlineIcon>
  );
}

export function X(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </OutlineIcon>
  );
}

export function Send(props) {
  return (
    <OutlineIcon {...props}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </OutlineIcon>
  );
}

export function ChevronDown(props) {
  return (
    <OutlineIcon {...props}>
      <path d="m6 9 6 6 6-6" />
    </OutlineIcon>
  );
}

export function ListFilter(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M3 6h18" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </OutlineIcon>
  );
}

export function ArrowUpDown(props) {
  return (
    <OutlineIcon {...props}>
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </OutlineIcon>
  );
}

export function Sparkles(props) {
  return (
    <OutlineIcon {...props}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </OutlineIcon>
  );
}

export function Bus(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M8 6v6" />
      <path d="M16 6v6" />
      <path d="M2 12h20" />
      <path d="M7 18h.01" />
      <path d="M17 18h.01" />
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="M4 20v2" />
      <path d="M20 20v2" />
    </OutlineIcon>
  );
}

export function Palmtree(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M13 8c0-2.8-2.2-5-5-5S3 5.2 3 8c0 1.6.8 3 2 4" />
      <path d="M17 16a5 5 0 0 0-5-5 5 5 0 0 0 5-5" />
      <path d="M13 8a5 5 0 0 0 5 5" />
      <path d="M13 8v13" />
    </OutlineIcon>
  );
}

export function Star(props) {
  return (
    <OutlineIcon {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </OutlineIcon>
  );
}

export function BookOpen(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </OutlineIcon>
  );
}

export function FileText(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </OutlineIcon>
  );
}

export function HelpCircle(props) {
  return (
    <OutlineIcon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </OutlineIcon>
  );
}

export function LogIn(props) {
  return (
    <OutlineIcon {...props}>
      <path d="m10 17 5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    </OutlineIcon>
  );
}

export function MessageCircle(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </OutlineIcon>
  );
}

export function Wallet(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2.3" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </OutlineIcon>
  );
}

export function Snowflake(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M12 2v20" />
      <path d="m4.93 4.93 14.14 14.14" />
      <path d="M2 12h20" />
      <path d="m4.93 19.07 14.14-14.14" />
    </OutlineIcon>
  );
}

export function Luggage(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 20v2" />
      <path d="M14 20v2" />
    </OutlineIcon>
  );
}

export function Fuel(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      <path d="M7 10h6" />
      <path d="M19 7.5V18a2.5 2.5 0 0 1-5 0" />
      <path d="M15 4h4l2 3v4" />
    </OutlineIcon>
  );
}

export const PersonIcon = UserRound;
export const SnowflakeIcon = Snowflake;
export const LuggageIcon = Luggage;
export const FuelIcon = Fuel;

/** Named aliases so leftover `lucide-react` imports never resolve to undefined. */
export const AlertTriangle = IconStub;
export const Armchair = IconStub;
export const ArrowRight = ChevronRight;
export const ArrowRightLeft = ArrowLeftRight;
export const Backpack = IconStub;
export const BadgeCheck = ShieldCheck;
export const BarChart3 = IconStub;
export const BedDouble = IconStub;
export const Binoculars = IconStub;
export const CalendarDays = Calendar;
export const CarTaxiFront = CarFront;
export const Church = IconStub;
export const CircleUser = UserRound;
export const ClipboardList = IconStub;
export const Copy = IconStub;
export const Download = IconStub;
export const ExternalLink = IconStub;
export const Eye = IconStub;
export const EyeOff = IconStub;
export const Gem = IconStub;
export const GripVertical = IconStub;
export const Headphones = IconStub;
export const Heart = IconStub;
export const Languages = IconStub;
export const Landmark = IconStub;
export const Layers = IconStub;
export const LayoutDashboard = IconStub;
export const Link2 = IconStub;
export const Lock = IconStub;
export const Map = IconStub;
export const MapPinned = MapPin;
export const Moon = IconStub;
export const Navigation = IconStub;
export const Newspaper = IconStub;
export const Nfc = IconStub;
export const Package = IconStub;
export const Percent = IconStub;
export const PlaneTakeoff = Plane;
export const Plus = IconStub;
export const Power = IconStub;
export const PowerOff = IconStub;
export const Radio = IconStub;
export const RefreshCw = IconStub;
export const Settings = IconStub;
export const Share2 = IconStub;
export const Shield = ShieldCheck;
export const ShipWheel = IconStub;
export const Sun = IconStub;
export const Sunrise = IconStub;
export const Sunset = IconStub;
export const Tag = IconStub;
export const Ticket = IconStub;
export const TrainFront = IconStub;
export const Trash2 = IconStub;
export const Umbrella = IconStub;
export const User = UserRound;
export const UserCheck = UserRound;
export const UserCircle = UserRound;
export const Users = UserRound;
export const UsersRound = UserRound;
export const Wind = IconStub;
