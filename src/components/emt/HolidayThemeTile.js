import Link from "next/link";
import {
  getHolidayThemeIcon,
  HOLIDAY_THEME_CHIP_STYLES,
  HOLIDAY_THEME_CHIP_STYLES_ON_DARK
} from "../icons/heroIcons";

const SIZE = {
  default: {
    wrap: "min-w-[5.25rem] flex-1 basis-0 max-w-[7.25rem] sm:min-w-0",
    box: "h-[5.25rem] w-[5.25rem] sm:h-24 sm:w-24",
    icon: "h-8 w-8 sm:h-9 sm:w-9",
    label: "text-[11px] sm:text-sm"
  },
  compact: {
    wrap: "min-w-[4.5rem] flex-1 basis-0 max-w-[5.5rem]",
    box: "h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20",
    icon: "h-7 w-7 sm:h-8 sm:w-8",
    label: "text-[10px] sm:text-[11px]"
  }
};

export default function HolidayThemeTile({ theme, size = "default", variant = "light", className = "" }) {
  const key = theme.iconKey || theme.id;
  const ThemeIcon = getHolidayThemeIcon(key);
  const chipStyle =
    variant === "onDark"
      ? HOLIDAY_THEME_CHIP_STYLES_ON_DARK[key] || HOLIDAY_THEME_CHIP_STYLES_ON_DARK.beach
      : HOLIDAY_THEME_CHIP_STYLES[key] || HOLIDAY_THEME_CHIP_STYLES.beach;
  const s = SIZE[size] || SIZE.default;
  const labelClass =
    variant === "onDark"
      ? "text-white/95 group-hover:text-white"
      : "text-slate-700 group-hover:text-slate-900";

  return (
    <Link
      href={theme.href || `/holidays?category=${encodeURIComponent(theme.category || key)}`}
      className={`cabzii-tap group mx-auto flex shrink-0 snap-center flex-col items-center gap-2.5 transition duration-200 hover:-translate-y-0.5 ${s.wrap} ${className}`}
    >
      <span
        className={`flex items-center justify-center rounded-2xl transition duration-200 group-hover:scale-[1.04] group-hover:shadow-md ${chipStyle} ${s.box}`}
      >
        <ThemeIcon className={s.icon} strokeWidth={1.75} />
      </span>
      <p className={`line-clamp-2 w-full text-center font-semibold leading-snug ${labelClass} ${s.label}`}>
        {theme.title}
      </p>
    </Link>
  );
}
