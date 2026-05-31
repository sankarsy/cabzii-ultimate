/** Shared additional-charge rows for cab, driver and holiday booking pages. */

export function buildStandardChargeItems({ extraKm, extraHr, nightCharge, serviceCharges = {} }) {
  const sc = serviceCharges || {};
  return [
    { label: "Extra KM Charge", value: `₹${extraKm}/km` },
    { label: "Extra Hour Charge", value: `₹${extraHr}/hr` },
    { label: "Drop Charge", value: sc.dropCharge != null ? String(sc.dropCharge) : "Contact Vendor" },
    {
      label: "Night Charges",
      value: nightCharge != null ? `₹${nightCharge} Extra (10 PM – 6 AM)` : "—"
    },
    { label: "Cancel Charge", value: sc.cancelCharge != null ? String(sc.cancelCharge) : "As per vendor policy" },
    { label: "Out of City (>40 km)", value: sc.outOfCity != null ? String(sc.outOfCity) : "Per trip quote" },
    { label: "Driver Allowance", value: "Included" },
    { label: "Toll, Parking & State Tax", value: "As per actuals" }
  ];
}

/** Holiday packages — toll, permit & driver bata billed separately from package fare. */
export function buildTourChargeItems({
  tollCharge = "As per actuals",
  permitCharge = "As per actuals",
  driverBata = "₹500/day"
} = {}) {
  return [
    { label: "Toll", value: tollCharge },
    { label: "Permit", value: permitCharge },
    { label: "Driver Bata", value: driverBata }
  ];
}
