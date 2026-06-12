/**
 * Vendor service category registry.
 *
 * Single source of truth for every business vertical a vendor can operate.
 * Adding a new vertical = adding one entry here (plus optional landing copy) —
 * no schema migrations or code rewrites: `Package.packageType` and admin
 * filters consume these keys as open strings.
 */
export const SERVICE_CATEGORIES = [
  { key: "taxi", label: "Taxi Services", active: true },
  { key: "tour-package", label: "Tour Packages", active: true },
  { key: "tempo-traveller", label: "Tempo Traveller Services", active: true },
  { key: "wedding-car", label: "Wedding Car Rental", active: true },
  { key: "corporate-travel", label: "Corporate Travel", active: true },
  { key: "airport-transfer", label: "Airport Transfers", active: true },
  /* Future-ready — flip `active` to launch, nothing else changes */
  { key: "hotel-package", label: "Hotel Packages", active: false },
  { key: "holiday-package", label: "Holiday Packages", active: false },
  { key: "pilgrimage-package", label: "Pilgrimage Packages", active: false },
  { key: "event-transport", label: "Event Transportation", active: false }
];

export const ACTIVE_SERVICE_CATEGORIES = SERVICE_CATEGORIES.filter((c) => c.active);

export function serviceCategoryLabel(key) {
  return SERVICE_CATEGORIES.find((c) => c.key === key)?.label || "";
}
