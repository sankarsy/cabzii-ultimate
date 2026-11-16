import { cabTypeBucket } from "./cabListing";
import { getCabVehicleName } from "./catalogDisplay";

/** Template cab silhouettes — hatch / sedan / mpv / innova / van. */
export function cabIllustrationKey(cab = {}) {
  const blob = [
    cab.type,
    cab.category,
    cab.title,
    cab.vehicleModel,
    cab.vehicleName,
    cab.model,
    cab.name,
    getCabVehicleName(cab)
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/tempo|traveller|urbania|mini\s*bus|\bvan\b|coach|12\s*seater|17\s*seater/.test(blob)) return "van";
  if (/innova|crysta|hycross/.test(blob)) return "innova";
  if (/ertiga|carens|rumion|xl6|\bmpv\b|\bmuv\b/.test(blob)) return "mpv";
  if (
    /hatch|wagon|alto|i10|i20|celerio|tiago|punch|baleno|santro|figo|polo|jazz|ignis|glanza|kiger|magnite/.test(blob) ||
    (/\bswift\b/.test(blob) && !/dzire/.test(blob))
  ) {
    return "hatch";
  }
  if (/premium|city|etios|ciaz|verna/.test(blob)) return "sedan";
  const bucket = cabTypeBucket(cab);
  if (bucket === "Van") return "van";
  if (bucket === "Hatchback") return "hatch";
  if (bucket === "SUV") return /innova|crysta/i.test(blob) ? "innova" : "mpv";
  return "sedan";
}

export const CAB_ILLUSTRATION_TONE = {
  hatch: "#3F6FE8",
  sedan: "#1E40AF",
  mpv: "#FFFFFF",
  innova: "#8B97B5",
  van: "#1E40AF"
};
