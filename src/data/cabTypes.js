import { CAR_TARIFF, VAN_TARIFF } from "../lib/publishedTariff";

const DZIRE = CAR_TARIFF.find((row) => /dzire/i.test(row.name)) || CAR_TARIFF[0];
const AMAZE = CAR_TARIFF.find((row) => /amaze/i.test(row.name));
const ERTIGA = CAR_TARIFF.find((row) => /ertiga/i.test(row.name));
const TEMPO = VAN_TARIFF.find((row) => /12 seater/i.test(row.name)) || VAN_TARIFF[0];

function inr(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export function buildCabTypes(cityName) {
  const sedanFrom = DZIRE.local4;
  const suvFrom = ERTIGA?.local4 || 1800;
  const tempoFrom = TEMPO.local5 || TEMPO.outMin;
  return [
    {
      id: "hatchback",
      name: "Hatchback cab",
      subtitle: `Compact cab for ${cityName} city drops. Wagon R class is quoted live when available; published compact starting fare is Swift Dzire ${inr(sedanFrom)} for 4 Hrs / 40 Km.`,
      fareFrom: sedanFrom,
      fareLabel: `From ${inr(sedanFrom)} · 4 Hrs / 40 Km`,
      capacity: "4 passengers",
      luggage: "2 bags",
      image: "/images/fallbacks/suv.svg",
      imageAlt: `Hatchback taxi for ${cityName} local and airport trips`
    },
    {
      id: "sedan",
      name: "Sedan cab",
      subtitle: `Swift Dzire from ${inr(DZIRE.local4)} and Honda Amaze from ${inr(AMAZE?.local4 || 1400)} for 4 Hrs / 40 Km on the published ${cityName} tariff.`,
      fareFrom: sedanFrom,
      fareLabel: `From ${inr(sedanFrom)} · 4 Hrs / 40 Km`,
      capacity: DZIRE.seats || "4+1",
      luggage: "3 bags",
      image: "/images/fallbacks/suv.svg",
      imageAlt: `Sedan taxi such as Swift Dzire in ${cityName}`
    },
    {
      id: "suv",
      name: "SUV cab",
      subtitle: `Maruti Ertiga / Tour M from ${inr(suvFrom)} for 4 Hrs / 40 Km. Innova and Crysta rates are listed on the Cabzii tariff.`,
      fareFrom: suvFrom,
      fareLabel: `From ${inr(suvFrom)} · 4 Hrs / 40 Km`,
      capacity: ERTIGA?.seats || "6+1",
      luggage: "4 bags",
      image: "/images/fallbacks/suv.svg",
      imageAlt: `SUV taxi for family trips from ${cityName}`
    },
    {
      id: "tempo",
      name: "Tempo Traveller cab",
      subtitle: `Tempo Traveller 12 seater from ${inr(tempoFrom)} for 5 Hrs / 50 Km. Groups use this for ${cityName} full-day and outstation trips.`,
      fareFrom: tempoFrom,
      fareLabel: `From ${inr(tempoFrom)} · 5 Hrs / 50 Km`,
      capacity: `${TEMPO.seats || 12} seats`,
      luggage: "8 bags",
      image: "/images/fallbacks/bus.svg",
      imageAlt: `Tempo Traveller hire in ${cityName}`
    }
  ];
}
