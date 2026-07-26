"use client";

import { HERO_TABS } from "../../lib/emt/constants";
import { cn } from "../../lib/emt/cn";
import { HOME_CATEGORY_ICON_STYLES } from "../icons";
import { HERO_TAB_ICONS } from "../icons/heroIcons";

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
  const isShell = variant === "shell" || variant === "nav";

  return (
    <div
      className={`emt-category-scroll flex min-w-0 gap-0 overflow-x-auto px-1 sm:px-3 ${isShell ? "emt-shell-category-scroll" : ""} ${className}`}
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
              e.stopPropagation();
              setActiveTab(tab.id);
            }}
            aria-pressed={isActive}
            className={cn(
              "emt-category-tab cabzii-tap shrink-0",
              isShell && "emt-shell-category-tab",
              isActive && (isShell ? "emt-shell-category-tab-active" : "emt-category-tab-active")
            )}
          >
            <span className={cn("emt-category-tab-icon", iconTone)} aria-hidden>
              {TabIcon ? (
                <TabIcon
                  className={isShell ? "h-[1.25rem] w-[1.25rem]" : "h-[1.0625rem] w-[1.0625rem] sm:h-[1.125rem] sm:w-[1.125rem]"}
                  strokeWidth={isShell ? 1.75 : undefined}
                />
              ) : null}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
