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
  if (/\bpremium\b|\bciaz\b|\bverna\b/.test(blob)) return "premium";
  const bucket = cabTypeBucket(cab);
  if (bucket === "Bus" || bucket === "Van") return "van";
  if (bucket === "MPV") return "mpv";
  if (bucket === "Hatchback") return "hatch";
  if (bucket === "SUV") return /innova|crysta/i.test(blob) ? "innova" : "mpv";
  return "sedan";
}

export const CAB_ILLUSTRATION_TONE = {
  hatch: "#F4F7FB",
  sedan: "#1E40AF",
  premium: "#C5CEDA",
  mpv: "#F7F8FA",
  innova: "#8E98AA",
  van: "#F4F7FB"
};
