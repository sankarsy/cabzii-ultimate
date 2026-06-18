const STORAGE_KEY = "cabzii-chat-session";
const MAX_STORED_MESSAGES = 50;

export function loadChatSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.name || !data?.mobile) return null;
    return {
      name: String(data.name),
      mobile: String(data.mobile),
      messages: Array.isArray(data.messages) ? data.messages : [],
      onboarded: true
    };
  } catch {
    return null;
  }
}

export function saveChatSession(session) {
  if (typeof window === "undefined") return;
  try {
    const messages = Array.isArray(session.messages) ? session.messages.slice(-MAX_STORED_MESSAGES) : [];
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        name: session.name,
        mobile: session.mobile,
        messages,
        onboarded: true,
        updatedAt: Date.now()
      })
    );
  } catch {
    /* ignore quota errors */
  }
}

export function clearChatSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function normalizeIndianMobile(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return "";
}

export function isValidIndianMobile(value) {
  const mobile = normalizeIndianMobile(value);
  return /^[6-9]\d{9}$/.test(mobile);
}
