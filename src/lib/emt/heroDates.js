import { addIstDays } from "../istDate";

/** Shared date formatting for EMT-style hero search cells */

const ISO_YMD = /^(\d{4})-(\d{2})-(\d{2})/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseYmd(iso) {
  const m = String(iso || "").trim().match(ISO_YMD);
  if (!m) return null;
  return { year: m[1], month: Number(m[2]), day: Number(m[3]) };
}

function istNoon(iso) {
  const p = parseYmd(iso);
  if (!p) return null;
  const stamp = `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}T12:00:00+05:30`;
  const d = new Date(stamp);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDayName(iso) {
  const d = istNoon(iso);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-IN", { weekday: "long", timeZone: "Asia/Kolkata" }).format(d);
}

export function formatEmtDate(iso) {
  const p = parseYmd(iso);
  if (!p) return "";
  return `${p.day} ${MONTHS[p.month - 1]}'${p.year}`;
}

export function formatEmtDateShort(iso) {
  const p = parseYmd(iso);
  if (!p) return { day: "", mon: "", wd: "" };
  const d = istNoon(iso);
  const wd = d
    ? new Intl.DateTimeFormat("en-IN", { weekday: "short", timeZone: "Asia/Kolkata" }).format(d).toUpperCase()
    : "";
  return { day: p.day, mon: MONTHS[p.month - 1].toUpperCase(), wd };
}

export function formatTime12(time24) {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function addDays(iso, days) {
  if (!iso) return "";
  return addIstDays(iso, days);
}

/** Open the native date/time picker from a fake overlay input (Chrome ignores most of the click otherwise). */
export function openNativePicker(event) {
  const el = event?.currentTarget;
  if (!el || typeof el.showPicker !== "function") return;
  try {
    el.showPicker();
  } catch {
    /* NotAllowedError if the picker is already open */
  }
}
