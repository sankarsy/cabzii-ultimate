"use client";

import DriverTripDetail from "../../../../components/driver/DriverTripDetail";

export default function DriverTripDetailPage({ params }) {
  return <DriverTripDetail tripId={params.id} />;
}
