"use client";

import CustomerTripTracker from "../../../../components/tracking/CustomerTripTracker";

export default function TrackTripPage({ params }) {
  return <CustomerTripTracker bookingId={params.id} />;
}
