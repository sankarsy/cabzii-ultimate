import { isValidIndianMobile, normalizeIndianMobile } from "./session";

export const ONBOARDING = {
  askPhone:
    "Hi there! 👋 I'm Zii, your Cabzii travel assistant.\n\nTo help with your enquiry, please share your 10-digit mobile number first.",
  invalidPhone:
    "That number doesn't look right. Please enter a valid 10-digit Indian mobile (starts with 6, 7, 8, or 9).",
  thankPhone:
    "Thanks! ✅ Mobile saved.\n\nMay I know your name? (Optional — type your name, or type Skip to continue.)",
  invalidName: "I didn't catch that. Share your name (at least 2 letters), or type Skip.",
  saving: "One moment — saving your details…",
  ready: (name) =>
    `Perfect${name && name !== "Guest" ? `, ${firstName(name)}` : ""}! 🎉\n\nYou can ask me about cabs, airport taxis, outstation routes, acting drivers, or holiday packages. How can I help today?`
};

function firstName(name) {
  return String(name || "there").trim().split(/\s+/)[0] || "there";
}

export function parseNameInput(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return null;
  if (/^(skip|no|na|n\/a)$/i.test(trimmed)) return "Guest";
  if (trimmed.length < 2) return null;
  if (/^\d+$/.test(trimmed)) return null;
  if (/^[^a-zA-Z\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F\u0980-\u09FF]{2,}$/.test(trimmed)) return null;
  return trimmed.replace(/\s+/g, " ");
}

export function parsePhoneInput(text) {
  const normalized = normalizeIndianMobile(text);
  if (!isValidIndianMobile(normalized)) return null;
  return normalized;
}

export function formatPhoneDisplay(mobile) {
  const m = normalizeIndianMobile(mobile);
  if (m.length !== 10) return mobile;
  return `+91 ${m.slice(0, 5)} ${m.slice(5)}`;
}
