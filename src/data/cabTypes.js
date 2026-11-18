import { CAR_TARIFF, VAN_TARIFF } from "../lib/publishedTariff";

const DZIRE = CAR_TARIFF.find((row) => /dzire/i.test(row.name)) || CAR_TARIFF[0];
const AMAZE = CAR_TARIFF.find((row) => /amaze/i.test(row.name));
const ERTIGA = CAR_TARIFF.find((row) => /ertiga/i.test(row.name));
const TEMPO = VAN_TARIFF.find((row) => /12 seater/i.test(row.name)) || VAN_TARIFF[0];

function inr(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

const CRYSTA = CAR_TARIFF.find((row) => /crysta/i.test(row.name));
const FORTUNER = CAR_TARIFF.find((row) => /fortuner/i.test(row.name));
const BUS = VAN_TARIFF.find((row) => /21 seater/i.test(row.name));

export function buildCabTypes(cityName) {
  const sedanFrom = DZIRE.local4;
  const mpvFrom = ERTIGA?.local4 || 1800;
  const suvFrom = CRYSTA?.local4 || 2200;
  const vanFrom = TEMPO.local5 || TEMPO.outMin;
  const busFrom = BUS?.outMin || 8700;
  return [
    {
      id: "hatchback",
      name: "Hatchback",
      subtitle: `Wagon R and Swift for ${cityName} city drops. Compact hire sits under the sedan starting fare of ${inr(sedanFrom)} for 4 Hrs / 40 Km.`,
      fareFrom: 1100,
      fareLabel: `From ${inr(1100)} · 4 Hrs / 40 Km`,
      capacity: "4 passengers",
      luggage: "2 bags",
      iconKey: "hatch",
      imageAlt: `Hatchback cabs in ${cityName}`
    },
    {
      id: "sedan",
      name: "Sedan",
      subtitle: `Dzire from ${inr(DZIRE.local4)}, Etios, and Amaze from ${inr(AMAZE?.local4 || 1400)} for 4 Hrs / 40 Km.`,
      fareFrom: sedanFrom,
      fareLabel: `From ${inr(sedanFrom)} · 4 Hrs / 40 Km`,
      capacity: DZIRE.seats || "4+1",
      luggage: "3 bags",
      iconKey: "sedan",
      imageAlt: `Sedan cabs in ${cityName}`
    },
    {
      id: "mpv",
      name: "MPV",
      subtitle: `Ertiga, Carens and Innova from ${inr(mpvFrom)} for 4 Hrs / 40 Km.`,
      fareFrom: mpvFrom,
      fareLabel: `From ${inr(mpvFrom)} · 4 Hrs / 40 Km`,
      capacity: ERTIGA?.seats || "6+1",
      luggage: "4 bags",
      iconKey: "mpv",
      imageAlt: `MPV cabs in ${cityName}`
    },
    {
      id: "suv",
      name: "SUV",
      subtitle: `Innova Crysta from ${inr(suvFrom)} and Fortuner from ${inr(FORTUNER?.local4 || 3800)} for 4 Hrs / 40 Km.`,
      fareFrom: suvFrom,
      fareLabel: `From ${inr(suvFrom)} · 4 Hrs / 40 Km`,
      capacity: CRYSTA?.seats || "6+1",
      luggage: "4 bags",
      iconKey: "innova",
      imageAlt: `SUV cabs in ${cityName}`
    },
    {
      id: "van",
      name: "Van",
      subtitle: `Tempo Traveller 12 and 18 seater from ${inr(vanFrom)} for 5 Hrs / 50 Km.`,
      fareFrom: vanFrom,
      fareLabel: `From ${inr(vanFrom)} · 5 Hrs / 50 Km`,
      capacity: `${TEMPO.seats || 12} seats`,
      luggage: "8 bags",
      iconKey: "van",
      imageAlt: `Van hire in ${cityName}`
    },
    {
      id: "bus",
      name: "Bus",
      subtitle: `21 and 25 seater mini buses. Outstation from ${inr(busFrom)}.`,
      fareFrom: busFrom,
      fareLabel: `From ${inr(busFrom)} · outstation`,
      capacity: `${BUS?.seats || 21} seats`,
      luggage: "Luggage hold",
      iconKey: "van",
      imageAlt: `Mini bus hire in ${cityName}`
    }
  ];
}
