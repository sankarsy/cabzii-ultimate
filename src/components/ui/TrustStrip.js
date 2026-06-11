import Link from "next/link";
import { Star } from "lucide-react";
import { getIcon, TRUST_ICON_STYLES, UserCheckIcon } from "../icons";

const StarFilled = (props) => <Star {...props} fill="currentColor" strokeWidth={0} />;

const TRUST_ITEMS = [
  {
    label: "4.9 rated",
    icon: StarFilled,
    style: { iconBg: "bg-amber-50", iconColor: "text-amber-500" },
    href: "/testimonials"
  },
  { label: "Verified drivers", iconKey: "verified" },
  { label: "Upfront fares", iconKey: "price" },
  { label: "OTP secure booking", iconKey: "secure" },
  { label: "24/7 support", iconKey: "support" }
];

export default function TrustStrip({ className = "" }) {
  return (
    <section className={`border-b border-slate-200/80 bg-white ${className}`}>
      <div className="section-shell py-4 sm:py-5">
        <div className="scroll-x-touch flex items-center justify-start gap-2 overflow-x-auto pb-0.5 sm:justify-center sm:gap-3">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon || getIcon(item.iconKey) || UserCheckIcon;
            const style = item.style || TRUST_ICON_STYLES[item.iconKey] || TRUST_ICON_STYLES.verified;
            const inner = (
              <>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.iconBg} ${style.iconColor}`}
                  aria-hidden
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="whitespace-nowrap text-xs font-semibold text-slate-700 sm:text-sm">{item.label}</span>
              </>
            );
            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="cabzii-trust-pill cabzii-tap hover:border-[var(--cabzii-brand)]/25 hover:bg-blue-50/50"
                >
                  {inner}
                </Link>
              );
            }
            return (
              <span key={item.label} className="cabzii-trust-pill">
                {inner}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
