import { resolveMediaUrl } from "./media";

/** Distinct placeholder images per vehicle — never one shared Fiat for all cabs. */
export const VEHICLE_STOCK_IMAGES = {
  dzire:
    "https://images.unsplash.com/photo-1621007947382-b6263ac8e237?auto=format&fit=crop&w=900&q=80",
  etios:
    "https://images.unsplash.com/photo-1552519507-da3b42c508e2?auto=format&fit=crop&w=900&q=80",
  wagon:
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80",
  hatchback:
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80",
  innova:
    "https://images.unsplash.com/photo-1563729784474-d77dcd085025?auto=format&fit=crop&w=900&q=80",
  ertiga:
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58dd?auto=format&fit=crop&w=900&q=80",
  suv:
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58dd?auto=format&fit=crop&w=900&q=80",
  tempo:
    "https://images.unsplash.com/photo-1570125909232-e097327a4962?auto=format&fit=crop&w=900&q=80",
  van:
    "https://images.unsplash.com/photo-1570125909232-e097327a4962?auto=format&fit=crop&w=900&q=80",
  bus:
    "https://images.unsplash.com/photo-1570125909232-e097327a4962?auto=format&fit=crop&w=900&q=80",
  sedan:
    "https://images.unsplash.com/photo-1621007947382-b6263ac8e237?auto=format&fit=crop&w=900&q=80"
};

function haystack(product = {}) {
  return [
    product.vehicleModel,
    product.title,
    product.name,
    product.examples,
    product.type,
    product.speciality
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/** Pick stock image key from product title / model / category. */
export function detectVehicleImageKey(product = {}) {
  const text = haystack(product);
  if (/wagon|swift|alto|i10|i20|hatch/.test(text)) return "wagon";
  if (/dzire/.test(text)) return "dzire";
  if (/etios|amaze|xcent|verna/.test(text)) return "etios";
  if (/innova|crysta|hycross|fortuner/.test(text)) return "innova";
  if (/ertiga|xl6|suv|xuv|creta|seltos/.test(text)) return "ertiga";
  if (/tempo|traveller|van|bus|coach/.test(text)) return "tempo";
  const type = String(product.type || "").toLowerCase();
  if (type.includes("hatch")) return "hatchback";
  if (type.includes("suv")) return "suv";
  if (type.includes("van") || type.includes("bus")) return "tempo";
  return "sedan";
}

export function stockImageForProduct(product = {}) {
  const key = detectVehicleImageKey(product);
  return VEHICLE_STOCK_IMAGES[key] || VEHICLE_STOCK_IMAGES.sedan;
}

/** Uploaded image first; otherwise type-aware stock photo (not one global fallback). */
export function resolveCabImage(cab = {}) {
  const uploaded = resolveMediaUrl(cab.image);
  if (uploaded) return uploaded;
  const fromGallery = resolveMediaUrl(Array.isArray(cab.gallery) ? cab.gallery[0] : "");
  if (fromGallery) return fromGallery;
  return stockImageForProduct(cab);
}

export function resolveDriverImage(driver = {}) {
  const uploaded = resolveMediaUrl(driver.image);
  if (uploaded) return uploaded;
  return stockImageForProduct({ ...driver, type: driver.type || "Sedan" });
}

export function resolvePackageImage(pkg = {}) {
  const uploaded = resolveMediaUrl(pkg.image);
  if (uploaded) return uploaded;
  return VEHICLE_STOCK_IMAGES.sedan;
}
