export const TOKEN_KEY = "cabzii_token";
export const USER_KEY = "cabzii_user";
export const ADMIN_TOKEN_KEY = "cabzii_admin_token";

/**
 * Allow only digits while typing.
 */
export function sanitizeMobileInput(value) {
  let digits = String(value || "").replace(/\D/g, "");

  if (digits.startsWith("91") && digits.length > 10) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0") && digits.length > 10) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 10);
}

/**
 * Return valid 10-digit mobile number.
 */
export function normalizeMobileInput(value) {
  const digits = sanitizeMobileInput(value);

  return digits.length === 10 ? digits : "";
}

/**
 * Format display number.
 */
export function formatMobileDisplay(mobileNumber) {
  const m = normalizeMobileInput(mobileNumber);

  if (m.length !== 10) {
    return mobileNumber || "";
  }

  return `+91 ${m.slice(0, 5)} ${m.slice(5)}`;
}

/**
 * OTP validation (6-digit).
 */
export function sanitizeOtpInput(value) {
  return String(value || "")
    .replace(/\D/g, "")
    .slice(0, 6);
}

export function isValidOtp(value) {
  return sanitizeOtpInput(value).length === 6;
}

/**
 * Safe user object.
 */
export function sanitizeUser(raw) {
  if (!raw) return null;

  return {
    id: raw._id || raw.id || "",

    mobileNumber:
      raw.mobileNumber || raw.phone || "",

    role: raw.role || "customer",

    name: raw.name || "",

    createdAt: raw.createdAt || null,
  };
}

/**
 * Get JWT token.
 */
export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

/** 
 * Get logged-in user.
 */
export function getUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(USER_KEY);

    return raw
      ? sanitizeUser(JSON.parse(raw))
      : null;
  } catch (error) {
    console.error("Invalid user session");

    clearSession();

    return null;
  }
}

/**
 * Save login session.
 */
export function setSession(token, user) {
  if (typeof window === "undefined") {
    return;
  }

  const safeUser = sanitizeUser(user);

  localStorage.setItem(TOKEN_KEY, token);

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(safeUser)
  );

  if (
    ["super_admin", "vendor_admin"].includes(
      safeUser?.role
    )
  ) {
    localStorage.setItem(
      ADMIN_TOKEN_KEY,
      token
    );
  }

  window.dispatchEvent(
    new Event("cabzii-auth")
  );
}

/**
 * Logout.
 */
export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);

  localStorage.removeItem(USER_KEY);

  localStorage.removeItem(ADMIN_TOKEN_KEY);

  window.dispatchEvent(
    new Event("cabzii-auth")
  );
}

/**
 * Check auth state.
 */
export function isLoggedIn() {
  return Boolean(getToken());
}

/**
 * JWT headers.
 */
export function authHeaders(extra = {}) {
  const token = getToken();

  return {
    ...extra,

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

/**
 * Auto logout on token expiry.
 */
export function isTokenExpired(token) {
  try {
    if (!token) return true;

    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

/**
 * Validate existing session.
 */
export function validateSession() {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
    clearSession();

    return false;
  }

  return true;
}