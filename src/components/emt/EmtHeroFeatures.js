"use client";

import Link from "next/link";
import { HERO_FEATURE_ICON_STYLES } from "../icons";
import { HERO_FEATURE_ICONS } from "../icons/heroIcons";
import { cn } from "../../lib/emt/cn";

const FEATURES = [
  { href: "/cabs", label: "Local Cab", iconKey: "deals" },
  { href: "/services/airport-taxi/chennai", label: "Airport Taxi", iconKey: "airport" },
  { href: "/services/outstation-cab/chennai", label: "Outstation", iconKey: "routes" },
  { href: "/call-driver", label: "Hire a Driver", iconKey: "driver" },
  { href: "/locations", label: "Locations", iconKey: "locations" },
  { href: "/holidays", label: "Tour Packages", iconKey: "packages" }
];

export default function EmtHeroFeatures() {
  return (
    <div className="emt-hero-features-scroll flex min-w-0 items-center gap-1 overflow-x-auto px-3 py-2.5 sm:gap-2 sm:px-4">
      {FEATURES.map((item) => {
        const Icon = HERO_FEATURE_ICONS[item.iconKey];
        return (
          <Link key={item.href} href={item.href} className="emt-hero-feature cabzii-tap shrink-0">
            <span
              className={cn("emt-hero-feature-icon", HERO_FEATURE_ICON_STYLES[item.iconKey])}
              aria-hidden
            >
              {Icon ? <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : null}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
