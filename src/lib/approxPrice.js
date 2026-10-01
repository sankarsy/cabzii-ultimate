/** Catalog and package fares are starting figures, not a locked live quote. */

export const APPROX_PRICE_LABEL = "approx.";

export const APPROX_PRICE_DISCLAIMER =
  "Prices shown are approximate starting fares. The live quote can change with date, vehicle, extra km, tolls and parking.";

export function approxFromLabel(amountText) {
  const text = String(amountText || "").trim();
  if (!text) return "";
  if (/^approx/i.test(text)) return text;
  return `Approx. ${text}`;
}
