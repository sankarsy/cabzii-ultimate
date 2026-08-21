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
