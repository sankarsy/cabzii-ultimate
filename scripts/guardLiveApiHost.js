/**
 * Blocks `npm run dev` / `npm run build` on the live API Windows host.
 * Reads .env.local because npm pre-scripts run before Next.js loads env.
 */
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (process.env[key] == null) process.env[key] = value;
  }
}

const protect = /^(1|true|yes)$/i.test(String(process.env.CABZII_PROTECT_LIVE_API || "").trim());
if (protect) {
  console.error(
    [
      "Refusing next dev/build on the live Cabzii API host.",
      "This PC serves https://api.cabzii.in (port 8000).",
      "Frontend SSG belongs on Vercel / CI, not this machine.",
      "Unset CABZII_PROTECT_LIVE_API only on a dedicated frontend machine."
    ].join("\n")
  );
  process.exit(1);
}
