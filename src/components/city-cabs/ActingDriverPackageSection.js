"use client";

import { useEffect, useState } from "react";
import CallDriverServiceGrid from "../call-driver/CallDriverServiceGrid";
import { CALL_DRIVER_SERVICES, mergeCallDriverServices } from "../../lib/callDriver";

export default function ActingDriverPackageSection({ pickup = "", initialServices = CALL_DRIVER_SERVICES }) {
  const [services, setServices] = useState(initialServices?.length ? initialServices : CALL_DRIVER_SERVICES);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/call-driver", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json?.data?.services) return;
        setServices(mergeCallDriverServices(json.data.services));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return <CallDriverServiceGrid services={services} pickup={pickup} />;
}
