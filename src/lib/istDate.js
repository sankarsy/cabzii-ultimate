/** India calendar dates for customer booking search (matches backend Asia/Kolkata). */

export function istYmd(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function todayStr(date = new Date()) {
  return istYmd(date);
}

export function addIstDays(ymd, days) {
  const base = String(ymd || "").trim();
  const start = new Date(`${base}T12:00:00+05:30`);
  if (Number.isNaN(start.getTime())) return istYmd();
  return istYmd(new Date(start.getTime() + Number(days) * 24 * 60 * 60 * 1000));
}

/** Native `<input type="date">` only accepts yyyy-mm-dd. */
export function toDateInputValue(value) {
  const raw = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const slash = raw.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/);
  if (!slash) return "";
  const a = Number(slash[1]);
  const b = Number(slash[2]);
  const y = slash[3];
  if (a > 12) return `${y}-${String(b).padStart(2, "0")}-${String(a).padStart(2, "0")}`;
  return `${y}-${String(a).padStart(2, "0")}-${String(b).padStart(2, "0")}`;
}

/** Native `<input type="time">` expects HH:mm. */
export function toTimeInputValue(value) {
  const raw = String(value || "").trim();
  const m = raw.match(/^([01]?\d|2[0-3]):([0-5]\d)/);
  if (!m) return "";
  return `${String(m[1]).padStart(2, "0")}:${m[2]}`;
}

/** Next full hour in IST when the pickup date is today; otherwise 09:00. */
export function defaultPickupTime(dateYmd, now = new Date()) {
  if (toDateInputValue(dateYmd) !== istYmd(now)) return "09:00";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(now);
  let hour = Number(parts.find((p) => p.type === "hour")?.value || 0) + 1;
  if (hour > 23) return "23:30";
  return `${String(hour).padStart(2, "0")}:00`;
}
