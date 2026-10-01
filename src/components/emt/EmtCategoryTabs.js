"use client";

import { HERO_TABS } from "../../lib/emt/constants";
import { cn } from "../../lib/emt/cn";
import { HOME_CATEGORY_ICON_STYLES } from "../icons";
import { HERO_TAB_ICONS } from "../icons/heroIcons";
import { useEffect, useRef } from "react";

/* Light, colourful icon tones for the shell tabs (no dark slate icons) */
const SHELL_ICON_TONES = {
  cabs: "text-sky-500",
  drivers: "text-violet-500",
  holidays: "text-emerald-500",
  hotels: "text-amber-500",
  flights: "text-blue-500",
  buses: "text-orange-500",
  trains: "text-indigo-500"
};

export default function EmtCategoryTabs({
  activeTab,
  setActiveTab,
  className = "",
  variant = "shell"
}) {
  const isNav = variant === "nav";
  const isShell = variant === "shell" || isNav;
  const scrollerRef = useRef(null);
  const skipScroll = useRef(true);

  useEffect(() => {
    if (isNav) return;
    if (skipScroll.current) {
      skipScroll.current = false;
      return;
    }
    const root = scrollerRef.current;
    if (!root) return;
    const active = root.querySelector("[aria-pressed='true']");
    if (!active || typeof active.scrollIntoView !== "function") return;
    active.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
  }, [activeTab, isNav]);

  return (
    <div
      ref={scrollerRef}
      role="navigation"
      aria-label="Book Cabs, Hire a Driver, Buses or Holidays"
      className={`emt-category-scroll flex min-w-0 gap-0 overflow-x-auto px-1 sm:px-3 ${
        isNav ? "emt-nav-category-scroll" : isShell ? "emt-shell-category-scroll" : ""
      } ${className}`}
    >
      {HERO_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const TabIcon = HERO_TAB_ICONS[tab.id];
        const styles = HOME_CATEGORY_ICON_STYLES[tab.id] || HOME_CATEGORY_ICON_STYLES.cabs;
        const iconTone = isShell
          ? SHELL_ICON_TONES[tab.id] || SHELL_ICON_TONES.cabs
          : isActive
            ? styles.active
            : styles.idle;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveTab(tab.id);
            }}
            aria-pressed={isActive}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "emt-category-tab cabzii-tap shrink-0",
              isNav && "emt-nav-category-tab",
              isShell && "emt-shell-category-tab",
              isActive && (isShell ? "emt-shell-category-tab-active" : "emt-category-tab-active")
            )}
          >
            <span className={cn("emt-category-tab-icon", iconTone)} aria-hidden>
              {TabIcon ? (
                <TabIcon
                  className={isNav ? "h-5 w-5" : isShell ? "h-6 w-6" : "h-[1.0625rem] w-[1.0625rem] sm:h-[1.125rem] sm:w-[1.125rem]"}
                  strokeWidth={isNav ? 1.7 : isShell ? 1.6 : 1.5}
                />
              ) : null}
            </span>
            <span className="emt-category-tab-label">
              <span className="lg:hidden">{tab.shortLabel || tab.label}</span>
              <span className="hidden lg:inline">{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
