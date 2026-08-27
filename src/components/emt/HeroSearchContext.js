"use client";

import { createContext, useContext, useMemo, useState } from "react";

const HeroSearchContext = createContext(null);

export function HeroSearchProvider({ children, defaultTab = "cabs" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab]);

  return <HeroSearchContext.Provider value={value}>{children}</HeroSearchContext.Provider>;
}

export function useHeroSearch() {
  return useContext(HeroSearchContext);
}
