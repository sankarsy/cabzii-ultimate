/** Homepage trust labels — only statements Cabzii can support without invented counts. */
export const MARKETING_STATS = {
  happyCustomers: 0,
  happyCustomersLabel: "OTP",
  tripsCompleted: 0,
  verifiedDrivers: 0,
  citiesCovered: 0,
  rating: ""
};

export const WHY_STATS = [
  { value: "OTP", label: "Secure booking" },
  { value: "Upfront", label: "Fares shown" },
  { value: "Chennai", label: "Home market" },
  { value: "WhatsApp", label: "Trip updates" }
];

export const TRUST_COUNTERS = [
  {
    label: "OTP booking",
    value: 0,
    display: "Secure",
    suffix: "",
    iconKey: "rated",
    color: "text-amber-400",
    bg: "bg-amber-50"
  },
  {
    label: "Published tariff",
    value: 0,
    display: "Chennai",
    suffix: "",
    iconKey: "trips",
    color: "text-sky-400",
    bg: "bg-blue-50"
  },
  {
    label: "Driver assigned after booking",
    value: 0,
    display: "Call Driver",
    suffix: "",
    iconKey: "verified",
    color: "text-emerald-400",
    bg: "bg-emerald-50"
  },
  {
    label: "Tamil Nadu first",
    value: 0,
    display: "South India",
    suffix: "",
    iconKey: "locations",
    color: "text-violet-400",
    bg: "bg-violet-50"
  }
];
