/** Smaller cars first, then family MPVs, SUVs and group vans. */
export const HOME_BODY_CLASS_ORDER = ["sedan", "hatchback", "mpv", "suv", "tempo", "other"];
export const HOME_CABS_LIMIT = 8;
export const HOME_CABS_FETCH = 24;

export function cabBodyClass(cab) {
  const text = `${cab.type || ""} ${cab.category || ""} ${cab.vehicleName || ""} ${cab.vehicleModel || ""} ${cab.title || ""} ${cab.model || ""}`.toLowerCase();
  if (/tempo|traveller|urbania|mini\s*bus|\bbus\b|\bvan\b/.test(text)) return "tempo";
  if (/dzire|amaze|ciaz|\bcity\b|verna|slavia|virtus|etios|xcent|premium\s*sedan|\bsedan\b/.test(text)) return "sedan";
  if (/hatch|\balto\b|\bi10\b|\bi20\b|wagon|celerio|tiago|punch/.test(text)) return "hatchback";
  if (/\bswift\b/.test(text) && !/dzire/.test(text)) return "hatchback";
  if (/mpv|muv|ertiga|xl6|carens|rumion|innova|crysta|hycross/.test(text)) return "mpv";
  if (/suv|fortuner|scorpio|xuv|safari|harrier|creta|seltos|bolero/.test(text)) return "suv";
  if (/luxury/.test(text)) return "sedan";
  return "other";
}

function bodyClassRank(cab) {
  const idx = HOME_BODY_CLASS_ORDER.indexOf(cabBodyClass(cab));
  return idx === -1 ? HOME_BODY_CLASS_ORDER.length : idx;
}

export function sortCabsForHome(list) {
  return [...list].sort((a, b) => {
    const classDiff = bodyClassRank(a) - bodyClassRank(b);
    if (classDiff !== 0) return classDiff;
    const featuredDiff = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    if (featuredDiff !== 0) return featuredDiff;
    const recommendedDiff = (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0);
    if (recommendedDiff !== 0) return recommendedDiff;
    return String(a.vehicleName || a.title || "").localeCompare(String(b.vehicleName || b.title || ""));
  });
}
