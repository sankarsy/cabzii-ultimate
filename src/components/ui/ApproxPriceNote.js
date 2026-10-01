import { APPROX_PRICE_DISCLAIMER } from "../../lib/approxPrice";

export default function ApproxPriceNote({ className = "" }) {
  return (
    <p className={`mt-2 text-[11px] leading-snug text-slate-500 sm:text-xs ${className}`.trim()}>
      {APPROX_PRICE_DISCLAIMER}
    </p>
  );
}
