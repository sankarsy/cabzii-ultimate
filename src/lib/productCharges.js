/** Shared additional-charge rows for cab and driver booking pages. */

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
