import { num } from "./cabFare";

/** Discounts are disabled for all packages. */
export function packageHasManualDiscount() {
  return false;
}

/** Selling price shown on cards and booking. */
export function packageListPrice(pkg) {
  if (!pkg) return 0;
  return num(pkg.price) || num(pkg.originalPrice);
}

/** Final payable for cards / SEO “from” price. */
export function packageDisplayPrice(pkg) {
  return packageListPrice(pkg);
}

/** Strikethrough MRP — always hidden. */
export function packageStrikePrice() {
  return 0;
}

/** Schema AggregateOffer high/low — no promo range. */
export function packageSchemaPriceRange() {
  return null;
}
