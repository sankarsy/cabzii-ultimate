/** SSR-safe Indian number formatting (avoids Node vs browser locale hydration mismatch). */
export function formatInr(value) {
  const num = Math.round(Number(value) || 0);
  if (!Number.isFinite(num)) return "0";
  const negative = num < 0;
  const str = String(Math.abs(num));
  if (str.length <= 3) return `${negative ? "-" : ""}${str}`;
  const lastThree = str.slice(-3);
  const rest = str.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (rest ? "," : "") + lastThree;
  return `${negative ? "-" : ""}${grouped}`;
}

export function formatInrCurrency(value) {
  return `₹${formatInr(value)}`;
}
