export const CHECKOUT_KEY = "cabzii-checkout";

export function loadCheckoutDraft() {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(CHECKOUT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCheckoutDraft(draft) {
  if (typeof window === "undefined") return;
  try {
    const existing = loadCheckoutDraft();
    sessionStorage.setItem(
      CHECKOUT_KEY,
      JSON.stringify({
        ...existing,
        ...draft,
        savedAt: Date.now()
      })
    );
  } catch {
    /* storage unavailable */
  }
}

export function clearCheckoutDraft() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(CHECKOUT_KEY);
  } catch {
    /* ignore */
  }
}
