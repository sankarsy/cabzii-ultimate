"use client";

import { HERO_TABS } from "../../lib/emt/constants";
import { cn } from "../../lib/emt/cn";
import { HOME_CATEGORY_ICON_STYLES } from "../icons";
import { HERO_TAB_ICONS } from "../icons/heroIcons";

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
        const iconTone = isActive ? styles.active : styles.idle;

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
                <TabIcon className="h-[1.0625rem] w-[1.0625rem] sm:h-[1.125rem] sm:w-[1.125rem]" />
              ) : null}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
