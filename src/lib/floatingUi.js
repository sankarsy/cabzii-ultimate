/** Routes where floating widgets (chat, call FAB, sticky bar) should hide. */
export const FLOATING_UI_HIDDEN_PREFIXES = [
  "/admin",
  "/payment",
  "/login",
  "/cabs/passenger",
  "/drivers/passenger"
];

export function shouldHideFloatingUi(pathname) {
  if (!pathname) return false;
  return FLOATING_UI_HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
