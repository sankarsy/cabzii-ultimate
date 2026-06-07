export function buildBookingStatsMap(bookings) {
  const byItem = {};
  let totalCount = 0;
  let totalAmount = 0;

  for (const booking of bookings) {
    totalCount += 1;
    totalAmount += Number(booking?.amount || 0);

    const type = booking?.type || "cab";
    const id = String(booking?.itemId || "");
    if (!id) continue;

    const key = `${type}:${id}`;
    if (!byItem[key]) {
      byItem[key] = { count: 0, total: 0 };
    }
    byItem[key].count += 1;
    byItem[key].total += Number(booking?.amount || 0);
  }

  return { byItem, totalCount, totalAmount };
}

export function catalogItemBookingKey(tabKey, item) {
  const id = String(item?._id || item?.id || "");
  if (!id) return "";
  if (tabKey === "cabs") return `cab:${id}`;
  if (tabKey === "drivers") return `driver:${id}`;
  if (tabKey === "packages") return `tour:${id}`;
  return "";
}

export function formatBookingStatsLine(stats) {
  if (!stats || stats.count === 0) return "0 bookings · ₹0";
  return `${stats.count} booking${stats.count === 1 ? "" : "s"} · ₹${stats.total.toLocaleString("en-IN")}`;
}
