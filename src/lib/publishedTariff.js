/** Published Cabzii rate card — cars, vans, mini buses. Keep in sync with backend scripts/cabziiTariff.js */
export function tariffInr(n) {
  if (n == null || n === "") return "—";
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  return `₹${num.toLocaleString("en-IN")}/-`;
}

export const CAR_TARIFF = [
  { name: "Swift Dzire", seats: "4+1", local4: 1200, local8: 2400, extraKm: 15, extraHr: 220, outMin: 3250, outKm: 15, batta: 600 },
  { name: "Honda Amaze", seats: "4+1", local4: 1400, local8: 2800, extraKm: 16, extraHr: 350, outMin: 3500, outKm: 16, batta: 600 },
  { name: "Maruti Ertiga / Tour M", seats: "6+1", local4: 1800, local8: 3600, extraKm: 19, extraHr: 450, outMin: 4500, outKm: 19, batta: 600 },
  { name: "Kia Carens", seats: "7+1", local4: 1800, local8: 3600, extraKm: 19, extraHr: 450, outMin: 4500, outKm: 19, batta: 800 },
  { name: "Toyota Innova 6+1", seats: "6+1", local4: 1800, local8: 3600, extraKm: 19, extraHr: 450, outMin: 4500, outKm: 19, batta: 600 },
  { name: "Toyota Innova 7+1", seats: "7+1", local4: 1800, local8: 3600, extraKm: 19, extraHr: 450, outMin: 4500, outKm: 19, batta: 600 },
  { name: "Innova Crysta 6+1", seats: "6+1", local4: 2200, local8: 4400, extraKm: 22, extraHr: 500, outMin: 5000, outKm: 22, batta: 800 },
  { name: "Innova Crysta 7+1", seats: "7+1", local4: 2200, local8: 4400, extraKm: 22, extraHr: 500, outMin: 5000, outKm: 22, batta: 800 },
  { name: "Toyota Innova Hycross", seats: "6+1", local4: null, local8: 5500, extraKm: 28, extraHr: 600, outMin: 6250, outKm: 28, batta: 800 },
  { name: "Toyota Corolla Altis", seats: "4+1", local4: null, local8: null, extraKm: 25, extraHr: null, outMin: 6250, outKm: 25, batta: 700 },
  { name: "Toyota Fortuner", seats: "7+1", local4: 3800, local8: 5600, extraKm: 55, extraHr: 500, outMin: 13750, outKm: 55, batta: 800 },
  { name: "Kia Carnival", seats: "7+1", local4: null, local8: 5600, extraKm: 50, extraHr: 500, outMin: 12500, outKm: 50, batta: 800 }
];

export const VAN_TARIFF = [
  { name: "Tempo Traveller 12 Seater", seats: "12", local5: 3000, local10: 6000, local15: 9000, extraKm: 22, extraHr: 650, outMin: 6600, outKm: 22, batta: 800 },
  { name: "Tempo Traveller 13 Seater", seats: "13", local5: 3000, local10: 6000, local15: 9000, extraKm: 22, extraHr: 650, outMin: 6600, outKm: 22, batta: 800 },
  { name: "Luxury Tempo 14 Seater", seats: "14", local5: 3000, local10: 6000, local15: 9000, extraKm: 25, extraHr: 650, outMin: 7500, outKm: 25, batta: 800 },
  { name: "Tempo Traveller 18 Seater", seats: "18", local5: 4000, local10: 8000, local15: 12000, extraKm: 30, extraHr: 750, outMin: 7800, outKm: 26, batta: 800 },
  { name: "Mahindra Tourister 16 Seater", seats: "16", local5: 3000, local10: 6000, local15: 9000, extraKm: 22, extraHr: 650, outMin: 6600, outKm: 22, batta: 700 }
];

export const BUS_TARIFF = [
  { name: "21 Seater Mini Bus", seats: "21", local10: 8500, extraKm: 28, extraHr: 800, outMin: 8700, outKm: 29, batta: 1000 },
  { name: "25 Seater Mini Bus", seats: "25", local10: 10000, extraKm: 32, extraHr: 900, outMin: 9900, outKm: 33, batta: 1000 },
  { name: "30 Seater Mini Bus", seats: "30", local10: null, extraKm: null, extraHr: null, outMin: 16500, outKm: 55, batta: 1000 }
];

export const TARIFF_FAQS = [
  [
    "What is the Cabzii cab rental tariff in Chennai?",
    "Swift Dzire starts at ₹1,200 for 4 Hrs / 40 Km. Innova Crysta starts at ₹2,200. Tempo Traveller 12 seater starts at ₹3,000 for 5 Hrs / 50 Km. See the full rate card on this page."
  ],
  [
    "Which vehicles are available now on Cabzii?",
    "Available cars: Swift Dzire, Honda Amaze, Maruti Ertiga, Kia Carens, Toyota Innova 6+1 and 7+1, Innova Crysta 6+1 and 7+1, Innova Hycross, Corolla Altis, Fortuner and Kia Carnival. Vans: Tempo Traveller 12, 13 and 18 seater, Luxury Tempo 14 seater and Mahindra Tourister 16 seater. Mini buses: 21, 25 and 30 seater."
  ],
  [
    "Are extra km, extra hours and driver batta included?",
    "Package fares include fuel and driver service only. Extra km, extra hours, driver batta (calendar day), tolls, parking and standing AC are charged as listed on the tariff."
  ],
  [
    "How is outstation cab fare calculated?",
    "Cars have a 250 km outstation minimum. Vans and mini buses have a 300 km minimum. Extra km beyond the minimum is charged at the outstation per-km rate. Driver batta is added per calendar day."
  ]
];
