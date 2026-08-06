import { num, packageYouPay } from "./cabFare";

/** True only when admin set an explicit online discount %. */
export function packageHasManualDiscount(pkg) {
  return num(pkg?.discountPercentage) > 0;
}

/**
 * List / MRP used before applying discount.
 * With no discount → selling `price` (no phantom MRP).
 * With manual discount → `originalPrice` when set, else `price`.
 */
export function packageListPrice(pkg) {
  if (!pkg) return 0;
  const selling = num(pkg.price);
  const mrp = num(pkg.originalPrice);
  if (packageHasManualDiscount(pkg)) {
    return mrp > 0 ? mrp : selling;
  }
  return selling;
}

/** Final payable for cards / SEO “from” price. */
export function packageDisplayPrice(pkg) {
  if (!pkg) return 0;
  if (!packageHasManualDiscount(pkg)) return num(pkg.price);
  return packageYouPay(packageListPrice(pkg), num(pkg.discountPercentage));
}

/** Strikethrough MRP — only when a manual discount is active. */
export function packageStrikePrice(pkg) {
  if (!packageHasManualDiscount(pkg)) return 0;
  const list = packageListPrice(pkg);
  const pay = packageDisplayPrice(pkg);
  return list > pay ? list : 0;
}

/** Schema AggregateOffer high/low — only with a real promo. */
export function packageSchemaPriceRange(pkg) {
  if (!packageHasManualDiscount(pkg)) return null;
  const low = packageDisplayPrice(pkg);
  const high = packageListPrice(pkg);
  if (low > 0 && high > low) return { lowPrice: low, highPrice: high };
  return null;
}
