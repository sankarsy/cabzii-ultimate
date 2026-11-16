"use client";

import Link from "next/link";
import { getTrustIcon } from "../icons/heroIcons";
import { TRUST_SIGNALS } from "../../lib/trustSignals";

export default function TrustStrip({ className = "" }) {
  return (
    <section className={`bg-[var(--cabzii-bg)] ${className}`}>
      <div className="section-shell py-4 sm:py-5">
        <div className="scroll-x-touch flex items-center justify-start gap-x-6 gap-y-2 overflow-x-auto pb-0.5 sm:justify-center">
          {TRUST_SIGNALS.map((item) => {
            const Icon = getTrustIcon(item.iconKey);
            const inner = (
              <>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[var(--cabzii-brand)]" aria-hidden>
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="whitespace-nowrap text-sm font-semibold text-[var(--cabzii-muted)]">{item.label}</span>
              </>
            );
            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--cabzii-muted)] hover:text-[var(--cabzii-ink)]"
                >
                  {inner}
                </Link>
              );
            }
            return (
              <span key={item.label} className="inline-flex items-center gap-2">
                {inner}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
