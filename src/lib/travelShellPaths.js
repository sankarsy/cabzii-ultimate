/** Routes that use TravelLayoutClient (cabzii.in header + footer). Legacy Navbar/Footer must not render here. */
export const TRAVEL_SHELL_PREFIXES = [
  "/cabs",
  "/call-driver",
  "/drivers",
  "/drivers/results",
  "/holidays",
  "/tour-packages",
  "/buses",
  "/payment",
  "/login",
  "/my-bookings",
  "/search",
  "/locations",
  "/booking",
  "/account",
  "/cab-booking",
  "/acting-driver",
  "/routes",
  "/services",
  "/blogs",
  "/blog",
  "/testimonials",
  "/earn"
];

export function isTravelShellPath(pathname = "") {
  return TRAVEL_SHELL_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
