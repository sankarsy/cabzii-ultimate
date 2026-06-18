/** Shared date formatting for EMT-style hero search cells */

export function formatDayName(iso) {
  if (!iso) return "";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-IN", { weekday: "long" });
}

export function formatEmtDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  const day = d.getDate();
  const mon = d.toLocaleDateString("en-IN", { month: "short" });
  const yr = d.getFullYear();
  return `${day} ${mon}'${yr}`;
}

export function formatEmtDateShort(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  const day = d.getDate();
  const mon = d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
  const wd = d.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase();
  return { day, mon, wd };
}

export function formatTime12(time24) {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function addDays(iso, days) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}
