/** Single source for homepage marketing numbers — keep all trust sections aligned. */
export const MARKETING_STATS = {
  happyCustomers: 50000,
  happyCustomersLabel: "50K+",
  tripsCompleted: 50000,
  verifiedDrivers: 150,
  citiesCovered: 25,
  rating: "4.9"
};

export const WHY_STATS = [
  { value: MARKETING_STATS.happyCustomersLabel, label: "Happy customers" },
  { value: "Best Price", label: "Guarantee" },
  { value: "24×7", label: "Support" },
  { value: "Secure", label: "OTP booking" }
];

export const TRUST_COUNTERS = [
  {
    label: "Happy customers",
    value: MARKETING_STATS.happyCustomers,
    suffix: "+",
    iconKey: "rated",
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    label: "Trips completed",
    value: MARKETING_STATS.tripsCompleted,
    suffix: "+",
    iconKey: "trips",
    color: "text-[var(--cabzii-brand)]",
    bg: "bg-blue-50"
  },
  {
    label: "Verified drivers",
    value: MARKETING_STATS.verifiedDrivers,
    suffix: "+",
    iconKey: "verified",
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    label: "Cities covered",
    value: MARKETING_STATS.citiesCovered,
    suffix: "+",
    iconKey: "locations",
    color: "text-violet-600",
    bg: "bg-violet-50"
  }
];
