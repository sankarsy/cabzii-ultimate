/**
 * Set CABZII_PROTECT_LIVE_API=1 on the Windows host that runs the live API
 * (api.cabzii.in / localhost:8000). That machine must not run next dev/build;
 * SSG would otherwise fetch every catalog/SEO slug against the live API.
 * Leave unset on Vercel and on dedicated frontend/CI machines.
 */
export function isLiveApiHostProtected() {
  return /^(1|true|yes)$/i.test(String(process.env.CABZII_PROTECT_LIVE_API || "").trim());
}
