import { isValidIndianMobile, normalizeIndianMobile } from "./session";

export const ONBOARDING = {
  askName:
    "Hi there! 👋 I'm Zii, your Cabzii travel assistant.\n\nBefore we get started — may I know your name?",
  invalidName: "I didn't catch that. Could you share your name? (At least 2 letters, please.)",
  thankName: (name) =>
    `Lovely to meet you, ${firstName(name)}! 😊\n\nWhat's your 10-digit mobile number? We'll use it only to help with your cab or tour enquiry.`,
  invalidPhone:
    "That number doesn't look right. Please enter a valid 10-digit Indian mobile (starts with 6, 7, 8, or 9).",
  saving: "One moment — saving your details…",
  ready: (name) =>
    `Perfect, ${firstName(name)}! 🎉\n\nYou can ask me about cabs, airport taxis, outstation routes, acting drivers, or holiday packages. How can I help today?`
};

function firstName(name) {
  return String(name || "there").trim().split(/\s+/)[0] || "there";
}

export function parseNameInput(text) {
  const trimmed = String(text || "").trim();
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
