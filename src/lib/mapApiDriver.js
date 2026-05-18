/**
 * Map Mongo/API driver document to the shape expected by DriverServiceCard.
 */
export function mapApiDriverToServiceCard(doc) {
  const id = String(doc._id ?? doc.id ?? "");
  const hourly = Number(doc.pricing?.hourly) || 0;
  const day = Number(doc.pricing?.day) || 0;
  const extraHour = Number(doc.pricing?.extraHour) || 0;
  const fourHr = hourly > 0 ? Math.round(hourly * 4) : day > 0 ? Math.max(1, Math.round(day / 2)) : 0;
  const twelveHr = hourly > 0 ? Math.round(hourly * 12) : day > 0 ? Math.round(day * 1.25) : 0;
  const rating = doc.rating != null && doc.rating !== "" ? String(doc.rating) : "—";
  const subtitle = [doc.vendor, doc.experience].filter(Boolean).join(" · ") || "—";

  return {
    id,
    serviceTitle: doc.name,
    serviceSubtitle: subtitle,
    type: "standard",
    rating,
    pricing: {
      hourly,
      day,
      extraHour,
      "4 hour": fourHr,
      "12 hour": twelveHr
    },
    discountPercentage: 0,
    trips: doc.trips,
    experience: doc.experience,
    languages: doc.languages ?? [],
    supportedVehicles: doc.supportedVehicles ?? []
  };
}
