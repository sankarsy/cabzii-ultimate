export const LOCATION_POLL_MS = 18 * 1000;

export function isTrackableBooking(booking) {
  const type = String(booking?.type || "");
  return type === "cab" || type === "driver";
}

export function shouldShowTrackTrip(booking) {
  if (!isTrackableBooking(booking)) return false;
  const status = String(booking?.status || "");
  if (status === "cancelled" || status === "pending") return false;
  return status === "confirmed" || status === "finished";
}

export function trackingStateLabel(state) {
  switch (String(state || "").toLowerCase()) {
    case "live":
      return "LIVE";
    case "recent":
      return "RECENT";
    case "stale":
      return "STALE";
    case "finished":
      return "FINISHED";
    case "not_started":
      return "NOT STARTED";
    default:
      return "";
  }
}

export function formatUpdatedAgo(iso, now = Date.now()) {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "";
  const sec = Math.max(0, Math.round((now - t) / 1000));
  if (sec < 10) return "Updated just now";
  if (sec < 60) return `Updated ${sec} second${sec === 1 ? "" : "s"} ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `Updated ${min} minute${min === 1 ? "" : "s"} ago`;
  return `Updated ${new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;
}

export function trackingHeadline(data) {
  const status = String(data?.status || "");
  const state = String(data?.trackingState || "");
  if (status === "cancelled") return "This trip was cancelled";
  if (state === "finished" || status === "finished") return "Trip completed";
  if (state === "not_started") return "Tracking will be available when your trip starts.";
  if (state === "stale") return "Your Cab is on the way";
  if (state === "live" || state === "recent") return "Your Cab is on the way";
  return "Trip tracking";
}

export function locationErrorMessage(statusCode) {
  if (statusCode === 401) return "Please sign in to track this trip.";
  if (statusCode === 403) return "You cannot view this trip.";
  if (statusCode === 404) return "This trip is not available.";
  if (statusCode === 409) return "Tracking is not available for this trip.";
  if (statusCode === 400) return "Tracking is only available for cab trips.";
  return "Location is temporarily unavailable.";
}
